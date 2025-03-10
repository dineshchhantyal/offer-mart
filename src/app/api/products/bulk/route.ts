import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { verifyBulkExpiryDates } from "@/lib/ai/verify-expiry";
import { auth } from "../../../../../auth";
import { z } from "zod";

const productValidation = {
  schema: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    brand: z.string().min(2),
    categoryId: z.string().uuid(),
    price: z.number().positive(),
    discountedPrice: z.number().positive(),
    expiryDate: z.string().datetime(),
    images: z.array(z.string().url()),
    size: z.string().optional(),
    isDonation: z.boolean(),
    commission: z.number().min(0).max(1),
    // New fields
    quantity: z.number().int().min(1).default(1),
    unit: z.string(),
    pickupAddress: z.string(),
    isDeliveryAvailable: z.boolean().default(false),
    deliveryFee: z.number().optional(),
    paymentMethods: z.array(
      z.enum(["CASH", "BANK_TRANSFER", "MOBILE_PAYMENT", "CARD"])
    ),
    condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]).default("NEW"),
    originalPrice: z.number().optional(),
    manufacturerDate: z.string().datetime().optional(),
    bestBefore: z.string().datetime().optional(),
    allergenInfo: z.string().optional(),
    storageInfo: z.string().optional(),
  }),

  validateBulkProducts(products: unknown[]) {
    return z.array(this.schema).safeParse(products);
  },
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const parseResult = productValidation.validateBulkProducts(body.products);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const products = parseResult.data;

    // Verify all expiry dates in bulk
    const verificationResults = await verifyBulkExpiryDates(products);
    const validProducts = products.filter((_, i) => verificationResults[i]);

    if (validProducts.length === 0) {
      return NextResponse.json(
        { error: "No valid products to create" },
        { status: 400 }
      );
    }

    // Transaction to ensure all products and images are created
    const result = await db.$transaction(async (tx) => {
      // Create products first
      const createdProducts = await tx.product.createMany({
        data: validProducts.map((product) => ({
          title: product.title,
          description: product.description,
          brand: product.brand,
          categoryId: product.categoryId,
          price: product.price,
          discountedPrice: product.discountedPrice,
          originalPrice: product.originalPrice,
          quantity: product.quantity,
          unit: product.unit,
          condition: product.condition,
          manufacturerDate: product.manufacturerDate
            ? new Date(product.manufacturerDate)
            : null,
          bestBefore: product.bestBefore ? new Date(product.bestBefore) : null,
          expiryDate: new Date(product.expiryDate),
          pickupAddress: product.pickupAddress,
          isDeliveryAvailable: product.isDeliveryAvailable,
          deliveryFee: product.deliveryFee,
          allergenInfo: product.allergenInfo,
          storageInfo: product.storageInfo,
          size: product.size,
          isDonation: product.isDonation,
          commission: product.isDonation ? 0 : product.commission,
          sellerId: session.user.id as string,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      });

      // Get the created products
      const productRecords = await tx.product.findMany({
        where: {
          sellerId: session.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: validProducts.length,
      });

      // Create relationships
      for (let i = 0; i < productRecords.length; i++) {
        const product = productRecords[i];
        const productData = validProducts[i];

        // Create images
        await tx.image.createMany({
          data: productData.images.map((url) => ({
            url,
            productId: product.id,
          })),
        });

        // Connect payment methods
        await tx.$executeRaw`
          INSERT INTO "_PaymentMethodToProduct" ("A", "B")
          SELECT id, ${product.id}
          FROM "PaymentMethod"
          WHERE type = ANY(${productData.paymentMethods}::text[])
        `;
      }

      return {
        count: createdProducts.count,
        products: productRecords,
      };
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      failed: products.length - validProducts.length,
      products: result.products,
    });
  } catch (error) {
    console.error("[PRODUCTS_BULK_POST]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { PaymentMethodType, ProductStatus } from "@prisma/client";
import { currentUser } from "@/lib/auth";

const dummyProducts = [
  {
    id: "1",
    title: "Mega Deal: Product 1",
    description: "Enjoy an exclusive discount on Product 1!",
    brand: "Brand A",
    categoryId: "cat1",
    price: 100,
    discountedPrice: 80,
    expiryDate: new Date().toISOString(),
    size: "Medium",
    isDonation: false,
    commission: 0.1,
    status: "AVAILABLE",
    quantity: 50,
    unit: "pieces",
    pickupAddress: "123 Market St, City A",
    isDeliveryAvailable: true,
    deliveryFee: 5,
    paymentMethods: ["Credit Card", "PayPal"],
    condition: "NEW",
    originalPrice: 120,
    manufacturerDate: new Date().toISOString(),
    bestBefore: new Date().toISOString(),
    allergenInfo: "None",
    storageInfo: "Keep in a cool, dry place",
    images: [
      {
        url: "https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    sellerId: "seller1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Hot Deal: Product 2",
    description: "Grab the deal before it expires!",
    brand: "Brand B",
    image: "https://via.placeholder.com/300x500",
    categoryId: "cat2",
    price: 200,
    discountedPrice: 150,
    expiryDate: new Date().toISOString(),
    size: "Large",
    isDonation: false,
    commission: 0.1,
    status: "AVAILABLE",
    quantity: 30,
    unit: "kg",
    pickupAddress: "456 Commerce Ave, City B",
    isDeliveryAvailable: false,
    deliveryFee: 0,
    paymentMethods: ["Cash", "Credit Card"],
    condition: "USED",
    originalPrice: 250,
    manufacturerDate: new Date().toISOString(),
    bestBefore: new Date().toISOString(),
    allergenInfo: "None",
    storageInfo: "Store in a ventilated area",
    images: [
      {
        url: "https://plus.unsplash.com/premium_photo-1666900440561-94dcb6865554?q=80&w=3027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ],
    sellerId: "seller2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function POST(req: Request) {
  try {
    const session = await currentUser();
    const body = await req.json();

    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create product with proper connections
    const product = await db.product.create({
      data: {
        title: body.title,
        description: body.description,
        brand: body.brand,
        category: {
          connectOrCreate: {
            where: { name: body.category },
            create: { name: body.category },
          },
        },
        seller: {
          connect: {
            id: session.id,
          },
        },
        images: {
          create: body.images.map((url: string) => ({
            url,
          })),
        },
        originalPrice: body.originalPrice,
        price: body.price,
        discountedPrice: body.discountedPrice,
        quantity: body.quantity,
        unit: body.unit,
        condition: body.condition,
        manufacturerDate: new Date(body.manufacturerDate),
        expiryDate: new Date(body.expiryDate),
        bestBefore: body.bestBefore ? new Date(body.bestBefore) : null,
        pickupAddress: body.pickupAddress,
        isDeliveryAvailable: body.isDeliveryAvailable,
        isDonation: body.isDonation,
        commission: body.commission,
        status: body.status as ProductStatus,
        // Correctly handle payment methods as enum array
        paymentMethods: body.paymentMethods.map(
          (method: string) => method.toUpperCase() as PaymentMethodType
        ),
      },
      include: {
        seller: true,
        category: true,
        images: true,
      },
    });

    return NextResponse.json({ data: product });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("[PRODUCTS_POST]", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET(req: Request) {
  console.log(req);
  return NextResponse.json(dummyProducts);
}

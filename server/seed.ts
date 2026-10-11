import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

async function seed() {
  for (let i = 1; i <= 500; i++) {
    await prisma.customer.create({
      data: {
        name: `Customer ${i}`,
        email: `customer${i}@gmail.com`,
        region: `region ${i}`,
      },
    });
  }

  for (let i = 1; i <= 100; i++) {
    await prisma.product.create({
      data: {
        name: `Product ${i}`,
        category: `category ${(i % 8) + 1}`,
        price: (i * 100) / 2 + 15,
        stock: i * Math.floor(Math.random() * 25),
      },
    });
  }

  for (let i = 1; i <= 1000; i++) {

    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));

    await prisma.order.create({
      data: {
        quantity: Math.floor(Math.random() * 5) + 1,
        total: Math.floor(Math.random() * 500) + 20,
        status: "completed",
        customerId: Math.floor(Math.random() * 500) + 1,
        productId: Math.floor(Math.random() * 100) + 1,
        createdAt:date
      },
    });
  }
}

seed();

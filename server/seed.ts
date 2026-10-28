import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.customer.deleteMany();

  const regions = ["North", "South", "East", "West", "Central"];

  for (let i = 1; i <= 500; i++) {
    await prisma.customer.create({
      data: {
        name: `Customer ${i}`,
        email: `customer${i}@gmail.com`,
        region: regions[Math.floor(Math.random() * regions.length)],
      },
    });
  }

  const categories = [
    "Electronics",
    "Clothing",
    "Home",
    "Books",
    "Sports",
    "Beauty",
    "Toys",
    "Food",
  ];

  for (let i = 1; i <= 100; i++) {
    await prisma.product.create({
      data: {
        name: `Product ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: (i * 100) / 2 + 15,
        stock: i * Math.floor(Math.random() * 25),
      },
    });
  }

  const products = await prisma.product.findMany();
  const customers = await prisma.customer.findMany({
    select: { id: true },
  });

  for (let i = 1; i <= 1000; i++) {
    const singleProduct = products[Math.floor(Math.random() * products.length)];
    const singleCustomer = customers[Math.floor(Math.random() * customers.length)];

    const date = new Date();
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 12));

    const quantity = Math.floor(Math.random() * 5) + 1;
    const total = singleProduct.price * quantity;

    await prisma.order.create({
      data: {
        quantity,
        total,
        status: "completed",
        customerId: singleCustomer.id,
        productId:singleProduct.id,
        createdAt: date
      },
    });
  }
}

seed();

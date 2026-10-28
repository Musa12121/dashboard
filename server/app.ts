import 'dotenv/config';
import express from 'express';
import { type Request, Response } from 'express';
import { PrismaClient } from './generated/prisma/client'

const prisma = new PrismaClient();

const app = express();

app.get('/api/dashboard/summary', async (request: Request, response: Response) => {
  const result = await prisma.order.aggregate({
    _sum: { total: true },
    _count: true,
    _avg: { total: true },
  });

  let revenue = result._sum.total;
  if (revenue === null) {
    revenue = 0;
  }

  let average = result._avg.total;
  if (average === null) {
    average = 0;
  }

  response.json({
    revenue: revenue,
    orders: result._count,
    average: average,
  });
});

app.get('/api/dashboard/over-time', (request: Request, response: Response) => {

});

app.get('/api/dashboard/by-category', async (request: Request, response: Response) => {
  const result = await prisma.product.groupBy({ by: ["category"], _sum: { price: true } })

  return response.json(result)
});

app.get('/api/dashboard/top-items', (request: Request, response: Response) => {
})

app.get('/api/items', async (request: Request, response: Response) => {
  const page = Number(request.query.page) || 1;
  const pageSize = Number(request.query.pageSize) || 10;
  const skip = pageSize * page - pageSize;

  const sortBy = request.query.sortBy || 'id';
  const sortOrder = request.query.sortOrder === 'desc' ? 'desc' : 'asc';

  const category = request.query.category;

  const startDate = request.query.startDate;
  const endDate = request.query.endDate;

  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(endDate) : undefined;

  if (end) {
    end.setUTCHours(23, 59, 59, 999);
  }

  const items = await prisma.order.findMany({
    where: category ? {
      product: { category }, createdAt: {
        gte: start,
        lte: end,
      },
    } : {
      createdAt: {
        gte: start,
        lte: end,
      },
    },
    include: {
      product: true,
      customer: true,
    },
    skip, take: pageSize, orderBy: { [sortBy]: sortOrder }
  });

  response.json(items);
});

app.listen(5050, () => {
  console.log('Server is running on http://localhost:5050');
});
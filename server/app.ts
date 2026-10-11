import express from 'express';
import {type Request, Response} from 'express';

const app = express();

app.get('/api/dashboard/summary', (request: Request, response: Response) => {
});

app.get('/api/dashboard/over-time', (request: Request, response: Response) => {
  
});

app.get('/api/dashboard/by-category', (request: Request, response: Response) => {
});

app.get('/api/dashboard/top-items', (request: Request, response: Response) => {
})

app.get('/api/items', (request: Request, response: Response) => {
});

app.listen(5050, () => {
  console.log('Server is running on http://localhost:5050');
});
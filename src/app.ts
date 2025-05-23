import express from 'express';
import controllers from './controllers';
import { HttpEventMiddleware, errorMiddleware } from './middleware';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(HttpEventMiddleware);

controllers(app);

// Error middleware should be last
app.use(errorMiddleware);

export default app;

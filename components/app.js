import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import morganMiddleware from '../lib/logger/morgan.js';
import { promises as fs } from 'fs';
import { Logger } from '../lib/logger/logger.js';
import { errorHandler } from '../lib/middleware/error-handler.js';
import { NotFoundError } from '../lib/errors/not-found-error.js';
import { router as kmsRouter } from './kms/index.js';
import { router as astRouter } from './ast/index.js';
import { router as apRouter } from './ap/index.js';
import { router as taRouter } from './ta/index.js';

const logger = Logger(import.meta.url);
const swaggerDocument = await fs.readFile('./swagger/swagger-output.json');

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morganMiddleware);
app.use(
  cors({
    origin: '*',
    credentials: true,
  }),
);

app.use('/kms', kmsRouter);

app.use((req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.path}`));
});

app.use(errorHandler);

process.on('uncaughtException', err => {
  logger.error(`uncaughtException ${JSON.stringify(err)}`);
  process.exit(1);
});

process.on('unhandledRejection', reason => {
  logger.error(`unhandledRejection ${JSON.stringify(reason)}`);
  process.exit(1);
});

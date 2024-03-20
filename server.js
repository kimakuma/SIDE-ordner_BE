import http from 'http';
import config from 'config';
import { app } from './components/app.js';
import { Logger } from './lib/logger/logger.js';

const logger = Logger(import.meta.url);

logger.info(`PORT: ${config.get('app.port')}`);
logger.info(`NODE_ENV: ${process.env.NODE_ENV}`);
logger.info(`NODE_CONFIG_ENV: ${config.util.getEnv('NODE_CONFIG_ENV')}`);
logger.info(`Elasticsearch Host: ${config.get('elasticsearch.nodes')}`)

const port = config.get('app.port');

http.createServer(app).listen(port);
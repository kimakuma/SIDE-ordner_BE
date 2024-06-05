import http from 'http';
import config from 'config';
import { app } from './components/app.js';
import { Logger } from './lib/logger/logger.js';

const port = config.get('app.port');
const logger = Logger(import.meta.url);

logger.info(`PORT: ${config.get('app.port')}`);
logger.info(`MySql Host: ${config.get('mysql.host')}`)
logger.info(`Elasticsearch Host: ${config.get('elasticsearch.nodes')}`)

http.createServer(app).listen(port);
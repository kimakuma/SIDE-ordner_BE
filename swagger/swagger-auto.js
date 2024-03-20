/* eslint-disable dot-notation */
import swaggerAutogen from 'swagger-autogen';
import { fileURLToPath } from 'url';
import path from 'path';
import config from 'config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(`Swagger-autogen ENV: ${process.env['NODE_CONFIG_ENV']}`);
const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: `${config.get('app.swagger.host')}:${config.get('app.port')}`,
  schemes: ['http'],
};

const outputFile = path.join(__dirname, 'swagger-output.json');
const endpointsFiles = ['./components/app.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);

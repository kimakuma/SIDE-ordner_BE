import { Logger } from '../../lib/logger/logger.js';
import { db } from '../../lib/mysql/connect.js'
import { search as esSearch } from '../../lib/elasticsearch/client.js';
import { indexConfig, filterConfig, sortConfig } from "./config/index-config.js"

const logger = Logger(import.meta.url);

export async function truckList(params) {
  const query = `
    SELECT *
    FROM truck
    LIMIT 10
  `;

  const [rows] = await db.query(query);

  return rows;
};

export async function list(params) {
  const query = `
    SELECT *
    FROM reserveList
    WHERE
      userId = ${params.userId}
  `;

  const [rows] = await db.query(query);

  return rows;
};
import { Logger } from '../../lib/logger/logger.js';
import { db } from '../../lib/mysql/connect.js'
import { search as esSearch } from '../../lib/elasticsearch/client.js';
import { indexConfig, filterConfig, sortConfig } from "./config/index-config.js"

const logger = Logger(import.meta.url);

export async function login(params) {
  const query = `
    SELECT 
      name
      , phone
      , email
    FROM user 
    WHERE
      email = "${params.email}"
      AND pwd = "${params.pwd}"
  `;

  const [rows] = await db.query(query);

  return rows;
};
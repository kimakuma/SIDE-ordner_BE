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

export async function truckInfo(params) {
  const query = `
    SELECT *
    FROM truck
    WHERE truckId = ${params.truckId}
  `;

  const [rows] = await db.query(query);

  return rows;
};

export async function truckMenuList(params) {
  const query = `
    SELECT *
    FROM truck_menu
    WHERE truckId = ${params.truckId}
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

export async function reserve(params) {
  const query = `
  INSERT INTO reserveList (userID, truckId, truckName, startDate, endDate)
  SELECT '${params.userId}', ${params.truckId}, '${params.truckName}', '${params.startDate}', '${params.endDate}'
  WHERE NOT EXISTS (
   SELECT 1
   FROM (SELECT * FROM reserveList) AS temp 
   WHERE temp.truckId = ${params.truckId} AND 
  (
   (startDate <= '${params.startDate}' AND '${params.startDate}' <= endDate) 
   OR (startDate <= '${params.endDate}' AND '${params.endDate}' <= endDate))
  )
  `;

  const [ResultSetHeader] = await db.query(query);

  return ResultSetHeader.affectedRows;
}

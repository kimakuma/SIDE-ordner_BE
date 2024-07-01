import { Logger } from '../../lib/logger/logger.js';
import { db } from '../../lib/mysql/connect.js'
import { search as esSearch } from '../../lib/elasticsearch/client.js';
import { indexConfig, filterConfig, sortConfig } from "./config/index-config.js"

const logger = Logger(import.meta.url);

export async function check(params) {
  const query = `
    SELECT *
    FROM user 
    WHERE
      phone = "${params.phone}"
      OR email = "${params.email}"
  `;

  const [rows] = await db.query(query);

  return rows;
};

export async function signUp(params) {
  const query = `
    INSERT INTO 
      user
      (name, phone, email, pwd) 
      VALUE
      (
        "${params.name}"
        , "${params.phone}"
        , "${params.email}"
        , "${params.pwd}"
      )
  `;

  const [rows] = await db.query(query);

  return rows;
};

export async function signIn(params) {
  const query = `
    SELECT
      id
      , name
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
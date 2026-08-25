import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  const dbName = process.env.DB_NAME || "todoapp";

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT) || 3306,
    multipleStatements: true,
  });

  // Step 1: create database
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);

  // Step 2: switch to that database
  await connection.changeUser({ database: dbName });

  // Step 3: create tables (use query, not execute — execute doesn't support multi-statement SQL)
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await connection.query(schema);

  await connection.end();
  console.log("Database initialized successfully");
}

initDatabase().catch((err) => {
  console.error("Error initializing database:", err);
  process.exit(1);
});

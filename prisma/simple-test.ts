import mysql from "mariadb";
import "dotenv/config";

async function main() {
  const config = {
    host: process.env.DB_HOST || "127.0.0.1",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "portfolio_aziz",
  };
  console.log("Testing connection with:", config);
  try {
    const conn = await mysql.createConnection(config);
    console.log("Connected successfully!");
    await conn.end();
  } catch (err) {
    console.error("Connection failed:", err);
  }
}

main();

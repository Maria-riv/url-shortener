import sqlite3 from "sqlite3";
import { open } from "sqlite";

let db = null;

export async function initDB() {
  if (!db) {
    db = await open({
      filename: "./urls.db",
      driver: sqlite3.Database,
    });
    db.configure("busyTimeout", 5000); 
    await db.run(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_url TEXT NOT NULL,
        short_url TEXT NOT NULL UNIQUE,
        expiry_date TEXT NOT NULL,
        clicks INTEGER DEFAULT 0
      )
    `);
  }
  return db;
}

import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

export const db = (SQLite as any).openDatabaseSync("movies.db");

export default function DateBase(){
  useEffect(() => {
     const dbSet = async () => await db.withTransactionAsync(async (tx) => {
      await tx.executeSqlAsync(
        `CREATE TABLE IF NOT EXISTS movie_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        watched BOOLEAN
        movie_id TEXT NOT NULL
      );`);

      await tx.executeSqlAsync(`CREATE TABLE IF NOT EXISTS movie_opinion (
        opinion_id INTEGER PRIMARY KEY AUTOINCREMENT,
        opinion_rate REAL NOT NULL CHECK(opinion_rate >= 1 AND opinion_rate <= 5),
        movie_id INTEGER NOT NULL,
        opinion_title TEXT NOT NULL,
        opinion_desc TEXT NOT NULL,
        FOREIGN KEY(movie_id) REFERENCES movie_list(id)
      );`);
    });
  }, []);


}

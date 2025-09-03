import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

export const db = (SQLite as any).openDatabaseSync("movies.db");

await db.execAsync("PRAGMA foreign_keys = ON;");

export async function insertMovie(id: number){
  await db.withTransactionAsync(async (tx: any) => {
    await tx.executeSqlAsync(
      "INSERT INTO movie_list (movie_id) VALUES(?)", 
      [id]
    );
  });
}
export async function insertOpinion(movie: any){
  await db.withTransactionAsync(async (tx: any) => {
    await tx.executeSqlAsync(
      "INSERT INTO movie_opinion (opinion_rate, movie_id, opinion_title, opinion_desc) VALUES(?, ?, ?, ?)", 
      [movie.opinion_rate, movie.id, movie.opinion_title, movie.opinion_desc]
    );
  });
}
export async function changeToWatched(id: number){
  await db.withTransactionAsync(async (tx: any) => {
    await tx.executeSqlAsync(
      "UPDATE movie_list SET watched = NOT watched WHERE id= ?", 
      [id]
    );
  });
}
export default function DateBase(){
  useEffect(() => {
     const dbSet = async () => await db.withTransactionAsync(async (tx: any) => {
      await tx.executeSqlAsync(
        `CREATE TABLE IF NOT EXISTS movie_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        watched BOOLEAN NOT NULL DEFAULT 0,
        movie_id INTEGER NOT NULL
      );`);

      await tx.executeSqlAsync(`CREATE TABLE IF NOT EXISTS movie_opinion (
        opinion_id INTEGER PRIMARY KEY AUTOINCREMENT,
        opinion_rate REAL NOT NULL CHECK(opinion_rate >= 1 AND opinion_rate <= 5),
        movie_id INTEGER NOT NULL,
        opinion_title TEXT NOT NULL,
        opinion_desc TEXT NOT NULL,
        date_watched, DATE NOT NULL,
        FOREIGN KEY(movie_id) REFERENCES movie_list(id)
      );`);
    });
    dbSet();
  }, []);


}

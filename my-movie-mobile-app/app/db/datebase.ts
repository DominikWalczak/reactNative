import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

export const db = (SQLite as any).openDatabaseAsync("movies.db");

export async function insertMovie(id: string){
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
      "INSERT INTO movie_opinion (opinion_rate, movie_id, opinion_title, opinion_desc, date_watched) VALUES(?, ?, ?, ?, CURRENT_DATE)", 
      [movie.opinion_rate, movie.id, movie.opinion_title, movie.opinion_desc]
    );
  });
}
export async function deleteOpinion(id: string){
  await db.withTransactionAsync(async (tx: any) => {
    await tx.executeSqlAsync(
      "DELETE FROM movie_opinion WHERE opinion_id = ?",
      [id]
    );
  });
}
export async function deleteMovie(id: string){
  await db.withTransactionAsync(async (tx: any) => {
    await tx.executeSqlAsync(
      "DELETE FROM movie_list WHERE movie_id = ?",
      [id]
    );
  });
}
export async function changeToWatched(id: string){
  await db.withTransactionAsync(async (tx: any) => {
    await tx.executeSqlAsync(
      "UPDATE movie_list SET watched = NOT watched WHERE movie_id = ?", 
      [id]
    );
  });
}
export async function changeOpinion(movie: any){
  await db.withTransactionAsync(async (tx: any) => {
    await tx.executeSqlAsync(
      "UPDATE movie_opinion SET (opinion_rate, movie_id, opinion_title, opinion_desc) VALUES(?, ?, ?, ?) WHERE movie_id = ?",
      [movie.rate, movie.id, movie.title, movie.desc, movie.id]
    );
  });
}
export async function loadMovies() {
  return await db.withTransactionAsync(async (tx: any) => {
    const result = await tx.executeSqlAsync("SELECT * FROM movie_list");
    return result.rows as any[];
  });
}
export async function loadMoviesAndOpinions(id: string) {
  return await db.withTransactionAsync(async (tx: any) => {
    const result = await tx.executeSqlAsync("SELECT * FROM movie_list LEFT JOIN movie_opinion.movie_id ON movie_list.movie_id WHERE movie_list.movie_id = ?",
      [id]
    );
    return result.rows as any[] || false;
  });
}

export default function DateBase(){
  useEffect(() => {
     const dbSet = async () => await db.withTransactionAsync(async (tx: any) => {
      await tx.executeSqlAsync(
        `CREATE TABLE IF NOT EXISTS movie_list (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        watched BOOLEAN NOT NULL DEFAULT 0,
        movie_id TEXT NOT NULL
      );`);

      await tx.executeSqlAsync(`CREATE TABLE IF NOT EXISTS movie_opinion (
        opinion_id INTEGER PRIMARY KEY AUTOINCREMENT,
        opinion_rate REAL NOT NULL CHECK(opinion_rate >= 1 AND opinion_rate <= 5),
        movie_id TEXT NOT NULL,
        opinion_title TEXT NOT NULL,
        opinion_desc TEXT NOT NULL,
        date_watched DATE NOT NULL,
        FOREIGN KEY(movie_id) REFERENCES movie_list(movie_id)
      );`);

      await db.execAsync("PRAGMA foreign_keys = ON;");
    });
    dbSet();
  }, []);


}

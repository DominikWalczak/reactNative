import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

export const db = SQLite.openDatabaseSync("movies.db");

export async function insertMovie(id: string) {
  try {
    await db.withTransactionAsync(async () => {
      await db.execAsync(
        `INSERT INTO movie_list (movie_id) VALUES('${id}')`
      );
      loadMovies();
    });
  } catch (error) {
    console.error("Błąd podczas INSERT:", error);
  }
}

export async function insertOpinion(movie: any) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(
      `INSERT INTO movie_opinion (opinion_rate, movie_id, opinion_title, opinion_desc, date_watched)
       VALUES(${movie.opinion_rate}, '${movie.id}', '${movie.opinion_title}', '${movie.opinion_desc}', CURRENT_DATE)`
    );
  });
}

export async function deleteOpinion(id: string) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(
      `DELETE FROM movie_opinion WHERE opinion_id = ${id}`
    );
  });
}

export async function deleteMovie(id: string) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(
      `DELETE FROM movie_list WHERE movie_id = ${id}`
    );
  });
}

export async function changeToWatched(id: string) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(
      `UPDATE movie_list SET watched = NOT watched WHERE movie_id = ${id}?`
    );
  });
}

export async function changeOpinion(movie: any) {
  await db.withTransactionAsync(async () => {
    await db.execAsync(
      `UPDATE movie_opinion SET opinion_rate = ${movie.rate}, movie_id = '${movie.id}', opinion_title = '${movie.title}', opinion_desc = '${movie.desc}' WHERE movie_id = '${movie.id}'`
    );
  });
}

// Pobieranie danych
export async function loadMovies() {
  try{
    const result = await db.getAllAsync("SELECT * FROM movie_list");
    console.log(23232);
    console.log(result);
    console.log(23232);
    return result;
  }
  catch(error){
    console.log(error);
  }
}

export async function loadMoviesAndOpinions(id: string) {
  const result = await db.getAllAsync(`SELECT * FROM movie_list LEFT JOIN movie_opinion ON movie_list.movie_id = movie_opinion.movie_id WHERE movie_list.movie_id = ${id}`);
  return result;
}

export async function initDatabase() {
  try{
    await db.withTransactionAsync(async () => {
        await db.execAsync(
          `CREATE TABLE IF NOT EXISTS movie_list (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            watched BOOLEAN NOT NULL DEFAULT 0,
            movie_id TEXT NOT NULL
          );`
        );
        await db.execAsync(`CREATE TABLE IF NOT EXISTS movie_opinion (
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
  }
  catch(error){
    console.log(error);
  }
}

export default function DateBase() { return null; }
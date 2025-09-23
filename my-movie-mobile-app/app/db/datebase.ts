import * as SQLite from "expo-sqlite";

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
    console.error("Movie Insert Error:", error);
  }
}

export async function insertOpinion(movie: any) {
  await db.withTransactionAsync(async () => {
    try{
      await db.execAsync(
        `INSERT INTO movie_opinion (opinion_rate, movie_id, opinion_title, opinion_desc, date_watched)
        VALUES(${movie.rate}, '${movie.id}', '${movie.title}', '${movie.desc}', CURRENT_DATE)`
      );
    }
    catch(error){
      console.error(`Opinion Insert Error: ${error}`);
    }
    try{
      await db.execAsync(
        `UPDATE movie_list SET watched = 1 WHERE movie_id = ${movie.id}`
      );
    }
    catch(error){
      console.error(`Opinion/Watched Change Error: ${error}`);
    }
  });
}

export async function deleteMovie(id: string) {
  await db.withTransactionAsync(async () => {
    try{
      await db.execAsync(
      `DELETE FROM movie_list WHERE movie_id = ${id}`
      );
    }
    catch(error){
      console.error(`Movie Delete Error: ${error}`);
    }
    try{
      await db.execAsync(
        `DELETE FROM movie_opinion WHERE movie_id = ${id}`
      );
    }
    catch(error){
      console.error(`Opinion Delete Error: ${error}`);
    }

  });
}

export async function changeOpinion(movie: any) {
  await db.withTransactionAsync(async () => {
    try{
      await db.execAsync(
        `UPDATE movie_opinion SET opinion_rate = ${movie.rate}, movie_id = '${movie.id}', opinion_title = '${movie.title}', opinion_desc = '${movie.desc}' WHERE movie_id = '${movie.id}'`
      );
    }
    catch(error){
      console.error(`Opinion Change Error: ${error}`);
    }
   
  });
}

// Pobieranie danych
export async function loadMovies() {
  try{
    const result = await db.getAllAsync("SELECT * FROM movie_list");
    return result;
  }
  catch(error){
    console.error(`Movies Load Error: ${error}`);
  }
}

export async function loadMoviesAndOpinions(id: string) {
  try{  
    const result = await db.getAllAsync(`SELECT * FROM movie_list LEFT JOIN movie_opinion ON movie_list.movie_id = movie_opinion.movie_id WHERE movie_list.movie_id = ${id}`);
    return result;
  }catch(error){
    console.error(`Movies&Opinion Load: ${error}`);
  }
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
          opinion_rate TEXT NOT NULL,
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
    console.error(`Datebase Init Error: ${error}`);
  }
  // try {
  //   await db.withTransactionAsync(async () => {
  //     await db.execAsync(`DELETE FROM movie_list`);
  //     await db.execAsync(`DELETE FROM movie_opinion`);
  //   });
  //   console.log("Tables cleared ✅");
  // } catch (err) {
  //   console.error("Failed to clear tables:", err);
  // }
}

export default function DateBase() { return null; }
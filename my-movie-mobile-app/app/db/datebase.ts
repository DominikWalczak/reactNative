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
    console.error("Błąd podczas INSERT:", error);
  }
}

export async function insertOpinion(movie: any) {
  await db.withTransactionAsync(async () => {
    const result = await db.getAllAsync(`SELECT * FROM movie_list LEFT JOIN movie_opinion ON movie_list.movie_id = movie_opinion.movie_id`);
    console.log("movie object:", movie);
    console.log(3);
    console.log(result);
    console.log(3); 
    console.log(movie.rate);
    console.log(movie.id);
    console.log(movie.title);
    console.log(movie.desc);
    try{
      await db.execAsync(
        `INSERT INTO movie_opinion (opinion_rate, movie_id, opinion_title, opinion_desc, date_watched)
        VALUES(${movie.rate}, '${movie.id}', '${movie.title}', '${movie.desc}', CURRENT_DATE)`
      );
      await db.execAsync(
        `UPDATE movie_list SET watched = 1 WHERE movie_id = ${movie.id}`
      );
    }
    catch(error){
      console.log(error);
    }
    const result2 = await db.getAllAsync(`SELECT * FROM movie_list LEFT JOIN movie_opinion ON movie_list.movie_id = movie_opinion.movie_id`);
    console.log("movie object:", movie);
    console.log(34);
    console.log(result2);
    console.log(34);
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

export async function changeOpinion(movie: any) {
  console.log(666);
  await db.withTransactionAsync(async () => {
    console.log(555);
    try{
      const result = await db.getAllAsync(`SELECT * FROM movie_list LEFT JOIN movie_opinion ON movie_list.movie_id = movie_opinion.movie_id`);
      console.log(2);
      console.log(result);
      console.log(2);
      await db.execAsync(
        `UPDATE movie_opinion SET opinion_rate = ${movie.rate}, movie_id = '${movie.id}', opinion_title = '${movie.title}', opinion_desc = '${movie.desc}' WHERE movie_id = '${movie.id}'`
      );
    }
    catch(error){
      console.log(error);
    }
   
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
  try{  
    console.log(500000)
    const result = await db.getAllAsync(`SELECT * FROM movie_list LEFT JOIN movie_opinion ON movie_list.movie_id = movie_opinion.movie_id WHERE movie_list.movie_id = ${id}`);
    console.log(result)
    console.log(500000)
    return result;
  }catch(error){

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
    console.log(error);
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
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

export const db = SQLite.openDatabase("movies.db");

useEffect(() =>{
    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS movie_liked(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            movie_id TEXT NOT NULL);`)
    },
    tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS movie_opinion(
            opinion_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            movie_id INTEGER NOT NULL, 
            opinion_title TEXT NOT NULL, 
            opinion_desc TEXT NOT NULL, 
            FOREIGN KEY(movie_id) REFERENCE movie_liked(id));`)
    });
});


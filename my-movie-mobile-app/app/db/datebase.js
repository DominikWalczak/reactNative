import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

export const db = SQLite.openDatabase("movies.db");

useEffect(() =>{
    db.transaction(tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS movie_watched(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            movie_id TEXT NOT NULL);`)
    },
    tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS movie_to_watch(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            movie_id TEXT NOT NULL);`)
    },
    tx => {
        tx.executeSql(`CREATE TABLE IF NOT EXISTS movie_opinion(
            opinion_id INTEGER PRIMARY KEY AUTOINCREMENT, 
            opinion_rate REAL NOT NULL CHECK(opinion_rate >= 1 AND opinion_rate <= 5),
            movie_id INTEGER NOT NULL, 
            opinion_title TEXT NOT NULL, 
            opinion_desc TEXT NOT NULL, 
            FOREIGN KEY(movie_id) REFERENCE movie_liked(id));`)
    });
});


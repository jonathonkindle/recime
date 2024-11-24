import * as SQLite from 'expo-sqlite';

let db = null;

export default function getDatabase() {
  if (db === null) {
    db = SQLite.openDatabase('recipeapp.db');
  }
  return db;
}

export function initDatabase() {
  const db = getDatabase();
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, time TEXT, ingredients TEXT, instructions TEXT, calories INTEGER, protein INTEGER, carbs INTEGER, fat INTEGER, image TEXT, mainIngredient TEXT, cuisine TEXT, isFavorite INTEGER);'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS dietaryRestrictions (recipeId INTEGER, restriction TEXT, FOREIGN KEY(recipeId) REFERENCES recipes(id));'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS allergens (recipeId INTEGER, allergen TEXT, FOREIGN KEY(recipeId) REFERENCES recipes(id));'
      );
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS mealPlan (id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT, recipeId INTEGER, label TEXT, FOREIGN KEY(recipeId) REFERENCES recipes(id));'
      );
    }, reject, resolve);
  });
}
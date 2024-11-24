import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getDatabase } from '../database';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlannerScreen() {
  const [mealPlan, setMealPlan] = useState({});
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    loadMealPlan();
    loadRecipes();
  }, []);

  const loadMealPlan = () => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM mealPlan',
        [],
        (_, { rows }) => {
          const plan = {};
          rows._array.forEach(meal => {
            if (!plan[meal.day]) {
              plan[meal.day] = [];
            }
            plan[meal.day].push(meal);
          });
          setMealPlan(plan);
        }
      );
    });
  };

  const loadRecipes = () => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM recipes', [], (_, { rows }) => {
        setRecipes(rows._array);
      });
    });
  };

  const addMealToDay = (day) => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO mealPlan (day, recipeId, label) VALUES (?, ?, ?)',
        [day, null, 'Breakfast'],
        (_, result) => {
          loadMealPlan();
        }
      );
    });
  };

  const updateMeal = (mealId, recipeId, label) => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE mealPlan SET recipeId = ?, label = ? WHERE id = ?',
        [recipeId, label, mealId],
        (_, result) => {
          loadMealPlan();
        }
      );
    });
  };

  const removeMeal = (mealId) => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM mealPlan WHERE id = ?',
        [mealId],
        (_, result) => {
          loadMealPlan();
        }
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      {days.map(day => (
        <View key={day} style={styles.dayContainer}>
          <Text style={styles.dayTitle}>{day}</Text>
          {mealPlan[day]?.map(meal => (
            <View key={meal.id} style={styles.mealContainer}>
              <Picker
                selectedValue={meal.recipeId}
                style={styles.recipePicker}
                onValueChange={(itemValue) => updateMeal(meal.id, itemValue, meal.label)}
              >
                <Picker.Item label="Select a recipe" value={null} />
                {recipes.map(recipe => (
                  <Picker.Item key={recipe.id} label={recipe.title} value={recipe.id} />
                ))}
              </Picker>
              <Picker
                selectedValue={meal.label}
                style={styles.labelPicker}
                onValueChange={(itemValue) => updateMeal(meal.id, meal.recipeId, itemValue)}
              >
                <Picker.Item label="Breakfast" value="Breakfast" />
                <Picker.Item label="Lunch" value="Lunch" />
                <Picker.Item label="Dinner" value="Dinner" />
                <Picker.Item label="Snack" value="Snack" />
              </Picker>
              <TouchableOpacity onPress={() => removeMeal(meal.id)} style={styles.removeButton}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={() => addMealToDay(day)} style={styles.addButton}>
            <Text style={styles.addButtonText}>Add Meal</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recipePicker: {
    flex: 2,
  },
  labelPicker: {
    flex: 1,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'white',
  },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
  },
});
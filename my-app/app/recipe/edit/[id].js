import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getDatabase } from '../../database';

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadRecipe();
  }, [id]);

  const loadRecipe = () => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM recipes WHERE id = ?',
        [id],
        (_, { rows }) => {
          if (rows.length > 0) {
            setRecipe(rows.item(0));
          }
        }
      );
    });
  };

  const handleUpdateRecipe = () => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE recipes SET title = ?, time = ?, ingredients = ?, instructions = ?, calories = ?, protein = ?, carbs = ?, fat = ?, image = ?, mainIngredient = ?, cuisine = ? WHERE id = ?',
        [recipe.title, recipe.time, recipe.ingredients, recipe.instructions, recipe.calories, recipe.protein, recipe.carbs, recipe.fat, recipe.image, recipe.mainIngredient, recipe.cuisine, id],
        (_, result) => {
          console.log('Recipe updated');
          router.replace(`/recipe/${id}`);
        },
        (_, error) => {
          console.log('Error updating recipe:', error);
        }
      );
    });
  };

  if (!recipe) {
    return <View><Text>Loading...</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Recipe Title"
        value={recipe.title}
        onChangeText={(text) => setRecipe({...recipe, title: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Cooking Time"
        value={recipe.time}
        onChangeText={(text) => setRecipe({...recipe, time: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Ingredients"
        value={recipe.ingredients}
        onChangeText={(text) => setRecipe({...recipe, ingredients: text})}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={recipe.instructions}
        onChangeText={(text) => setRecipe({...recipe, instructions: text})}
        multiline
      />
      <TextInput
        style={styles.input}
        placeholder="Calories"
        value={recipe.calories.toString()}
        onChangeText={(text) => setRecipe({...recipe, calories: parseInt(text) || 0})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Protein (g)"
        value={recipe.protein.toString()}
        onChangeText={(text) => setRecipe({...recipe, protein: parseInt(text) || 0})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Carbs (g)"
        value={recipe.carbs.toString()}
        onChangeText={(text) => setRecipe({...recipe, carbs: parseInt(text) || 0})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Fat (g)"
        value={recipe.fat.toString()}
        onChangeText={(text) => setRecipe({...recipe, fat: parseInt(text) || 0})}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={recipe.image}
        onChangeText={(text) => setRecipe({...recipe, image: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Main Ingredient"
        value={recipe.mainIngredient}
        onChangeText={(text) => setRecipe({...recipe, mainIngredient: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Cuisine"
        value={recipe.cuisine}
        onChangeText={(text) => setRecipe({...recipe, cuisine: text})}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdateRecipe}>
        <Text style={styles.buttonText}>Update Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
});
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { getDatabase } from './database';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const db = getDatabase();
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM recipes WHERE isFavorite = 1', [], (_, { rows }) => {
        setFavorites(rows._array);
      });
    });
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <Image source={{ uri: item.image || 'https://via.placeholder.com/100' }} style={styles.favoriteImage} />
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteTitle}>{item.title}</Text>
        <Text style={styles.favoriteTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id.toString()}
        />
      ) : (
        <Text style={styles.noFavoritesText}>No favorite recipes yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  favoriteItem: {
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  favoriteImage: {
    width: 100,
    height: 100,
  },
  favoriteInfo: {
    flex: 1,
    padding: 10,
  },
  favoriteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteTime: {
    fontSize: 14,
    color: '#666',
  },
  noFavoritesText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
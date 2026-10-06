import React from 'react';
import { StyleSheet, View, TextInput, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Search, X } from 'lucide-react-native';

// Champ de recherche arrondi : loupe, texte et bouton pour effacer
export default function SearchBar({ value, onChangeText, onSubmit }) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Search size={20} color={colors.textSecondary} />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        placeholder="Rechercher un film"
        placeholderTextColor={colors.textSecondary}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel="Rechercher un film"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Effacer la recherche"
        >
          <X size={18} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
    borderRadius: 24,
    borderWidth: 1,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
});

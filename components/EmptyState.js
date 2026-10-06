import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';

// Message centré à la place d'une liste vide ou d'un contenu en erreur :
// icône, titre, texte et bouton optionnel
export default function EmptyState({
  icon: Icon,
  title,
  message,
  buttonTitle,
  onPress,
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      {Icon && (
        <Icon size={48} color={colors.textSecondary} strokeWidth={1.5} />
      )}
      {title && (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      )}
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {message}
      </Text>
      {onPress && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>{buttonTitle}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 21,
    marginTop: 6,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonText: {
    color: '#141A2A',
    fontSize: 15,
    fontWeight: '700',
  },
});

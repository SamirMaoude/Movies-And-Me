import React from 'react';
import { Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';

// Cœur de la fiche film : plein quand le film est en favori, avec un rebond à chaque appui
export default function FavoriteButton({ isFavorite, onPress }) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.35, { duration: 120 }),
      withSpring(1),
    );
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
      }
    >
      <Animated.View style={animatedStyle}>
        <Heart
          size={24}
          color={isFavorite ? colors.favorite : colors.text}
          fill={isFavorite ? colors.favorite : 'transparent'}
        />
      </Animated.View>
    </Pressable>
  );
}

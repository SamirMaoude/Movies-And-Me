import React from 'react';
import { StyleSheet, View, Image, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera, UserRound } from 'lucide-react-native';

// Photo de profil choisie dans la galerie (icône par défaut) ; un appui permet d'en changer
export default function Avatar() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const avatar = useSelector(state => state.setAvatar.avatar);
  // Les anciennes versions persistaient un numéro d'asset (require) : seule une photo { uri } est gardée
  const photo = avatar && avatar.uri ? avatar : null;

  const pickPhoto = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxWidth: 300, maxHeight: 300, quality: 0.9 },
      response => {
        if (!response.didCancel && !response.errorCode && response.assets) {
          dispatch({
            type: 'SET_AVATAR',
            value: { uri: response.assets[0].uri },
          });
        }
      },
    );
  };

  return (
    <Pressable
      onPress={pickPhoto}
      accessibilityRole="button"
      accessibilityLabel="Changer la photo de profil"
    >
      {photo ? (
        <Image
          style={[styles.avatar, { borderColor: colors.primary }]}
          source={photo}
        />
      ) : (
        <View
          style={[
            styles.avatar,
            styles.placeholder,
            { borderColor: colors.primary, backgroundColor: colors.skeleton },
          ]}
        >
          <UserRound size={36} color={colors.textSecondary} />
        </View>
      )}
      <View
        style={[
          styles.badge,
          { backgroundColor: colors.primary, borderColor: colors.card },
        ]}
      >
        <Camera size={13} color="#141A2A" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

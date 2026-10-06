import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Linking,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { getImageFromApi } from '../API/TMDBApi';
import { groupWatchProviders } from '../Helpers/media';

// Plateformes où voir le film en France, par mode d'accès (abonnement, gratuit, location, achat).
// Un appui ouvre la page TMDB qui renvoie vers chaque plateforme.
export default function WatchProviders({ watchProviders }) {
  const { colors } = useTheme();
  const { link, groups } = groupWatchProviders(watchProviders);

  if (groups.length === 0) {
    return (
      <Text style={[styles.empty, { color: colors.textSecondary }]}>
        Ce film n'est proposé sur aucune plateforme en France pour le moment.
      </Text>
    );
  }

  const openLink = () => {
    if (link) {
      Linking.openURL(link).catch(() => {});
    }
  };

  return (
    <View>
      {groups.map(group => (
        <View key={group.label} style={styles.group}>
          <Text style={[styles.groupLabel, { color: colors.textSecondary }]}>
            {group.label}
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.logosScroll}
            contentContainerStyle={styles.logos}
          >
            {group.providers.map(provider => (
              <Pressable
                key={provider.provider_id}
                onPress={openLink}
                accessibilityRole="link"
                accessibilityLabel={`${
                  provider.provider_name
                } (${group.label.toLowerCase()})`}
              >
                <Image
                  style={[styles.logo, { borderColor: colors.border }]}
                  source={{ uri: getImageFromApi(provider.logo_path, 'w92') }}
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ))}
      <Text style={[styles.source, { color: colors.textSecondary }]}>
        Disponibilités en France, source JustWatch
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  empty: {
    fontSize: 15,
    lineHeight: 21,
  },
  group: {
    marginBottom: 12,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  // La rangée défile jusqu'aux bords de l'écran, malgré la marge de la section
  logosScroll: {
    marginHorizontal: -16,
  },
  logos: {
    gap: 10,
    paddingHorizontal: 16,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  source: {
    fontSize: 12,
  },
});

import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { darkKJTheme } from './ui/theme';
import { smartSearch } from './search/smartSearch';

export default function AppTemplate() {
  const demo = useMemo(() => smartSearch('queen bohemian rhapsody', 5), []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>IKFS Karaoke Console</Text>
      <Text style={styles.subtitle}>Dark mode KJ interface</Text>
      <View style={styles.card}>
        {demo.map((result) => (
          <Text style={styles.row} key={result.id}>
            {result.artist} — {result.title}
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkKJTheme.colors.background,
    padding: darkKJTheme.spacing.md,
  },
  title: {
    color: darkKJTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: darkKJTheme.colors.textSecondary,
    marginTop: darkKJTheme.spacing.xs,
    marginBottom: darkKJTheme.spacing.md,
  },
  card: {
    backgroundColor: darkKJTheme.colors.card,
    borderRadius: darkKJTheme.radius.lg,
    padding: darkKJTheme.spacing.md,
  },
  row: {
    color: darkKJTheme.colors.textPrimary,
    marginBottom: darkKJTheme.spacing.sm,
  },
});

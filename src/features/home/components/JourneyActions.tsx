import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export interface JourneyActionsProps {
  onRestart: () => void;
  onChooseAnother: () => void;
  onViewDetails: () => void;
  disabled?: boolean;
}

export const JourneyActions = React.memo(({
  onRestart,
  onChooseAnother,
  onViewDetails,
  disabled = false,
}: JourneyActionsProps) => {
  return (
    <View style={styles.container}>
      {/* View Details */}
      <Pressable
        onPress={onViewDetails}
        disabled={disabled}
        style={styles.actionBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="View journey progress details"
      >
        <Text style={styles.actionText}>View Details</Text>
      </Pressable>

      <Text style={styles.divider}>•</Text>

      {/* Choose Another */}
      <Pressable
        onPress={onChooseAnother}
        disabled={disabled}
        style={styles.actionBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Choose another wellness journey"
      >
        <Text style={styles.actionText}>Choose Another</Text>
      </Pressable>

      <Text style={styles.divider}>•</Text>

      {/* Restart */}
      <Pressable
        onPress={onRestart}
        disabled={disabled}
        style={styles.actionBtn}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Restart this journey"
      >
        <Text style={styles.actionText}>Restart</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    width: '100%',
  },
  actionBtn: {
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    fontFamily: 'Geomini, SF Pro Text',
    fontWeight: '500',
  },
  divider: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 10,
  },
});

export default JourneyActions;

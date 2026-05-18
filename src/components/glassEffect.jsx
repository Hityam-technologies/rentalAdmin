import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GlassEffect = ({
  children,
  className = '',
  removeDefaultClasses = false,
  gradientProps,
  noRoundedCorners = false,
  style,
}) => {
  const defaultClasses = 'flex-row items-center justify-between rounded-2xl px-5 py-3';
  const finalClassName = removeDefaultClasses ? className : `${defaultClasses} ${className}`;

  const hasCustomBorderRadius = style?.borderRadius !== undefined;
  const borderRadius = hasCustomBorderRadius ? style.borderRadius : 24;

  const wrapperStyle = [
    {
      borderRadius,
      overflow: 'hidden',
      backgroundColor: 'rgba(25, 25, 28, 0.95)', // Solid premium dark base
    },
    style
  ];

  return (
    <View style={wrapperStyle}>
      {/* 1. Primary Glossy Sheen (Increased contrast for gloss) */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.22)', 'rgba(255, 255, 255, 0.05)', 'transparent']}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 2. Top Edge Specular Highlight (The "Glint") */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.15)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.2 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 3. Secondary Depth Gradient */}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.3)', 'transparent']}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0.5 }}
        style={StyleSheet.absoluteFill}
      />

      {/* 4. Specular Border (Defined glossy edge) */}
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius,
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.25)',
          }
        ]}
        pointerEvents="none"
      />

      {/* 5. Content Layer */}
      <View className={`${finalClassName} bg-transparent`}>
        {children}
      </View>
    </View>
  );
};

export default GlassEffect;

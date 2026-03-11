import { Platform } from 'react-native';

export const Colors = {
  light: {
    // neutrals
    text: '#000000', // Black
    background: '#FFFFFF', // White
    grey: '#9B938F',
    greyHover: '#9B938F',
    lowGrey: '#F7F5F3',

    // primary brand
    primary: '#E0607E', // Pink
    primaryHover: '#D15373',
    primaryActive: '#FF5F93',
    lowPink: '#FFF4F4',

    // semantic
    border: '#E2DEDB',
    error: '#B00020',

    // existing consumers
    tint: '#E0607E',
    icon: '#9B938F',
    tabIconDefault: '#9B938F',
    tabIconSelected: '#E0607E',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    grey: '#9B938F',
    greyHover: '#9B938F',
    lowGrey: '#151515',

    primary: '#E0607E',
    primaryHover: '#D15373',
    primaryActive: '#FF5F93',
    lowPink: '#402027',

    border: '#333333',
    error: '#FFB3C1',

    tint: '#E0607E',
    icon: '#FFFFFF',
    tabIconDefault: '#9B938F',
    tabIconSelected: '#E0607E',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

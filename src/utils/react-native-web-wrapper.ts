import * as RNWeb from 'react-native-web';

export const TurboModuleRegistry = {
  get: () => null,
  getEnforcing: (name: string) => {
    return null;
  },
};

// Re-export everything from react-native-web
export * from 'react-native-web';

const defaultExport = {
  ...RNWeb,
  TurboModuleRegistry,
};
export default defaultExport;

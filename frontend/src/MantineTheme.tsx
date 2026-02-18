import { MantineThemeOverride } from '@mantine/core';

export const mantineTheme: MantineThemeOverride = {
  components: {
    Modal: {
      styles: {
        title: {
          fontWeight: 700,
        },
      },
    },
  },
};

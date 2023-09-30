import { NbJSThemeOptions, DEFAULT_THEME as baseTheme } from '@nebular/theme';

const {bg, fgText, primary, separator} = baseTheme.variables ?? {
  bg: '#ffffff',
  primary: '#333333',
  fgText: '#666666',
  separator: '#999999'
};

export const DEFAULT_THEME = {
  name: 'default',
  base: 'default',
  variables: {
    echarts: {
      bg: bg,
      textColor: fgText,
      axisLineColor: fgText,
      splitLineColor: separator,
      itemHoverShadowColor: 'rgba(0, 0, 0, 0.5)',
      tooltipBackgroundColor: primary,
      areaOpacity: '0.7',
    },

    chartjs: {
      axisLineColor: separator,
      textColor: fgText,
    }
  },
} as NbJSThemeOptions;

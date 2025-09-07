import {
  FluentProvider as FluentProviderInternal,
  FluentProviderProps,
  ForwardRefComponent,
} from '@fluentui/react-components';
import { createContext, forwardRef, useContext, useMemo } from 'react';

export interface ExtendedThemeProps {
  corners:
    | 'soft' // medium rounded corners
    | 'rounded' // large rounded corners
    | 'square' // sharp corners
    | 'circular'; // circular corners
  density:
    | 'compact' // For desktop
    | 'comfortable'; // For mobile or touch devices
}

export type ExtendedFluentProviderProps = FluentProviderProps &
  Partial<ExtendedThemeProps>;

const defaultCorners = 'rounded';
const defaultDensity = 'compact';

export const FluentProvider: ForwardRefComponent<ExtendedFluentProviderProps> =
  forwardRef(function FluentProvider(
    {
      corners = defaultCorners,
      density = defaultDensity,
      children,
      theme,
      ...rest
    },
    ref
  ) {
    corners ??= defaultCorners;
    density ??= defaultDensity;
    const contextValue = useMemo(
      () => ({ corners, density }),
      [corners, density]
    );

    const extendedTheme = useMemo(() => {
      let buttonBorderRadius: string;
      let controlBorderRadius: string;
      let paperBorderRadius: string;
      let checkboxBorderRadius: string;
      let controlBottomBorderMargin: string;
      let dialogBorderRadius: string;

      switch (corners) {
        case 'soft':
          buttonBorderRadius = '4px';
          controlBorderRadius = '4px';
          paperBorderRadius = '4px';
          checkboxBorderRadius = '2px';
          controlBottomBorderMargin = '-1px';
          dialogBorderRadius = '8px';
          break;
        case 'rounded':
          buttonBorderRadius = '8px';
          controlBorderRadius = '8px';
          paperBorderRadius = '8px';
          checkboxBorderRadius = '4px';
          controlBottomBorderMargin = '1px';
          dialogBorderRadius = '12px';
          break;
        case 'square':
          buttonBorderRadius = '0px';
          controlBorderRadius = '0px';
          paperBorderRadius = '0px';
          checkboxBorderRadius = '0px';
          controlBottomBorderMargin = '0px';
          dialogBorderRadius = '0px';
          break;
        case 'circular':
          buttonBorderRadius = '16px';
          controlBorderRadius = '16px';
          paperBorderRadius = '20px';
          checkboxBorderRadius = '8px';
          controlBottomBorderMargin = '8px';
          dialogBorderRadius = '20px';
          break;
      }

      let buttonMinWidthS = '64px';
      let buttonMinWidthM = '96px';
      let buttonMinWidthL = '96px';
      let buttonMinHeightS = '24px';
      let buttonMinHeightM = '32px';
      let buttonMinHeightL = '40px';
      let controlMinHeightS = '24px';
      let controlMinHeightM = '32px';
      let controlMinHeightL = '40px';
      let menuItemPaddingVertical = '6px';
      let optionPaddingVertical = '6px';
      let appBarHeight = '48px';
      let navItempaddingVertical = '10px';

      if (density === 'comfortable') {
        buttonMinWidthS = '72px';
        buttonMinWidthM = '112px';
        buttonMinWidthL = '112px';
        buttonMinHeightS = '32px';
        buttonMinHeightM = '40px';
        buttonMinHeightL = '48px';
        controlMinHeightS = '32px';
        controlMinHeightM = '40px';
        controlMinHeightL = '48px';
        menuItemPaddingVertical = '9px';
        optionPaddingVertical = '9px';
        appBarHeight = '64px';
        navItempaddingVertical = '16px';
      }

      let fontSizeBase100 = '10px';
      let fontSizeBase200 = '12px';
      let fontSizeBase300 = '14px';
      let fontSizeBase400 = '16px';
      let fontSizeBase500 = '20px';
      let fontSizeBase600 = '24px';
      let fontSizeHero700 = '28px';
      let fontSizeHero800 = '32px';
      let fontSizeHero900 = '40px';
      let fontSizeHero1000 = '68px';
      let lineHeightBase100 = '14px';
      let lineHeightBase200 = '16px';
      let lineHeightBase300 = '20px';
      let lineHeightBase400 = '22px';
      let lineHeightBase500 = '28px';
      let lineHeightBase600 = '32px';
      let lineHeightHero700 = '36px';
      let lineHeightHero800 = '40px';
      let lineHeightHero900 = '52px';
      let lineHeightHero1000 = '92px';

      if (density === 'comfortable') {
        fontSizeBase100 = '12px';
        fontSizeBase200 = '14px';
        fontSizeBase300 = '16px';
        fontSizeBase400 = '18px';
        fontSizeBase500 = '22px';
        fontSizeBase600 = '26px';
        fontSizeHero700 = '30px';
        fontSizeHero800 = '34px';
        fontSizeHero900 = '42px';
        fontSizeHero1000 = '72px';
        lineHeightBase100 = '16px';
        lineHeightBase200 = '18px';
        lineHeightBase300 = '22px';
        lineHeightBase400 = '24px';
        lineHeightBase500 = '30px';
        lineHeightBase600 = '34px';
        lineHeightHero700 = '38px';
        lineHeightHero800 = '42px';
        lineHeightHero900 = '54px';
        lineHeightHero1000 = '94px';
      }

      return {
        ...theme,
        buttonBorderRadius,
        controlBorderRadius,
        paperBorderRadius,
        checkboxBorderRadius,
        controlBottomBorderMargin,
        dialogBorderRadius,
        buttonMinHeightS,
        buttonMinHeightM,
        buttonMinHeightL,
        buttonMinWidthS,
        buttonMinWidthM,
        buttonMinWidthL,
        controlMinHeightS,
        controlMinHeightM,
        controlMinHeightL,
        menuItemPaddingVertical,
        optionPaddingVertical,
        navItempaddingVertical,
        appBarHeight,

        fontSizeBase100,
        fontSizeBase200,
        fontSizeBase300,
        fontSizeBase400,
        fontSizeBase500,
        fontSizeBase600,
        fontSizeHero700,
        fontSizeHero800,
        fontSizeHero900,
        fontSizeHero1000,
        lineHeightBase100,
        lineHeightBase200,
        lineHeightBase300,
        lineHeightBase400,
        lineHeightBase500,
        lineHeightBase600,
        lineHeightHero700,
        lineHeightHero800,
        lineHeightHero900,
        lineHeightHero1000,
      };
    }, [corners, density, theme]);

    return (
      <FluentProviderInternal {...rest} theme={extendedTheme} ref={ref}>
        <ExtendedThemeContext.Provider value={contextValue}>
          {children}
        </ExtendedThemeContext.Provider>
      </FluentProviderInternal>
    );
  });

export const ExtendedThemeContext = createContext<
  ExtendedThemeProps | undefined
>(undefined);

export function useExtendedThemeContext() {
  const value = useContext(ExtendedThemeContext);

  return useMemo(() => {
    return {
      corners: value?.corners ?? defaultCorners,
      density: value?.density ?? defaultDensity,
    };
  }, [value]);
}

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

      return {
        ...theme,
        buttonBorderRadius,
        controlBorderRadius,
        paperBorderRadius,
        checkboxBorderRadius,
        controlBottomBorderMargin,
        dialogBorderRadius,
      };
    }, [corners, theme]);

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

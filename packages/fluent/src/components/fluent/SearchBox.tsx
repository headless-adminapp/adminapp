import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  SearchBox as SearchBoxInternal,
  SearchBoxProps,
  tokens,
} from '@fluentui/react-components';
import { forwardRef } from 'react';

import { extendedTokens } from './tokens';

const useStyles = makeStyles({
  root: {
    borderRadius: extendedTokens.controlBorderRadius,
    '&::after': {
      borderBottomLeftRadius: extendedTokens.controlBorderRadius,
      borderBottomRightRadius: extendedTokens.controlBorderRadius,
      left: extendedTokens.controlBottomBorderMargin,
      right: extendedTokens.controlBottomBorderMargin,
    },
  },
  readonly: {
    '&::after': {
      borderBottomColor: tokens.colorNeutralStrokeDisabled,
    },
    '&:focus-within:active::after': {
      borderBottomColor: tokens.colorNeutralStrokeDisabled,
    },
  },
  outlined: {
    borderBottomColor: tokens.colorNeutralStroke1,

    '&:hover': {
      borderBottomColor: tokens.colorNeutralStroke1Hover,
    },

    '&:active': {
      borderBottomColor: tokens.colorNeutralStroke1Pressed,
    },
    '&:focus-within': {
      borderBottomColor: tokens.colorNeutralStroke1Pressed,
    },
  },
});

type ExtendedSearchBoxProps = SearchBoxProps;

export const SearchBox: ForwardRefComponent<ExtendedSearchBoxProps> =
  forwardRef(function SearchBox({ className, ...rest }, ref) {
    const styles = useStyles();
    return (
      <SearchBoxInternal
        {...rest}
        className={mergeClasses(
          className,
          styles.root,
          rest.readOnly && styles.readonly,
          rest.appearance === 'outline' && styles.outlined
        )}
        ref={ref}
      />
    );
  });

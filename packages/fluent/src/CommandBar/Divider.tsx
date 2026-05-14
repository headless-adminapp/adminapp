import {
  type ForwardRefComponent,
  tokens,
  ToolbarDivider,
} from '@fluentui/react-components';
import { forwardRef, memo, type RefObject } from 'react';

export const CommandDivider = memo(
  forwardRef(function CommandDivider(_, ref) {
    return (
      <ToolbarDivider
        ref={ref as RefObject<HTMLDivElement | null>}
        style={{ paddingInline: tokens.spacingHorizontalXS }}
      />
    );
  }),
) as ForwardRefComponent<{}>;

CommandDivider.displayName = 'CommandDivider';

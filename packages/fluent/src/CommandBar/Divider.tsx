import {
  ForwardRefComponent,
  tokens,
  ToolbarDivider,
} from '@fluentui/react-components';
import { forwardRef, RefObject } from 'react';

export const CommandDivider: ForwardRefComponent<{}> = forwardRef(
  function CommandDivider(_, ref) {
    return (
      <ToolbarDivider
        ref={ref as RefObject<HTMLDivElement>}
        style={{ paddingInline: tokens.spacingHorizontalXS }}
      />
    );
  }
);

CommandDivider.displayName = 'CommandDivider';

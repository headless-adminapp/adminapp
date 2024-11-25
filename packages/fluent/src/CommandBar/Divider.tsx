import {
  ForwardRefComponent,
  tokens,
  ToolbarDivider,
} from '@fluentui/react-components';
import { forwardRef, memo, MemoExoticComponent, RefObject } from 'react';

export const CommandDivider: MemoExoticComponent<ForwardRefComponent<{}>> =
  memo(
    forwardRef(function CommandDivider(_, ref) {
      return (
        <ToolbarDivider
          ref={ref as RefObject<HTMLDivElement>}
          style={{ paddingInline: tokens.spacingHorizontalXS }}
        />
      );
    })
  );

CommandDivider.displayName = 'CommandDivider';

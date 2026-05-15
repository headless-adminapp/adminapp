import { tokens, ToolbarDivider } from '@fluentui/react-components';
import { type FC, memo, type Ref } from 'react';

interface CommandDividerProps {
  ref?: Ref<HTMLDivElement>;
}

export const CommandDivider: FC<CommandDividerProps> = memo(
  function CommandDivider({ ref }) {
    return (
      <ToolbarDivider
        ref={ref}
        style={{ paddingInline: tokens.spacingHorizontalXS }}
      />
    );
  },
);

CommandDivider.displayName = 'CommandDivider';

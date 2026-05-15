import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import type { Icon } from '@headless-adminapp/icons';
import { type FC, memo, type Ref } from 'react';

import { ToolbarButton } from '../components/fluent';

const useStyles = makeStyles({
  root: {
    minWidth: 'unset',
    textWrap: 'nowrap',
    flexShrink: 0,
    cursor: 'default !important',

    '&:hover:active': {
      backgroundColor: tokens.colorNeutralBackground2Hover,
    },
  },
});

export interface CommandLabelProps {
  Icon?: Icon;
  text: string;
  ref?: Ref<HTMLButtonElement>;
}

export const CommandLabel: FC<CommandLabelProps> = memo(function CommandLabel({
  Icon,
  text,
  ref,
}) {
  const styles = useStyles();

  return (
    <ToolbarButton
      ref={ref}
      type="button"
      icon={Icon ? <Icon size={20} /> : undefined}
      className={mergeClasses(styles.root)}
    >
      {text}
    </ToolbarButton>
  );
});

CommandLabel.displayName = 'CommandLabel';

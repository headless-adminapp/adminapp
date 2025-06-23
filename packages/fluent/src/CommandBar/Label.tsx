import {
  ForwardRefComponent,
  makeStyles,
  mergeClasses,
  tokens,
  ToolbarButton,
} from '@fluentui/react-components';
import { Icon } from '@headless-adminapp/icons';
import { forwardRef, memo, MemoExoticComponent } from 'react';

const useStyles = makeStyles({
  root: {
    fontWeight: 'normal',
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
}

export const CommandLabel: MemoExoticComponent<
  ForwardRefComponent<CommandLabelProps>
> = memo(
  forwardRef(function CommandLabel({ Icon, text }, ref) {
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
  })
);

CommandLabel.displayName = 'CommandLabel';

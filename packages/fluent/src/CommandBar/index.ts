import { CommandButton } from './Button';
import { CommandDivider } from './Divider';
import { CommandIconButton } from './IconButton';
import { CommandLabel } from './Label';
import { CommandMenuButton } from './MenuButton';
import { CommandBarWrapper } from './Wrapper';

const CommandBar = {
  Wrapper: CommandBarWrapper,
  Button: CommandButton,
  MenuButton: CommandMenuButton,
  Divider: CommandDivider,
  IconButton: CommandIconButton,
  Label: CommandLabel,
};

export default CommandBar;

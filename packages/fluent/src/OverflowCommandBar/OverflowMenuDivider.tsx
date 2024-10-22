import {
  MenuDivider,
  useIsOverflowGroupVisible,
} from '@fluentui/react-components';

export const OverflowMenuDivider: React.FC<{
  id: string;
  previousGroupId: string;
}> = (props) => {
  const isGroupVisible = useIsOverflowGroupVisible(props.id);
  const isPreviousGroupVisible = useIsOverflowGroupVisible(
    props.previousGroupId
  );

  if (isGroupVisible !== 'hidden' || isPreviousGroupVisible === 'visible') {
    return null;
  }

  return <MenuDivider />;
};

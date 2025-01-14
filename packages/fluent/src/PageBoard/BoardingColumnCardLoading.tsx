import { Skeleton, SkeletonItem, tokens } from '@fluentui/react-components';

export function BoardingColumnCardLoading() {
  return (
    <Skeleton
      style={{
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: tokens.borderRadiusLarge,
        padding: tokens.spacingHorizontalM,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
      }}
    >
      <SkeletonItem
        style={{
          height: 16,
          width: '100%',
        }}
      />
      <SkeletonItem
        style={{
          height: 16,
          width: '50%',
        }}
      />
    </Skeleton>
  );
}

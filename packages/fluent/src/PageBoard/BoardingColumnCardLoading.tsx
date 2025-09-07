import { Skeleton, SkeletonItem, tokens } from '@fluentui/react-components';

import { extendedTokens } from '../components/fluent';

export function BoardingColumnCardLoading() {
  return (
    <Skeleton
      style={{
        backgroundColor: tokens.colorNeutralBackground1,
        borderRadius: extendedTokens.paperBorderRadius,
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

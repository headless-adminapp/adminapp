import { SkeletonItem, tokens } from '@fluentui/react-components';
import { FC } from 'react';

interface TextSkeletonProps {
  width?: number | string;
  height?: number | string;
}

export const TextSkeletonProps: FC<TextSkeletonProps> = ({ width, height }) => {
  return (
    <div style={{ height: height, display: 'flex', alignItems: 'center' }}>
      <SkeletonItem style={{ width, height: '75%' }} />
    </div>
  );
};

export const Body1Skeleton: FC<
  Omit<TextSkeletonProps, 'height' | 'textHeight'>
> = (props) => {
  return <TextSkeletonProps {...props} height={tokens.lineHeightBase300} />;
};

export const Subtitle2Skeleton: FC<
  Omit<TextSkeletonProps, 'height' | 'textHeight'>
> = (props) => {
  return <TextSkeletonProps {...props} height={tokens.lineHeightBase400} />;
};

export const Caption1Skeleton: FC<
  Omit<TextSkeletonProps, 'height' | 'textHeight'>
> = (props) => {
  return <TextSkeletonProps {...props} height={tokens.lineHeightBase300} />;
};

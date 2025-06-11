import { makeStyles, SkeletonItem } from '@fluentui/react-components';
import { FC } from 'react';

const useStyles = makeStyles({
  skeleton: {
    backgroundColor: 'var(--colorNeutralBackground3)',
    '&:after': {
      backgroundImage:
        'linear-gradient(to right, var(--colorNeutralBackground3) 0%, var(--colorNeutralBackground6) 50%, var(--colorNeutralBackground3) 100%)',
    },
  },
});

interface SkeletonControlProps {
  height?: number;
  width?: number | string;
}

export const SkeletonControl: FC<SkeletonControlProps> = ({
  height = 32,
  width,
}) => {
  const styles = useStyles();
  return (
    <div style={{ paddingBlock: 2 }}>
      <SkeletonItem
        style={{ height: height - 4, width }}
        className={styles.skeleton}
      />
    </div>
  );
};

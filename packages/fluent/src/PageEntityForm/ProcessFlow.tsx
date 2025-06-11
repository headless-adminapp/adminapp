import {
  Caption1,
  makeStyles,
  SkeletonItem,
  tokens,
} from '@fluentui/react-components';
import { FC } from 'react';

const useStyles = makeStyles({
  skeleton: {
    backgroundColor: 'transparent',
    '&:after': {
      backgroundImage:
        'linear-gradient(to right, transparent 0%, var(--colorNeutralStencil2) 50%, transparent 100%)',
    },
  },
});

interface ProcessFlowProps {
  height?: number;
  rounded?: boolean;
  items: Array<{
    label: string;
    isActivated?: boolean;
  }>;
  skeleton?: boolean;
}

export function ProcessFlow({
  height = 32,
  rounded = true,
  items,
  skeleton,
}: ProcessFlowProps) {
  const styles = useStyles();

  return (
    <div style={{ position: 'relative', height }}>
      <div
        style={{
          display: 'flex',
          overflow: 'hidden',
          borderRadius: rounded ? tokens.borderRadiusMedium : 0,
        }}
      >
        {items.map((item, index) => (
          <ProcessFlowItem
            key={index}
            height={height}
            label={item.label}
            isActivated={item.isActivated}
            isFirst={index === 0}
            isLast={index === items.length - 1}
            skeleton={skeleton}
          />
        ))}
      </div>
      {skeleton && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <SkeletonItem
            style={{
              height: '100%',
              borderRadius: rounded ? tokens.borderRadiusMedium : 0,
            }}
            className={styles.skeleton}
          />
        </div>
      )}
    </div>
  );
}

interface ProcessFlowItemProps {
  label: string;
  isActivated?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  height: number;
  skeleton?: boolean;
}

const ProcessFlowItem: FC<ProcessFlowItemProps> = ({
  label,
  height,
  isActivated,
  isFirst,
  isLast,
  skeleton,
}) => {
  let backgroundColor = tokens.colorNeutralStencil1;

  if (!skeleton) {
    backgroundColor = isActivated
      ? tokens.colorBrandBackground
      : tokens.colorNeutralStrokeDisabled;
  }

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height,
      }}
    >
      <div style={{ zIndex: 1 }}>
        <div
          style={{
            position: 'absolute',
            left: 20,
            right: 20,
            top: 0,
            height: '100%',
            backgroundColor: backgroundColor,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 40,
            height: '50%',
            backgroundColor: backgroundColor,
            transform: isFirst ? 'skewX(0deg)' : 'skewX(30deg)',
            borderLeft: isFirst
              ? 'none'
              : `1px solid ${tokens.colorNeutralBackground1}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: 40,
            height: '50%',
            backgroundColor: backgroundColor,
            transform: isLast ? 'skewX(0deg)' : 'skewX(30deg)',
            borderRight: isLast
              ? 'none'
              : `1px solid ${tokens.colorNeutralBackground1}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '50%',
            width: 40,
            height: '50%',
            backgroundColor: backgroundColor,
            transform: isFirst ? 'skewX(0deg)' : 'skewX(-30deg)',
            borderLeft: isFirst
              ? 'none'
              : `1px solid ${tokens.colorNeutralBackground1}`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '50%',
            width: 40,
            height: '50%',
            backgroundColor: backgroundColor,
            transform: isLast ? 'skewX(0deg)' : 'skewX(-30deg)',
            borderRight: isLast
              ? 'none'
              : `1px solid ${tokens.colorNeutralBackground1}`,
          }}
        />
      </div>
      {!skeleton && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            alignItems: 'center',
            gap: tokens.spacingVerticalS,
            color: isActivated ? 'white' : undefined,
            zIndex: 2,
          }}
        >
          <Caption1>{label}</Caption1>
        </div>
      )}
    </div>
  );
};

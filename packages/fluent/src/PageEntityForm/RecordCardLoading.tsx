import {
  Avatar,
  makeStyles,
  mergeClasses,
  SkeletonItem,
  tokens,
} from '@fluentui/react-components';
import { CardView } from '@headless-adminapp/core/experience/view';
import { SchemaAttributes } from '@headless-adminapp/core/schema';

interface RecordCardLoadingProps<
  S extends SchemaAttributes = SchemaAttributes
> {
  cardView: CardView<S>;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingInline: tokens.spacingHorizontalL,
    paddingBlock: tokens.spacingVerticalS,
    gap: tokens.spacingHorizontalS,
  },
});

export function RecordCardLoading<
  S extends SchemaAttributes = SchemaAttributes
>({ cardView }: Readonly<RecordCardLoadingProps<S>>) {
  const styles = useStyles();

  return (
    <div className={mergeClasses(styles.root)}>
      {cardView.showAvatar && (
        <Avatar color="neutral" style={{ cursor: 'pointer' }} />
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          gap: tokens.spacingVerticalXXS,
        }}
      >
        <div style={{ paddingBlock: 2 }}>
          <SkeletonItem size={16} style={{ height: 16 }} />
        </div>
        {cardView.secondaryColumns?.map((_, index) => (
          <div key={index} style={{ paddingBlock: 2 }}>
            <SkeletonItem size={16} style={{ width: 160, height: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

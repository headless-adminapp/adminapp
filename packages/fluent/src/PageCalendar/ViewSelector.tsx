import { makeStyles, mergeClasses, tokens } from '@fluentui/react-components';
import { FC, Fragment } from 'react';

import { Button } from '../components/fluent';
import { ViewType } from './types';

type ViewItem = {
  label: string;
  value: ViewType;
};

const viewItems: ViewItem[] = [
  {
    label: 'Month',
    value: ViewType.Month,
  },
  {
    label: 'Week',
    value: ViewType.Week,
  },
  {
    label: 'Day',
    value: ViewType.Day,
  },
];

interface ViewSelectorProps {
  viewType: ViewType;
  onChange: (viewType: ViewType) => void;
}

const useStyles = makeStyles({
  root: {},
  button: {
    '&:not(:first-of-type)': {
      // borderLeftWidth: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    '&:not(:last-of-type)': {
      borderRightWidth: 0,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    },
  },
  active: {
    '&+button': {
      borderLeftColor: 'transparent !important',
    },
  },
});

export const ViewSelector: FC<ViewSelectorProps> = ({ viewType, onChange }) => {
  const styles = useStyles();

  return (
    <div
      style={{
        display: 'inline-flex',
        overflow: 'hidden',
      }}
      className={styles.root}
    >
      {viewItems.map((item) => (
        <Fragment key={item.value}>
          <Button
            className={mergeClasses(
              styles.button,
              item.value === viewType && styles.active
            )}
            key={item.value}
            appearance={item.value === viewType ? 'primary' : 'secondary'}
            onClick={() => onChange(item.value)}
            style={{
              fontWeight: tokens.fontWeightRegular,
              minWidth: 60,
            }}
          >
            {item.label}
          </Button>
        </Fragment>
      ))}
    </div>
  );
};

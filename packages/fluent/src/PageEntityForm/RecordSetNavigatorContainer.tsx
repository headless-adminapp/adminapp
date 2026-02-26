import {
  Body1Strong,
  Divider,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
import { DataFormContext } from '@headless-adminapp/app/dataform';
import { useLocale } from '@headless-adminapp/app/locale';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { useOpenForm } from '@headless-adminapp/app/navigation';
import {
  useRecordSetResult,
  useRecordSetVisibility,
} from '@headless-adminapp/app/recordset/hooks';
import { FC, Fragment } from 'react';

import { extendedTokens } from '../components/fluent';
import { RecordCard } from './RecordCard';

const useStyles = makeStyles({
  item: {
    cursor: 'pointer',

    '&:hover': {
      background: tokens.colorNeutralBackground1Hover,
    },
    '&:active': {
      background: tokens.colorNeutralBackground1Pressed,
    },
  },
  selected: {
    background: tokens.colorNeutralBackground1Selected,
  },
});

export const RecordSetNavigatorContainer: FC = () => {
  const { data, cardView, schema } = useRecordSetResult();

  const [visible] = useRecordSetVisibility();

  const navigatorRecordId = useContextSelector(
    DataFormContext,
    (state) => state.navigatorRecordId ?? state.recordId,
  );
  const navigatorLogicalName = useContextSelector(
    DataFormContext,
    (state) => state.navigatorLogicalName ?? state.schema.logicalName,
  );

  const styles = useStyles();

  const openForm = useOpenForm();
  const { language, direction } = useLocale();

  if (!schema) {
    return null;
  }

  if (!visible) {
    return null;
  }

  if (schema.logicalName !== navigatorLogicalName) {
    return null;
  }

  return (
    <div
      style={{
        [direction === 'rtl' ? 'paddingRight' : 'paddingLeft']:
          tokens.spacingVerticalM,
        paddingBlock: tokens.spacingVerticalM,
        display: 'flex',
        // display: 'none',
      }}
    >
      <div
        style={{
          boxShadow: tokens.shadow2,
          borderRadius: extendedTokens.paperBorderRadius,
          background: tokens.colorNeutralBackground1,
          display: 'flex',
          minWidth: 320,
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingInline: 16,
            paddingBlock: 8,
          }}
        >
          <Body1Strong>
            {schema.localizedPluralLabels?.[language] ?? schema?.pluralLabel}
          </Body1Strong>
        </div>
        <div>
          <Divider vertical={false} style={{ opacity: 0.2 }} />
        </div>
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column' }}>
          <ScrollView autoHide rtl={direction === 'rtl'}>
            {data?.map((record) => (
              <Fragment key={record[schema.idAttribute] as string}>
                <div
                  role="button"
                  className={mergeClasses(
                    styles.item,
                    navigatorRecordId === record[schema.idAttribute] &&
                      styles.selected,
                  )}
                  onClick={() => {
                    void openForm({
                      logicalName: schema.logicalName,
                      id: record[schema.idAttribute] as string,
                      replace: true,
                    });
                  }}
                >
                  <RecordCard
                    cardView={cardView!}
                    record={record}
                    schema={schema}
                    selected={navigatorRecordId === record[schema.idAttribute]}
                  />
                </div>
                <div style={{ paddingInline: tokens.spacingHorizontalL }}>
                  <Divider vertical={false} style={{ opacity: 0.2 }} />
                </div>
              </Fragment>
            ))}
          </ScrollView>
        </div>
      </div>
    </div>
  );
};

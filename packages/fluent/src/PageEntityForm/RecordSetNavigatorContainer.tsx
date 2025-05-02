import {
  Body1Strong,
  Divider,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
import {
  useDataFormSchema,
  useRecordId,
} from '@headless-adminapp/app/dataform/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { useOpenForm } from '@headless-adminapp/app/navigation';
import {
  useRecordSetResult,
  useRecordSetVisibility,
} from '@headless-adminapp/app/recordset/hooks';
import { FC, Fragment } from 'react';

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

  const recordId = useRecordId();
  const formSchema = useDataFormSchema();

  const styles = useStyles();

  const openForm = useOpenForm();
  const { language, direction } = useLocale();

  if (!schema) {
    return null;
  }

  if (!visible) {
    return null;
  }

  if (schema.logicalName !== formSchema?.logicalName) {
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
          borderRadius: tokens.borderRadiusMedium,
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
              <Fragment
                key={record[schema!.idAttribute as string] as unknown as string}
              >
                <div
                  role="button"
                  className={mergeClasses(
                    styles.item,
                    recordId ===
                      (record as any)[schema.idAttribute as string] &&
                      styles.selected
                  )}
                  onClick={() => {
                    openForm({
                      logicalName: schema.logicalName,
                      id: (record as any)[schema.idAttribute] as string,
                      replace: true,
                    });
                  }}
                >
                  <RecordCard
                    cardView={cardView!}
                    record={record}
                    schema={schema!}
                    selected={
                      recordId ===
                      (record as any)[schema!.idAttribute as string]
                    }
                  />
                </div>
                <div style={{ paddingInline: tokens.spacingHorizontalL }}>
                  <Divider vertical={false} style={{ opacity: 0.2 }} />
                </div>
              </Fragment>
            ))}
            {/* <RecordCard
            cardView={{
              primaryColumn: 'name',
              secondaryColumns: [
                {
                  name: 'city',
                },
              ],
              avatarColumn: 'name',
              showAvatar: true,
            }}
            record={{
              name: 'Shreeyam steel industries pvt ltd',
              city: 'Ahmedabad',
            }}
            schema={partySchema}
          /> */}
            {/* {Array.from({ length: 5 }).map((_, index) => (
            <Fragment key={index}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingInline: tokens.spacingHorizontalL,
                  paddingBlock: tokens.spacingVerticalS,
                  // background: tokens.colorNeutralBackground1Hover,
                  gap: tokens.spacingHorizontalS,
                }}
              >
                <Avatar
                  initials={'GA'}
                  color="neutral"
                  style={{ cursor: 'pointer' }}
                  image={
                    {
                      // src: authSession.profilePicture,
                    }
                  }
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Body1>Shreeyam steel industries pvt ltd</Body1>
                  <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
                    Ahmedabad
                  </Caption1>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Body1Strong>$ 48</Body1Strong>
                  <Tag
                    size="extra-small"
                    appearance="filled"
                    style={{
                      background: 'green',
                      color: 'white',
                      // fontSize: `${tokens.fontSizeBase100} !important`,
                      height: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Active
                  </Tag>
                </div>
              </div>
              <div style={{ paddingInline: tokens.spacingHorizontalL }}>
                <Divider vertical={false} style={{ opacity: 0.2 }} />
              </div>
            </Fragment>
          ))}
          {Array.from({ length: 5 }).map((_, index) => (
            <Fragment key={index}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  paddingInline: tokens.spacingHorizontalL,
                  paddingBlock: tokens.spacingVerticalS,
                  // background: tokens.colorNeutralBackground1Hover,
                  gap: tokens.spacingHorizontalS,
                }}
              >
                <Avatar
                  initials={'GA'}
                  color="neutral"
                  style={{ cursor: 'pointer' }}
                  image={
                    {
                      // src: authSession.profilePicture,
                    }
                  }
                />
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                  }}
                >
                  <Body1>Shreeyam steel industries</Body1>
                  <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
                    Phone: +91234343434
                  </Caption1>
                  <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
                    City: Ahmedabad
                  </Caption1>
                  <Caption1 style={{ color: tokens.colorNeutralForeground4 }}>
                    Address: Ahmedabad
                  </Caption1>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Body1Strong>$ 48</Body1Strong>
                  <Tag
                    size="extra-small"
                    appearance="filled"
                    style={{ background: 'green', color: 'white' }}
                  >
                    Active
                  </Tag>
                </div>
              </div>
              <div style={{ paddingInline: tokens.spacingHorizontalL }}>
                <Divider vertical={false} style={{ opacity: 0.2 }} />
              </div>
            </Fragment>
          ))} */}
          </ScrollView>
        </div>
      </div>
    </div>
  );
};

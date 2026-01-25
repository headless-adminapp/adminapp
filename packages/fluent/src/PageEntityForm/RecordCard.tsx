import {
  Avatar,
  Body1,
  Body1Strong,
  Caption1,
  makeStyles,
  mergeClasses,
  tokens,
} from '@fluentui/react-components';
import { useLocale } from '@headless-adminapp/app/locale';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { ChoiceAttribute } from '@headless-adminapp/core/attributes';
import { ChoicesAttribute } from '@headless-adminapp/core/attributes/ChoiceAttribute';
import { Locale } from '@headless-adminapp/core/experience/locale';
import { CardView } from '@headless-adminapp/core/experience/view';
import { CardViewSecondaryColumn } from '@headless-adminapp/core/experience/view/View';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { FC, useMemo } from 'react';

import { ChoiceBadge } from '../components/ChoiceBadge';

interface RecordCardProps<S extends SchemaAttributes = SchemaAttributes> {
  schema: Schema<S>;
  cardView: CardView<S>;
  record: InferredSchemaType<S>;
  selected?: boolean;
}

const useStyles = makeStyles({
  root: {
    minHeight: '44px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingInline: tokens.spacingHorizontalL,
    paddingBlock: tokens.spacingVerticalS,
    gap: tokens.spacingHorizontalS,
  },
  selected: {
    background: tokens.colorNeutralBackground1Hover,
  },
});

function createIntial(name: string | null | undefined) {
  return name
    ?.split(' ')
    .map((x) => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function RecordCard<S extends SchemaAttributes = SchemaAttributes>({
  schema,
  cardView,
  record,
  selected,
}: Readonly<RecordCardProps<S>>) {
  const styles = useStyles();
  const locale = useLocale();

  const _record = record as any;

  const recordTitle = useMemo(() => {
    const _title = _record[schema.primaryAttribute];

    if (_title === undefined || _title === null) {
      return null;
    }

    if (typeof _title !== 'string') {
      return String(_title);
    }

    return _title;
  }, [_record, schema.primaryAttribute]);

  const initials = createIntial(recordTitle);

  let avatarSrc = '';

  if (cardView.showAvatar) {
    const avatarColumn = cardView.avatarColumn ?? schema.avatarAttribute;

    if (avatarColumn) {
      const avatarAttribute = schema.attributes[avatarColumn];

      if (
        avatarAttribute.type === 'attachment' &&
        avatarAttribute.format === 'image'
      ) {
        avatarSrc = _record[avatarColumn]?.url;
      } else if (
        avatarAttribute.type === 'string' &&
        avatarAttribute.format === 'url'
      ) {
        avatarSrc = _record[avatarColumn];
      }
    }
  }

  return (
    <div className={mergeClasses(styles.root, selected && styles.selected)}>
      <div className={styles.inner}>
        {cardView.showAvatar && (
          <Avatar
            initials={initials}
            color="neutral"
            size={!cardView.secondaryColumns?.length ? 20 : 32}
            style={{ cursor: 'pointer' }}
            image={{
              src: avatarSrc,
            }}
          />
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <Body1 style={{ wordBreak: 'break-all' }}>
            {getAttributeFormattedValue(
              schema.attributes[cardView.primaryColumn],
              _record[cardView.primaryColumn],
              locale,
            )}
          </Body1>
          {cardView.secondaryColumns?.map((column) => (
            <SecondaryColumnContent
              key={column.name as string}
              record={_record}
              column={column}
              schema={schema}
              locale={locale}
            />
          ))}
        </div>
        {!!cardView.rightColumn?.length && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
            }}
          >
            {cardView.rightColumn.map((column) => {
              const value = _record[column.name];

              if (!value) {
                return null;
              }

              const attribute = schema.attributes[column.name];

              if (column.variant === 'choice') {
                if (attribute.type === 'choice') {
                  return (
                    <ChoiceTag
                      key={column.name as string}
                      attribute={attribute}
                      value={value}
                    />
                  );
                }
              }

              if (column.variant === 'strong') {
                return (
                  <Body1Strong key={column.name as string}>
                    {getAttributeFormattedValue(attribute, value, locale)}
                  </Body1Strong>
                );
              }

              return (
                <Caption1
                  key={column.name as string}
                  style={{ color: tokens.colorNeutralForeground4 }}
                >
                  {getAttributeFormattedValue(attribute, value, locale)}
                </Caption1>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SecondaryColumnContent<S extends SchemaAttributes = SchemaAttributes>({
  record: _record,
  column,
  schema,
  locale,
}: Readonly<{
  record: any;
  column: CardViewSecondaryColumn<S>;
  schema: Schema<S>;
  locale: Locale;
}>) {
  const value = _record[column.name];
  if (!value && value !== 0) {
    return null;
  }

  const attribute = schema.attributes[column.name];

  let label = '';

  if (column.label === true) {
    label = attribute.label;
  } else if (typeof column.label === 'string') {
    label = column.label;
  }

  if (column.variant === 'choice') {
    if (attribute.type === 'choice') {
      return <ChoiceTag attribute={attribute} value={value} />;
    }

    if (attribute.type === 'choices') {
      const choices = attribute.options.filter((option) =>
        value.includes(option.value),
      );

      if (!choices.length) {
        return null;
      }

      return (
        <div
          key={column.name as string}
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 4,
          }}
        >
          {choices.map((choice) => (
            <ChoiceTag
              key={choice.value as string}
              attribute={attribute}
              value={choice.value}
            />
          ))}
        </div>
      );
    }
  }

  return (
    <Caption1
      key={column.name as string}
      style={{ color: tokens.colorNeutralForeground4 }}
    >
      {!!label && `${label}: `}
      {getAttributeFormattedValue(attribute, value, locale)}
    </Caption1>
  );
}

interface ChoiceTagProps<T extends string | number> {
  attribute: ChoiceAttribute<T> | ChoicesAttribute<T>;
  value: T;
}

const ChoiceTag: FC<ChoiceTagProps<string | number>> = ({
  attribute,
  value,
}) => {
  return <ChoiceBadge attribute={attribute} value={value} size="small" />;
};

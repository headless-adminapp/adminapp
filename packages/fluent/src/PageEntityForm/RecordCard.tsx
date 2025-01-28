import {
  Avatar,
  Body1,
  Body1Strong,
  Caption1,
  makeStyles,
  mergeClasses,
  Tag,
  tokens,
} from '@fluentui/react-components';
import { getAttributeFormattedValue } from '@headless-adminapp/app/utils';
import { isColorDark } from '@headless-adminapp/app/utils/color';
import { CardView } from '@headless-adminapp/core/experience/view';
import { CardViewSecondaryColumn } from '@headless-adminapp/core/experience/view/View';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';

interface RecordCardProps<S extends SchemaAttributes = SchemaAttributes> {
  schema: Schema<S>;
  cardView: CardView<S>;
  record: InferredSchemaType<S>;
  selected?: boolean;
}

const useStyles = makeStyles({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingInline: tokens.spacingHorizontalL,
    paddingBlock: tokens.spacingVerticalS,
    gap: tokens.spacingHorizontalS,
    // cursor: 'pointer',

    // '&:hover': {
    //   background: tokens.colorNeutralBackground1Hover,
    // },
    // '&:active': {
    //   background: tokens.colorNeutralBackground1Pressed,
    // },
  },
  // selected: {
  //   background: tokens.colorNeutralBackground1Selected,
  // },
  selected: {},
});

function createIntial(name: string) {
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

  const _record = record as any;

  const recordTitle = _record[schema.primaryAttribute];

  const initials = createIntial(recordTitle);

  let avatarSrc = '';

  if (cardView.avatarColumn) {
    const avatarAttribute = schema.attributes[cardView.avatarColumn];

    if (
      avatarAttribute.type === 'attachment' &&
      avatarAttribute.format === 'image'
    ) {
      avatarSrc = _record[cardView.avatarColumn]?.url;
    } else if (
      avatarAttribute.type === 'string' &&
      avatarAttribute.format === 'url'
    ) {
      avatarSrc = _record[cardView.avatarColumn];
    }
  }

  return (
    <div className={mergeClasses(styles.root, selected && styles.selected)}>
      {cardView.showAvatar && (
        <Avatar
          initials={initials}
          color="neutral"
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
          {_record[cardView.primaryColumn]}
        </Body1>
        {cardView.secondaryColumns?.map((column) => (
          <SecondaryColumnContent
            key={column.name as string}
            record={_record}
            column={column}
            schema={schema}
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
                const choice = attribute.options.find(
                  (option) => option.value === value
                );

                if (!choice) {
                  return null;
                }

                return (
                  <Tag
                    key={column.name as string}
                    size="extra-small"
                    appearance="filled"
                    style={{
                      background: choice.color,
                      color: 'white',
                      height: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {choice.label}
                  </Tag>
                );
              }
            }

            if (column.variant === 'strong') {
              return (
                <Body1Strong key={column.name as string}>
                  {getAttributeFormattedValue(value, attribute)}
                </Body1Strong>
              );
            }

            return (
              <Caption1
                key={column.name as string}
                style={{ color: tokens.colorNeutralForeground4 }}
              >
                {getAttributeFormattedValue(value, attribute)}
              </Caption1>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SecondaryColumnContent<S extends SchemaAttributes = SchemaAttributes>({
  record: _record,
  column,
  schema,
}: Readonly<{
  record: any;
  column: CardViewSecondaryColumn<S>;
  schema: Schema<S>;
}>) {
  const value = _record[column.name];
  if (!value) {
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
      const choice = attribute.options.find((option) => option.value === value);

      if (!choice) {
        return null;
      }

      const bgColor = choice.color;
      let color: string | undefined;
      if (bgColor) {
        color = isColorDark(bgColor) ? '#FFFFFF' : '#000000';
      }

      return (
        <Tag
          key={column.name as string}
          size="extra-small"
          appearance="filled"
          style={{
            background: bgColor,
            color: color,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {choice.label}
        </Tag>
      );
    }

    if (attribute.type === 'choices') {
      const choices = attribute.options.filter((option) =>
        value.includes(option.value)
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
            <Tag
              key={choice.value as string}
              size="extra-small"
              appearance="filled"
              style={{
                background: choice.color,
                color: 'white',
                height: 16,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {choice.label}
            </Tag>
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
      {getAttributeFormattedValue(attribute, value)}
    </Caption1>
  );
}

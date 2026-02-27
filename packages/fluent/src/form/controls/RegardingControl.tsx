import {
  Avatar,
  Body1,
  Link,
  makeStyles,
  mergeClasses,
  OptionGroup,
  Spinner,
  TagGroup,
  tokens,
} from '@fluentui/react-components';
import { useAppContext } from '@headless-adminapp/app/app';
import { useDebouncedValue } from '@headless-adminapp/app/hooks';
import { useMetadata } from '@headless-adminapp/app/metadata/hooks/useMetadata';
import {
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import { PageType } from '@headless-adminapp/core/experience/app';
import { ViewExperience } from '@headless-adminapp/core/experience/view';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { ISchemaStore } from '@headless-adminapp/core/store';
import {
  Data,
  IDataService,
  RetriveRecordsResult,
} from '@headless-adminapp/core/transport';
import { IconPlaceholder, Icons } from '@headless-adminapp/icons';
import { useQuery } from '@tanstack/react-query';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import { Combobox, Tag } from '../../components/fluent';
import { Option } from '../../components/fluent/Option';
import { RecordCard } from '../../PageEntityForm/RecordCard';
import { getAvatarColor } from '../../utils/avatar';
import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';
import { useLookupDatas } from './useLookupData';

export interface LookupOption {
  limit: number;
  search: string;
  enabled?: boolean;
}

export type DataLookup = {
  id: string;
  name: string;
  logicalName: string;
  avatar?: string;
};

export type RegardingControlProps = ControlProps<DataLookup> & {
  dataService: IDataService;
  entities: string[];
  schemaStore: ISchemaStore;
  allowNavigation?: boolean;
};

export function RegardingControl(props: RegardingControlProps) {
  const Control = LookupControlMd;

  return <Control {...props} />;
}

const useStyles = makeStyles({
  option: {
    padding: 0,

    '& .fui-Option__checkIcon': {
      display: 'none',
    },

    '&[data-activedescendant-focusvisible]': {
      background: tokens.colorNeutralBackground1Hover,

      '&:after': {
        border: 'none !important',
        // background: tokens.colorNeutralBackground1Hover,
      },
    },
  },
});

const LookupControlMd: FC<RegardingControlProps> = ({
  value,
  onChange,
  id,
  name,
  onBlur,
  onFocus,
  placeholder,
  disabled,
  autoFocus,
  readOnly,
  dataService,
  entities,
  schemaStore,
  allowNavigation,
  skeleton,
}) => {
  const [lookupEnabled, setLookupEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { lookupStrings } = useAppStrings();
  const routeResolver = useRouteResolver();
  const router = useRouter();

  const path = useMemo(() => {
    if (!value) {
      return '';
    }

    if (!allowNavigation) {
      return '';
    }

    return routeResolver({
      logicalName: value.logicalName,
      type: PageType.EntityForm,
      id: value.id,
    });
  }, [allowNavigation, routeResolver, value]);

  const handleOpenRecord = useCallback(
    async (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!path) {
        return;
      }

      await router.push(path);
    },
    [path, router],
  );

  useEffect(() => {
    if (open) setLookupEnabled(true);
  }, [open]);

  const [debouncedSearchText] = useDebouncedValue(searchText, 500);

  const styles = useStyles();

  const { experienceStore } = useMetadata();

  const { isFetching: isConfigFetching, data: configs } = useQuery({
    queryKey: ['data', 'getLookupViews', entities, undefined],
    queryFn: async () => {
      return Promise.all(
        entities.map(async (name) => {
          const schema = schemaStore.getSchema(name);
          const view = await experienceStore.getViewLookupV2(name);
          return {
            schema,
            view: view?.experience as ViewExperience | null,
          };
        }),
      );
    },
    throwOnError: true,
    initialData: [],
  });

  const result = useLookupDatas({
    dataService,
    searchText: debouncedSearchText,
    enabled:
      lookupEnabled && !isConfigFetching && !value && !readOnly && !disabled,
    items: configs,
  });

  const isLoading = result.some((item) => item.isFetching);

  useEffect(() => {
    if (value) {
      setSearchText(value.name);
    } else {
      setSearchText('');
    }
  }, [value]);

  const handleChange = (
    value: Data<InferredSchemaType<SchemaAttributes>> | null,
  ) => {
    setSearchText('');
    if (!value) {
      return onChange?.(null);
    } else {
      const schema = schemaStore.getSchema(value.$entity);
      return onChange?.({
        id: value[schema.idAttribute] as string,
        name: value[schema.primaryAttribute] as string,
        logicalName: schema.logicalName,
      });
    }
  };

  const valueSchema = useMemo(() => {
    if (!value) {
      return null;
    }

    return schemaStore.getSchema(value?.logicalName);
  }, [schemaStore, value]);

  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <Combobox
        name={name}
        appearance="filled-darker"
        expandIcon={
          readOnly || disabled ? null : isLoading ? (
            <Spinner size="extra-tiny" />
          ) : (
            <Icons.Search size={18} />
          )
        }
        placeholder={!value ? placeholder : ''}
        inputMode="search"
        style={{ width: '100%', minWidth: 'unset' }}
        autoComplete="off"
        readOnly={readOnly || disabled}
        // disabled={disabled}
        open={open && !value && !readOnly && !disabled}
        value={!value ? searchText : ''}
        onOpenChange={(e, data) => setOpen(data.open)}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        onOptionSelect={(e, item) => {
          const _item = result
            .map((group, index) => {
              const schema = configs[index].schema;
              if (!schema) {
                return null;
              }

              const data = group.data as RetriveRecordsResult<
                Record<string, unknown>
              >;

              const record = data?.records.find(
                (x) =>
                  String(x[schema.idAttribute]) === String(item.optionValue),
              );

              return record;
            })
            .filter(Boolean)[0];

          handleChange(_item ?? null);
        }}
        disableAutoFocus
        onBlur={onBlur}
        onFocus={onFocus}
        id={id}
        autoFocus={autoFocus}
      >
        {result.map((group, index) => {
          const schema = configs[index].schema;
          const view = configs[index].view;
          const data = group.data as
            | RetriveRecordsResult<Record<string, unknown>>
            | undefined;

          if (!data?.records.length) {
            return null;
          }

          return (
            <OptionGroup key={schema.logicalName} label={schema.label}>
              {data?.records.map((item) => {
                return (
                  <Option
                    key={item[schema.idAttribute] as string}
                    value={item[schema.idAttribute] as string}
                    className={mergeClasses(styles.option)}
                    text={item[schema.primaryAttribute] as string}
                  >
                    {view?.card ? (
                      view.card.Renderer ? (
                        <view.card.Renderer record={item} schema={schema} />
                      ) : (
                        <RecordCard
                          cardView={view.card}
                          record={item}
                          schema={schema}
                        />
                      )
                    ) : (
                      (item[schema.primaryAttribute] as string)
                    )}
                  </Option>
                );
              })}
            </OptionGroup>
          );
        })}
        {!isLoading &&
          result.every(
            (item) => !(item.data as RetriveRecordsResult)?.records.length,
          ) && (
            <div
              style={{
                paddingInline: tokens.spacingHorizontalL,
                paddingBlock: tokens.spacingVerticalS,
              }}
            >
              <Body1>{lookupStrings.noRecordsFound}</Body1>
            </div>
          )}
      </Combobox>
      {!!value && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            alignItems: 'center',
            paddingInline: 4,
            display: 'flex',
          }}
        >
          <TagGroup as="div">
            <Tag
              as="span"
              appearance="brand"
              size="small"
              dismissible={!disabled && !readOnly}
              value={value.id}
              style={{
                paddingRight: !disabled && !readOnly ? 0 : 5,
                background: tokens.colorNeutralBackground6,
              }}
              dismissIcon={
                <div
                  style={{ display: 'flex', cursor: 'pointer' }}
                  onClick={() => {
                    onChange?.(null);
                  }}
                >
                  <Icons.Close size={16} />
                </div>
              }
              primaryText={{
                style: {
                  paddingBottom: 0,
                },
              }}
            >
              {allowNavigation && path ? (
                <Link
                  href={path}
                  onClick={handleOpenRecord}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: tokens.spacingHorizontalXS,
                  }}
                >
                  {!!valueSchema && (
                    <LookupAvatar
                      schema={valueSchema}
                      logicalName={valueSchema.logicalName}
                      value={value}
                    />
                  )}
                  <Body1
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {value?.name}
                  </Body1>
                </Link>
              ) : (
                <Body1 style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {value?.name}
                </Body1>
              )}
            </Tag>
          </TagGroup>
        </div>
      )}
    </div>
  );
};

interface LookupAvatarProps {
  logicalName: string;
  value?: DataLookup;
  schema: Schema;
}

const LookupAvatar: FC<LookupAvatarProps> = ({
  logicalName,
  schema,
  value,
}) => {
  const { schemaMetadataDic } = useAppContext();

  if (!schema.avatarAttribute) {
    const experienceSchema = schemaMetadataDic[logicalName];
    const Icon = experienceSchema.Icon ?? Icons.Entity ?? IconPlaceholder;

    return (
      <Avatar
        style={{
          width: 20,
          height: 20,
        }}
        icon={{
          style: {
            background: 'transparent',
            color: 'inherit',
          },
          children: <Icon size={20} />,
        }}
      />
    );
  }

  return (
    <Avatar
      style={{
        width: 20,
        height: 20,
        fontSize: tokens.fontSizeBase100,
        backgroundColor: 'transparent',
      }}
      name={value?.name}
      color={getAvatarColor(value?.name)}
      image={{
        src: value?.avatar,
      }}
    />
  );
};

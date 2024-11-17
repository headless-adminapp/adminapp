import {
  Body1,
  Combobox,
  Divider,
  Link,
  makeStyles,
  mergeClasses,
  Option,
  Spinner,
  Tag,
  TagGroup,
  tokens,
  ToolbarButton,
} from '@fluentui/react-components';
import { useDebouncedValue } from '@headless-adminapp/app/hooks';
import {
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import { PageType } from '@headless-adminapp/core/experience/app';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { ISchemaExperienceStore } from '@headless-adminapp/core/store';
import { Data, IDataService } from '@headless-adminapp/core/transport';
import { Icons } from '@headless-adminapp/icons';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import { RecordCard } from '../../PageEntityForm/RecordCard';
import { ControlProps } from './types';
import { useGetLookupView, useLookupData } from './useLookupData';

export interface LookupOption {
  limit: number;
  search: string;
  enabled?: boolean;
}

export type DataLookup = {
  id: string;
  name: string;
  logicalName: string;
};

export type LookupControlProps = ControlProps<DataLookup> & {
  async?: boolean;
  lookupKey?: string;
  openRecord?: (id: string) => void;
  dataService: IDataService;
  schema: Schema;
  experienceStore: ISchemaExperienceStore;
  viewId?: string;
  allowNavigation?: boolean;
  allowNewRecord?: boolean;
};

export function LookupControl(props: LookupControlProps) {
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

const LookupControlMd: FC<LookupControlProps> = ({
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
  schema,
  viewId,
  allowNavigation,
  allowNewRecord,
}) => {
  const [lookupEnabled, setLookupEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { loockupStrings } = useAppStrings();
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
      logicalName: schema.logicalName,
      type: PageType.EntityForm,
      id: value.id,
    });
  }, [allowNavigation, routeResolver, schema.logicalName, value]);

  const handleOpenRecord = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!path) {
        return;
      }

      router.push(path);
    },
    [path, router]
  );

  useEffect(() => {
    if (open) setLookupEnabled(true);
  }, [open]);

  const [debouncedSearchText] = useDebouncedValue(searchText, 500);

  const styles = useStyles();

  // const useLookupData = useMemo(
  //   () =>
  //     createUseLookupDataHook({
  //       dataResolver: dataResolverRef.current,
  //       useLookupQuery: undefined,
  //       lookupKey,
  //     }),
  //   [lookupKey]
  // );

  // const {
  //   data,
  //   isLoading: loading,
  //   isFetching,
  // } = useLookupData({
  //   limit: 10,
  //   search: async ? debouncedSearchText : '',
  //   enabled: lookupEnabled,
  // });

  const { isLoading: isViewLoading, view } = useGetLookupView(
    schema.logicalName,
    viewId
  );

  const { data, isLoading } = useLookupData({
    schema,
    view: view?.experience,
    searchText: debouncedSearchText,
    dataService,
    enabled:
      lookupEnabled && !isViewLoading && !value && !readOnly && !disabled,
  });

  useEffect(() => {
    if (value) {
      setSearchText(value.name);
    } else {
      setSearchText('');
    }
  }, [value]);

  const handleChange = (
    value: Data<InferredSchemaType<SchemaAttributes>> | null
  ) => {
    setSearchText('');
    if (!value) {
      return onChange?.(null);
    } else {
      return onChange?.({
        id: value[schema.idAttribute] as string,
        name: value[schema.primaryAttribute] as string,
        logicalName: schema.logicalName,
      });
    }
  };

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
        style={{ width: '100%' }}
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
          const _item = data?.records.find(
            (x) => String(x[schema.idAttribute]) === String(item.optionValue)
          );

          handleChange(_item ?? null);
        }}
        disableAutoFocus
        onBlur={onBlur}
        onFocus={onFocus}
        id={id}
        autoFocus={autoFocus}
      >
        {data?.records.map((item) => (
          <Option
            key={item[schema.idAttribute] as string}
            value={item[schema.idAttribute] as string}
            className={mergeClasses(styles.option)}
            text={item[schema.primaryAttribute] as string}
          >
            <RecordCard
              cardView={view?.experience.card!}
              record={item}
              schema={schema}
            />
          </Option>
        ))}
        {!isLoading && !data?.records.length && (
          <div
            style={{
              paddingInline: tokens.spacingHorizontalL,
              paddingBlock: tokens.spacingVerticalS,
            }}
          >
            <Body1>{loockupStrings.noRecordsFound}</Body1>
          </div>
        )}
        {allowNewRecord && (
          <>
            <Divider />
            <div style={{ marginTop: tokens.spacingVerticalXXS }}>
              <ToolbarButton
                style={{ fontWeight: 'normal' }}
                icon={<Icons.Add />}
              >
                {loockupStrings.newRecord}
              </ToolbarButton>
            </div>
          </>
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
              style={{ paddingRight: !disabled && !readOnly ? 0 : 5 }}
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
            >
              {allowNavigation && path ? (
                <Link href={path} onClick={handleOpenRecord}>
                  <Body1
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
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

import {
  Body1,
  Divider,
  Link,
  makeStyles,
  mergeClasses,
  Spinner,
  TagPicker,
  TagPickerControl,
  TagPickerGroup,
  TagPickerInput,
  TagPickerList,
  TagPickerOption,
  tokens,
} from '@fluentui/react-components';
import { useDebouncedValue } from '@headless-adminapp/app/hooks';
import { useRecentItemStore } from '@headless-adminapp/app/metadata/hooks/useRecentItemStore';
import {
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import type { Id } from '@headless-adminapp/core';
import { PageType } from '@headless-adminapp/core/experience/app';
import type {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import type { Data, IDataService } from '@headless-adminapp/core/transport';
import { Icons } from '@headless-adminapp/icons';
import { type FC, useCallback, useEffect, useMemo, useState } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import { Tag, ToolbarButton } from '../../components/fluent';
import { RecordCard } from '../../PageEntityForm/RecordCard';
import { SkeletonControl } from './SkeletonControl';
import type { ControlProps } from './types';
import {
  createLookupRecentKey,
  useGetLookupView,
  useLookupData,
} from './useLookupData';

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

export type MultiSelectLookupControlProps = ControlProps<DataLookup[]> & {
  dataService: IDataService;
  schema: Schema;
  viewId?: string;
  allowNavigation?: boolean;
  allowNewRecord?: boolean;
};

export function MultiSelectLookupControl(props: MultiSelectLookupControlProps) {
  const Control = LookupControlMd;

  return <Control {...props} />;
}

const useStyles = makeStyles({
  option: {
    padding: 0,
  },
});

const LookupControlMd: FC<MultiSelectLookupControlProps> = ({
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
  skeleton,
}) => {
  const [lookupEnabled, setLookupEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { lookupStrings } = useAppStrings();
  const recentItemStore = useRecentItemStore();

  useEffect(() => {
    if (open) setLookupEnabled(true);
  }, [open]);

  const [debouncedSearchText] = useDebouncedValue(searchText, 500);

  const styles = useStyles();

  const { isLoading: isViewLoading, view } = useGetLookupView(
    schema.logicalName,
    viewId,
  );

  const { data, isLoading } = useLookupData({
    schema,
    view: view?.experience,
    searchText: debouncedSearchText,
    dataService,
    enabled: lookupEnabled && !isViewLoading && !readOnly && !disabled,
  });

  const handleAdd = (
    selectedValue: Data<InferredSchemaType<SchemaAttributes>>,
  ) => {
    setSearchText('');
    if (!value) {
      return onChange?.([
        {
          id: selectedValue[schema.idAttribute] as string,
          name: selectedValue[schema.primaryAttribute] as string,
          logicalName: schema.logicalName,
        },
      ]);
    } else {
      if (value.find((x) => x.id === selectedValue[schema.idAttribute])) {
        return;
      }

      return onChange?.([
        ...value,
        {
          id: selectedValue[schema.idAttribute] as string,
          name: selectedValue[schema.primaryAttribute] as string,
          logicalName: schema.logicalName,
        },
      ]);
    }
  };

  const handleRemove = (id: string) => {
    const newValue = value?.filter((x) => x.id !== id);
    if (!newValue?.length) {
      onChange?.(null);
    } else {
      onChange?.(newValue);
    }
  };

  if (skeleton) {
    return <SkeletonControl />;
  }

  return (
    <TagPicker
      appearance="filled-darker"
      selectedOptions={value?.map((item) => item.id) ?? []}
      onOptionSelect={(e, item) => {
        const _item = data?.records.find(
          (x) => String(x[schema.idAttribute]) === String(item.value),
        );

        if (!_item) return;

        recentItemStore.addItem(
          createLookupRecentKey(schema.logicalName),
          _item[schema.idAttribute] as Id,
          _item[schema.idAttribute] as string,
        );

        handleAdd(_item);
      }}
      open={open && !readOnly && !disabled}
      onOpenChange={(e, data) => {
        setOpen(data.open);
      }}
      disabled={readOnly || disabled}
    >
      <TagPickerControl
        expandIcon={
          <div style={{ marginRight: -4 }}>
            {readOnly || disabled ? null : isLoading ? (
              <Spinner size="extra-tiny" />
            ) : (
              <Icons.Search size={18} />
            )}
          </div>
        }
      >
        <TagPickerGroup>
          {value?.map((item, index) => (
            <TagItem
              key={`${item.id}-${index}`}
              disabled={disabled}
              readOnly={readOnly}
              value={item}
              onRemove={handleRemove}
              allowNavigation={allowNavigation}
            />
          ))}
        </TagPickerGroup>
        <TagPickerInput
          name={name}
          placeholder={placeholder}
          onBlur={onBlur}
          onFocus={onFocus}
          id={id}
          autoFocus={autoFocus}
        />
      </TagPickerControl>
      <TagPickerList>
        {data?.records.map((item) => (
          <TagPickerOption
            key={item[schema.idAttribute] as string}
            value={item[schema.idAttribute] as string}
            className={mergeClasses(styles.option)}
            text={item[schema.primaryAttribute] as string}
          >
            {view?.experience.card.Renderer ? (
              <view.experience.card.Renderer record={item} schema={schema} />
            ) : (
              <RecordCard
                cardView={view?.experience.card!}
                record={item}
                schema={schema}
              />
            )}
          </TagPickerOption>
        ))}
        {!isLoading && !data?.records.length && (
          <div
            style={{
              paddingInline: tokens.spacingHorizontalL,
              paddingBlock: tokens.spacingVerticalS,
            }}
          >
            <Body1>{lookupStrings.noRecordsFound}</Body1>
          </div>
        )}
        {allowNewRecord && (
          <>
            <Divider />
            <div style={{ marginTop: tokens.spacingVerticalXXS }}>
              <ToolbarButton icon={<Icons.Add />}>
                {lookupStrings.newRecord}
              </ToolbarButton>
            </div>
          </>
        )}
      </TagPickerList>
    </TagPicker>
  );
};

function TagItem({
  disabled,
  readOnly,
  value,
  onRemove,
  allowNavigation,
}: Readonly<{
  disabled?: boolean;
  readOnly?: boolean;
  value: DataLookup;
  onRemove?: (id: string) => void;
  allowNavigation?: boolean;
}>) {
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
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      if (!path) {
        return;
      }

      void router.push(path);
    },
    [path, router],
  );
  return (
    <Tag
      as="span"
      appearance="brand"
      size="small"
      dismissible={!disabled && !readOnly}
      value={value.id}
      style={{
        paddingRight: !disabled && !readOnly ? 0 : 5,
        pointerEvents: 'auto',
      }}
      dismissIcon={
        <div
          style={{ display: 'flex', cursor: 'pointer' }}
          onClick={() => {
            onRemove?.(value.id);
          }}
        >
          <Icons.Close size={16} />
        </div>
      }
    >
      {allowNavigation && !!path ? (
        <Link onClick={handleOpenRecord}>
          <Body1 style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {value?.name}
          </Body1>
        </Link>
      ) : (
        <Body1 style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {value?.name}
        </Body1>
      )}
    </Tag>
  );
}

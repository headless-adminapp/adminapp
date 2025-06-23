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
import { useRecentItemStore } from '@headless-adminapp/app/metadata/hooks/useRecentItemStore';
import {
  useRouter,
  useRouteResolver,
} from '@headless-adminapp/app/route/hooks';
import { Id } from '@headless-adminapp/core';
import { PageType } from '@headless-adminapp/core/experience/app';
import {
  InferredSchemaType,
  Schema,
  SchemaAttributes,
} from '@headless-adminapp/core/schema';
import { Data, IDataService } from '@headless-adminapp/core/transport';
import { Icons } from '@headless-adminapp/icons';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useAppStrings } from '../../App/AppStringContext';
import { RecordCard } from '../../PageEntityForm/RecordCard';
import { SkeletonControl } from './SkeletonControl';
import { ControlProps } from './types';
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
    viewId
  );

  const { data, isLoading } = useLookupData({
    schema,
    view: view?.experience,
    searchText: debouncedSearchText,
    dataService,
    enabled: lookupEnabled && !isViewLoading && !readOnly && !disabled,
  });

  const tagGroupContainerRef = useRef<HTMLDivElement>(null);

  const [inputLeft, setInputLeft] = useState(0);
  const [containerHeight, setContainerHeight] = useState(32);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!tagGroupContainerRef.current) {
        return;
      }

      const lastElementChild =
        tagGroupContainerRef.current?.lastElementChild?.querySelector(
          '.fui-Tag:last-of-type'
        );

      if (!lastElementChild) {
        setContainerHeight(32);
        setInputLeft(0);
        return;
      }

      const containerBoundingRect =
        tagGroupContainerRef.current.getBoundingClientRect();
      const lastElementBoundingRect = lastElementChild?.getBoundingClientRect();

      const remainingWidth =
        containerBoundingRect.right - (lastElementBoundingRect?.right ?? 0);

      let newHeight = containerBoundingRect.height + 8;

      if (remainingWidth > 100) {
        setInputLeft(containerBoundingRect.width - remainingWidth);
      } else {
        setInputLeft(0);
        newHeight = containerBoundingRect.height + 32 + 4;
      }

      setContainerHeight(newHeight);
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleAdd = (
    selectedValue: Data<InferredSchemaType<SchemaAttributes>>
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
    <div
      style={{ position: 'relative', width: '100%', height: containerHeight }}
    >
      <Combobox
        name={name}
        appearance="filled-darker"
        expandIcon={
          <div style={{ position: 'absolute', right: 4, bottom: 8 }}>
            {readOnly || disabled ? null : isLoading ? (
              <Spinner size="extra-tiny" />
            ) : (
              <Icons.Search size={18} />
            )}
          </div>
        }
        input={{
          style: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: inputLeft,
            height: 30,
          },
        }}
        placeholder={placeholder}
        inputMode="search"
        style={{ width: '100%', height: '100%', minWidth: 'unset' }}
        autoComplete="off"
        readOnly={readOnly || disabled}
        open={open && !readOnly && !disabled}
        value={searchText}
        onOpenChange={(e, data) => {
          setOpen(data.open);
        }}
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        onOptionSelect={(e, item) => {
          const _item = data?.records.find(
            (x) => String(x[schema.idAttribute]) === String(item.optionValue)
          );

          if (!_item) return;

          recentItemStore.addItem(
            createLookupRecentKey(schema.logicalName),
            _item[schema.idAttribute] as Id,
            _item[schema.idAttribute] as string
          );

          handleAdd(_item);
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
            <Body1>{lookupStrings.noRecordsFound}</Body1>
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
                {lookupStrings.newRecord}
              </ToolbarButton>
            </div>
          </>
        )}
      </Combobox>
      <div
        ref={tagGroupContainerRef}
        style={{
          position: 'absolute',
          top: 4,
          left: 0,
          right: 0,
          alignItems: 'center',
          paddingInline: 4,
          display: 'flex',
          pointerEvents: 'none',
        }}
      >
        <TagGroup as="div" style={{ flexWrap: 'wrap', rowGap: 8 }}>
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
        </TagGroup>
      </div>
    </div>
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

      router.push(path);
    },
    [path, router]
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

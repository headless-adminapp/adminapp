import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import { useDataService } from '@headless-adminapp/app/transport';
import type { Attribute } from '@headless-adminapp/core/attributes';
import { FC, Fragment } from 'react';

import { CurrencyControl } from '../form/controls/CurrencyControl';
import { DateControl } from '../form/controls/DateControl';
import { DateRangeControl } from '../form/controls/DateRangeControl';
import { DateTimeControl } from '../form/controls/DateTimeControl';
import { EmailControl } from '../form/controls/EmailControl';
import { LookupControl } from '../form/controls/LookupControl';
import MultiSelectControl from '../form/controls/MultiSelectControl';
import { MultiSelectLookupControl } from '../form/controls/MultiSelectLookupControl';
import { NumberControl } from '../form/controls/NumberControl';
import SelectControl from '../form/controls/SelectControl';
import { SwitchControl } from '../form/controls/SwitchControl';
import { TelephoneControl } from '../form/controls/TelephoneControl';
import { TextAreaControl } from '../form/controls/TextAreaControl';
import { TextControl } from '../form/controls/TextControl';

// Standard Control (Base control)

// TextControl
// TextInput

interface StandardControlProps {
  attribute: Attribute;
  label?: string;
  isError: boolean;
  errorMessage: string | undefined;
  name: string;
  value: any;
  placeholder?: string;
  onChange: (value: any) => void;
  onBlur: () => void;
  // dataService: IDataService;
  // fileService: FileServiceFactory;
  disabled?: boolean;
  borderOnFocusOnly?: boolean;
  hideLabel?: boolean;
  hidePlaceholder?: boolean;
  allowQuickCreate?: boolean;
  readOnly?: boolean;
  quickViewControl?: boolean;
  allowNavigation?: boolean;
  allowNewRecord?: boolean;
}

export const StandardControl: FC<StandardControlProps> = ({
  attribute,
  label: _label,
  isError,
  // errorMessage,
  name,
  value,
  onBlur,
  onChange,
  // dataService,
  // fileService,
  disabled,
  borderOnFocusOnly,
  placeholder: _placeholder,
  // hideLabel,
  hidePlaceholder,
  readOnly,
  // quickViewControl,
  allowNavigation,
  allowNewRecord,
}) => {
  const isDisabled = attribute.readonly || disabled;
  // const label = hideLabel ? undefined : _label ?? attribute.label;
  const placeholder = hidePlaceholder
    ? undefined
    : _placeholder ?? _label ?? attribute.label;
  // const required = quickViewControl ? false : attribute.required;

  const dataService = useDataService();
  const { schemaStore, experienceStore } = useMetadata();

  // const { openQuickCreate } = useQuickCreateForm();

  switch (attribute.type) {
    case 'string':
      const controlProps = {
        name,
        placeholder,
        value,
        onChange,
        onBlur,
        error: isError,
        disabled: isDisabled,
        readOnly,
      };

      switch (attribute.format) {
        case 'text':
          return (
            <TextControl
              {...controlProps}
              textTransform={attribute.textTransform}
            />
          );
        case 'email':
          return <EmailControl {...controlProps} />;
        case 'phone':
          return <TelephoneControl {...controlProps} />;
        case 'url':
          return <TextControl {...controlProps} />;
        case 'textarea':
          return <TextAreaControl {...controlProps} />;
        default:
          return <Fragment />;
      }
    case 'number':
      return (
        <NumberControl
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={isError}
          disabled={isDisabled}
          readOnly={readOnly}
        />
      );

    case 'date': {
      const controlProps = {
        name,
        placeholder,
        value,
        onChange,
        onBlur,
        error: isError,
        disabled: isDisabled,
        readOnly,
      };

      if (attribute.format === 'datetime') {
        return <DateTimeControl {...controlProps} />;
      } else {
        return <DateControl {...controlProps} />;
      }
    }
    case 'daterange': {
      const controlProps = {
        name,
        placeholder,
        value,
        onChange,
        onBlur,
        error: isError,
        disabled: isDisabled,
        readOnly,
      };

      return <DateRangeControl {...controlProps} />;
    }
    case 'money': {
      return (
        <CurrencyControl
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={isError}
          disabled={isDisabled}
          borderOnFocusOnly={borderOnFocusOnly}
          readOnly={readOnly}
        />
      );
    }
    case 'lookup': {
      //   const experienceSchema = getExperienceSchema(attribute.entity);
      //   const routes = getExperienceRoutes(attribute.entity);
      //   const path = routes?.create?.();

      //   let createButtonProps:
      //     | {
      //         label: string;
      //         onClick: () => void;
      //       }
      //     | undefined;

      //   if (allowQuickCreate && experienceSchema.defaultQuickCreateForm) {
      //     createButtonProps = {
      //       label: 'New record',
      //       onClick: async () => {
      //         try {
      //           const result = await openQuickCreate({
      //             logicalName: attribute.entity,
      //           });

      //           if (result) {
      //             onChange(result);
      //           }
      //         } catch (error) {
      //           console.error(error);
      //         }
      //       },
      //     };
      //   } else if (path) {
      //     createButtonProps = {
      //       label: 'New record',
      //       onClick: () => {
      //         router.push(path);
      //       },
      //     };
      //   }

      //   return (
      //     <FormControl
      //       type="lookup"
      //       name={name}
      //       label={label}
      //       placeholder={placeholder}
      //       required={required}
      //       value={value}
      //       onChange={onChange}
      //       onBlur={onBlur}
      //       error={isError}
      //       helperText={errorMessage}
      //       disabled={isDisabled}
      //       borderOnFocusOnly={borderOnFocusOnly}
      //       readOnly={readOnly}
      //       createButton={createButtonProps}
      //       openRecord={
      //         routes?.edit
      //           ? (id) => {
      //               router.push(routes.edit!(id));
      //             }
      //           : undefined
      //       }
      //       async
      //       dataResolver={async (options) => {
      //         const lookupSchema = getSchema(attribute.entity);

      //         const data = await dataService.retriveRecords({
      //           logicalName: attribute.entity,
      //           search: options?.search ?? '',
      //           columnFilters: {},
      //           pagination: {
      //             pageIndex: 0,
      //             rowsPerPage: 10,
      //             sortBy: 'createdAt',
      //             sortOrder: 'desc',
      //           },
      //           viewFilter: null,
      //           columns: ['_id', lookupSchema.primaryAttribute ?? 'name'],
      //           limit: options?.limit ?? 10,
      //         });

      //         return data.records.map((x: any) => ({
      //           _id: x._id,
      //           name: x[lookupSchema.primaryAttribute ?? 'name'],
      //         }));
      //       }}
      //     />
      //   );

      return (
        <LookupControl
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={isDisabled}
          dataService={dataService}
          schema={schemaStore.getSchema(attribute.entity)}
          experienceStore={experienceStore}
          allowNavigation={allowNavigation}
          allowNewRecord={allowNewRecord}
        />
      );
    }
    case 'lookups': {
      return (
        <MultiSelectLookupControl
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={isDisabled}
          dataService={dataService}
          schema={schemaStore.getSchema(attribute.entity)}
          experienceStore={experienceStore}
          allowNavigation={allowNavigation}
          allowNewRecord={allowNewRecord}
        />
      );
    }

    case 'boolean': {
      return (
        <SwitchControl
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={isError}
          disabled={isDisabled}
          readOnly={readOnly}
        />
      );
    }

    case 'choice': {
      return (
        <SelectControl
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={isError}
          disabled={isDisabled}
          options={attribute.options}
          placeholder={placeholder}
          borderOnFocusOnly={borderOnFocusOnly}
          readOnly={readOnly}
        />
      );
    }

    case 'choices': {
      return (
        <MultiSelectControl
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={isError}
          disabled={isDisabled}
          options={attribute.options}
          placeholder={placeholder}
          borderOnFocusOnly={borderOnFocusOnly}
          readOnly={readOnly}
        />
      );
    }

    // case 'attachment': {
    //   return (
    //     <FormControl
    //       type="attachment"
    //       name={name}
    //       label={label}
    //       required={required}
    //       value={value}
    //       onChange={onChange}
    //       onBlur={onBlur}
    //       error={isError}
    //       helperText={errorMessage}
    //       disabled={isDisabled}
    //       placeholder={placeholder}
    //       borderOnFocusOnly={borderOnFocusOnly}
    //       readOnly={readOnly}
    //       format={attribute.format}
    //       maxSize={attribute.maxSize}
    //       fileService={fileService}
    //     />
    //   );
    // }
  }

  return <Fragment />;
};

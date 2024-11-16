import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import { useDataService } from '@headless-adminapp/app/transport';
import type { Attribute } from '@headless-adminapp/core/attributes';
import { FC, Fragment } from 'react';

import { componentStore } from '../componentStore';
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

export interface StandardControlProps {
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

export const StandardControl: FC<StandardControlProps> = (props) => {
  const {
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
  } = props;
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
        case 'text': {
          const Control =
            componentStore.getComponent<typeof TextControl>(
              'Form.TextControl'
            ) ?? TextControl;
          return (
            <Control
              {...controlProps}
              textTransform={attribute.textTransform}
            />
          );
        }
        case 'email': {
          const Control =
            componentStore.getComponent<typeof EmailControl>(
              'Form.EmailControl'
            ) ?? EmailControl;
          return <Control {...controlProps} />;
        }
        case 'phone': {
          const Control =
            componentStore.getComponent<typeof TelephoneControl>(
              'Form.TelephoneControl'
            ) ?? TelephoneControl;
          return <Control {...controlProps} />;
        }
        case 'url': {
          const Control =
            componentStore.getComponent<typeof TextControl>(
              'Form.UrlControl'
            ) ?? TextControl;
          return <Control {...controlProps} />;
        }
        case 'textarea': {
          const Control =
            componentStore.getComponent<typeof TextAreaControl>(
              'Form.TextAreaControl'
            ) ?? TextAreaControl;
          return <Control {...controlProps} />;
        }
        default:
          return <Fragment />;
      }
    case 'number': {
      const Control =
        componentStore.getComponent<typeof NumberControl>(
          'Form.NumberControl'
        ) ?? NumberControl;

      return (
        <Control
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
    }

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
        const Control =
          componentStore.getComponent<typeof DateTimeControl>(
            'Form.DateTimeControl'
          ) ?? DateTimeControl;
        return <Control {...controlProps} />;
      } else {
        const Control =
          componentStore.getComponent<typeof DateControl>('Form.DateControl') ??
          DateControl;
        return <Control {...controlProps} />;
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

      const Control =
        componentStore.getComponent<typeof DateRangeControl>(
          'Form.DateRangeControl'
        ) ?? DateRangeControl;

      return <Control {...controlProps} />;
    }
    case 'money': {
      const Control =
        componentStore.getComponent<typeof CurrencyControl>(
          'Form.CurrencyControl'
        ) ?? CurrencyControl;
      return (
        <Control
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
      const Control =
        componentStore.getComponent<typeof LookupControl>(
          'Form.LookupControl'
        ) ?? LookupControl;
      return (
        <Control
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
      const Control =
        componentStore.getComponent<typeof MultiSelectLookupControl>(
          'Form.MultiSelectLookupControl'
        ) ?? MultiSelectLookupControl;

      return (
        <Control
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
      const Control =
        componentStore.getComponent<typeof SwitchControl>(
          'Form.SwitchControl'
        ) ?? SwitchControl;

      return (
        <Control
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
      const Control =
        componentStore.getComponent<typeof SelectControl>(
          'Form.SelectControl'
        ) ?? SelectControl;

      return (
        <Control
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
      const Control =
        componentStore.getComponent<typeof MultiSelectControl>(
          'Form.MultiSelectControl'
        ) ?? MultiSelectControl;

      return (
        <Control
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

  const FallBackControl = componentStore.getComponent<FC<StandardControlProps>>(
    'StandardControl.FallBack'
  );

  if (FallBackControl) {
    return <FallBackControl {...props} />;
  }

  return <Fragment />;
};

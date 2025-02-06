import { useMetadata } from '@headless-adminapp/app/metadata/hooks';
import {
  useDataService,
  useFileService,
} from '@headless-adminapp/app/transport';
import type { Attribute } from '@headless-adminapp/core/attributes';
import { FC, Fragment } from 'react';

import { componentStore } from '../componentStore';
import { AttachmentControl } from '../form/controls/AttachmentControl';
import { AttachmentsControl } from '../form/controls/AttachmentsControl';
import { CurrencyControl } from '../form/controls/CurrencyControl';
import { DateControl } from '../form/controls/DateControl';
import { DateRangeControl } from '../form/controls/DateRangeControl';
import { DateTimeControl } from '../form/controls/DateTimeControl';
import { DecimalControl } from '../form/controls/DecimalControl';
import { DurationControl } from '../form/controls/DurationControl';
import { EmailControl } from '../form/controls/EmailControl';
import { IntegerControl } from '../form/controls/IntegerControl';
import { LookupControl } from '../form/controls/LookupControl';
import MultiSelectControl from '../form/controls/MultiSelectControl';
import { MultiSelectLookupControl } from '../form/controls/MultiSelectLookupControl';
import { RichTextControl } from '../form/controls/RichTextControl';
import SelectControl from '../form/controls/SelectControl';
import { SwitchControl } from '../form/controls/SwitchControl';
import { TelephoneControl } from '../form/controls/TelephoneControl';
import { TextAreaControl } from '../form/controls/TextAreaControl';
import { TextControl } from '../form/controls/TextControl';
import { UrlControl } from '../form/controls/UrlControl';

// Standard Control (Base control)

// TextControl
// TextInput

export interface StandardControlProps {
  attribute: Attribute;
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  name: string;
  value: any;
  placeholder?: string;
  onChange: (value: any) => void;
  onBlur?: () => void;
  fileServiceContext?: Record<string, unknown>;
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
  const fileService = useFileService();
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
            componentStore.getComponent<typeof UrlControl>('Form.UrlControl') ??
            UrlControl;
          return <Control {...controlProps} />;
        }
        case 'textarea': {
          const Control =
            componentStore.getComponent<typeof TextAreaControl>(
              'Form.TextAreaControl'
            ) ?? TextAreaControl;
          return <Control {...controlProps} />;
        }
        case 'richtext': {
          const Control =
            componentStore.getComponent<typeof TextAreaControl>(
              'Form.RichTextControl'
            ) ?? RichTextControl;
          return <Control {...controlProps} />;
        }
        default:
          return <Fragment />;
      }
    case 'number': {
      switch (attribute.format) {
        case 'decimal': {
          const Control =
            componentStore.getComponent<typeof DecimalControl>(
              'Form.DecimalControl'
            ) ?? DecimalControl;

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
              decimalPlaces={attribute.decimalPlaces}
            />
          );
        }
        case 'integer': {
          const Control =
            componentStore.getComponent<typeof IntegerControl>(
              'Form.IntegerControl'
            ) ?? IntegerControl;

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
        case 'duration': {
          const Control =
            componentStore.getComponent<typeof DurationControl>(
              'Form.DurationControl'
            ) ?? DurationControl;

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
        default: {
          return <Fragment />;
        }
      }
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

    case 'attachment': {
      const Control =
        componentStore.getComponent<typeof AttachmentControl>(
          'Form.AttachmentControl'
        ) ?? AttachmentControl;

      return (
        <Control
          fileService={fileService}
          format={attribute.format}
          location={attribute.location}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={isError}
          disabled={isDisabled}
          placeholder={placeholder}
          borderOnFocusOnly={borderOnFocusOnly}
          readOnly={readOnly}
          fileServiceContext={props.fileServiceContext}
        />
      );
    }

    case 'attachments': {
      const Control =
        componentStore.getComponent<typeof AttachmentsControl>(
          'Form.AttachmentsControl'
        ) ?? AttachmentsControl;

      return (
        <Control
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          error={isError}
          disabled={isDisabled}
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

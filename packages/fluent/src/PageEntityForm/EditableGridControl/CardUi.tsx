import { Button, Divider, tokens } from '@fluentui/react-components';
import { useEventManager } from '@headless-adminapp/app/dataform';
import { EVENT_KEY_ON_FIELD_CHANGE } from '@headless-adminapp/app/dataform/constants';
import { useIsMobile, useIsTablet } from '@headless-adminapp/app/hooks';
import { useCalculatedAttributeStore } from '@headless-adminapp/app/metadata/hooks/useCalculatedAttributeStore';
import { SectionEditableGridControl } from '@headless-adminapp/core/experience/form';
import { Schema } from '@headless-adminapp/core/schema';
import { Icons } from '@headless-adminapp/icons';
import { FC } from 'react';
import { Control, Controller } from 'react-hook-form';

import { SectionControlWrapper } from '../../DataForm/SectionControl';
import { StandardControl } from '../StandardControl';

interface CardUiProps {
  schema: Schema;
  control: SectionEditableGridControl;
  formControl: Control;
  onAddRow?: () => void;
  onRemoveRow?: (index: number) => void;
  rows: Record<'__key', string>[];
  alias: string;
  readOnly?: boolean;
}

export const CardUi: FC<CardUiProps> = ({
  schema,
  control,
  formControl,
  onAddRow,
  onRemoveRow,
  rows,
  alias,
  readOnly,
}) => {
  const eventManager = useEventManager();
  const calculatedAttributeStore = useCalculatedAttributeStore();

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  let controlsPerRow: number;
  if (isMobile) {
    controlsPerRow = 1;
  } else if (isTablet) {
    controlsPerRow = 3;
  } else {
    controlsPerRow = 6;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
      }}
    >
      {rows.map((item, index) => (
        <div
          key={item.__key}
          style={{
            boxShadow: tokens.shadow4,
            borderRadius: tokens.borderRadiusMedium,
            padding: tokens.spacingVerticalM,
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacingVerticalM,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              margin: -8,
            }}
          >
            {control.controls.map((control) => {
              const attributeName =
                typeof control === 'string' ? control : control.attributeName;

              const attribute = schema.attributes[attributeName];

              if (!attribute) {
                return null;
              }

              const calculatedAttribute =
                calculatedAttributeStore?.getCalculatedAttributeInfo(
                  schema.logicalName,
                  attributeName
                );

              const isControlReadonly =
                readOnly ||
                (calculatedAttribute && !calculatedAttribute.allowUserToEdit);

              return (
                <div
                  key={attributeName}
                  style={{
                    flexShrink: 0,
                    flex: `0 0 ${100 / controlsPerRow}%`,
                    maxWidth: `${100 / controlsPerRow}%`,
                    padding: 8,
                  }}
                >
                  <Controller
                    name={`${alias}.${index}.${attributeName}`}
                    control={formControl}
                    render={({ field, fieldState, formState }) => {
                      const isError =
                        (fieldState.isTouched || formState.isSubmitted) &&
                        !!fieldState.error?.message;

                      return (
                        <SectionControlWrapper
                          label={attribute.label}
                          labelPosition="top"
                          isError={isError}
                        >
                          <StandardControl
                            attribute={attribute}
                            name={attributeName}
                            value={field.value ?? null}
                            readOnly={isControlReadonly}
                            onChange={(value) => {
                              const previousValue = field.value;
                              field.onChange(value);
                              eventManager.emit(
                                EVENT_KEY_ON_FIELD_CHANGE,
                                field.name,
                                value,
                                previousValue
                              );
                            }}
                            onBlur={field.onBlur}
                            placeholder=""
                          />
                        </SectionControlWrapper>
                      );
                    }}
                  />
                </div>
              );
            })}
          </div>
          <Divider style={{ opacity: 0.2 }} />
          {!readOnly && (
            <Button
              icon={<Icons.Delete size={16} />}
              appearance="primary"
              onClick={() => onRemoveRow?.(index)}
              style={{
                fontWeight: tokens.fontWeightRegular,
                alignSelf: 'flex-start',
                color: tokens.colorStatusDangerForeground1,
                backgroundColor: tokens.colorStatusDangerBackground1,
                minWidth: 0,
              }}
              size="small"
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      {!readOnly && (
        <Button
          icon={<Icons.Add size={16} />}
          appearance="primary"
          onClick={onAddRow}
          style={{ alignSelf: 'flex-start', minWidth: 0 }}
          size="small"
        >
          Add
        </Button>
      )}
    </div>
  );
};

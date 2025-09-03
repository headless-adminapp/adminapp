import { DataFormContext } from '@headless-adminapp/app/dataform';
import { EVENT_KEY_ON_FIELD_CHANGE } from '@headless-adminapp/app/dataform/constants';
import {
  getIsControlHidden,
  getIsFieldDisabled,
  getIsFieldRequired,
} from '@headless-adminapp/app/dataform/DataFormProvider/utils';
import {
  useDataFormSchema,
  useFormInstance,
  useFormIsReadonly,
  useRecordId,
} from '@headless-adminapp/app/dataform/hooks';
import { useEventManager } from '@headless-adminapp/app/dataform/hooks/useEventManager';
import { HistoryStateKeyProvider } from '@headless-adminapp/app/historystate';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { localizedLabel } from '@headless-adminapp/app/locale/utils';
import { useCalculatedAttributeStore } from '@headless-adminapp/app/metadata/hooks/useCalculatedAttributeStore';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { Section } from '@headless-adminapp/core/experience/form';
import type { StandardControlProps } from '@headless-adminapp/core/experience/form/SectionControl';
import type { SchemaAttributes } from '@headless-adminapp/core/schema';
import { type FC, useMemo } from 'react';
import { Controller } from 'react-hook-form';

import { componentStore } from '../componentStore';
import { SectionControlWrapper } from '../DataForm/SectionControl';
import { FormSection } from '../form/layout';
import { EditableGridControl } from './EditableGridControl/EditableGridControl';
import { QuickViewControl } from './QuickViewControl';
import { StandardControl } from './StandardControl';
import { SubgridControl } from './SubgridControl';

export function SectionContainer<
  S extends SchemaAttributes = SchemaAttributes
>({
  section,
  skeleton,
}: Readonly<{ section: Section<S>; readOnly: boolean; skeleton?: boolean }>) {
  const schema = useDataFormSchema<S>();

  const formInstance = useFormInstance();
  const recordId = useRecordId();
  const isFormReadonly = useFormIsReadonly();
  const { language } = useLocale();
  const eventManager = useEventManager();
  const isMobile = useIsMobile();

  const disabledControls = useContextSelector(
    DataFormContext,
    (state) => state.disabledControls
  );
  const hiddenControls = useContextSelector(
    DataFormContext,
    (state) => state.hiddenControls
  );
  const requiredFields = useContextSelector(
    DataFormContext,
    (state) => state.requiredFields
  );
  const hiddenSections = useContextSelector(
    DataFormContext,
    (state) => state.hiddenSections
  );

  const calculatedAttributeStore = useCalculatedAttributeStore();

  const visibleControls = useMemo(
    () =>
      section.controls.filter((control) => {
        return !getIsControlHidden({
          control,
          hiddenControls,
        });
      }),
    [section.controls, hiddenControls]
  );

  if (hiddenSections[section.name] || visibleControls.length === 0) {
    return null;
  }

  return (
    <FormSection
      title={localizedLabel(language, section)}
      columnCount={section.columnCount}
      labelPosition={section.labelPosition}
      noPadding={section.noPadding}
      hideLabel={section.hideLabel}
      fullHeight={section.fullHeight}
    >
      {visibleControls.map((control, index) => {
        switch (control.type) {
          case 'standard': {
            const attribute = schema.attributes[control.attributeName];

            if (!attribute) {
              console.warn(
                `Attribute ${control.attributeName as string} not found`
              );
              return null;
            }

            let Control: React.ComponentType<StandardControlProps> =
              StandardControl;

            if (control.component) {
              if (typeof control.component === 'function') {
                Control = control.component;
              } else if (typeof control.component === 'string') {
                const OverrideControl = componentStore.getComponent<
                  FC<StandardControlProps>
                >(control.component);

                if (OverrideControl) {
                  Control = OverrideControl;
                }
              }
            }

            const disabled = getIsFieldDisabled({
              isFormReadonly,
              disabledFields: disabledControls,
              attribute,
              control,
              calculatedAttribute:
                calculatedAttributeStore?.getCalculatedAttributeInfo(
                  schema.logicalName,
                  control.attributeName as string
                ),
            });

            const required = getIsFieldRequired({
              attribute,
              requiredFields,
              control,
            });

            return (
              <div
                key={control.attributeName as string}
                style={{
                  gridColumn: control.span
                    ? `var(--section-item-span-${control.span})`
                    : undefined,
                }}
              >
                <Controller
                  key={control.attributeName as string}
                  control={formInstance.control}
                  name={control.attributeName as string}
                  render={({ field, fieldState, formState }) => {
                    const isError =
                      (fieldState.isTouched || formState.isSubmitted) &&
                      !!fieldState.error?.message;
                    const errorMessage =
                      fieldState.isTouched || formState.isSubmitted
                        ? fieldState.error?.message
                        : '';

                    const label =
                      control.localizedLabels?.[language] ??
                      attribute.localizedLabels?.[language] ??
                      control.label ??
                      attribute.label;

                    const labelHidden = control.labelHidden;

                    return (
                      <SectionControlWrapper
                        label={label}
                        labelHidden={labelHidden}
                        labelPosition={isMobile ? 'top' : section.labelPosition}
                        required={required}
                        isError={isError}
                        errorMessage={errorMessage}
                      >
                        <Control
                          attribute={attribute}
                          name={control.attributeName as string}
                          value={field.value}
                          onChange={(value) => {
                            const previousValue = field.value;
                            field.onChange(value);
                            eventManager.emit(
                              EVENT_KEY_ON_FIELD_CHANGE,
                              control.attributeName,
                              value,
                              previousValue
                            );
                          }}
                          onBlur={field.onBlur}
                          errorMessage={errorMessage}
                          isError={isError}
                          readOnly={disabled}
                          label={label}
                          placeholder={label}
                          allowNavigation={true}
                          allowNewRecord={true}
                          fileServiceContext={{
                            type: 'entity-form',
                            recordId,
                            attributeName: control.attributeName,
                            logicalName: schema.logicalName,
                          }}
                          autoHeight={control.autoHeight}
                          maxHeight={control.maxHeight}
                          skeleton={skeleton}
                          required={required}
                        />
                      </SectionControlWrapper>
                    );
                  }}
                />
              </div>
            );
          }
          case 'editablegrid': {
            const disabled = getIsFieldDisabled({
              isFormReadonly,
              disabledFields: disabledControls,
              attribute: null,
              control,
              calculatedAttribute: undefined,
            });

            return (
              <EditableGridControl readOnly={disabled} control={control} />
            );
          }
          case 'quickview':
            return (
              <QuickViewControl
                control={control}
                labelPosition={section.labelPosition}
              />
            );
          case 'subgrid': {
            let ContainerComponent: React.ComponentType | null = null;

            if (control.component) {
              if (typeof control.component === 'function') {
                ContainerComponent = control.component;
              } else if (typeof control.component === 'string') {
                ContainerComponent = componentStore.getComponent<FC>(
                  control.component
                );
              }
            }

            const key = control.key ?? `${control.logicalName}-${index}`;

            return (
              <HistoryStateKeyProvider historyKey={`subgrid.${key}`} nested>
                <SubgridControl
                  key={key}
                  logicalName={control.logicalName}
                  allowViewSelection={control.allowViewSelection}
                  viewId={control.viewId}
                  availableViewIds={control.availableViewIds}
                  ContainerComponent={ContainerComponent}
                  associated={
                    !control.associatedAttribute
                      ? false
                      : {
                          logicalName: schema.logicalName,
                          id: recordId,
                          refAttributeName: control.associatedAttribute,
                        }
                  }
                />
              </HistoryStateKeyProvider>
            );
          }
          case 'component': {
            const Component =
              control.component === 'string'
                ? (componentStore.getComponent(
                    control.component
                  ) as React.ComponentType)
                : control.component;

            if (!Component) {
              console.warn(
                `Component ${control.component} not found for control ${control.key}`
              );

              return null;
            }

            return (
              <div
                key={index}
                style={{
                  gridColumn: control.span
                    ? `var(--section-item-span-${control.span ?? 1})`
                    : undefined,
                  display: 'flex',
                }}
              >
                <Component {...control.componentProps} />
              </div>
            );
          }
          case 'spacer':
            return (
              <div
                key={index}
                style={{
                  gridColumn: control.span
                    ? `var(--section-item-span-${control.span ?? 1})`
                    : undefined,
                }}
              />
            );
          default:
            return null;
        }
      })}
    </FormSection>
  );
}

import {
  useDataFormSchema,
  useFormInstance,
  useFormIsReadonly,
  useRecordId,
} from '@headless-adminapp/app/dataform/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { localizedLabel } from '@headless-adminapp/app/locale/utils';
import { Section } from '@headless-adminapp/core/experience/form';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { FC } from 'react';
import { Controller } from 'react-hook-form';

import { componentStore } from '../componentStore';
import { SectionControlWrapper } from '../DataForm/SectionControl';
import { FormSection } from '../form/layout';
import { StandardControl, StandardControlProps } from './StandardControl';
import { SubgridControl } from './SubgridControl';

export function SectionContainer<
  S extends SchemaAttributes = SchemaAttributes
>({ section }: { section: Section<S>; readOnly: boolean }) {
  const schema = useDataFormSchema<S>();

  const formInstance = useFormInstance();
  const recordId = useRecordId();
  const readonly = useFormIsReadonly();
  const { language } = useLocale();

  return (
    <FormSection
      title={localizedLabel(language, section)}
      columnCount={section.columnCount}
      labelPosition={section.labelPosition}
      noPadding={section.noPadding}
      hideLabel={section.hideLabel}
    >
      {section.controls.map((control, index) => {
        switch (control.type) {
          case 'standard': {
            const attribute = schema.attributes[control.attributeName];
            let Control = StandardControl;

            if (control.component) {
              const OverrideControl = componentStore.getComponent<
                FC<StandardControlProps>
              >(control.component);

              if (OverrideControl) {
                Control = OverrideControl;
              }
            }
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

                    return (
                      <SectionControlWrapper
                        label={label}
                        labelPosition={section.labelPosition}
                        required={attribute.required}
                        isError={isError}
                        errorMessage={errorMessage}
                      >
                        <Control
                          attribute={attribute}
                          name={control.attributeName as string}
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          errorMessage={errorMessage}
                          isError={isError}
                          disabled={readonly}
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
                        />
                      </SectionControlWrapper>
                    );
                  }}
                />
              </div>
            );
          }
          case 'editablegrid': {
            return null;
          }
          case 'quickview':
            return null;
          case 'subgrid':
            let ContainerComponent: FC | null = null;

            if (control.component) {
              ContainerComponent = componentStore.getComponent<FC>(
                control.component
              );
            }
            return (
              <SubgridControl
                key={index}
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
            );
          case 'spacer':
            return (
              <div
                key={index}
                style={{
                  gridColumn: control.span
                    ? `var(--section-item-span-${control.span})`
                    : undefined,
                  display: `var(--section-item-spacer-${control.span ?? 1})`,
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

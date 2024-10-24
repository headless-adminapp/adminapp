import { localizedLabel } from '@headless-adminapp/app/builders';
import {
  useDataFormSchema,
  useFormInstance,
  useFormIsReadonly,
  useRecordId,
} from '@headless-adminapp/app/dataform/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { Section } from '@headless-adminapp/core/experience/form';
import { SchemaAttributes } from '@headless-adminapp/core/schema';
import { Controller } from 'react-hook-form';

import { SectionControlWrapper } from '../DataForm/SectionControl';
import { FormSection } from '../form/layout';
import { StandardControl } from './StandardControl';
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
          case 'standard':
            const attribute = schema.attributes[control.attributeName];
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
                        <StandardControl
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
                        />
                      </SectionControlWrapper>
                    );
                  }}
                />
              </div>
            );
          case 'editablegrid': {
            return null;
          }
          case 'quickview':
            return null;
          case 'subgrid':
            return (
              <SubgridControl
                key={index}
                logicalName={control.logicalName}
                allowViewSelection={control.allowViewSelection}
                viewId={control.viewId}
                availableViewIds={control.availableViewIds}
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

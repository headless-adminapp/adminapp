import { tokens } from '@fluentui/react-components';
import {
  useDataFormSchema,
  useFormInstance,
} from '@headless-adminapp/app/dataform';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { useMetadata } from '@headless-adminapp/app/metadata';
import { useDataService } from '@headless-adminapp/app/transport';
import { SectionQuickViewControl } from '@headless-adminapp/core/experience/form/SectionControl';
import { Schema } from '@headless-adminapp/core/schema';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { SectionControlWrapper } from '../../DataForm/SectionControl';
import { StandardControl } from '../StandardControl';

interface QuickViewControlProps {
  labelPosition?: 'top' | 'left';
  control: SectionQuickViewControl;
}

export function QuickViewControl({
  control,
  labelPosition,
}: Readonly<QuickViewControlProps>) {
  const schema = useDataFormSchema();
  const formInstance = useFormInstance();
  const { schemaStore } = useMetadata();

  const attribute = schema.attributes[control.attributeName];

  if (!attribute) {
    console.warn(`Attribute ${control.attributeName} not found in schema`);
    return null;
  }

  if (attribute.type !== 'lookup') {
    console.warn(
      `Attribute ${control.attributeName} is not a lookup field, skipping QuickViewControl.`
    );
    return null;
  }

  const targetSchema = schemaStore.getSchema(attribute.entity);

  const value = formInstance.watch(control.attributeName);

  if (!value?.id) {
    return null;
  }

  return (
    <QuickViewControlInternal
      control={control}
      labelPosition={labelPosition}
      targetRecordId={value.id}
      targetSchema={targetSchema}
    />
  );
}

interface QuickViewControlInternalProps {
  labelPosition?: 'top' | 'left';
  control: SectionQuickViewControl;
  targetRecordId: string;
  targetSchema: Schema;
}

function QuickViewControlInternal({
  labelPosition,
  control,
  targetRecordId,
  targetSchema,
}: Readonly<QuickViewControlInternalProps>) {
  const isMobile = useIsMobile();
  const dataService = useDataService();

  const { data, isPending } = useQuery<any>({
    queryKey: [
      'data',
      'retriveRecord',
      targetSchema.logicalName,
      targetRecordId,
      control.form.attributes,
    ],
    queryFn: async () => {
      if (!targetRecordId) {
        return null;
      }

      const record = await dataService.retriveRecord(
        targetSchema.logicalName,
        targetRecordId,
        control.form.attributes
      );

      return record;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacingVerticalM,
      }}
    >
      {control.form.attributes.map((attributeName) => {
        const attribute = targetSchema.attributes[attributeName];

        if (!attribute) {
          return null;
        }

        return (
          <SectionControlWrapper
            key={attributeName}
            label={attribute.label}
            labelPosition={isMobile ? 'top' : labelPosition}
          >
            <StandardControl
              attribute={attribute}
              name={attributeName}
              value={data?.[attributeName] ?? null}
              onChange={() => {
                // do nothing
              }}
              readOnly
              label={attribute.label}
              placeholder={attribute.label}
              allowNavigation={true}
              allowNewRecord={false}
              skeleton={isPending}
            />
          </SectionControlWrapper>
        );
      })}
    </div>
  );
}

import { tokens } from '@fluentui/react-components';
import { useDataFormSchema } from '@headless-adminapp/app/dataform/hooks';
import { useRecordId } from '@headless-adminapp/app/dataform/hooks';

import { FormTab } from '../form/layout/FormTab';
import { RelatedItemInfo } from './RelatedViewSelector';
import { SubgridControl } from './SubgridControl';

interface FormTabRelatedProps {
  selectedRelatedItem: RelatedItemInfo | null;
}

export function FormTabRelated({ selectedRelatedItem }: FormTabRelatedProps) {
  const recordId = useRecordId();
  const schema = useDataFormSchema();

  return (
    <FormTab value="related" noWrapper>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              boxShadow: tokens.shadow2,
              borderRadius: tokens.borderRadiusMedium,
              background: tokens.colorNeutralBackground1,
              flex: 1,
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {!!selectedRelatedItem && (
                  <SubgridControl
                    logicalName={selectedRelatedItem.logicalName}
                    allowViewSelection
                    associated={{
                      logicalName: schema.logicalName,
                      id: recordId,
                      refAttributeName: selectedRelatedItem.attributeName,
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormTab>
  );
}

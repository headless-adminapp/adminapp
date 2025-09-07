import { tokens } from '@fluentui/react-components';
import { RelatedItemInfo } from '@headless-adminapp/app/dataform/context';
import {
  useDataFormSchema,
  useRecordId,
} from '@headless-adminapp/app/dataform/hooks';
import { HistoryStateKeyProvider } from '@headless-adminapp/app/historystate';

import { extendedTokens } from '../components/fluent';
import { FormTab } from '../form/layout/FormTab';
import { SubgridControl } from './SubgridControl';

interface FormTabRelatedProps {
  selectedRelatedItem: RelatedItemInfo | null;
}

export function FormTabRelated({
  selectedRelatedItem,
}: Readonly<FormTabRelatedProps>) {
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
              borderRadius: extendedTokens.paperBorderRadius,
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
                  <HistoryStateKeyProvider
                    historyKey={`related.${selectedRelatedItem.key}`}
                    nested
                  >
                    <SubgridControl
                      logicalName={selectedRelatedItem.logicalName}
                      allowViewSelection
                      associated={{
                        logicalName: schema.logicalName,
                        id: recordId,
                        refAttributeName: selectedRelatedItem.attributeName,
                      }}
                    />
                  </HistoryStateKeyProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FormTab>
  );
}

import { tokens } from '@fluentui/react-components';
import { RetriveRecordFn } from '@headless-adminapp/app/dataform/DataFormProvider/types';
import { SaveRecordFn } from '@headless-adminapp/app/dataform/utils/saveRecord';
import { HistoryStateKeyProvider } from '@headless-adminapp/app/historystate';
import { PageEntityFormProvider } from '@headless-adminapp/app/providers/PageEntityFormProvider';
import { RecordSetProvider } from '@headless-adminapp/app/recordset';
import {
  EntityMainFormCommandItemExperience,
  Form,
} from '@headless-adminapp/core/experience/form';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';

import { PageEntityFormDesktopContainer } from './PageEntityFormDesktopContainer';
import { RecordSetNavigatorContainer } from './RecordSetNavigatorContainer';

interface PageCustomEntityFormProps<
  SA extends SchemaAttributes = SchemaAttributes
> {
  recordId?: string;
  schema: Schema<SA>;
  form: Form<SA>;
  commands: EntityMainFormCommandItemExperience[][];
  retriveRecordFn?: RetriveRecordFn<SA>;
  saveRecordFn?: SaveRecordFn;
}

export function PageCustomEntityForm<
  SA extends SchemaAttributes = SchemaAttributes
>({
  recordId,
  commands,
  form,
  schema,
  retriveRecordFn,
  saveRecordFn,
}: Readonly<PageCustomEntityFormProps<SA>>) {
  return (
    <HistoryStateKeyProvider
      historyKey={'page-entity-form.' + schema.logicalName}
    >
      <RecordSetProvider>
        <PageEntityFormProvider
          schema={schema}
          form={form}
          recordId={recordId}
          commands={commands}
          retriveRecordFn={retriveRecordFn}
          saveRecordFn={saveRecordFn}
        >
          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'row',
              backgroundColor: tokens.colorNeutralBackground2,
              overflow: 'hidden',
            }}
          >
            <RecordSetNavigatorContainer />
            <PageEntityFormDesktopContainer />
          </div>
        </PageEntityFormProvider>
      </RecordSetProvider>
    </HistoryStateKeyProvider>
  );
}

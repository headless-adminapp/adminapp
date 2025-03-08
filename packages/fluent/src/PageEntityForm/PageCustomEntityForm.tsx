import { tokens } from '@fluentui/react-components';
import { RetriveRecordFn } from '@headless-adminapp/app/dataform/DataFormProvider/types';
import { SaveRecordFn } from '@headless-adminapp/app/dataform/utils/saveRecord';
import { PageEntityFormProvider } from '@headless-adminapp/app/providers/PageEntityFormProvider';
import {
  EntityMainFormCommandItemExperience,
  Form,
} from '@headless-adminapp/core/experience/form';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { FC } from 'react';

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

export const PageCustomEntityForm: FC<PageCustomEntityFormProps> = ({
  recordId,
  commands,
  form,
  schema,
  retriveRecordFn,
  saveRecordFn,
}) => {
  return (
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
  );
};

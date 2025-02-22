import { tokens } from '@fluentui/react-components';
import { PageEntityFormProvider } from '@headless-adminapp/app/providers/PageEntityFormProvider';
import {
  EntityMainFormCommandItemExperience,
  Form,
} from '@headless-adminapp/core/experience/form';
import { Schema, SchemaAttributes } from '@headless-adminapp/core/schema';
import { FC } from 'react';

import { PageEntityFormDesktopContainer } from './PageEntityFormDesktopContainer';

interface PageCustomEntityFormProps<
  SA extends SchemaAttributes = SchemaAttributes
> {
  recordId?: string;
  schema: Schema<SA>;
  form: Form<SA>;
  commands: EntityMainFormCommandItemExperience[][];
}

export const PageCustomEntityForm: FC<PageCustomEntityFormProps> = ({
  recordId,
  commands,
  form,
  schema,
}) => {
  return (
    <PageEntityFormProvider
      schema={schema}
      form={form}
      recordId={recordId}
      commands={commands}
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
        <PageEntityFormDesktopContainer />
      </div>
    </PageEntityFormProvider>
  );
};

import { Caption1, Subtitle2, tokens } from '@fluentui/react-components';
import {
  useDataFormSchema,
  useRecordTitle,
} from '@headless-adminapp/app/dataform';
import { useFormDataState } from '@headless-adminapp/app/dataform/hooks/useFormDataState';
import { MobileHeaderTitle } from '@headless-adminapp/app/header/components/MobileHeaderTitle';
import { useLocale } from '@headless-adminapp/app/locale';
import { localizedLabel } from '@headless-adminapp/app/locale/utils';
import { FC } from 'react';

export const MobileHeaderTitleContainer: FC = () => {
  const [recordTitle] = useRecordTitle();
  const { language } = useLocale();
  const schema = useDataFormSchema();
  const dataState = useFormDataState();

  if (dataState.isFetching || dataState.isError) {
    return null;
  }

  return (
    <MobileHeaderTitle
      order={3}
      title={
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: tokens.spacingHorizontalXS,
                alignItems: 'center',
              }}
            >
              <Subtitle2
                style={{
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
              >
                {recordTitle}
              </Subtitle2>
            </div>
            <Caption1 style={{ opacity: 0.8 }}>
              {localizedLabel(language, schema)}
            </Caption1>
          </div>
        </div>
      }
    />
  );
};

import { tokens } from '@fluentui/react-components';
import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
import { useIsMobile } from '@headless-adminapp/app/hooks';
import { useLocale } from '@headless-adminapp/app/locale';
import { FC, PropsWithChildren } from 'react';

export const FormBody: FC<PropsWithChildren> = ({ children }) => {
  const { direction } = useLocale();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: tokens.spacingVerticalM,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <ScrollView
        autoHide
        className="FormBody_scrollview"
        rtl={direction === 'rtl'}
      >
        {children}
      </ScrollView>
    </div>
  );
};

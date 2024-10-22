import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
import { useLocale } from '@headless-adminapp/app/locale';
import { FC, PropsWithChildren } from 'react';

export const FormBody: FC<PropsWithChildren> = ({ children }) => {
  const { direction } = useLocale();
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

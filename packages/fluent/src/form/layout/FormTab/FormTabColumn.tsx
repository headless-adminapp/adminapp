import { tokens } from '@fluentui/react-components';
import { FC, PropsWithChildren } from 'react';

interface FormTabColumnProps {
  span?: number;
}

export const FormTabColumn: FC<PropsWithChildren<FormTabColumnProps>> = ({
  children,
  span: _span,
}) => {
  return (
    <div
    // style={{ display: 'flex', flex: '0 0 50%', maxWidth: '50%', padding: 12 }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: tokens.spacingVerticalM,
          minHeight: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
};

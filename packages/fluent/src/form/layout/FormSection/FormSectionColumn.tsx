import { FC, PropsWithChildren } from 'react';

interface FormSectionColumnProps {
  span?: number;
}

export const FormSectionColumn: FC<
  PropsWithChildren<FormSectionColumnProps>
> = ({ children }) => {
  return (
    <div
      // md={span}
      // xs={12}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {children}
    </div>
  );
};

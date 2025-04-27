import { FC, lazy, Suspense } from 'react';

import { ControlProps } from './types';

const ReactQuill = lazy(() => import('react-quill'));

export interface RichTextControlProps extends ControlProps<string> {}

export const RichTextControl: FC<RichTextControlProps> = ({
  value,
  onChange,
  id,
  onBlur,
  onFocus,
  disabled,
  readOnly,
}) => {
  return (
    <Suspense>
      <ReactQuill
        value={value ?? ''}
        onChange={onChange}
        className="hdlapp_rte"
        readOnly={disabled || readOnly}
        style={{ maxHeight: '400px', minHeight: '200px' }}
        onFocus={onFocus}
        onBlur={onBlur}
        id={id}
      />
    </Suspense>
  );
};

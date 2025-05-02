import { tokens } from '@fluentui/react-components';
import { useQuickFilter } from '@headless-adminapp/app/board/hooks/useQuickFilter';
import { FC } from 'react';

import { SectionControlWrapper } from '../DataForm/SectionControl';
import { StandardControl } from '../PageEntityForm/StandardControl';

export const HeaderQuickFilter: FC = () => {
  const [quickFilter, values, setValue] = useQuickFilter();

  if (!quickFilter) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: tokens.spacingHorizontalS,
      }}
    >
      {Object.entries(quickFilter.attributes).map(([key, attribute]) => {
        return (
          <div key={key}>
            <SectionControlWrapper
              label={attribute.label}
              labelHidden
              labelPosition="top"
            >
              <StandardControl
                attribute={attribute}
                name={key}
                value={values[key] ?? null}
                onChange={(value) => setValue(key, value)}
              />
            </SectionControlWrapper>
          </div>
        );
      })}
    </div>
  );
};

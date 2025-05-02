import { tokens } from '@fluentui/react-components';
import { useQuickFilter } from '@headless-adminapp/app/datagrid/hooks/useQuickFilter';
import { FC } from 'react';

import { SectionControlWrapper } from '../DataForm/SectionControl';
import { StandardControl } from '../PageEntityForm/StandardControl';

export const GridQuickFilterDesktop: FC = () => {
  const [quickFilter, values, setValue] = useQuickFilter();

  if (!quickFilter) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: tokens.spacingHorizontalS,
        paddingInline: tokens.spacingHorizontalM,
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

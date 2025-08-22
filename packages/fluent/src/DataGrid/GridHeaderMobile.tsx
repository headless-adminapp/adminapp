import { Badge, Button, Input } from '@fluentui/react-components';
import {
  useGridColumnFilter,
  useSearchText,
} from '@headless-adminapp/app/datagrid/hooks';
import { Icons } from '@headless-adminapp/icons';
import { FC, useState } from 'react';

import { useAppStrings } from '../App/AppStringContext';
import { CustomFilter } from './CustomFilter';
import { MobileHeaderTitleContainer } from './MobileHeaderTitleContainer';

interface GridHeaderMobileProps {}

export const GridHeaderMobile: FC<GridHeaderMobileProps> = () => {
  const [columnFilters] = useGridColumnFilter();
  const [showCustomFilters, setShowCustomFilters] = useState(false);
  const [searchText, setSearchText] = useSearchText();
  const appStrings = useAppStrings();

  return (
    <div
      style={{
        alignItems: 'center',
        paddingInline: 8,
        gap: 8,
        display: 'flex',
      }}
    >
      <MobileHeaderTitleContainer />
      <div style={{ alignItems: 'center', display: 'flex', gap: 16, flex: 1 }}>
        <Input
          contentBefore={<Icons.Search size={16} />}
          placeholder={appStrings.searchPlaceholder}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>
      <div
        style={{
          alignItems: 'center',
          gap: 16,
          justifyContent: 'space-between',
          display: 'flex',
        }}
      >
        <Button
          appearance="subtle"
          style={{ position: 'relative' }}
          icon={
            <>
              <Icons.Filter />
              {Object.keys(columnFilters).length > 0 && (
                <Badge
                  style={{ position: 'absolute', top: 0, right: 0 }}
                  color="danger"
                  size="tiny"
                />
              )}
            </>
          }
          iconPosition="after"
          onClick={() => setShowCustomFilters(true)}
        />
        <CustomFilter
          open={showCustomFilters}
          onClose={() => setShowCustomFilters(false)}
        />
      </div>
    </div>
  );
};

import {
  Caption1,
  Divider,
  Subtitle2,
  tokens,
} from '@fluentui/react-components';
import { InsightsContext } from '@headless-adminapp/app/insights';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { InsightConfig } from '@headless-adminapp/core/experience/insights';
import { Icons } from '@headless-adminapp/icons';
import { FC, Fragment } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Button, extendedTokens } from '../components/fluent';
import { StandardControl } from '../PageEntityForm/StandardControl';

interface HeaderProps {
  isScrolled: boolean;
}

export const Header: FC<HeaderProps> = () => {
  const config = useContextSelector(
    InsightsContext,
    (state) => state.config as unknown as InsightConfig
  );

  const eventManager = useContextSelector(
    InsightsContext,
    (state) => state.eventManager
  );

  const filterForm = useFormContext();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        // background: tokens.colorNeutralBackground1,
        // borderRadius: tokens.borderRadiusLarge,
        paddingBlock: tokens.spacingVerticalM,
        paddingInline: tokens.spacingHorizontalXL, // spacingMapping[insightsState.style?.spacing ?? 'normal'],
        gap: tokens.spacingVerticalS,
        // borderRadius: radiusMapping[insightsState.style?.radius ?? 'normal'],
        // boxShadow: tokens.shadow2,
        // boxShadow: isScrolled ? tokens.shadow2 : 'none',
        // backgroundColor: isScrolled
        //   ? tokens.colorNeutralBackground1
        //   : 'transparent',
        // backdropFilter: isScrolled ? 'blur(15px)' : 'none',
        backdropFilter: 'blur(20px)',
        background: tokens.colorNeutralBackgroundAlpha2,

        boxShadow: tokens.shadow4,
        // backgroundColor: tokens.colorNeutralBackground1,
        // backgroundColor: 'rgba(255, 255, 255, 0.8)',
        // backdropFilter: 'blur(20px)',
        borderRadius: extendedTokens.paperBorderRadius,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacingHorizontalM,
        }}
      >
        <div style={{ flex: 1 }}>
          <div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Subtitle2 style={{ color: tokens.colorNeutralForeground1 }}>
                {config.title}
              </Subtitle2>
              <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>
                {config.subtitle}
              </Caption1>
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacingHorizontalS,
          }}
        >
          <Button
            icon={<Icons.Refresh />}
            appearance="subtle"
            onClick={() => {
              eventManager.emit('INSIGHT_REFRESH_TRIGGER');
            }}
          >
            Refresh
          </Button>
        </div>
      </div>
      {!!config.filterAttributes && (
        <Fragment>
          <Divider style={{ opacity: 0.2 }} />
          <div style={{ display: 'flex', gap: tokens.spacingHorizontalS }}>
            {Object.entries(config.filterAttributes).map(
              ([attributeName, attribute]) => {
                return (
                  <Controller
                    key={attributeName}
                    control={filterForm.control}
                    name={attributeName}
                    render={({ field }) => {
                      return (
                        <div style={{ width: 210, minWidth: 210 }}>
                          <StandardControl
                            attribute={attribute}
                            name={attributeName}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            required={attribute.required}
                          />
                        </div>
                      );
                    }}
                  />
                );
              }
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
};

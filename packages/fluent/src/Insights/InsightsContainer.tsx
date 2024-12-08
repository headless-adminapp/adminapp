import {
  Body1Strong,
  Button,
  Caption1,
  Caption2,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Subtitle2,
  tokens,
} from '@fluentui/react-components';
import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
import { InsightsContext } from '@headless-adminapp/app/insights';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { InsightsState } from '@headless-adminapp/core/experience/insights';

import { CommandBarContainer } from './CommandBarContainer';
import { FilterBarContainer } from './FilterBarContainer';
import { Widgets } from './Widgets';

export function InsightsContainer() {
  const insightsState = useContextSelector(
    InsightsContext,
    (state) => state as unknown as InsightsState
  );
  const insightExpereince = insightsState.experience;

  const titleButton = (
    <Button appearance="subtle" style={{ pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Subtitle2 style={{ color: tokens.colorNeutralForeground1 }}>
          {insightExpereince.title}
        </Subtitle2>
        <Caption1 style={{ color: tokens.colorNeutralForeground2 }}>
          {insightExpereince.subtitle}
        </Caption1>
      </div>
    </Button>
  );

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        backgroundColor: tokens.colorNeutralBackground2,
        overflow: 'hidden',
      }}
    >
      <div style={{ padding: 12 }}>
        <div
          style={{
            background: tokens.colorNeutralBackground1,
            boxShadow: tokens.shadow2,
            borderRadius: tokens.borderRadiusMedium,
            display: 'flex',
            alignItems: 'center',
            minHeight: 40,
          }}
        >
          <CommandBarContainer />
          <FilterBarContainer />
        </div>
      </div>
      <div style={{ padding: 12 }}>
        {insightsState.insightLookup.length > 0 ? (
          <Menu>
            <MenuTrigger disableButtonEnhancement>{titleButton}</MenuTrigger>

            <MenuPopover>
              <MenuList>
                {insightsState.insightLookup.map((insight) => (
                  <MenuItem
                    key={insight.id}
                    onClick={() => insightsState.onInsightSelect(insight.id)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Body1Strong>{insight.title}</Body1Strong>
                      <Caption2
                        style={{ color: tokens.colorNeutralForeground2 }}
                      >
                        {insight.subtitle}
                      </Caption2>
                    </div>
                  </MenuItem>
                ))}
              </MenuList>
            </MenuPopover>
          </Menu>
        ) : (
          titleButton
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <ScrollView>
          <Widgets widgets={insightExpereince.widgets} />
        </ScrollView>
      </div>
    </div>
  );
}

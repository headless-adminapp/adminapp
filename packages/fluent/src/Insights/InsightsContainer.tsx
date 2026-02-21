import { tokens } from '@fluentui/react-components';
import { ScrollView } from '@headless-adminapp/app/components/ScrollView';
import { InsightsContext } from '@headless-adminapp/app/insights';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { InsightConfig } from '@headless-adminapp/core/experience/insights';
import { useState } from 'react';

import { Header } from './Header';
import { Widgets } from './Widgets';

export function InsightsContainer() {
  const config = useContextSelector(
    InsightsContext,
    (state) => state.config as unknown as InsightConfig,
  );

  const [isScrolled, setIsScrolled] = useState(false);

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
      {/* <div style={{ padding: 12 }}>
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
      </div> */}
      {/* <div
        style={{
          // padding: spacingMapping[insightExpereince.style?.spacing ?? 'normal'],
          // paddingBottom: 0,
          // boxShadow: isScrolled ? tokens.shadow2 : 'none',
          // backgroundColor: isScrolled
          //   ? tokens.colorNeutralBackground1
          //   : 'transparent',
          zIndex: 1,
          position: 'sticky',
          top: 0,
        }}
      >
        <Header isScrolled={isScrolled} />
      </div> */}

      {/* <div
        style={{
          zIndex: 10,
          position: 'sticky',
          top: 50,
          height: 100,
          width: 200,
          border: '1px solid red',
        }}
      ></div> */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          onScroll={(event) => {
            const div = event.target as HTMLDivElement;

            setIsScrolled(div.scrollTop > 0);
          }}
        >
          <div
            style={{
              // paddingInline:
              //   spacingMapping[insightExpereince.style?.spacing ?? 'normal'],
              padding: tokens.spacingHorizontalXL,
              paddingBottom: 0,
              // boxShadow: isScrolled ? tokens.shadow2 : 'none',
              // backgroundColor: isScrolled
              //   ? tokens.colorNeutralBackground1
              //   : 'transparent',
              zIndex: 50,
              position: 'sticky',
              top: 0,
            }}
          >
            {/* <div
              style={{
                // height:
                //   spacingMapping[insightExpereince.style?.spacing ?? 'normal'],
                backgroundColor: tokens.colorNeutralBackground2,
              }}
            /> */}
            <Header isScrolled={isScrolled} />
          </div>
          {/* <div style={{ height: ROW_GAP }} /> */}
          <Widgets widgets={config.widgets} />
        </ScrollView>
      </div>
    </div>
  );
}

import { Body1Strong, Divider, tokens } from '@fluentui/react-components';
import { useElementSize } from '@headless-adminapp/app/hooks';
import { FC, Fragment, PropsWithChildren, useRef } from 'react';

import { extendedTokens } from '../../../components/fluent';
import { FormSectionColumn } from './FormSectionColumn';
import { FormSectionLoading } from './FormSectionLoading';

function determineItemCount(
  availableWidth: number,
  itemWidth: number,
  gap: number,
  padding: number
) {
  return Math.floor((availableWidth + gap - 2 * padding) / (itemWidth + gap));
}

interface FormSectionProps {
  title?: string;
  fullHeight?: boolean;
  columnCount?: number;
  labelPosition?: 'top' | 'left';
  noPadding?: boolean;
  hideLabel?: boolean;
}

export const FormSection: FC<PropsWithChildren<FormSectionProps>> & {
  Column: typeof FormSectionColumn;
  Loading: typeof FormSectionLoading;
} = ({
  title,
  children,
  columnCount,
  labelPosition,
  noPadding,
  hideLabel,
  fullHeight,
}) => {
  // const columnCount = 2;
  const divRef = useRef<HTMLDivElement>(null);

  const divSize = useElementSize(divRef, 100);

  const minControlWidth = labelPosition === 'top' ? 200 : 360;
  const gap = 12;
  const padding = noPadding ? 0 : 16;

  let itemCount = determineItemCount(
    divSize.width,
    minControlWidth,
    gap,
    padding
  );

  if (!columnCount) {
    itemCount = 1;
  } else if (itemCount > columnCount) {
    itemCount = columnCount;
  }

  if (itemCount < 1) {
    itemCount = 1;
  }

  if (itemCount > 4) {
    itemCount = 4;
  }

  if (itemCount === 3) {
    itemCount = 2;
  }

  const template1 = Array.from({ length: itemCount })
    .map(() => '1fr')
    .join(' ');
  const template2 = '';

  const minWidthRequired =
    minControlWidth * (columnCount ?? 1) +
    gap * ((columnCount ?? 1) - 1) +
    padding * 2;

  const template = divSize.width >= minWidthRequired ? template1 : template2;

  const spanTemplates = {
    '--section-item-span-1': 'span 1',
    '--section-item-span-2': 'span 2',
    '--section-item-span-4': 'span 4',
    '--section-item-spacer-1': 'block',
    '--section-item-spacer-2': 'block',
    '--section-item-spacer-4': 'none',
  };

  if (itemCount === 2) {
    spanTemplates['--section-item-span-4'] = 'span 2';
    spanTemplates['--section-item-spacer-2'] = 'none';
  } else if (itemCount === 1) {
    spanTemplates['--section-item-span-2'] = 'span 1';
    spanTemplates['--section-item-span-4'] = 'span 1';
    spanTemplates['--section-item-spacer-1'] = 'none';
    spanTemplates['--section-item-spacer-2'] = 'none';
  }

  return (
    <div
      ref={divRef}
      style={{
        boxShadow: tokens.shadow2,
        borderRadius: extendedTokens.paperBorderRadius,
        background: tokens.colorNeutralBackground1,
        display: 'flex',
        flexDirection: 'column',
        flex: fullHeight ? 1 : undefined,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: fullHeight ? 1 : undefined,
        }}
      >
        {!hideLabel && !!title && (
          <Fragment>
            <div
              style={{
                display: 'flex',
                paddingInline: 16,
                paddingBlock: 8,
                height: 40,
                alignItems: 'center',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', width: '100%' }}
              >
                <Body1Strong>{title}</Body1Strong>
                <div style={{ flex: 1 }} />
              </div>
            </div>
            <Divider style={{ opacity: 0.2, flexGrow: 0 }} />
          </Fragment>
        )}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: template,
              rowGap: gap,
              columnGap: gap,
              ...spanTemplates,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

FormSection.Column = FormSectionColumn;
FormSection.Loading = FormSectionLoading;

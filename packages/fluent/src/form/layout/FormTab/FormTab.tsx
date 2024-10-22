import { DataFormContext } from '@headless-adminapp/app/dataform';
import { useElementSize } from '@headless-adminapp/app/hooks';
import { useContextSelector } from '@headless-adminapp/app/mutable';
import { FC, PropsWithChildren, useRef } from 'react';

import { FormTabColumn } from './FormTabColumn';

function determineItemCount(
  availableWidth: number,
  itemWidth: number,
  gap: number,
  padding: number
) {
  return Math.floor((availableWidth + gap - 2 * padding) / (itemWidth + gap));
}

interface FormTabProps {
  value: string;
  fullHeight?: boolean;
  columnCount?: number;
  columnWidths?: Array<number | string | [number, number | string]>; // Array<width | [minWidth, width]>
  noWrapper?: boolean;
}

export const FormTab: FC<PropsWithChildren<FormTabProps>> & {
  Column: typeof FormTabColumn;
} = (props) => {
  const divRef = useRef<HTMLDivElement>(null);
  const activeTab = useContextSelector(
    DataFormContext,
    (state) => state.activeTab
  );

  const divSize = useElementSize(divRef);

  if (activeTab !== props.value) {
    return null;
  }

  if (props.noWrapper) {
    return props.children;
  }

  return <FormTabInternal {...props} />;
};

/** @todo: unfinished component */
const FormTabInternal: FC<PropsWithChildren<FormTabProps>> = ({
  children,
  value,
  fullHeight,
  columnCount,
  columnWidths,
}) => {
  const divRef = useRef<HTMLDivElement>(null);

  const divSize = useElementSize(divRef);

  const padding = 0;
  // const columnCount = 2;
  const minSectionWidth = 392;
  const gap = 12;

  // let itemCount = determineItemCount(
  //   divSize.width,
  //   minSectionWidth,
  //   gap,
  //   padding
  // );

  columnCount = columnCount ?? 1;

  // if (itemCount > columnCount) {
  //   itemCount = columnCount;
  // }

  // if (itemCount < 1) {
  //   itemCount = 1;
  // }

  // if (itemCount > 4) {
  //   itemCount = 4;
  // }

  const itemCount = columnCount;

  const template1 = columnWidths
    ? columnWidths.join(' ')
    : Array.from({ length: itemCount })
        .map(() => '1fr')
        .join(' ');
  const template2 = '';

  const minWidthRequired = minSectionWidth * itemCount + gap * (itemCount - 1);

  // 1 - 1 * minSectionWidth + gap * 0
  // 2 - 2 * minSectionWidth + gap * 1
  // 4 - 4 * minSectionWidth + gap * 3
  // 8 - 8 * minSectionWidth + gap * 7

  const template = divSize.width >= minWidthRequired ? template1 : template2;

  return (
    <div
      ref={divRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        // marginTop: 12,
        // padding: 12,
      }}
    >
      <div
        style={{
          // display: 'flex',
          // flexWrap: 'wrap',
          // justifyContent: 'flex-start',
          // gap: tokens.spacingHorizontalM,
          // marginInline: -12,
          display: 'grid',
          gridRowGap: 12,
          gridColumnGap: 12,
          gridTemplateColumns: template,
        }}
      >
        {children}
      </div>
    </div>
  );
};

FormTab.Column = FormTabColumn;

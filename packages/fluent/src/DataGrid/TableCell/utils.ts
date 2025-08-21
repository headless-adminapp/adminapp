import { tokens } from '@fluentui/react-components';
import { CSSProperties } from 'react';

export interface SelectionInfo {
  selected?: boolean;
  left?: boolean;
  right?: boolean;
  top?: boolean;
  bottom?: boolean;
}

export function getSelectedCellStyle(info: SelectionInfo | undefined) {
  if (!info) return;

  const styles: Pick<CSSProperties, 'backgroundColor' | 'boxShadow'> = {};

  if (info.selected) {
    styles.backgroundColor = `color-mix(in srgb, ${tokens.colorBrandBackground2} 60%, transparent)`;
  }

  const shadows: string[] = [];

  if (info.left) {
    shadows.push(`inset 1px 0 0 ${tokens.colorBrandStroke1}`);
  }

  if (info.right) {
    shadows.push(`inset -1px 0 0 ${tokens.colorBrandStroke1}`);
  }

  if (info.top) {
    shadows.push(`inset 0 1px 0 ${tokens.colorBrandStroke1}`);
  }

  if (info.bottom) {
    shadows.push(`inset 0 -1px 0 ${tokens.colorBrandStroke1}`);
  }

  if (shadows.length > 0) {
    styles.boxShadow = shadows.join(', ');
  }

  return styles;
}

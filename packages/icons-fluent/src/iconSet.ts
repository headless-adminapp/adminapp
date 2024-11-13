import { bundleIcon } from '@headless-adminapp/icons/bundleIcon';
import { defineIconSet } from '@headless-adminapp/icons/utils';
import { lazy } from 'react';

import { createIcon } from './createIcon';
import { bundleLazyIcon } from './lazyIcon';

const ExcelRegular = lazy(() => import('./ExcelRegular'));
const ExcelFilled = lazy(() => import('./ExcelFilled'));
const CsvRegular = lazy(() => import('./CsvRegular'));
const CsvFilled = lazy(() => import('./CsvFilled'));

export const iconSet = defineIconSet({
  // controls
  Mail: bundleLazyIcon('Mail24Regular', 'Mail24Filled'),
  Phone: bundleLazyIcon('Call24Regular', 'Call24Filled'),
  Search: bundleLazyIcon('Search24Regular', 'Search24Filled'),
  Eye: bundleLazyIcon('Eye24Regular', 'Eye24Filled'),
  EyeOff: bundleLazyIcon('EyeOff24Regular', 'EyeOff24Filled'),
  Calendar: bundleLazyIcon('CalendarMonth24Regular', 'CalendarMonth24Regular'),

  // arrows
  ArrowLeft: bundleLazyIcon('ArrowLeft24Regular', 'ArrowLeft24Filled'),
  ArrowRight: bundleLazyIcon('ArrowRight24Regular', 'ArrowRight24Filled'),
  ArrowDown: bundleLazyIcon('ArrowDown24Regular', 'ArrowDown24Filled'),
  ArrowUp: bundleLazyIcon('ArrowUp24Regular', 'ArrowUp24Filled'),
  ChevronDown: bundleLazyIcon('ChevronDown24Regular', 'ChevronDown24Filled'),
  ChevronUp: bundleLazyIcon('ChevronUp24Regular', 'ChevronUp24Filled'),

  // general actions
  Close: bundleLazyIcon('Dismiss24Regular', 'Dismiss24Filled'),
  Add: bundleLazyIcon('Add24Regular', 'Add24Filled'),
  Edit: bundleLazyIcon('Edit24Regular', 'Edit24Filled'),
  Delete: bundleLazyIcon('Delete24Regular', 'Delete24Filled'),
  Refresh: bundleLazyIcon(
    'ArrowCounterclockwise24Regular',
    'ArrowCounterclockwise24Regular'
  ),
  MoreVertical: bundleLazyIcon('MoreVertical24Regular', 'MoreVertical24Filled'),
  MoreHorizontal: bundleLazyIcon(
    'MoreHorizontal24Regular',
    'MoreHorizontal24Filled'
  ),

  // others
  Error: bundleLazyIcon('ErrorCircle24Regular', 'ErrorCircle24Filled'),
  Settings: bundleLazyIcon('Settings24Regular', 'Settings24Filled'),
  SignOut: bundleLazyIcon('SignOut24Regular', 'SignOut24Filled'),
  EditColumns: bundleLazyIcon(
    'TextGrammarSettings24Regular',
    'TextGrammarSettings24Regular'
  ),
  Filter: bundleLazyIcon('Filter24Regular', 'Filter24Filled'),
  FilterDismiss: bundleLazyIcon(
    'FilterDismiss24Regular',
    'FilterDismiss24Filled'
  ),
  ListLtr: bundleLazyIcon(
    'TextBulletListLtr24Regular',
    'TextBulletListLtr24Filled'
  ),
  ListRtl: bundleLazyIcon(
    'TextBulletListRtl24Regular',
    'TextBulletListRtl24Filled'
  ),
  Export: bundleLazyIcon('ArrowDownload24Regular', 'ArrowDownload24Filled'),
  ExportCsv: bundleIcon(
    createIcon(CsvRegular, true),
    createIcon(CsvFilled, true)
  ),
  ExportExcel: bundleIcon(
    createIcon(ExcelRegular, true),
    createIcon(ExcelFilled, true)
  ),
});

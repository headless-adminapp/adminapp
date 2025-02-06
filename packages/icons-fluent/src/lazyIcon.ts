import type * as FluentIconTypes from '@fluentui/react-icons';
import { bundleIcon } from '@headless-adminapp/icons/bundleIcon';
import { lazy } from 'react';

import { createIcon } from './createIcon';

type FluentIcon = FluentIconTypes.FluentIcon;

type FluentReactIconsResult = typeof FluentIconTypes;

function getFluentIconPromise() {
  return import('@fluentui/react-icons');
}

export function lazyIcon(name: keyof FluentReactIconsResult) {
  return lazy(() =>
    getFluentIconPromise().then((module) => ({
      default: module[name] as FluentIcon,
    }))
  );
}

export function createLazyIcon(name: keyof FluentReactIconsResult) {
  return createIcon(lazyIcon(name), true);
}

export function bundleLazyIcon(
  regular: keyof FluentReactIconsResult,
  filled: keyof FluentReactIconsResult
) {
  return bundleIcon(createLazyIcon(regular), createLazyIcon(filled));
}

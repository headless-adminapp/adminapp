import { useMobileHeaderSetValue } from './useMobileHeaderSetValue';

export function useHeaderShowBackButton(show: boolean, order = 0) {
  useMobileHeaderSetValue(show, order, 'showBackButton');
}

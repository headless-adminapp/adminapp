export interface HistoryStatePlugin {
  getter: () => Record<string, Record<string, unknown>>;
  setter: (value: Record<string, Record<string, unknown>>) => void;
}

let historyStatePlugin: HistoryStatePlugin | null = null;

export function registerHistoryStatePlugin(plugin: HistoryStatePlugin) {
  historyStatePlugin = plugin;
}

export function getHistoryState<
  T extends Record<string, unknown> = Record<string, unknown>
>(key: string): Partial<T> {
  if (!historyStatePlugin) {
    return {};
  }

  if (!key || typeof key !== 'string' || key.startsWith('~')) {
    return {};
  }

  const state = historyStatePlugin.getter();
  return (state[key] || {}) as Partial<T>;
}

export function setHistoryState(key: string, value: Record<string, unknown>) {
  if (!historyStatePlugin) {
    return;
  }

  const currentState = historyStatePlugin.getter();

  historyStatePlugin.setter({
    ...currentState,
    [key]: {
      ...currentState[key],
      ...value,
    },
  });
}

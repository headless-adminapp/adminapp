import { BoardColumnProvider } from '@headless-adminapp/app/board/BoardColumnProvider';
import { BoardColumnConfig } from '@headless-adminapp/app/board/types';

import { BoardColumnUI } from './BoardColumnUI';

export type BoardColumnProps = {
  config: BoardColumnConfig;
};

export function BoardColumn(props: BoardColumnProps) {
  return (
    <BoardColumnProvider config={props.config}>
      <BoardColumnUI />
    </BoardColumnProvider>
  );
}

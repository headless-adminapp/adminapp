export interface TransitionItem {
  columnId: string;
  laneId: string;
}

export interface TransitionItemWithId extends TransitionItem {
  id: string;
}

export class ColumnLaneTransition {
  private receivingLanes: Record<string, TransitionItemWithId[]> = {};
  private sendingLanes: Record<string, TransitionItemWithId[]> = {};

  constructor() {}

  private getLaneKey(columnId: string, laneId: string): string {
    return `${columnId}::${laneId}`;
  }

  public getReceivingLanes(
    columnId: string,
    laneId: string,
  ): TransitionItemWithId[] {
    return this.receivingLanes[this.getLaneKey(columnId, laneId)] || [];
  }

  public getSendingLanes(
    columnId: string,
    laneId: string,
  ): TransitionItemWithId[] {
    return this.sendingLanes[this.getLaneKey(columnId, laneId)] || [];
  }

  public getReceivingLaneIds(columnId: string, laneId: string): string[] {
    return this.getReceivingLanes(columnId, laneId).map((lane) =>
      this.getLaneKey(lane.columnId, lane.laneId),
    );
  }

  public getSendingLaneIds(columnId: string, laneId: string): string[] {
    return this.getSendingLanes(columnId, laneId).map((lane) =>
      this.getLaneKey(lane.columnId, lane.laneId),
    );
  }

  private addTransitionItem(sender: TransitionItem, receiver: TransitionItem) {
    const senderId = this.getLaneKey(sender.columnId, sender.laneId);
    const receiverId = this.getLaneKey(receiver.columnId, receiver.laneId);

    if (!this.receivingLanes[senderId]) {
      this.receivingLanes[senderId] = [];
    }

    if (!this.sendingLanes[receiverId]) {
      this.sendingLanes[receiverId] = [];
    }

    this.receivingLanes[senderId].push({
      ...receiver,
      id: receiverId,
    });

    this.sendingLanes[receiverId].push({
      ...sender,
      id: senderId,
    });
  }

  public addReceivingLane(
    sender: string | TransitionItem,
    receiver: string | TransitionItem | Array<string | TransitionItem>,
  ) {
    if (typeof sender === 'string') {
      sender = {
        columnId: sender,
        laneId: sender,
      };
    }

    if (!Array.isArray(receiver)) {
      receiver = [receiver];
    }

    for (let r of receiver) {
      if (typeof r === 'string') {
        r = {
          columnId: r,
          laneId: r,
        };
      }
      this.addTransitionItem(sender, r);
    }
  }

  public addSendingLane(
    receiver: string | TransitionItem,
    sender: string | TransitionItem | Array<string | TransitionItem>,
  ) {
    if (typeof receiver === 'string') {
      receiver = {
        columnId: receiver,
        laneId: receiver,
      };
    }

    if (!Array.isArray(sender)) {
      sender = [sender];
    }

    for (let s of sender) {
      if (typeof s === 'string') {
        s = {
          columnId: s,
          laneId: s,
        };
      }
      this.addTransitionItem(s, receiver);
    }
  }
}

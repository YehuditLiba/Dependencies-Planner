import { Status } from "./StatusTypes";
import { TSize } from "./t_size";

export interface AffectedGroup {
  id: number;
  requestId: number;
  groupId: number;
  status: Status;
  tSize: TSize;
}

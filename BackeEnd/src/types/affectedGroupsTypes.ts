import { Status } from "./StatusTypes";


export interface AffectedGroup {
  requestId: number;
  groupId: number;
  status: Status;
  id: number;

}

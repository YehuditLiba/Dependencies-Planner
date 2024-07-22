import { AffectedGroup } from "./affectedGroupsTypes";
import { Priority } from "./priorityTypes";
// import { RequestorName } from "./requestorNameTypes";

export interface RequestT {
    ID: number;
    requestorName:string[]/*RequestorName */;
    title: string;
    requestGroup: string;
    description: string;
    priority: Priority;
    finalDecision: boolean;
    planned: string; // שקול לשנות את הסוג ל-Date אם מדובר בתאריך
    comments: string;
    dateTime: Date;
    affectedGroupList: AffectedGroup[] | number[]; // אם יש צורך בשני סוגים שונים
    jiraLink: string;
    emailRequestor: string;
}

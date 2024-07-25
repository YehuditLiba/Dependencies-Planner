import { AffectedGroup } from "./affectedGroupsTypes";
import { Priority } from "./priorityTypes";

export interface RequestT {
    ID: number;
    requestorName: string;
    title: string;
    requestGroup: string;
    description: string;
    priority: Priority;
    finalDecision: boolean;
    planned: string; // שקול לשנות את הסוג ל-Date אם מדובר בתאריך
    comments: string;
    dateTime: Date;
    affectedGroupList: number[]; // אם יש צורך בשני סוגים שונים
    jiraLink: string;
    emailRequestor: string;
}

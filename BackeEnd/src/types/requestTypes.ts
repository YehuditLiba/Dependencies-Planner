import { AffectedGroup } from "./affectedGroupsTypes";
import { Priority } from "./priorityTypes";
import { Status } from "../types/StatusTypes"; // נניח שהטייפ הזה מוגדר בקובץ אחר בשם statusTypes.ts

export interface RequestT {
    ID: number;
    requestorName: string;
    title: string;
    requestGroup: string;
    description: string;
    // priority: Priority;
    priority: string; // מתעדכן ל-string בגלל הסוג שנשמר במסד הנתונים
    finalDecision: boolean;
    planned: string; // שקול לשנות את הסוג ל-Date אם מדובר בתאריך
    comments: string;
    dateTime: Date;
    affectedGroupList: number[]; // אם יש צורך בשני סוגים שונים
    jiraLink: string;
    emailRequestor: string;
    statuses: { groupId: number; status: Status }[];
}

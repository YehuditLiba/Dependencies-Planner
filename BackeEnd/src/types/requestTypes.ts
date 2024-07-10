import { AffectedGroup } from "./affectedGroupsTypes";
import { Priority } from "./priorityTypes";

export interface Request {

    ID: number;
    title: string;
    requestGroup: string[];
    description: string;
    priority: Priority;
    finalDecision: boolean;
    planned: string;
    comments: string;
    dateTime: Date;
    affectedGroupList: AffectedGroup[];
    jiraLink: string;
}

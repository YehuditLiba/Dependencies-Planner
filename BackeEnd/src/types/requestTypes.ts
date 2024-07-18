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
    planned: string;
    comments: string;
    dateTime: Date;
    affectedGroupList: number[];
    jiraLink: string;
    emailRequestor: string;
}

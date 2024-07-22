import { AffectedGroup } from "./affectedGroupsTypes";
import { Priority } from "./priorityTypes";
// import { RequestorName } from "./requestorNameTypes";

export interface RequestT {

    ID: number;
    requestorName:string[]/*RequestorName */;
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
    emailRequestor: string;
}

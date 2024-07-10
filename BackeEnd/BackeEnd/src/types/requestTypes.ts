import { AffectedGroup } from "./affectedGroupsTypes";

enum Priority {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Critical = 'Critical'
}

interface Request {
    ID: number;
    title: string;
    requestGroup: string[];
    description: string;
    priority: Priority;
    finalDecision: boolean;
    planned: string;
    comments: string;
    dateTime: Date;
    affectedGroupList:AffectedGroup[];
    jiraLink: string;
}

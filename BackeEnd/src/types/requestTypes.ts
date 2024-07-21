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
<<<<<<< HEAD
    affectedGroupList: AffectedGroup[];
    // avital:
    // affectedGroupList: number[];
=======
    affectedGroupList: number[];
>>>>>>> 15f2bfb543d6472ea38ea33c6871e60e348508aa
    jiraLink: string;
    emailRequestor: string;
}

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


// export const mapToRequestT = (row: any): RequestT => {
//     return {
//         ID: row.id,
//         requestorName: row.requestor_name,
//         title: row.title || null, 
//         requestGroup: row.request_group.split(','),
//         description: row.description || null, 
//         priority: row.priority as Priority, 
//         finalDecision: row.final_decision,
//         planned: row.planned,
//         comments: row.comments,
//         dateTime: row.date_time,
//         affectedGroupList: row.affected_group_list as AffectedGroup[],
//         jiraLink: row.jira_link || null,
//         emailRequestor: row.email_requestor,
//     };
// };
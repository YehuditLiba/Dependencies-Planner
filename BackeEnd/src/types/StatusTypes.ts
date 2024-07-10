export interface Status {
    id: number;
    status: string;
}

const statuses: Status[] = [
    { id: 1, status: "not required" },
    { id: 2, status: "pending response" },
    { id: 3, status: "in Q" },
    { id: 4, status: "not in Q" }
];

export default statuses;

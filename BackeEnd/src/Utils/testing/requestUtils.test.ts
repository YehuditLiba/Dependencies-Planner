// import { filterRequestsByRequestorName } from '../requestUtils'; // וודא שהנתיב נכון

//  Mock the database connection
// jest.mock('../../config/db', () => {
//     const mPool = {
//         connect: jest.fn().mockResolvedValue({
//             query: jest.fn().mockResolvedValue({ rows: [{ id: 1, title: 'Test Request', request_group: 'Group 1', description: 'Test Description', priority: 'High', final_decision: 'Approved', planned: true, comments: 'No comments', date_time: new Date(), affected_group_list: 'Group A, Group B', jira_link: 'http://jira.test', requestor_name: 'Avital', email_requestor: 'avital@test.com' }] }),
//             release: jest.fn(),
//         }),
//     };
//     return { pool: mPool };
// });

// describe('filterRequestsByName', () => {
//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should return filtered requests by name', async () => {
//         const results = await filterRequestsByRequestorName('Avital', 10, 0);
//         expect(results).toEqual([{
//             ID: 1,
//             title: 'Test Request',
//             requestGroup: 'Group 1',
//             description: 'Test Description',
//             priority: 'High',
//             finalDecision: 'Approved',
//             planned: true,
//             comments: 'No comments',
//             dateTime: expect.any(Date),
//             affectedGroupList: 'Group A, Group B',
//             jiraLink: 'http://jira.test',
//             requestorName: 'Avital',
//             emailRequestor: 'avital@test.com',
//         }]);
//     });
// });
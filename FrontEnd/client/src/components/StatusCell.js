// import React from 'react';
// import { TableCell, TableRow } from '@mui/material';

// const StatusCell = ({ status, onStatusChange, groupId, rowId }) => {
//     const getStatusBackgroundColor = (status) => {
//         switch (status) {
//             case 'Pending Response':
//                 return '#FFFF99'; // Yellow
//             case 'Not Required':
//                 return '#D3D3D3'; // Grey
//             case 'In Q':
//                 return '#98FB98'; // Green
//             case 'Not in Q':
//                 return '#FF6961'; // Red
//             default:
//                 return 'white';
//         }
//     };

//     return (
//         <TableCell
//             style={{ backgroundColor: getStatusBackgroundColor(status) }}
//             onClick={() => {
//                 console.log(`StatusCell clicked: rowId=${rowId}, groupId=${groupId}`);
//                 onStatusChange && onStatusChange(rowId, groupId);
//             }}
//         >
//             {status}
//         </TableCell>
//     );
// };

// const DataTable = ({ rows, columns, groups, showGroupColumns, getStatusForGroup, handleStatusChange }) => {
//     console.log('Rows:', rows);
//     console.log('Columns:', columns);
//     console.log('Groups:', groups);

//     return (
//         <>
//             {rows.map((row) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.ID}>
//                     {columns.map((column) => (
//                         <TableCell key={column.id}>
//                             {row[column.id]}
//                         </TableCell>
//                     ))}
//                     {showGroupColumns && groups.map((group) => {
//                         const status = getStatusForGroup(row.ID, group.id);
//                         console.log(`Group ${group.id} status for row ${row.ID}: ${status}`);
//                         return (
//                             <StatusCell
//                                 key={group.id}
//                                 status={status}
//                                 onStatusChange={handleStatusChange}
//                                 groupId={group.id}
//                                 rowId={row.ID}
//                             />
//                         );
//                     })}
//                 </TableRow>
//             ))}
//         </>
//     );
// };

// export default DataTable;

// import * as React from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox,
//   ListItemText,
//   Button,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from '@mui/material';
// import { DragDropContext, Droppable, Draggable,DragHandle } from 'react-beautiful-dnd';
// import axios from 'axios';
// import RequestForm from './RequestForm';
// import '../designs/mainTable.css';

// // פונקציה ליצירת נתונים לדוגמה
// function createData(
//   requestorGroup,
//   requestorName,
//   title,
//   planned,
//   description,
//   priority,
//   finalDecision,
//   comments,
//   dateTime,
//   affectedGroupList,
//   jiraLink,
//   emailRequestor
// ) {
//   return {
//     requestorGroup,
//     requestorName,
//     title,
//     planned,
//     description,
//     priority,
//     finalDecision,
//     comments,
//     dateTime,
//     affectedGroupList,
//     jiraLink,
//     emailRequestor,
//   };
// }

// //הגדרות לתפריט הבחירה בפילטר
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// export default function MainTable() {
//   //הגדרות המצב (state) והרשימות של קבוצות ומבקשים מתוך נתוני השורות ההתחלתיים.
//   const [rows, setRows] = React.useState([]);
//   const [open, setOpen] = React.useState(false);
//   const [groups, setGroups] = React.useState([]);
//   const [involvedGroups, setInvolvedGroups] = React.useState([]);
//   const [requestorGroups, setRequestorGroups] = React.useState([]);
//   const [requestorNames, setRequestorNames] = React.useState([]);

//   // הגדרת משתנים לתפריט הבחירה - פילטר
//   const allInvolvedGroups = Array.from(new Set(rows.map(row => row.requestorGroup)));
//   const allRequestorGroups = Array.from(new Set(rows.map(row => row.requestorGroup)));
//   const allRequestorNames = Array.from(new Set(rows.map(row => row.requestorName)));


//   const getAll = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/requests');
//       const data = response.data.map(row =>
//         createData(
//           row.requestorGroup ? row.requestorGroup.join(', ') : '',
//           row.requestorName || '',
//           row.title || 'No Title',
//           row.planned,
//           row.description,
//           row.priority,
//           row.finalDecision ? 'In Q' : 'Not in Q',
//           row.comments,
//           row.dateTime,
//           row.affectedGroupList || [],
//           row.jiraLink,
//           row.emailRequestor
//         )
//       );
//       setRows(data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const getGroups = async () => {
//     try {
//       const response = await axios.get('http://localhost:3001/api/groups');
//       setGroups(response.data);
//     } catch (error) {
//       console.error('Error fetching groups:', error);
//     }
//   };

//   React.useEffect(() => {
//     getAll();
//     getGroups();
//   }, []);

//   const handleOnDragEnd = (result) => {
//     if (!result.destination) return;

//     const updatedRows = Array.from(rows);
//     const [reorderedRow] = updatedRows.splice(result.source.index, 1);
//     updatedRows.splice(result.destination.index, 0, reorderedRow);

//     setRows(updatedRows);
//   };

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleFilterChange = (event, type) => {
//     const { value } = event.target;
//     if (type === 'involvedGroups') {
//       setInvolvedGroups(value);
//     } else if (type === 'requestorGroups') {
//       setRequestorGroups(value);
//     } else if (type === 'requestorNames') {
//       setRequestorNames(value);
//     }
//   };

//   const filteredRows = rows.filter(row => {
//     const matchesInvolvedGroups = involvedGroups.length === 0 || involvedGroups.includes(row.requestorGroup);
//     const matchesRequestorGroups = requestorGroups.length === 0 || requestorGroups.includes(row.requestorGroup);
//     const matchesRequestorNames = requestorNames.length === 0 || requestorNames.includes(row.requestorName);
//     return matchesInvolvedGroups && matchesRequestorGroups && matchesRequestorNames;
//   });

//   const handleAddRequest = async (newRequest) => {
//     try {
//       const response = await axios.post('http://localhost:3001/api/requests/createRequest', newRequest);
//       const savedRequest = response.data;
//       const updatedRows = [...rows, createData(
//         savedRequest.requestorGroup ? savedRequest.requestorGroup.join(', ') : '',
//         savedRequest.requestorName || '',
//         savedRequest.title || 'No Title',
//         savedRequest.planned,
//         savedRequest.description,
//         savedRequest.priority,
//         savedRequest.finalDecision ? 'In Q' : 'Not in Q',
//         savedRequest.comments,
//         savedRequest.dateTime,
//         savedRequest.affectedGroupList || [],
//         savedRequest.jiraLink,
//         savedRequest.emailRequestor
//       )];
//       setRows(updatedRows);
//       handleClose();
//     } catch (error) {
//       console.error('Error saving request:', error);
//     }
//   };

//   const getGroupIds = (groupIds) => {
//     return groupIds.map(groupId => groupId).join(', ');
//   };

//   return (
//     <>
//       <FormControl sx={{ m: 1, width: 300 }}>
//         <InputLabel>Involved Group</InputLabel>
//         <Select
//           multiple
//           value={involvedGroups}
//           onChange={(e) => handleFilterChange(e, 'involvedGroups')}
//           renderValue={(selected) => selected.join(', ')}
//           MenuProps={MenuProps}
//         >
//           {allInvolvedGroups.map((group) => (
//             <MenuItem key={group} value={group}>
//               <Checkbox checked={involvedGroups.indexOf(group) > -1} />
//               <ListItemText primary={group} />
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <FormControl sx={{ m: 1, width: 300 }}>
//         <InputLabel>Requestor Group</InputLabel>
//         <Select
//           multiple
//           value={requestorGroups}
//           onChange={(e) => handleFilterChange(e, 'requestorGroups')}
//           renderValue={(selected) => selected.join(', ')}
//           MenuProps={MenuProps}
//         >
//           {allRequestorGroups.map((group) => (
//             <MenuItem key={group} value={group}>
//               <Checkbox checked={requestorGroups.indexOf(group) > -1} />
//               <ListItemText primary={group} />
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <FormControl sx={{ m: 1, width: 300 }}>
//         <InputLabel>Requestor Name</InputLabel>
//         <Select
//           multiple
//           value={requestorNames}
//           onChange={(e) => handleFilterChange(e, 'requestorNames')}
//           renderValue={(selected) => selected.join(', ')}
//           MenuProps={MenuProps}
//         >
//           {allRequestorNames.map((name) => (
//             <MenuItem key={name} value={name}>
//               <Checkbox checked={requestorNames.indexOf(name) > -1} />
//               <ListItemText primary={name} />
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>

//       <DragDropContext onDragEnd={handleOnDragEnd}>
//         <TableContainer component={Paper}>
//           <Table sx={{ minWidth: 650 }} aria-label="initiatives table">
//             <TableHead>
//               <TableRow>
//                 <TableCell>Requestor Group</TableCell>
//                 <TableCell>Requestor Name</TableCell>
//                 <TableCell>Title</TableCell>
//                 <TableCell>Planned</TableCell>
//                 <TableCell>Description</TableCell>
//                 <TableCell>Priority</TableCell>
//                 <TableCell>Final Decision</TableCell>
//                 <TableCell>Comments</TableCell>
//                 <TableCell>Date Time</TableCell>
//                 <TableCell>Groups</TableCell>
//                 <TableCell>Jira Link</TableCell>
//                 <TableCell>Email Requestor</TableCell>
//               </TableRow>
//             </TableHead>
//             <Droppable droppableId="rows">
//               {(provided) => (
//                 <TableBody
//                   {...provided.droppableProps}
//                   ref={provided.innerRef}
//                 >
//                   {rows.map((row, index) => (
//                     <Draggable key={row.title} draggableId={row.title} index={index}>
//                       {(provided) => (
//                         <StyledTableRow
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//                         >
//                           <TableCell component="th" scope="row">
//                             <DragHandle>{row.requestorGroup}</DragHandle>
//                           </TableCell>
//                           <TableCell>{row.requestorName}</TableCell>
//                           <TableCell>{row.title}</TableCell>
//                           <TableCell>
//                             <Select value={row.planned}>
//                               <MenuItem value="2024 Q1">2024 Q1</MenuItem>
//                               <MenuItem value="2024 Q2">2024 Q2</MenuItem>
//                               <MenuItem value="2024 Q3">2024 Q3</MenuItem>
//                               <MenuItem value="2024 Q4">2024 Q4</MenuItem>
//                             </Select>
//                           </TableCell>
//                           <TableCell>{row.description}</TableCell>
//                           <TableCell>{row.priority}</TableCell>
//                           <TableCell>{row.finalDecision}</TableCell>
//                           <TableCell>{row.comments}</TableCell>
//                           <TableCell>{row.dateTime}</TableCell>
//                           <TableCell>
//                             {getGroupIds(row.affectedGroupList.map(group => group.groupId))}
//                           </TableCell>
//                           <TableCell>{row.jiraLink}</TableCell>
//                           <TableCell>{row.emailRequestor}</TableCell>
//                         </StyledTableRow>
//                       )}
//                     </Draggable>
//                   ))}
//                   {provided.placeholder}
//                 </TableBody>
//               )}
//             </Droppable>
//           </Table>
//         </TableContainer>
//         <Button variant="contained" color="primary" onClick={handleClickOpen}>
//           +
//         </Button>
//         <Dialog open={open} onClose={handleClose}>
//           <DialogTitle>Add New Request</DialogTitle>
//           <DialogContent>
//             <RequestForm onSubmit={handleAddRequest} groups={groups} />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose} color="primary">
//               Cancel
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </DragDropContext></>
//   );
// }


// // import * as React from 'react';
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   FormControl,
// //   InputLabel,
// //   Select,
// //   MenuItem,
// //   Checkbox,
// //   ListItemText,
// //   Button,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// // } from '@mui/material';
// // import {
// //   DragDropContext,
// //   Droppable,
// //   Draggable,
// // } from 'react-beautiful-dnd';
// // import axios from 'axios';
// // import RequestForm from './RequestForm';
// // import '../designs/mainTable.css';

// // function createData(
// //   requestorGroup,
// //   requestorName,
// //   title,
// //   planned,
// //   description,
// //   priority,
// //   finalDecision,
// //   comments,
// //   dateTime,
// //   affectedGroupList,
// //   jiraLink,
// //   emailRequestor
// // ) {
// //   return {
// //     requestorGroup,
// //     requestorName,
// //     title,
// //     planned,
// //     description,
// //     priority,
// //     finalDecision,
// //     comments,
// //     dateTime,
// //     affectedGroupList,
// //     jiraLink,
// //     emailRequestor,
// //   };
// // }

// // const ITEM_HEIGHT = 48;
// // const ITEM_PADDING_TOP = 8;
// // const MenuProps = {
// //   PaperProps: {
// //     style: {
// //       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
// //       width: 250,
// //     },
// //   },
// // };

// // export default function MainTable() {
// //   const [rows, setRows] = React.useState([]);
// //   const [open, setOpen] = React.useState(false);
// //   const [groups, setGroups] = React.useState([]);
// //   const [involvedGroups, setInvolvedGroups] = React.useState([]);
// //   const [requestorGroups, setRequestorGroups] = React.useState([]);
// //   const [requestorNames, setRequestorNames] = React.useState([]);

// //   const allInvolvedGroups = Array.from(new Set(rows.map(row => row.requestorGroup)));
// //   const allRequestorGroups = Array.from(new Set(rows.map(row => row.requestorGroup)));
// //   const allRequestorNames = Array.from(new Set(rows.map(row => row.requestorName)));

// //   const getAll = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:3001/api/requests');
// //       const data = response.data.map(row =>
// //         createData(
// //           row.requestorGroup ? row.requestorGroup.join(', ') : '',
// //           row.requestorName || '',
// //           row.title || 'No Title',
// //           row.planned,
// //           row.description,
// //           row.priority,
// //           row.finalDecision ? 'In Q' : 'Not in Q',
// //           row.comments,
// //           row.dateTime,
// //           row.affectedGroupList || [],
// //           row.jiraLink,
// //           row.emailRequestor
// //         )
// //       );
// //       setRows(data);
// //     } catch (error) {
// //       console.error('Error fetching data:', error);
// //     }
// //   };

// //   const getGroups = async () => {
// //     try {
// //       const response = await axios.get('http://localhost:3001/api/groups');
// //       setGroups(response.data);
// //     } catch (error) {
// //       console.error('Error fetching groups:', error);
// //     }
// //   };

// //   React.useEffect(() => {
// //     getAll();
// //     getGroups();
// //   }, []);

// //   const handleOnDragEnd = (result) => {
// //     if (!result.destination) return;

// //     const updatedRows = Array.from(rows);
// //     const [reorderedRow] = updatedRows.splice(result.source.index, 1);
// //     updatedRows.splice(result.destination.index, 0, reorderedRow);

// //     setRows(updatedRows);
// //   };

// //   const handleClickOpen = () => {
// //     setOpen(true);
// //   };

// //   const handleClose = () => {
// //     setOpen(false);
// //   };

// //   const handleFilterChange = (event, type) => {
// //     const { value } = event.target;
// //     if (type === 'involvedGroups') {
// //       setInvolvedGroups(value);
// //     } else if (type === 'requestorGroups') {
// //       setRequestorGroups(value);
// //     } else if (type === 'requestorNames') {
// //       setRequestorNames(value);
// //     }
// //   };

// //   const filteredRows = rows.filter(row => {
// //     const matchesInvolvedGroups = involvedGroups.length === 0 || involvedGroups.includes(row.requestorGroup);
// //     const matchesRequestorGroups = requestorGroups.length === 0 || requestorGroups.includes(row.requestorGroup);
// //     const matchesRequestorNames = requestorNames.length === 0 || requestorNames.includes(row.requestorName);
// //     return matchesInvolvedGroups && matchesRequestorGroups && matchesRequestorNames;
// //   });

// //   const handleAddRequest = async (newRequest) => {
// //     try {
// //       const response = await axios.post('http://localhost:3001/api/requests/createRequest', newRequest);
// //       const savedRequest = response.data;
// //       const updatedRows = [...rows, createData(
// //         savedRequest.requestorGroup ? savedRequest.requestorGroup.join(', ') : '',
// //         savedRequest.requestorName || '',
// //         savedRequest.title || 'No Title',
// //         savedRequest.planned,
// //         savedRequest.description,
// //         savedRequest.priority,
// //         savedRequest.finalDecision ? 'In Q' : 'Not in Q',
// //         savedRequest.comments,
// //         savedRequest.dateTime,
// //         savedRequest.affectedGroupList || [],
// //         savedRequest.jiraLink,
// //         savedRequest.emailRequestor
// //       )];
// //       setRows(updatedRows);
// //       handleClose();
// //     } catch (error) {
// //       console.error('Error saving request:', error);
// //     }
// //   };

// //   const getGroupIds = (groupIds) => {
// //     return groupIds.map(groupId => groupId).join(', ');
// //   };

// //   return (
// //     <>
// //       <FormControl sx={{ m: 1, width: 300 }}>
// //         <InputLabel>Involved Group</InputLabel>
// //         <Select
// //           multiple
// //           value={involvedGroups}
// //           onChange={(e) => handleFilterChange(e, 'involvedGroups')}
// //           renderValue={(selected) => selected.join(', ')}
// //           MenuProps={MenuProps}
// //         >
// //           {allInvolvedGroups.map((group) => (
// //             <MenuItem key={group} value={group}>
// //               <Checkbox checked={involvedGroups.indexOf(group) > -1} />
// //               <ListItemText primary={group} />
// //             </MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>

// //       <FormControl sx={{ m: 1, width: 300 }}>
// //         <InputLabel>Requestor Group</InputLabel>
// //         <Select
// //           multiple
// //           value={requestorGroups}
// //           onChange={(e) => handleFilterChange(e, 'requestorGroups')}
// //           renderValue={(selected) => selected.join(', ')}
// //           MenuProps={MenuProps}
// //         >
// //           {allRequestorGroups.map((group) => (
// //             <MenuItem key={group} value={group}>
// //               <Checkbox checked={requestorGroups.indexOf(group) > -1} />
// //               <ListItemText primary={group} />
// //             </MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>

// //       <FormControl sx={{ m: 1, width: 300 }}>
// //         <InputLabel>Requestor Name</InputLabel>
// //         <Select
// //           multiple
// //           value={requestorNames}
// //           onChange={(e) => handleFilterChange(e, 'requestorNames')}
// //           renderValue={(selected) => selected.join(', ')}
// //           MenuProps={MenuProps}
// //         >
// //           {allRequestorNames.map((name) => (
// //             <MenuItem key={name} value={name}>
// //               <Checkbox checked={requestorNames.indexOf(name) > -1} />
// //               <ListItemText primary={name} />
// //             </MenuItem>
// //           ))}
// //         </Select>
// //       </FormControl>
// //       <DragDropContext onDragEnd={handleOnDragEnd}>

// //       <TableContainer component={Paper}>
// //     <Table>
// //       <Droppable droppableId="rows">
// //         {(provided) => (
// //           <TableBody
// //             {...provided.droppableProps}
// //             ref={provided.innerRef}
// //           >
// //             {filteredRows.map((row, index) => (
// //               <Draggable key={row.title} draggableId={row.title} index={index}>
// //                 {(provided) => (
// //                   <StyledTableRow
// //                     ref={provided.innerRef}
// //                     {...provided.draggableProps}
// //                     {...provided.dragHandleProps}
// //                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
// //                   >
// //                     <TableCell component="th" scope="row">
// //                       <DragHandle>{row.requestorGroup}</DragHandle>
// //                     </TableCell>
// //                     <TableCell>{row.requestorName}</TableCell>
// //                     <TableCell>{row.title}</TableCell>
// //                     <TableCell>
// //                       <Select value={row.planned}>
// //                         <MenuItem value="2024 Q1">2024 Q1</MenuItem>
// //                         <MenuItem value="2024 Q2">2024 Q2</MenuItem>
// //                         <MenuItem value="2024 Q3">2024 Q3</MenuItem>
// //                         <MenuItem value="2024 Q4">2024 Q4</MenuItem>
// //                       </Select>
// //                     </TableCell>
// //                     <TableCell>{row.description}</TableCell>
// //                     <TableCell>{row.priority}</TableCell>
// //                     <TableCell>{row.finalDecision}</TableCell>
// //                     <TableCell>{row.comments}</TableCell>
// //                     <TableCell>{row.dateTime}</TableCell>
// //                     <TableCell>
// //                       {getGroupIds(row.affectedGroupList.map(group => group.groupId))}
// //                     </TableCell>
// //                     <TableCell>{row.jiraLink}</TableCell>
// //                     <TableCell>{row.emailRequestor}</TableCell>
// //                   </StyledTableRow>
// //                 )}
// //               </Draggable>
// //             ))}
// //             {provided.placeholder}
// //           </TableBody>
// //         )}
// //       </Droppable>
// //     </Table >
// // </TableContainer >
// // <Button variant="contained" color="primary" onClick={handleClickOpen}>
// //   +
// // </Button>
// // <Dialog open={open} onClose={handleClose}>
// //   <DialogTitle>Add New Request</DialogTitle>
// //   <DialogContent>
// //     <RequestForm onSubmit={handleAddRequest} groups={groups} />
// //   </DialogContent>
// //   <DialogActions>
// //     <Button onClick={handleClose} color="primary">
// //       Cancel
// //     </Button>
// //   </DialogActions>
// // </Dialog>
// // </DragDropContext >
// // </>
// // );
// // }


import * as React from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { styled } from '@mui/system';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import RequestForm from './RequestForm';
import '../designs/mainTable.css';


const StyledTableRow = styled(TableRow)({
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
});

const DragHandle = styled('div')({
  cursor: 'move',
});

// פונקציה ליצירת נתונים לדוגמה
function createData(
  requestorGroup,
  requestorName,
  title,
  planned,
  description,
  priority,
  finalDecision,
  comments,
  dateTime,
  affectedGroupList,
  jiraLink,
  emailRequestor
) {
  return {
    requestorGroup,
    requestorName,
    title,
    planned,
    description,
    priority,
    finalDecision,
    comments,
    dateTime,
    affectedGroupList,
    jiraLink,
    emailRequestor,
  };
}

//הגדרות לתפריט הבחירה בפילטר
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MainTable() {
  //הגדרות המצב (state) והרשימות של קבוצות ומבקשים מתוך נתוני השורות ההתחלתיים.
  const [rows, setRows] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [groups, setGroups] = React.useState([]);
  const [involvedGroups, setInvolvedGroups] = React.useState([]);
  const [requestorGroups, setRequestorGroups] = React.useState([]);
  const [requestorNames, setRequestorNames] = React.useState([]);

  // הגדרת משתנים לתפריט הבחירה - פילטר
  const allInvolvedGroups = Array.from(new Set(rows.map(row => row.requestorGroup)));
  const allRequestorGroups = Array.from(new Set(rows.map(row => row.requestorGroup)));
  const allRequestorNames = Array.from(new Set(rows.map(row => row.requestorName)));


  const getAll = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/requests');
      const data = response.data.map(row =>
        createData(
          row.requestorGroup ? row.requestorGroup.join(', ') : '',
          row.requestorName || '',
          row.title || 'No Title',
          row.planned,
          row.description,
          row.priority,
          row.finalDecision ? 'In Q' : 'Not in Q',
          row.comments,
          row.dateTime,
          row.affectedGroupList || [],
          row.jiraLink,
          row.emailRequestor
        )
      );
      setRows(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getGroups = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/groups');
      setGroups(response.data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  React.useEffect(() => {
    getAll();
    getGroups();
  }, []);

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const updatedRows = Array.from(rows);
    const [reorderedRow] = updatedRows.splice(result.source.index, 1);
    updatedRows.splice(result.destination.index, 0, reorderedRow);

    setRows(updatedRows);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFilterChange = (event, type) => {
    const { value } = event.target;
    if (type === 'involvedGroups') {
      setInvolvedGroups(value);
    } else if (type === 'requestorGroups') {
      setRequestorGroups(value);
    } else if (type === 'requestorNames') {
      setRequestorNames(value);
    }
  };

  const filteredRows = rows.filter(row => {
    const matchesInvolvedGroups = involvedGroups.length === 0 || involvedGroups.includes(row.requestorGroup);
    const matchesRequestorGroups = requestorGroups.length === 0 || requestorGroups.includes(row.requestorGroup);
    const matchesRequestorNames = requestorNames.length === 0 || requestorNames.includes(row.requestorName);
    return matchesInvolvedGroups && matchesRequestorGroups && matchesRequestorNames;
  });

  const handleAddRequest = async (newRequest) => {
    try {
      const response = await axios.post('http://localhost:3001/api/requests/createRequest', newRequest);
      const savedRequest = response.data;
      const updatedRows = [...rows, createData(
        savedRequest.requestorGroup ? savedRequest.requestorGroup.join(', ') : '',
        savedRequest.requestorName || '',
        savedRequest.title || 'No Title',
        savedRequest.planned,
        savedRequest.description,
        savedRequest.priority,
        savedRequest.finalDecision ? 'In Q' : 'Not in Q',
        savedRequest.comments,
        savedRequest.dateTime,
        savedRequest.affectedGroupList || [],
        savedRequest.jiraLink,
        savedRequest.emailRequestor
      )];
      setRows(updatedRows);
      handleClose();
    } catch (error) {
      console.error('Error saving request:', error);
    }
  };

  const getGroupIds = (groupIds) => {
    return groupIds.map(groupId => groupId).join(', ');
  };

  return (
    <>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel>Involved Group</InputLabel>
        <Select
          multiple
          value={involvedGroups}
          onChange={(e) => handleFilterChange(e, 'involvedGroups')}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {allInvolvedGroups.map((group) => (
            <MenuItem key={group} value={group}>
              <Checkbox checked={involvedGroups.indexOf(group) > -1} />
              <ListItemText primary={group} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel>Requestor Group</InputLabel>
        <Select
          multiple
          value={requestorGroups}
          onChange={(e) => handleFilterChange(e, 'requestorGroups')}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {allRequestorGroups.map((group) => (
            <MenuItem key={group} value={group}>
              <Checkbox checked={requestorGroups.indexOf(group) > -1} />
              <ListItemText primary={group} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel>Requestor Name</InputLabel>
        <Select
          multiple
          value={requestorNames}
          onChange={(e) => handleFilterChange(e, 'requestorNames')}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {allRequestorNames.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={requestorNames.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="initiatives table">
            <TableHead>
              <TableRow>
                <TableCell>Requestor Group</TableCell>
                <TableCell>Requestor Name</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Planned</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Final Decision</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Date Time</TableCell>
                <TableCell>Groups</TableCell>
                <TableCell>Jira Link</TableCell>
                <TableCell>Email Requestor</TableCell>
              </TableRow>
            </TableHead>
            <Droppable droppableId="rows">
              {(provided) => (
                <TableBody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {rows.map((row, index) => (
                    <Draggable key={row.title} draggableId={row.title} index={index}>
                      {(provided) => (
                        <StyledTableRow
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            <DragHandle>{row.requestorGroup}</DragHandle>
                          </TableCell>
                          <TableCell>{row.requestorName}</TableCell>
                          <TableCell>{row.title}</TableCell>
                          <TableCell>
                            <Select value={row.planned}>
                              <MenuItem value="2024 Q1">2024 Q1</MenuItem>
                              <MenuItem value="2024 Q2">2024 Q2</MenuItem>
                              <MenuItem value="2024 Q3">2024 Q3</MenuItem>
                              <MenuItem value="2024 Q4">2024 Q4</MenuItem>
                            </Select>
                          </TableCell>
                          <TableCell>{row.description}</TableCell>
                          <TableCell>{row.priority}</TableCell>
                          <TableCell>{row.finalDecision}</TableCell>
                          <TableCell>{row.comments}</TableCell>
                          <TableCell>{row.dateTime}</TableCell>
                          <TableCell>
                            {getGroupIds(row.affectedGroupList.map(group => group.groupId))}
                          </TableCell>
                          <TableCell>{row.jiraLink}</TableCell>
                          <TableCell>{row.emailRequestor}</TableCell>
                        </StyledTableRow>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </TableBody>
              )}
            </Droppable>
          </Table>
        </TableContainer>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          +
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add New Request</DialogTitle>
          <DialogContent>
            <RequestForm onSubmit={handleAddRequest} groups={groups} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </DragDropContext></>
  );
}

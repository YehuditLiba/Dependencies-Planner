import { useEffect } from 'react';
import axios from 'axios';

const useFetchData = ({ setRows, setTotalRows, setGroups, setManagers, setStatuses, page, rowsPerPage, selectedGroup, selectedManager, selectedAffectedGroups }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rowsResponse, groupsResponse, managersResponse, statusesResponse] = await Promise.all([
          axios.get('http://localhost:3001/api/requests'),
          axios.get('http://localhost:3001/api/groups'),
          axios.get('http://localhost:3001/api/productManagers'),
          axios.get('http://localhost:3001/api/status')
        ]);

        setRows(rowsResponse.data);
        setTotalRows(rowsResponse.data.length);
        setGroups(groupsResponse.data);
        setManagers(managersResponse.data);
        setStatuses(statusesResponse.data);
      } catch (error) {
        console.error('שגיאה בטעינת הנתונים', error);
      }
    };

    fetchData();
  }, [page, rowsPerPage, selectedGroup, selectedManager, selectedAffectedGroups, setRows, setTotalRows, setGroups, setManagers, setStatuses]);
};

export default useFetchData;

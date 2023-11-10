import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { UserDB } from '../interfaces/user';

const columns: GridColDef[] = [

  { field: 'username', headerName: 'Nombre', width: 130 },
  { field: 'lastName', headerName: 'Apellido', width: 130 },
  { field: 'email', headerName: 'Correo', type: 'string', width: 90 },
  { field: 'organismo', headerName: 'Organismo', sortable: false, width: 160},
  { field: 'role', headerName: 'Roles', type: 'singleSelect', sortable: false, width: 160},
  { field: 'address', headerName: 'Dirección', sortable: false, width: 160},
];



export const  DataTableUser = () => {


    const [users, setusers] = useState<UserDB[]>([])


    useEffect(() => {
      
        const axiosInstance = axios.create({
			baseURL: "http://localhost:3000/api",
		});
        axiosInstance.get<UserDB[]>('v1/auth/get-users').then(resp => {
            const users = resp.data;
            setusers(users);
        })
     
    }, [])
    


  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
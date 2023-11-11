import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import {
  randomCreatedDate,
  randomTraderName,
  randomId,
  randomArrayItem,
} from '@mui/x-data-grid-generator';
import { UserDB } from '../interfaces/user';
import axios from 'axios';
import { AlertDialogSlide } from './AlertDialog';

const roles = ['Market', 'Finance', 'Development'];
const randomRole = () => {
  return randomArrayItem(roles);
};

const initialRows: GridRowsProp = [
  {
    id: randomId(),
    name: randomTraderName(),
    age: 25,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 36,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 19,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 28,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
  {
    id: randomId(),
    name: randomTraderName(),
    age: 23,
    joinDate: randomCreatedDate(),
    role: randomRole(),
  },
];

interface EditToolbarProps {
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [...oldRows, { id, name: '', age: '', isNew: true }]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export const TableUserEditable = () => {
  const [rows, setRows] = React.useState(initialRows);
  const [users, setusers] = React.useState<UserDB[]>([])
  const [openDialog, setopenDialog] = React.useState(false);

const refRowValidModel = React.useRef<GridRowModel | null>(null);



  const handleClosedialog = () => {
    setopenDialog(false);
  }

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    handleEditUser(newRow);
    return updatedRow;
  };

  const handleEditUser = async (newRow: GridRowModel) => {
    const axiosInstance = axios.create({
        baseURL: "http://localhost:3000/api"
    });
    delete newRow.isDeleted;
    delete newRow.isNew;
    const response = await axiosInstance.patch<UserDB>(`v1/auth/${newRow.id}`, {...newRow});
    const usersUpdated = response.data;
    setusers(users.map((user) => (user.id === newRow.id ? usersUpdated : user)));
    setRowModesModel({ ...rowModesModel, [newRow.id]: { mode: GridRowModes.View } });
    return usersUpdated;

  }

  const handleRemoveById = (id: string) => {
    const axiosInstance = axios.create({
        baseURL: "http://localhost:3000/api"
    });
    axiosInstance.delete(`v1/auth/${id}`).then(resp => {
        const userDeleted = resp.data;
        console.log({ userDeleted });
    })

    handleClosedialog();
  }

  React.useEffect(() => {
      
    const axiosInstance = axios.create({
        baseURL: "http://localhost:3000/api",
    });
    axiosInstance.get<UserDB[]>('v1/auth/get-users').then(resp => {
        const users = resp.data;
        setusers(users);
    })
 
}, [])


  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };


  const handleSaveClick = (id: GridRowId) => () => {
    refRowValidModel.current = users.find(user => user.id === id) || null;
    setopenDialog(true);
    // setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    handleRemoveById(id.toString());
    setusers(users.filter((user) => user.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [

    { editable: true, field: 'username', headerName: 'Nombre', width: 130 },
    { editable: true, field: 'lastName', headerName: 'Apellido', width: 130 },
    { editable: true, field: 'email', headerName: 'Correo', type: 'string', width: 90 },
    { editable: true, field: 'organismo', headerName: 'Organismo', sortable: false, width: 160},
    { field: 'role', headerName: 'Roles', type: 'singleSelect', sortable: false, width: 160},
    { editable: true, field: 'address', headerName: 'Dirección', sortable: false, width: 160},
    {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
  
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                sx={{
                  color: 'primary.main',
                }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />,
            ];
          }
  
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ];
        },
      },
  ];

  return (
    <Box
      sx={{
        height: 500,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={users}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { users, setusers },
        }}
      />
      <AlertDialogSlide message = { 'Desea actualizar el usuario' } open = {openDialog} handleClose={handleClosedialog} handleAction={processRowUpdate} row={refRowValidModel.current!}/>
    </Box>
  );
}
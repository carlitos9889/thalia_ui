/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
} from "@mui/x-data-grid";

import { UserDB } from "../interfaces/user";
import axios from "axios";
import { AlertDialogSlide } from "./AlertDialog";
import { CustomizedSnackbars, TYPE_MESSAGES } from "./MessageAlerts";

export const TableUserEditable = () => {
	const [users, setusers] = React.useState<UserDB[]>([]);
	const [openDialog, setopenDialog] = React.useState<boolean>(false);
	const [openDialogDeleted, setopenDialogDeleted] =
		React.useState<boolean>(false);
	const [openSnack, setopenSnack] = React.useState({
		status: TYPE_MESSAGES.NOT_STATUS,
		message: "",
	});

	const refRowValidModel = React.useRef<GridRowModel | null>(null);
	const refRowVaalidId = React.useRef<GridRowId | null>(null);

	const handleCloseDialogDeleted = () => {
		setopenDialogDeleted(false);
	};
	const handleClosedialog = () => {
		setopenDialog(false);
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		const updatedRow = { ...newRow, isNew: false };
		handleEditUser(newRow);
		return updatedRow;
	};

	const getMessages = (message: string) => {
		if (message.startsWith("username")) return "Nombre es requerido";
		if (message.startsWith("lastName")) return "Apellido es requerido";
		if (message.startsWith("password")) return "Contraseña inválida";
		if (message.startsWith("email")) return "Correo Inválido";
		if (message.startsWith("organismo")) return "Organismo es requerido";
		if (message.startsWith("address")) return "Dirección es requerido";
		if (message.startsWith("El Nombre no puede")) return message;
		if (message.startsWith("El Apellido no puede")) return message;
		if (message.startsWith("Key"))
			return message.replace("Key", "").replace("(email)=", "");
		return "Error en el formulario contacte al administrador";
	};

	const handleEditUser = async (newRow: GridRowModel) => {
		const axiosInstance = axios.create({
			baseURL: "http://localhost:3000/api",
		});
		delete newRow.isDeleted;
		delete newRow.isNew;
		try {
			const response = await axiosInstance.patch<UserDB>(
				`v1/auth/${newRow.id}`,
				{ ...newRow }
			);
			const usersUpdated = response.data;
			setusers(
				users.map((user) =>
					user.id === newRow.id ? usersUpdated : user
				)
			);
			setRowModesModel({
				...rowModesModel,
				[newRow.id]: { mode: GridRowModes.View },
			});
			setopenSnack({
				status: TYPE_MESSAGES.SUCCESS,
				message: "Registro actualizado correctamente",
			});
			return usersUpdated;
		} catch (error: any) {
			if (error && error.response && error.response.data) {
				const data = error.response.data;
				const message = Array.isArray(data.message)
					? data.message[0]
					: data.message;
				setopenSnack({
					status: TYPE_MESSAGES.ERROR,
					message: getMessages(message),
				});
			} else {
				setopenSnack({
					status: TYPE_MESSAGES.ERROR,
					message: "Error desconocido hable con el administrador",
				});
			}
		}
	};

	const handleRemoveById = async (id: string) => {
		const axiosInstance = axios.create({
			baseURL: "http://localhost:3000/api",
		});

		try {
			await axiosInstance.delete(`v1/auth/${id}`);
			setusers(users.filter((user) => user.id !== id));
			setopenSnack({
				status: TYPE_MESSAGES.SUCCESS,
				message: "Usuario eliminada con suceso",
			});
		} catch (error: any) {
			if (error && error.response && error.response.data) {
				const data = error.response.data;
				const message = Array.isArray(data.message)
					? data.message[0]
					: data.message;
				setopenSnack({
					status: TYPE_MESSAGES.ERROR,
					message: getMessages(message),
				});
			} else {
				setopenSnack({
					status: TYPE_MESSAGES.ERROR,
					message: "Error desconocido hable con el administrador",
				});
			}
		}
		handleCloseDialogDeleted();
	};

	React.useEffect(() => {
		const axiosInstance = axios.create({
			baseURL: "http://localhost:3000/api",
		});
		axiosInstance.get<UserDB[]>("v1/auth/get-users").then((resp) => {
			const users = resp.data;
			setusers(users);
		});
	}, []);

	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
		{}
	);

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (
		params,
		event
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const handleEditClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.Edit },
		});
	};

	const handleSaveClick = (id: GridRowId) => () => {
		refRowValidModel.current = users.find((user) => user.id === id) || null;
		setopenDialog(true);
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		refRowVaalidId.current = id;
		setopenDialogDeleted(true);
		// setusers(users.filter((user) => user.id !== id));
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});
		// const editedRow = users.find((user) => user.id === id);
		// if (editedRow!.isNew) {
		//   setusers(users.filter((user) => user.id !== id));
		// }
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns: GridColDef[] = [
		{ editable: true, field: "username", headerName: "Nombre", width: 130 },
		{
			editable: true,
			field: "lastName",
			headerName: "Apellido",
			width: 130,
		},
		{
			editable: true,
			field: "email",
			headerName: "Correo",
			type: "string",
			width: 90,
		},
		{
			editable: true,
			field: "organismo",
			headerName: "Organismo",
			sortable: false,
			width: 160,
		},
		{
			field: "role",
			headerName: "Roles",
			type: "singleSelect",
			sortable: false,
			width: 160,
		},
		{
			editable: true,
			field: "address",
			headerName: "Dirección",
			sortable: false,
			width: 160,
		},
		{
			field: "actions",
			type: "actions",
			headerName: "Actions",
			width: 100,
			cellClassName: "actions",
			getActions: ({ id }) => {
				const isInEditMode =
					rowModesModel[id]?.mode === GridRowModes.Edit;

				if (isInEditMode) {
					return [
						<GridActionsCellItem
							icon={<SaveIcon />}
							label="Save"
							sx={{
								color: "primary.main",
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
	const handleClose = (
		_event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") return;
		setopenSnack({ ...openSnack, status: TYPE_MESSAGES.NOT_STATUS });
	};

	return (
		<Box
			sx={{
				height: 500,
				width: "100%",
				"& .actions": {
					color: "text.secondary",
				},
				"& .textPrimary": {
					color: "text.primary",
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
				slotProps={{
					toolbar: { users, setusers },
				}}
			/>
			<AlertDialogSlide
				message={"Desea actualizar el usuario"}
				open={openDialog}
				handleClose={handleClosedialog}
				handleAction={processRowUpdate}
				row={refRowValidModel.current!}
			/>
			<AlertDialogSlide
				message={"Desea Eliminar el usuario"}
				open={openDialogDeleted}
				handleClose={handleCloseDialogDeleted}
				handleDelete={handleRemoveById}
				id={refRowVaalidId.current!}
			/>
			<CustomizedSnackbars
				open={openSnack.status !== TYPE_MESSAGES.NOT_STATUS}
				message={openSnack.message}
				type={openSnack.status}
				closeFunction={handleClose}
			/>
		</Box>
	);
};

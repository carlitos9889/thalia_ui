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

import { AlertDialogSlide } from "./AlertDialog";
import { CustomizedSnackbars, TYPE_MESSAGES } from "./MessageAlerts";
import { axiosInstance } from "../config/axios";
import { FuenteDB } from "../interfaces/fuente.interface";

export const TableFuenteEditable = () => {
	const [fuentes, setfuentes] = React.useState<FuenteDB[]>([]);
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
		if (message.startsWith("title")) return "Título es requerido";
		if (message.startsWith("materia")) return "La materia es requerida";
		if (message.startsWith("organization"))
			return "La organización es requerida";
		if (message.startsWith("organismo")) return "Organismo es requerido";
		if (message.startsWith("url")) return "El url es requerido";
		if (
			message.startsWith("Key") ||
			message.startsWith("Ya existe la llave (title)")
		)
			return message.replace("Key (title)=", "");
		if (message.startsWith("editores")) return "Editor es requerido";
		if (message.startsWith("El nombre del editor no puede conteneter"))
			message;

		return "Error en el formulario contacte al administrador";
	};

	const handleEditUser = async (newRow: GridRowModel) => {
		delete newRow.isDeleted;
		delete newRow.isNew;
		try {
			const { frequency } = newRow;
			const freq = Number(frequency || 0);
			newRow.frequency = freq;
			const response = await axiosInstance.patch<FuenteDB>(
				`v1/fuentes/${newRow.id}`,
				{ ...newRow }
			);
			const fuenteUpdated = response.data;
			setfuentes(
				fuentes.map((fuente) =>
					fuente.id === newRow.id ? fuenteUpdated : fuente
				)
			);
			setRowModesModel({
				...rowModesModel,
				[newRow.id]: { mode: GridRowModes.View },
			});
			setopenSnack({
				status: TYPE_MESSAGES.SUCCESS,
				message: "Fuente actualizada correctamente",
			});
			return fuenteUpdated;
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
		try {
			await axiosInstance.delete(`v1/fuentes/${id}`);
			setfuentes(fuentes.filter((fuente) => fuente.id !== id));
			setopenSnack({
				status: TYPE_MESSAGES.SUCCESS,
				message: "Fuente eliminada con suceso",
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
		axiosInstance
			.get<FuenteDB[]>("v1/fuentes/get-all-fuentes")
			.then((resp) => {
				const fuentes = resp.data;
				setfuentes(fuentes);
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
		refRowValidModel.current =
			fuentes.find((fuente) => fuente.id === id) || null;
		setopenDialog(true);
	};

	const handleDeleteClick = (id: GridRowId) => () => {
		refRowVaalidId.current = id;
		setopenDialogDeleted(true);
	};

	const handleCancelClick = (id: GridRowId) => () => {
		setRowModesModel({
			...rowModesModel,
			[id]: { mode: GridRowModes.View, ignoreModifications: true },
		});
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns: GridColDef[] = [
		{
			editable: true,
			field: "title",
			headerName: "Título",
			sortable: false,
			width: 120,
		},
		{
			editable: true,
			field: "ejesTematicos",
			headerName: "Ejes Temáticos",
			type: "string",
			width: 160,
		},
		{
			editable: true,
			field: "materia",
			headerName: "Tipo de Fuente",
			sortable: false,
			width: 160,
		},
		{
			editable: true,
			field: "editores",
			headerName: "Editores",
			width: 130,
		},
		{
			editable: true,
			field: "frequency",
			headerName: "Frecuencia",
			width: 90,
		},
		{
			editable: true,
			field: "isOpen",
			headerName: "Abierta",
			type: "string",
			width: 90,
		},

		{
			editable: true,
			field: "organization",
			headerName: "Organización",
			type: "singleSelect",
			sortable: false,
			width: 100,
		},
		{
			editable: true,
			field: "url",
			headerName: "Url",
			sortable: false,
			width: 100,
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
				rows={fuentes}
				columns={columns}
				editMode="row"
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				slotProps={{
					toolbar: { fuentes, setfuentes },
				}}
			/>
			<AlertDialogSlide
				message={"Desea actualizar la fuente"}
				open={openDialog}
				handleClose={handleClosedialog}
				handleAction={processRowUpdate}
				row={refRowValidModel.current!}
			/>
			<AlertDialogSlide
				message={"Desea Eliminar la fuente"}
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

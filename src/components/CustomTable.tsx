import * as React from "react";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
	GridRowsProp,
	GridRowModesModel,
	GridRowModes,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridEventListener,
	GridRowId,
	GridRowModel,
	GridRowEditStopReasons,
	GridToolbar,
} from "@mui/x-data-grid";
import { randomId, useDemoData } from "@mui/x-data-grid-generator";
import { AlertDialogSlideMap } from "./DialogMap";
import { AlertDialogSlide } from "./CustomDialog";

const ROWS: GridRowsProp = Array.from({ length: 100 }, () => {
	const id = randomId();
	return {
		id: id,
		autor: "Autor" + "-" + id,
		titulo: "Titulo" + "-" + id,
		fecha: Date.now().toLocaleString(),
		editorial: "Editorial" + "-" + id,
		materia: "Materia" + "-" + id,
		organizacion: "Organizacion" + "-" + id,
		lugardeOrganizacion: "LugarOrganizacion" + "-" + id,
	};
});

export default function FullFeaturedCrudGrid() {
	const [rows, setRows] = React.useState(ROWS);
	const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>(
		{}
	);

	const [open, setopen] = React.useState(false);
	const [openEdit, setOpenEdit] = React.useState(false);
	const idSelected = React.useRef<GridRowId>();
	const idSelecteMap = React.useRef<GridRowId>();
	const handleClose = () => {
		setopen(false);
	};

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (
		params,
		event
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	// const handleEditClick = (id: GridRowId) => () => {
	// 	idSelected.current = id;
	// 	setRowModesModel({
	// 		...rowModesModel,
	// 		[id]: { mode: GridRowModes.Edit },
	// 	});
	// };

	const handleOpenDialog = (id: GridRowId) => () => {
		idSelected.current = id;
		setopen(true);
	};

	const handleOpenMap = (id: GridRowId) => {
		idSelecteMap.current = id;
		setOpenEdit(true);
	};

	const handleDelete = () => {
		setRows(rows.filter((row) => row.id !== idSelected.current));
	};

	const handleEdit = (lat: number, lng: number) => {
		const index = rows.findIndex((e) => e.id == idSelecteMap.current);
		rows[index].lugardeOrganizacion = `${lat} + - + ${lng}`;
	};

	const processRowUpdate = (newRow: GridRowModel) => {
		const updatedRow = { ...newRow, isNew: false };
		setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
		return updatedRow;
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setRowModesModel(newRowModesModel);
	};

	const columns: GridColDef[] = [
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
					setOpenEdit(true);
					return [];
				}

				return [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						className="textPrimary"
						onClick={() => handleOpenMap(id)}
						color="inherit"
					/>,
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={handleOpenDialog(id)}
						color="inherit"
					/>,
				];
			},
		},
		{ field: "autor", headerName: "Autor", minWidth: 150, editable: true },
		{
			field: "titulo",
			headerName: "Título",
			minWidth: 150,
			editable: true,
		},
		{ field: "fecha", headerName: "Fecha", minWidth: 150, editable: true },
		{
			field: "editorial",
			headerName: "Editorial",
			minWidth: 150,
			editable: true,
		},
		{
			field: "materia",
			headerName: "Materia",
			minWidth: 150,
			editable: true,
		},
		{
			field: "organizacion",
			headerName: "Organización",
			minWidth: 180,
			editable: true,
		},
		{
			field: "lugardeOrganizacion",
			headerName: "Lugar de Organización",
			minWidth: 180,
			editable: true,
		},
	];

	const { data, loading } = useDemoData({
		dataSet: "Commodity",
		rowLength: 4,
		maxColumns: 6,
	});

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
				{...data}
				loading={loading}
				rows={rows}
				columns={columns}
				editMode="row"
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowUpdate}
				slots={{
					toolbar: GridToolbar,
				}}
				slotProps={{
					toolbar: { setRows, setRowModesModel },
				}}
			/>
			<AlertDialogSlide
				title="Desea borrar el elemento?"
				description={`Desea borrar el autor ${
					rows[Number(idSelected.current) || 0].autor
				}`}
				open={open}
				close={handleClose}
				accept={handleDelete}
			/>
			<AlertDialogSlideMap
				description=""
				title="Mapa"
				accept={(lat, lng) => {
					handleEdit(lat, lng);

					setOpenEdit(false);
				}}
				open={openEdit}
				close={() => {
					setOpenEdit(false);
				}}
			/>
		</Box>
	);
}

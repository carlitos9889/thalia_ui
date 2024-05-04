import Box from "@mui/material/Box";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import {
	GridRowModes,
	DataGrid,
	GridColDef,
	GridActionsCellItem,
	GridToolbar,
} from "@mui/x-data-grid";
import SnackCustom from "./SnackCustom";
import useFuentes from "../hooks/useFuentes";

export default function FullFeaturedCrudGrid() {
	const {
		fuenteModels,
		rows,
		handleRowEditStop,
		handleRowModesModelChange,
		processRowmodefuentes,
		resetFuenteModel,
		rowModesModel,
		setrows,
		setrowmodesmodel,
		deleteFuenteById,
	} = useFuentes();

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
					// setOpenEdit(true);
					return [];
				}

				return [
					<GridActionsCellItem
						icon={<DeleteIcon />}
						label="Delete"
						onClick={() => {
							deleteFuenteById(id as string);
						}}
						color="inherit"
					/>,
				];
			},
		},
		{
			field: "title",
			headerName: "Título",
			minWidth: 180,
			editable: true,
		},
		{
			field: "editores",
			headerName: "Editores",
			minWidth: 150,
			editable: true,
		},
		{
			field: "frequency",
			headerName: "Frequencia",
			minWidth: 150,
			editable: true,
		},
		{
			field: "isOpen",
			headerName: "Abierta",
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
			field: "organization",
			headerName: "Organización",
			minWidth: 180,
			editable: true,
		},

		{
			field: "url",
			headerName: "Url",
			minWidth: 180,
			editable: true,
		},
		{
			field: "ejesTematicos",
			headerName: "Eje Temático",
			minWidth: 180,
			editable: true,
		},
		{
			field: "is_monitoring",
			headerName: "Monitoreando",
			minWidth: 180,
			editable: true,
		},
	];

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
				onProcessRowUpdateError={console.log}
				rows={rows}
				columns={columns}
				editMode="row"
				rowModesModel={rowModesModel}
				onRowModesModelChange={handleRowModesModelChange}
				onRowEditStop={handleRowEditStop}
				processRowUpdate={processRowmodefuentes}
				slots={{
					toolbar: GridToolbar,
				}}
				slotProps={{
					toolbar: {
						setRows: setrows,
						setRowModesModel: setrowmodesmodel,
					},
				}}
			/>
			<SnackCustom
				message={"Fuente Actualizada correctamente"}
				hasError={false}
				open={fuenteModels.success}
				handleClose={resetFuenteModel}
			/>
			<SnackCustom
				message={"Error al actualizar la tabla de fuentes"}
				hasError={true}
				open={fuenteModels.error}
				handleClose={resetFuenteModel}
			/>
		</Box>
	);
}

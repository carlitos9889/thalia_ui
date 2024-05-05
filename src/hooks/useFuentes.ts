import {
	GridEventListener,
	GridRowEditStopReasons,
	GridRowModel,
	GridRowModesModel,
} from "@mui/x-data-grid";
import React from "react";
import { AxiosConfig } from "../config/axios";
import { FuenteDB } from "../interfaces/fuente.interface";

const useFuentes = () => {
	const [rows, setrows] = React.useState<FuenteDB[]>([]);
	const [rowModesModel, setrowmodesmodel] = React.useState<GridRowModesModel>(
		{}
	);

	const [fuenteModels, setFuenteModels] = React.useState({
		success: false,
		error: false,
	});
	const [openDialogDelete, setopenDialogDelete] =
		React.useState<boolean>(false);
	const currentId = React.useRef({
		id: "",
		title: "",
	});

	const handleChangeDialogDelete = (value: boolean) => {
		setopenDialogDelete(value);
	};
	const acceptDialog = () => {
		const id = currentId.current.id;
		deleteFuenteById(id);
		handleChangeDialogDelete(false);
	};

	const handleSucces = () => {
		setFuenteModels((prev) => ({
			...prev,
			success: true,
		}));
	};
	const handleError = () => {
		setFuenteModels((prev) => ({
			...prev,
			error: true,
		}));
	};

	const resetFuenteModel = () => {
		setFuenteModels((prev) => ({
			...prev,
			success: false,
			error: false,
		}));
	};

	const handleRowEditStop: GridEventListener<"rowEditStop"> = (
		params,
		event
	) => {
		if (params.reason === GridRowEditStopReasons.rowFocusOut) {
			event.defaultMuiPrevented = true;
		}
	};

	const processRowmodefuentes = async (newRow: GridRowModel) => {
		const fuente = newRow as FuenteDB;

		try {
			await AxiosConfig.updateFuenteById(newRow.id, {
				...fuente,
				frequency: Number(fuente.frequency),
			});
			handleSucces();
		} catch (error) {
			handleError();
		}
		getallFuentes();
	};

	const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
		setrowmodesmodel(newRowModesModel);
	};
	const getallFuentes = async () => {
		const fuentes = await AxiosConfig.getAllFuentes();
		setrows(fuentes);
	};

	const deleteFuenteById = async (id: string) => {
		try {
			await AxiosConfig.deleteFuenteById(id);
			handleSucces();
		} catch (error) {
			handleError();
		}
		getallFuentes();
	};

	React.useEffect(() => {
		getallFuentes();
	}, []);

	return {
		rows,
		rowModesModel,
		fuenteModels,
		resetFuenteModel,
		handleRowEditStop,
		processRowmodefuentes,
		handleRowModesModelChange,
		setrows,
		setrowmodesmodel,
		deleteFuenteById,
		openDialogDelete,
		currentId,
		handleChangeDialogDelete,
		acceptDialog,
	};
};

export default useFuentes;

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
// import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	Avatar,
	Checkbox,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	Stack,
} from "@mui/material";
// import { CustomizedSnackbars, TYPE_MESSAGES } from "../components/MessageAlerts";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { axiosInstance } from "../config/axios";
import { useState } from "react";
import {
	CustomizedSnackbars,
	TYPE_MESSAGES,
} from "../components/MessageAlerts";
import { TIPOS_FUENTES } from "../constants/tiposFuentes";
import { EJES_TEMATICOS } from "../constants/ejesTematicos";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const RegisterFuente = () => {
	// const [personName, setPersonName] = React.useState<string[]>(["Usuario"]);
	// const [loginStatus, setloginStatus] = React.useState({
	// 	status: TYPE_MESSAGES.NOT_STATUS,
	// 	message: ''
	// });
	const [check, setcheck] = useState(true);
	const [tipofuente, settipofuente] = useState<string>(TIPOS_FUENTES[0]);
	const [ejesTematicos, setejesTematicos] = useState<string>(
		EJES_TEMATICOS[0]
	);
	const [statusCreate, setstatusCreate] = useState({
		status: TYPE_MESSAGES.NOT_STATUS,
		message: "",
	});

	// // const navigate = useNavigate();
	// const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
	// 	if (reason === 'clickaway') return;

	// 	setloginStatus({...loginStatus, status: TYPE_MESSAGES.NOT_STATUS})
	// };

	const getMessages = (message: string) => {
		if (message.startsWith("title")) return "Título es requerido";
		if (message.startsWith("materia")) return "La materia es requerida";
		if (message.startsWith("organization"))
			return "La organización es requerida";
		if (message.startsWith("organismo")) return "Organismo es requerido";
		if (message.startsWith("url")) return "El url es requerido";
		if (message.startsWith("Key"))
			return message.replace("Key (title)=", "");
		if (message.startsWith("editores")) return "Editor es requerido";
		return "Error en el formulario contacte al administrador";
	};
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		try {
			await axiosInstance.post("/v1/fuentes/create-fuente", {
				title: data.get("title"),
				organization: data.get("organization"),
				frequency: Number(data.get("frequency") || 0),
				isOpen: check,
				ejesTematicos: ejesTematicos,
				editores: data.get("editores"),
				materia: tipofuente,
				url: data.get("url"),
			});

			setstatusCreate({
				status: TYPE_MESSAGES.SUCCESS,
				message: "Fuente agregada correctamente",
			});
		} catch (error: any) {
			if (error && error.response && error.response.data) {
				const data = error.response.data;
				const message = Array.isArray(data.message)
					? data.message[0]
					: data.message;
				setstatusCreate({
					status: TYPE_MESSAGES.ERROR,
					message: getMessages(message),
				});
			} else {
				setstatusCreate({
					status: TYPE_MESSAGES.ERROR,
					message: "Error desconocido hable con el administrador",
				});
			}
		}
	};

	React.useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			window.location.href = "/";
		}
	});

	function handleClose(
		_event?: Event | React.SyntheticEvent<Element, Event> | undefined,
		reason?: string | undefined
	): void {
		if (reason === "clickaway") return;

		setstatusCreate({ ...statusCreate, status: TYPE_MESSAGES.NOT_STATUS });
	}

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						// marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Registro de Fuentes
					</Typography>
					<Box
						component="form"
						noValidate
						onSubmit={handleSubmit}
						sx={{ mt: 3 }}
					>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									autoComplete="given-name"
									name="title"
									required
									fullWidth
									id="title"
									label="Título"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									defaultValue={"1"}
									id="frequency"
									label="Frecuencia"
									type="number"
									name="frequency"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									name="editores"
									label="Editor"
									id="editores"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									name="organization"
									label="Organización"
									id="organization"
								/>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel id="demo-simple-select-label">
										Tipo de Fuente
									</InputLabel>
									<Select
										labelId="materia"
										id="materia"
										value={tipofuente}
										label="Tipo de Fuente"
										onChange={(val) => {
											settipofuente(
												val.target.value.toString()
											);
										}}
									>
										{TIPOS_FUENTES.map((tipo) => (
											<MenuItem key={tipo} value={tipo}>
												{tipo}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<FormControl fullWidth>
									<InputLabel id="ejesTematicos">
										Ejes Temáticos
									</InputLabel>
									<Select
										labelId="ejesTematicos"
										id="ejesTematicos"
										value={ejesTematicos}
										label="Ejes Temáticos"
										onChange={(val) => {
											setejesTematicos(
												val.target.value.toString()
											);
										}}
									>
										{EJES_TEMATICOS.map((tipo) => (
											<MenuItem key={tipo} value={tipo}>
												{tipo}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>

							<Grid item xs={12}>
								<TextField
									fullWidth
									required
									name="url"
									label="Url"
									id="url"
								/>
							</Grid>
						</Grid>
						<FormControlLabel
							onChange={(va: any) => {
								setcheck(va.target.checked);
							}}
							control={<Checkbox value={check} />}
							label="Está abierta la fuente?"
						/>
						<Stack
							spacing={{ xs: 1, sm: 2 }}
							direction="row"
							sx={{ marginTop: "30px" }}
						>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Registrar Fuente
							</Button>
						</Stack>
						<CustomizedSnackbars
							open={
								statusCreate.status !== TYPE_MESSAGES.NOT_STATUS
							}
							message={statusCreate.message}
							type={statusCreate.status}
							closeFunction={handleClose}
						/>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
};

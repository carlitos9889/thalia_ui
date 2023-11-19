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
import MultipleSelectChip from "../components/CustomSelect";
import { axiosInstance } from "../config/axios";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
} from "@mui/material";
import {
	CustomizedSnackbars,
	TYPE_MESSAGES,
} from "../components/MessageAlerts";
import { MUNICIPIOS_BY_PROVINCIAS, PROVINCIAS } from "../constants/provincias";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
	const [personName, setPersonName] = React.useState<string[]>(["Usuario"]);
	const [provincia, setprovincia] = React.useState<string>("La Habana");
	const [municipioSelected, setmunicipioSelected] = React.useState("");
	const [municipiosByProvincia, setMunicipiosByProvincia] = React.useState(
		MUNICIPIOS_BY_PROVINCIAS["La Habana"]
	);

	const [loginStatus, setloginStatus] = React.useState({
		status: TYPE_MESSAGES.NOT_STATUS,
		message: "",
	});

	React.useEffect(() => {
		const municipios = (MUNICIPIOS_BY_PROVINCIAS as any)[provincia];
		setMunicipiosByProvincia(municipios);
		setmunicipioSelected(municipios[0]);
	}, [provincia]);

	// const navigate = useNavigate();
	const handleClose = (
		_event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === "clickaway") return;

		setloginStatus({ ...loginStatus, status: TYPE_MESSAGES.NOT_STATUS });
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
		if (message.startsWith("Key") || message.startsWith("Ya existe"))
			return message.replace("Key", "").replace("(email)=", "");
		return "Error en el formulario contacte al administrador";
	};
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);

		try {
			axiosInstance.defaults.headers.post[
				"Authorization"
			] = `Bearer ${localStorage.getItem("token")}`;
			await axiosInstance.post("/v1/auth/register", {
				email: data.get("email"),
				password: data.get("password"),
				lastName: data.get("lastName"),
				username: data.get("firstName"),
				organismo: data.get("organismo"),
				address:
					`${provincia}, ${municipioSelected} ` + data.get("address"),
				role: personName,
			});

			setloginStatus({
				status: TYPE_MESSAGES.SUCCESS,
				message: "Registro agregado correctamente",
			});
		} catch (error: any) {
			if (error && error.response && error.response.data) {
				const data = error.response.data;
				const message = Array.isArray(data.message)
					? data.message[0]
					: data.message;
				setloginStatus({
					status: TYPE_MESSAGES.ERROR,
					message: getMessages(message),
				});
			} else {
				setloginStatus({
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

	return (
		<ThemeProvider theme={defaultTheme}>
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					{/* <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar> */}
					<Typography component="h1" variant="h5">
						Registro de Usuarios
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
									name="firstName"
									required
									fullWidth
									id="firstName"
									label="First Name"
									autoFocus
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									id="lastName"
									label="Last Name"
									name="lastName"
									autoComplete="family-name"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id="email"
									label="Email Address"
									name="email"
									autoComplete="email"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="new-password"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									required
									fullWidth
									name="organismo"
									label="Organismo"
									id="organismo"
									autoComplete="organismo"
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel id="provincia">
										Provincias
									</InputLabel>
									<Select
										labelId="provincia"
										id="provincia"
										value={provincia}
										label="Provincia"
										onChange={(val) => {
											setprovincia(val.target.value);
										}}
									>
										{PROVINCIAS.map((provincia) => (
											<MenuItem
												key={provincia}
												value={provincia}
											>
												{provincia}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth>
									<InputLabel id="municipio">
										Municipios
									</InputLabel>
									<Select
										labelId="municipio"
										id="municipio"
										value={municipioSelected}
										label="municipio"
										onChange={(val) => {
											setmunicipioSelected(
												val.target.value
											);
										}}
									>
										{municipiosByProvincia.map(
											(municipio) => (
												<MenuItem
													key={municipio}
													value={municipio}
												>
													{municipio}
												</MenuItem>
											)
										)}
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									required
									name="address"
									label="Dirección"
									id="address"
									autoComplete="address"
								/>
							</Grid>
							<Grid item xs={12}>
								<MultipleSelectChip
									personName={personName}
									setPersonName={setPersonName}
								/>
							</Grid>
						</Grid>
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
								Registrar Usuario
							</Button>
						</Stack>
						<CustomizedSnackbars
							open={
								loginStatus.status !== TYPE_MESSAGES.NOT_STATUS
							}
							message={loginStatus.message}
							type={loginStatus.status}
							closeFunction={handleClose}
						/>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

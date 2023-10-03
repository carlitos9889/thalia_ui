import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MultipleSelectChip from "../components/CustomSelect";
import { axiosInstance } from "../config/axios";
import { LOGIN_STATUS } from "./SingIn";
import { Snackbar, Alert, Stack } from "@mui/material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {
	const [personName, setPersonName] = React.useState<string[]>(["user"]);
	const [loginStatus, setloginStatus] = React.useState<LOGIN_STATUS>(
		LOGIN_STATUS.INITIAL
	);

	const [statusCode, setStatusCode] = React.useState<number>(0);
	const navigate = useNavigate();
	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log({
			email: data.get("email"),
			password: data.get("password"),
			lastName: data.get("lastName"),
			firstName: data.get("firstName"),
			organismo: data.get("organismo"),
			address: data.get("address"),
			roles: personName,
		});

		try {
			axiosInstance.defaults.headers.post[
				"Authorization"
			] = `Bearer ${localStorage.getItem("token")}`;
			const response = await axiosInstance.post("/v1/auth/register", {
				email: data.get("email"),
				password: data.get("password"),
				lastName: data.get("lastName"),
				username: data.get("firstName"),
				organismo: data.get("organismo"),
				address: data.get("address"),
				role: personName,
			});
			setStatusCode(response.status);
			console.log({ statusCode: response.status });
			if (response.data.token) {
				localStorage.setItem("token", response.data.token);
				setloginStatus(LOGIN_STATUS.SUCCESS);
				navigate("/main", {
					replace: true,
					state: {
						token: response.data.token,
						user: response.data.user,
					},
				});
			}
		} catch (error: any) {
			setStatusCode(error.response.status);
			setloginStatus(LOGIN_STATUS.FAILURE);
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
						marginTop: 8,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
					}}
				>
					<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Sign up
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
							<Grid item xs={12}>
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
							<Grid item xs={12}>
								<TextField
									fullWidth
									name="organismo"
									label="Organismo"
									id="organismo"
									autoComplete="organismo"
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
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
								Sign Up
							</Button>
							<Button
								onClick={() => {
									navigate("/main");
								}}
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								go pagina principal
							</Button>
						</Stack>
						<Snackbar
							open={loginStatus == LOGIN_STATUS.FAILURE}
							autoHideDuration={6000}
							onClose={() => setloginStatus(LOGIN_STATUS.INITIAL)}
						>
							<Alert
								onClose={() =>
									setloginStatus(LOGIN_STATUS.INITIAL)
								}
								severity="error"
								sx={{ width: "100%" }}
							>
								{statusCode == 403 &&
									"You do not have permission, please contact the administrator"}
								{statusCode !== 403 &&
									"Formulario iconrrecto, por favor verifique los datos"}
							</Alert>
						</Snackbar>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

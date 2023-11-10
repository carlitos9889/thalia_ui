import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

// eslint-disable-next-line react-refresh/only-export-components
export enum LOGIN_STATUS {
	INITIAL = "INITIAL",
	LOADING = "LOADING",
	SUCCESS = "SUCCESS",
	FAILURE = "FAILURE",
}

export default function SignIn() {
	const [loginStatus, setloginStatus] = React.useState<LOGIN_STATUS>(
		LOGIN_STATUS.INITIAL
	);

	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		console.log({
			email: data.get("email"),
			password: data.get("password"),
		});

		const axiosInstance = axios.create({
			baseURL: "http://localhost:3000/api",
		});

		try {
			const response = await axiosInstance.post("/v1/auth/login", {
				email: data.get("email"),
				password: data.get("password"),
			});
			localStorage.setItem("token", response.data.token);
			setloginStatus(LOGIN_STATUS.SUCCESS);
			navigate("/main", {
				replace: true,
				state: { token: response.data.token, user: response.data.user },
			});
		} catch (error) {
			setloginStatus(LOGIN_STATUS.FAILURE);
		}
	};

	React.useEffect(() => {
		localStorage.getItem("token") && navigate("/main", { replace: true });
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
						Sign in
					</Typography>
					<Box
						component="form"
						onSubmit={handleSubmit}
						noValidate
						sx={{ mt: 1 }}
					>
						<TextField
							margin="normal"
							required
							fullWidth
							id="email"
							label="Email Address"
							name="email"
							autoComplete="email"
							autoFocus
						/>
						<TextField
							margin="normal"
							required
							fullWidth
							name="password"
							label="Password"
							type="password"
							id="password"
							autoComplete="current-password"
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
						>
							Sign In
						</Button>
						<Snackbar
							open={loginStatus === LOGIN_STATUS.SUCCESS}
							autoHideDuration={6000}
							onClose={() => setloginStatus(LOGIN_STATUS.INITIAL)}
						>
							<Alert
								onClose={() =>
									setloginStatus(LOGIN_STATUS.INITIAL)
								}
								severity="success"
								sx={{ width: "100%" }}
							>
								Login success
							</Alert>
						</Snackbar>
						<Snackbar
							open={loginStatus === LOGIN_STATUS.FAILURE}
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
								Credenciales Incorrectos!
							</Alert>
						</Snackbar>
					</Box>
				</Box>
			</Container>
		</ThemeProvider>
	);
}

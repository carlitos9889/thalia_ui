/* eslint-disable @typescript-eslint/no-explicit-any */
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CreateIcon from "@mui/icons-material/Create";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import { useEffect, useState } from "react";
import SignUp from "../pages/SingUp";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RegisterFuente } from "../pages/RegisterFuente";
import { TableUserEditable } from "./CustomTableUserEditable";
import { TableFuenteEditable } from "./CustomTableFuenteEditable";
import { DraggableDialog } from "./EstadisticaDialog";
import { UserDB } from "../interfaces/user";
import { axiosInstance } from "../config/axios";
import JustGraficas from "../pages/JustGraficas";

const drawerWidth = 240;

enum MENU {
	REGISTER_USER,
	REGISTER_FUENTE,
	TABLE_USER,
	TABLE_FUENTE,
}

export const CustomDrawerPermanent = () => {
	const [showItem, setshowItem] = useState<MENU>(MENU.TABLE_USER);
	const [openEstadistica, setopenEstadistica] = useState<boolean>(false);
	const [user, setuser] = useState<UserDB>();
	const navigate = useNavigate();

	const handleGetUserByToken = async (token: string) => {
		try {
			const response = await axiosInstance.get<UserDB>(
				"/v1/auth/get-user-by-token",
				{
					headers: {
						token,
					},
				}
			);
			setuser(response.data);
			console.log({ user: response.data });
			return response.data;
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		console.log({ token });
		if (!token) return;
		handleGetUserByToken(token);
	}, []);

	if (user && user.role[0] === "Admin") {
		return (
			<Box sx={{ display: "flex" }}>
				<CssBaseline />
				<AppBar
					position="fixed"
					sx={{
						width: `calc(100% - ${drawerWidth}px)`,
						mr: `${drawerWidth}px`,
					}}
				>
					<Toolbar>
						<IconButton
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
						>
							{/* <MenuIcon /> */}
						</IconButton>
						<Typography
							variant="h6"
							component="div"
							sx={{ flexGrow: 1 }}
						>
							Panel Administrativo
						</Typography>
						<Button
							color="inherit"
							onClick={() => {
								setopenEstadistica(true);
							}}
						>
							Recoger Estadisticas
						</Button>
						<Button
							color="inherit"
							onClick={() => {
								// localStorage.removeItem("token");
								navigate("/", { replace: true });
							}}
						>
							Gráficas
						</Button>
						<Button
							color="inherit"
							onClick={() => {
								localStorage.removeItem("token");
								navigate("/", { replace: true });
							}}
						>
							Logout
						</Button>
					</Toolbar>
				</AppBar>
				<Box
					component="main"
					sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
				>
					<Toolbar />
					{["Admin"].includes((user && user.role[0]) || "no admin") &&
						showItem === MENU.TABLE_USER && <TableUserEditable />}
					{["Admin", "Informador"].includes(
						(user && user.role[0]) || "no admin"
					) &&
						showItem === MENU.TABLE_FUENTE && (
							<TableFuenteEditable />
						)}
					{["Admin"].includes((user && user.role[0]) || "no admin") &&
						showItem === MENU.REGISTER_USER && <SignUp />}
					{["Admin", "Informador"].includes(
						(user && user.role[0]) || "no admin"
					) &&
						showItem === MENU.REGISTER_FUENTE && <RegisterFuente />}
				</Box>
				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						"& .MuiDrawer-paper": {
							width: drawerWidth,
							boxSizing: "border-box",
						},
					}}
					variant="permanent"
					anchor="right"
				>
					<Toolbar />
					<Divider />
					<List>
						{["Tabla de Usuarios", "Tabla de Fuentes"].map(
							(text, index) => (
								<ListItem key={text} disablePadding>
									<ListItemButton
										onClick={() => {
											if (text.endsWith("Usuarios")) {
												setshowItem(MENU.TABLE_USER);
											} else {
												setshowItem(MENU.TABLE_FUENTE);
											}
										}}
									>
										<ListItemIcon>
											{index % 2 === 0 ? (
												<SupervisedUserCircleIcon />
											) : (
												<SmartButtonIcon />
											)}
										</ListItemIcon>
										<ListItemText primary={text} />
									</ListItemButton>
								</ListItem>
							)
						)}
					</List>
					<Divider />
					<List>
						{["Registro de Usuario", "Registro de Fuentes"].map(
							(text, index) => (
								<ListItem key={text} disablePadding>
									<ListItemButton
										onClick={() => {
											if (text.endsWith("Usuario")) {
												setshowItem(MENU.REGISTER_USER);
											} else {
												setshowItem(
													MENU.REGISTER_FUENTE
												);
											}
										}}
									>
										<ListItemIcon>
											{index % 2 === 0 ? (
												<CreateIcon />
											) : (
												<CreateNewFolderIcon />
											)}
										</ListItemIcon>
										<ListItemText primary={text} />
									</ListItemButton>
								</ListItem>
							)
						)}
					</List>
					<DraggableDialog
						open={openEstadistica}
						handleClose={() => setopenEstadistica(false)}
					/>
				</Drawer>
			</Box>
		);
	}

	return <JustGraficas />;
};

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Albun = () => {
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			window.location.href = "/";
		}
	});

	const navigate = useNavigate();

	return (
		<Stack
			spacing={{ xs: 1, sm: 2 }}
			direction="row"
			useFlexGap
			flexWrap="wrap"
		>
			<Button
				onClick={() => {
					localStorage.removeItem("token");
					// window.location.href = "/";
					navigate("/", { replace: true });
				}}
				variant="contained"
			>
				Logout
			</Button>
			<Button
				onClick={() => {
					// window.location.href = "/";
					navigate("/register");
				}}
				variant="contained"
			>
				Registar usuario
			</Button>
		</Stack>
	);
};

export default Albun;

import { Alert, Snackbar } from "@mui/material";
import { FC } from "react";

interface Props {
	message: string;
	hasError: boolean;
	open: boolean;
	handleClose: () => void;
}

const SnackCustom: FC<Props> = ({
	message,
	hasError = false,
	open,
	handleClose,
}): JSX.Element => {
	return (
		<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
			<Alert
				onClose={handleClose}
				severity={hasError ? "error" : "success"}
				variant="filled"
				sx={{ width: "100%" }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default SnackCustom;

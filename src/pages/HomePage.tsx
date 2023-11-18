import { useEffect } from "react";
import { CustomDrawerPermanent } from "../components/CustomDrawer";

const Albun = () => {
	useEffect(() => {
		const token = localStorage.getItem("token");
		console.log({ token });
		if (!token) {
			window.location.href = "/";
		}
	});

	return <CustomDrawerPermanent />;
};

export default Albun;

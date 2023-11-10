import { useEffect } from "react";
import { CustomDrawerPermanent } from "../components/CustomDrawer";

const Albun = () => {
	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			window.location.href = "/";
		}
	});


	return (
		<CustomDrawerPermanent/>
	);
};

export default Albun;

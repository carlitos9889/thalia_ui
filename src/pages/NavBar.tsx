import { Outlet, useLocation } from "react-router-dom";

const NavBar = () => {
	const { state } = useLocation();
	console.log({ state });
	return (
		<>
			<Outlet />
		</>
	);
};

export default NavBar;

import { Route, Routes } from "react-router-dom";
import NavBar from "../pages/NavBar";
import SignIn from "../pages/SingIn";
// import SignUp from "../pages/SingUp";
import Album from "../pages/Albun";

const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<NavBar />}>
				{/* <Route index element={<HomePage />} /> */}
				<Route index element={<SignIn />} />
				{/* <Route path="register" element={<SignUp />} /> */}
				<Route path="main" element={<Album />} />
			</Route>
		</Routes>
	);
};

export default AppRouter;

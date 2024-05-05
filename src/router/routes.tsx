import { Route, Routes } from "react-router-dom";
import NavBar from "../pages/NavBar";
import SignIn from "../pages/SingIn";
// import SignUp from "../pages/SingUp";
import Album from "../pages/HomePage";

const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={<NavBar />}>
				{/* <Route index element={<HomePage />} /> */}
				<Route index element={<SignIn />} />
				{/* <Route path="register" element={<SignUp />} /> */}
			</Route>
			<Route path="/main" element={<Album />} />
		</Routes>
	);
};

export default AppRouter;

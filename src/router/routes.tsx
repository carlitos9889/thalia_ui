import { createBrowserRouter } from "react-router-dom";
import SignIn from "../pages/SingIn";
import SignUp from "../pages/SingUp";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <SignUp />,
	},
	{
		path: "/sign-in",
		element: <SignIn />,
	},
]);

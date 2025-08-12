import { ToastContainer as LibraryToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./styles.module.css";

const ToastContainer = (): React.JSX.Element => {
	return (
		<LibraryToastContainer
			autoClose={3000}
			closeOnClick
			draggable
			hideProgressBar={false}
			limit={3}
			newestOnTop={false}
			pauseOnFocusLoss
			pauseOnHover
			position="top-right"
			rtl={false}
			theme="light"
			transition={Slide}
		/>
	);
};

export { ToastContainer };

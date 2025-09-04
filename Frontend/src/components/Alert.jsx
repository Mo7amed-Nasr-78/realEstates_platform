import { toast } from "react-toastify";

function Alert(type, message) {
	return toast[type](message, {
		autoClose: 3000,
		pauseOnHover: false,
		closeOnClick: true,
		className:
			"font-Plus-Jakarta-Sans font-light text-sm capitalize",
	});
}

export default Alert;

import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export const toastSuccess = (message: string) => {
  // Show success toast
  toast.success(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });

};

export const toastError = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    style: {
      backgroundColor: "red",
      color: "white",
    },
  });
};
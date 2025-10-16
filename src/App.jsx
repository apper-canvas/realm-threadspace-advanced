import { ToastContainer } from "react-toastify";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
        toastClassName="font-inter"
      />
    </>
  );
}

export default App;
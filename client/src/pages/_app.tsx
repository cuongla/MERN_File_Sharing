import axios from "axios";
import "tailwindcss/tailwind.css";
import "../../styles/globals.css";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_API;

function MyApp({ Component, pageProps }) {
  return (
    <div className="h-screen font-serif bg-gray-900 text-white grid place-items-center">
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp;

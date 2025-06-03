import "@/styles/globals.css";
import axios from "axios";

// Axios ayarını global yap
axios.defaults.baseURL = "https://retropol.onrender.com";
axios.defaults.withCredentials = true;

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

import "@/styles/globals.css";
import axios from "axios";

// Axios ayarını global yap
axios.defaults.baseURL = "https://retropol.onrender.com";
axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

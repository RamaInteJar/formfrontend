import { devBaseUrl, prodBaseUrl } from "@/config/apiConfig";
import axios from "axios";

export const axisoInstance = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? devBaseUrl : prodBaseUrl,
});

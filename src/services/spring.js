import axios from "axios";

const spring = axios.create({
  baseURL: "/spring",
});

spring.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default spring;

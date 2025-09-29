import axios from "axios";

async function authUser(setUser) {
  console.log("Authenticating user...");
  const axiosInstance = axios.create({
    baseURL: "http://localhost:3002/api",
    withCredentials: true,
  });

  const user = await axiosInstance.get("/authAdmin");
  setUser(user);
  return user;
}

export default authUser;

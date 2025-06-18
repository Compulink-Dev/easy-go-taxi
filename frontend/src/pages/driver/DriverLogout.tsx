import React from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export const DriveLogout = () => {
  const token = localStorage.getItem("captain-token");
  const navigate = useNavigate();

  axios
    .get(`${import.meta.env.VITE_API_URL}/drivers/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("driver-token");
        navigate("/driver-login");
      }
    });

  return <div>DriveLogout</div>;
};

export default DriveLogout;

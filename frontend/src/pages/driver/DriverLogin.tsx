import React, { useState } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import axios from "axios";
import { DriverDataContext } from "../../context/DriverContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";

const DriverLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setDriver } = React.useContext(DriverDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const driver = {
      email: email,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/drivers/login`,
      driver
    );

    if (response.status === 200) {
      const data = response.data;

      setDriver(data.driver);
      localStorage.setItem("token", data.token);
      navigate("/driver-home");
    }

    setEmail("");
    setPassword("");
  };
  return (
    <div className="h-screen flex flex-col justify-between">
      <div>
        <Title />
        <form
          className="space-y-6 mt-8"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <div className="">
            <Label className="">What's your email</Label>
            <Input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className=""
              type="email"
              placeholder="email@example.com"
            />
          </div>

          <div className="">
            <Label className="">Enter Password</Label>
            <Input
              className=""
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              type="password"
              placeholder="password"
            />
          </div>

          <Button className="mb-6">Login</Button>
        </form>
        <p className="text-center">
          Join a fleet?{" "}
          <Link to="/driver-signup" className="text-blue-600">
            Register as a Driver
          </Link>
        </p>
      </div>
      <div>
        <Button onClick={() => navigate("/login")} className="">
          Sign in as User
        </Button>
      </div>
    </div>
  );
};

export default DriverLogin;

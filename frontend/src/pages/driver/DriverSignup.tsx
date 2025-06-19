import React, { useState } from "react";
import { Link } from "react-router";
import { DriverDataContext } from "../../context/DriverContext";
import { useNavigate } from "react-router";
import axios from "axios";
import Title from "@/components/Title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DriverSignup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { setDriver } = React.useContext(DriverDataContext);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const driverData = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    console.log("Sending:", driverData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/drivers/register`,
        driverData
      );

      if (response.status === 201) {
        const data = response.data;
        setDriver(data.driver);
        localStorage.setItem("token", data.token);
        navigate("/driver-home");
      }
    } catch (error: any) {
      console.error("Registration error:", error.response?.data);
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setVehicleColor("");
    setVehiclePlate("");
    setVehicleCapacity("");
    setVehicleType("");
  };
  return (
    <div className="h-screen flex flex-col justify-between">
      <div>
        <Title />
        <form
          className="space-y-6 mt-12"
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <div className="">
            <Label className="">What's our Driver's name</Label>
            <div className="flex gap-4 mb-7">
              <Input
                required
                className=""
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
              />
              <Input
                required
                className=""
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="">
            <Label className="">What's our Driver's email</Label>
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

          <div className="">
            <Label className="">Vehicle Information</Label>
            <div className="flex gap-4 mb-7">
              <Input
                required
                className=""
                type="text"
                placeholder="Vehicle Color"
                value={vehicleColor}
                onChange={(e) => {
                  setVehicleColor(e.target.value);
                }}
              />
              <Input
                required
                className=""
                type="text"
                placeholder="Vehicle Plate"
                value={vehiclePlate}
                onChange={(e) => {
                  setVehiclePlate(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex gap-4 mb-7">
            <Input
              required
              className=""
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value);
              }}
            />
            <select
              required
              className=""
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value);
              }}
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

          <Button className="mb-6">Create Driver Account</Button>
        </form>
        <p className="text-center">
          Already have a account?{" "}
          <Link to="/driver-login" className="">
            Login here
          </Link>
        </p>
      </div>
      <div>
        <p className="text-[10px] mt-6 leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy Policy</span> and{" "}
          <span className="underline">Terms of Service apply</span>.
        </p>
      </div>
    </div>
  );
};

export default DriverSignup;

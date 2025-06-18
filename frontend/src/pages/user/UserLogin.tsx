import { useState, useContext } from "react";
import { Link } from "react-router";
import { UserDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router";
import axios from "axios";
import Title from "../../components/Title";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState({});

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e: any) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
      userData
    );

    if (response.status === 200) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div className="h-screen flex flex-col justify-between">
      <div>
        <Title />

        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
          className="space-y-4 mt-8"
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

          <Button className="button">Login</Button>
        </form>
        <p className="text-center mt-8">
          New here?{" "}
          <Link to="/signup" className="">
            Create new Account
          </Link>
        </p>
      </div>
      <div>
        <Button className="button">
          <Link to="/driver-login" className="text-black!">
            Sign in as Driver
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default UserLogin;

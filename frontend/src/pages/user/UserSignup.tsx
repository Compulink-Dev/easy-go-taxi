import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { UserDataContext } from "../../context/UserContext";
import Title from "../../components/Title";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UserSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  const submitHandler = async (e: any) => {
    e.preventDefault();
    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
      newUser
    );

    if (response.status === 201) {
      const data = response.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      navigate("/home");
    }

    setEmail("");
    setFirstName("");
    setLastName("");
    setPassword("");
  };
  return (
    <div>
      <div className="h-screen flex flex-col justify-between">
        <div>
          <Title />

          <form
            className="space-y-5 mt-12"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="">
              <Label className="">What's your name</Label>
              <div className="flex gap-4">
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

            <Button className="my-5">Create account</Button>
          </form>
          <p className="text-center">
            Already have a account?{"  "}
            <Link to="/login" className="">
              Login here
            </Link>
          </p>
        </div>
        <div>
          <p className="text-[10px] leading-tight">
            This site is protected by reCAPTCHA and the{" "}
            <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;

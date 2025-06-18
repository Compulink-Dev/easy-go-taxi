import { Route, Routes } from "react-router";
import Landing from "./pages/Landing";
import UserLogin from "./pages/user/UserLogin";
import UserSignup from "./pages/user/UserSignup";
import Driverlogin from "./pages/driver/DriverLogin";
import DriverSignup from "./pages/driver/DriverSignup";
import Home from "./pages/Home";
import UserProtectWrapper from "./pages/user/UserProtectWrapper";
import UserLogout from "./pages/user/UserLogout";
import DriverHome from "./pages/driver/DriverHome";
import DriverProtectWrapper from "./pages/driver/DriverProtectWrapper";
import DriverLogout from "./pages/driver/DriverLogout";
import Riding from "./pages/Riding";
import "remixicon/fonts/remixicon.css";
import DriverRiding from "./pages/driver/DrivierRiding";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/riding" element={<Riding />} />
        <Route path="/driver-riding" element={<DriverRiding />} />

        <Route path="/signup" element={<UserSignup />} />
        <Route path="/driver-login" element={<Driverlogin />} />
        <Route path="/driver-signup" element={<DriverSignup />} />
        <Route
          path="/home"
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/user/logout"
          element={
            <UserProtectWrapper>
              <UserLogout />
            </UserProtectWrapper>
          }
        />
        <Route
          path="/driver-home"
          element={
            <DriverProtectWrapper>
              <DriverHome />
            </DriverProtectWrapper>
          }
        />
        <Route
          path="/driver/logout"
          element={
            <DriverProtectWrapper>
              <DriverLogout />
            </DriverProtectWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default App;

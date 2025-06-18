import React, { createContext, useState } from "react";

type FullName = {
  firstName: string;
  lastName: string;
};

type User = {
  email: string;
  fullName: FullName;
};

type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const defaultValue: UserContextType = {
  user: {
    email: "",
    fullName: {
      firstName: "",
      lastName: "",
    },
  },
  setUser: () => {},
};

export const UserDataContext = createContext<UserContextType>(defaultValue);

const UserContext = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(defaultValue.user);

  return (
    <UserDataContext.Provider value={{ user, setUser }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;

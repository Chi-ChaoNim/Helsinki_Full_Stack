import { createContext, useState, useEffect } from "react";
import blogServices from "./services/blogServices";

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    return loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
  });

  useEffect(() => {
    if (user) {
      blogServices.setToken(user.token);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;

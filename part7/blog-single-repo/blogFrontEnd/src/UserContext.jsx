import { createContext, useState, useEffect } from "react";
import blogServices from "./services/blogServices";
import userServices from "./services/persistentUser";

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, setUser] = useState(() => {
    const loggedUserJSON = userServices.getUser("loggedBlogappUser");
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

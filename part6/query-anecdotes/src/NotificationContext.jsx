import { createContext, useState } from "react";

const NotificationContext = createContext();

export default NotificationContext;

export const NotificationContextProvider = (props) => {
  const [message, setMessage] = useState(null);
  return (
    <NotificationContext.Provider value={{ message, setMessage }}>
      {props.children}
    </NotificationContext.Provider>
  );
};

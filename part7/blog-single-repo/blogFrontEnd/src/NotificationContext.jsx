import { createContext, useReducer, useEffect } from "react";

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const notifiReducer = (notification, action) => {
    switch (action.type) {
      case "success": {
        return { text: action.text, type: action.type };
      }
      case "error": {
        return {
          text: `${action.text}: ${action.error}`,
          type: action.type,
        };
      }
      case "reset": {
        return null;
      }
    }
  };
  const [notification, dispatch] = useReducer(notifiReducer, null);

  const notifiPositive = (text) => {
    dispatch({
      type: "success",
      text,
    });
  };

  const notifiNegative = (text, error) => {
    dispatch({
      type: "error",
      text,
      error,
    });
  };

  const notifiReset = () => {
    dispatch({
      type: "reset",
    });
  };

  useEffect(() => {
    setTimeout(() => notifiReset(), 5000);
  }, [notification]);

  return (
    <NotificationContext.Provider
      value={{ notification, notifiPositive, notifiNegative, notifiReset }}
    >
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

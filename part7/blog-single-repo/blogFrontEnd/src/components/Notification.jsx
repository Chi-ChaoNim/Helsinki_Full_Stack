import "../../index.css";
import { Alert } from "@mui/material";

import { useContext } from "react";
import NotificationContext from "../NotificationContext";

const Notification = () => {
  const { notification } = useContext(NotificationContext);
  if (notification === null) {
    return null;
  } else {
    return (
      <Alert
        style={{ marginTop: 10, marginBottom: 10 }}
        severity={notification.type}
      >
        {notification.text}
      </Alert>
    );
  }
};

export default Notification;

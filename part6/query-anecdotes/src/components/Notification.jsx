import { useNotification } from "../hooks/querys";

const Notification = () => {
  const { message } = useNotification();
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  if (!message) return null;

  return <div style={style}>{message}</div>;
};

export default Notification;

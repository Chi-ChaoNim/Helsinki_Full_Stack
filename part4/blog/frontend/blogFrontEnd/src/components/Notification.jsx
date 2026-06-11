import "../../index.css";

const Notification = ({ message, notificationSuccess }) => {
  if (message === null) {
    return null;
  } else {
    return (
      <div
        className={`${notificationSuccess === true ? "pNotification" : "nNotification"}`}
      >
        {message}
      </div>
    );
  }
};

export default Notification;

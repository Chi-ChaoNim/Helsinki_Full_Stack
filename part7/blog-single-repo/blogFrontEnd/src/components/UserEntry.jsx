import { useParams } from "react-router-dom";
import { List, ListItem } from "@mui/material";

const UserEntry = ({ users }) => {
  const id = useParams().id;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return <h2>404: Page not found</h2>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h4>Added blogs:</h4>
      <List>
        {user.blogs.map((b) => (
          <ListItem key={b.id}>{b.title}</ListItem>
        ))}
      </List>
    </div>
  );
};
//done
export default UserEntry;

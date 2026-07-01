import { useParams } from "react-router-dom";

const UserEntry = ({ users }) => {
  const id = useParams().id;
  const user = users.find((u) => u.id === id);
  console.log("🚀 ~ UserEntry ~ user:", user);

  if (!user) {
    return <h2>404: Page not found</h2>;
  }

  console.log("🚀 ~ UserEntry ~ user.blog:", user.blogs);
  return (
    <div>
      <h2>{user.name}</h2>
      <h4>Added blogs:</h4>
      {user.blogs.map((b) => (
        <li key={b.id}>{b.title}</li>
      ))}
    </div>
  );
};

export default UserEntry;

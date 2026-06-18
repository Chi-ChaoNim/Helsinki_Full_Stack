import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";

const Home = ({ blogsList }) => {
  const sortedBlogsList = [...blogsList].sort((a, b) => b.likes - a.likes);
  return (
    <div>
      <h3>Blogs</h3>
      <List sx={{ background: "lightblue" }}>
        {blogsList.length > 0
          ? sortedBlogsList.map((blog) => {
              return (
                <ListItem key={blog.id}>
                  <Link to={`/blogs/${blog.id}`}>
                    <ListItemText>
                      {blog.title} by {blog.author}
                    </ListItemText>
                  </Link>
                </ListItem>
              );
            })
          : "None available"}
      </List>
    </div>
  );
};

export default Home;

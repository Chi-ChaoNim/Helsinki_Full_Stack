import { Link } from "react-router-dom";
const Home = ({ blogsList }) => {
  const sortedBlogsList = [...blogsList].sort((a, b) => b.likes - a.likes);
  return (
    <div>
      <h1>Blogs</h1>
      <ul>
        {blogsList.length > 0
          ? sortedBlogsList.map((blog) => {
              return (
                <li key={blog.id}>
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} by {blog.author}
                  </Link>
                </li>
              );
            })
          : "None available"}
      </ul>
    </div>
  );
};

export default Home;

const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post(
  "/",
  middleware.getTokenFrom,
  middleware.getUserFromToken,
  async (request, response) => {
    const body = request.body;
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: request.user._id,
    });

    const savedBlog = await blog.save();

    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
  },
);

blogsRouter.delete(
  "/:id",
  middleware.getTokenFrom,
  middleware.getUserFromToken,
  async (request, response) => {
    const blogToCompare = await Blog.findById(request.params.id);

    if (blogToCompare.user.toString() === request.user._id.toString()) {
      await Blog.findByIdAndDelete(request.params.id);
      response.status(204).end();
    } else {
      response
        .status(401)
        .json({ error: "Unauthorized attempt to delete blog" });
    }
  },
);

blogsRouter.put(
  "/:id",
  middleware.getTokenFrom,
  middleware.getUserFromToken,
  async (request, response) => {
    const { title, author, url, likes } = request.body;

    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      response.status(404).end();
    } else if (blog.user.toString() === request.user._id.toString()) {
      blog.title = title;
      blog.author = author;
      blog.url = url;
      blog.likes = likes;

      const updatedBlog = await blog.save();
      response.status(201).json(updatedBlog);
    } else {
      response
        .status(401)
        .json({ error: "Unauthorized attempt to modify blog" });
    }
  },
);

module.exports = blogsRouter;

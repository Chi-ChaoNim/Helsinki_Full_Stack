const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { content: 1 });
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
    const returningBlog = await savedBlog.populate("user", {
      username: 1,
      name: 1,
    });

    request.user.blogs = request.user.blogs.concat(savedBlog._id);
    await request.user.save();

    response.status(201).json(returningBlog);
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

    const blog = await Blog.findById(request.params.id).populate("user", {
      username: 1,
      name: 1,
    });

    if (!blog) {
      response.status(404).end();
    } else {
      blog.title = title;
      blog.author = author;
      blog.url = url;
      blog.likes = likes;

      const updatedBlog = await blog.save();
      response.status(201).json(updatedBlog);
    }
  },
);

blogsRouter.put("/:id/comments", async (request, response) => {
  const { content } = request.body;

  if (!content || typeof content !== "string") {
    return response.status(400).json({ error: "Comment content is required" });
  }

  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).end();
  }

  const comment = new Comment({
    content,
    blog: blog._id,
  });

  const savedComment = await comment.save();
  blog.comments = blog.comments.concat(savedComment._id);
  await blog.save();

  const populatedBlog = await Blog.findById(blog._id)
    .populate("user", { username: 1, name: 1 })
    .populate("comments", { content: 1 });

  response.status(201).json(populatedBlog);
});

module.exports = blogsRouter;

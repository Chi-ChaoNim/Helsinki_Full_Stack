const blogsRouter = require("express").Router();
const note = require("../../../../testing_grounds/tests_backend/models/note");
const { request } = require("../app");
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blog = await Blog.findById(request.params.id);

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
});

module.exports = blogsRouter;

const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    id: 1,
    title: "7 Tips You Need to Know Before Opening Your Speakeasy",
    author: "Rina Yimo",
    url: "https://api.coolapp.org/contact",
    likes: 6,
  },
  {
    id: 2,
    title: "20 Free Things You Must Do in Kansas City This Year",
    author: "Nkosinathi Bertrando",
    url: "https://www.mywebsite.dev/contact",
    likes: 23,
  },
  {
    id: 3,
    title: "Why Everyone Is Talking About These 30-Minute Recipes",
    author: "Donnchad Neso",
    url: "http://app.mywebsite.net/products",
    likes: 1,
  },
  {
    id: 4,
    title: "Why Everyone's Gas Prices Are Different",
    author: "Cy Radha",
    url: "https://api.mywebsite.io/home",
    likes: 98,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "will remove this soon" });
  await blog.save();
  await blog.deleteOne();

  return blog.id.toString();
};

const blogsInDB = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDB,
  usersInDb,
};

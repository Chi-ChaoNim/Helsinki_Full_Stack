const blog = require("../models/blog");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let sumLikes = 0;
  if (blogs.length === 0) {
    return 0;
  } else {
    blogs.map((blog) => {
      sumLikes += blog.likes;
    });
    return sumLikes;
  }
};

const favoriteBlog = (blogs) => {
  let maxLike = -Infinity;
  let blogIndex = -1;
  if (blogs.length === 0) {
    return "No blogs found";
  } else {
    blogs.map((blog, index) => {
      if (blog.likes > maxLike) {
        maxLike = blog.likes;
        blogIndex = index;
      }
    });
  }
  return blogs[blogIndex];
};

const mostBlogs = (blogs) => {
  const seenAuthors = {};
  if (blogs.length > 0) {
    blogs.map((blog) => {
      let author = blog.author;
      if (author in seenAuthors) {
        seenAuthors[author] += 1;
      } else {
        seenAuthors[author] = 1;
      }
    });
    let maxBlog = 0;
    let maxAuthor = "";
    for (const author in seenAuthors) {
      if (seenAuthors[author] > maxBlog) {
        maxBlog = seenAuthors[author];
        maxAuthor = author;
      }
    }
    return {
      author: maxAuthor,
      blogs: maxBlog,
    };
  } else {
    return "No blogs found";
  }
};

const mostLikes = (blogs) => {
  const seenAuthors = {};
  if (blogs.length === 0) {
    return "No blogs found";
  } else {
    blogs.map((blog) => {
      let author = blog.author;
      if (author in seenAuthors) {
        seenAuthors[author] += blog.likes;
      } else {
        seenAuthors[author] = blog.likes;
      }
    });
    let maxLikes = 0;
    let maxAuthor = "";
    for (const author in seenAuthors) {
      if (seenAuthors[author] > maxLikes) {
        maxLikes = seenAuthors[author];
        maxAuthor = author;
      }
    }
    return {
      author: maxAuthor,
      likes: maxLikes,
    };
  }
};
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };

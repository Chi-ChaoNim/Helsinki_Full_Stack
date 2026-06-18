import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogEntry from "./BlogEntry";
import { beforeEach, describe, expect } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";

const blogs = [
  {
    title: "94 Tips You Need to Know Before Opening Your Cat Cafe",
    author: "Rina Yimo",
    url: "https://api.coolapp.org/contact/missingno",
    likes: 59,
    user: {
      username: "Windflint",
      name: "CupChunGae",
      id: "6a291ada88216a6ba6447910",
    },
    id: "6a2924d0a92ff744b63651d9",
  },
];

const windUser = {
  username: "Windflint",
  name: "CupChunGae",
  id: "6a291ada88216a6ba6447910",
};

const megaloUser = {
  username: "Megalobucc",
  name: "Magicaw",
  id: "6a292c77995db904df8e9efc",
};

const nullUser = null;

const mockLikes = vi.fn();
const mockDelete = vi.fn();

describe("<BlogEntry />", () => {
  describe("while unauthenticated", () => {
    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={[`/blogs/${blogs[0].id}`]}>
          <Routes>
            <Route
              path="/blogs/:id"
              element={
                <BlogEntry
                  user={nullUser}
                  blogs={blogs}
                  handleLikes={mockLikes}
                  handleDelete={mockDelete}
                />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    test("blog information and likes are displayed, buttons are not", () => {
      expect(screen.queryByText(blogs[0].title)).toBeVisible();
      expect(screen.queryByText(blogs[0].author)).toBeVisible();
      expect(screen.queryByText(blogs[0].url)).toBeVisible();
      expect(screen.queryByText(`Likes: ${blogs[0].likes}`)).toBeVisible();
      expect(screen.queryByRole("button", { name: "Like" })).toBeNull();
      expect(screen.queryByRole("button", { name: "Delete" })).toBeNull();
    });
  });

  describe("while authenticated", () => {
    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={[`/blogs/${blogs[0].id}`]}>
          <Routes>
            <Route
              path="/blogs/:id"
              element={
                <BlogEntry
                  user={megaloUser}
                  blogs={blogs}
                  handleLikes={mockLikes}
                  handleDelete={mockDelete}
                />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
    });
    test("only the like button can be seen", () => {
      expect(screen.getByRole("button", { name: "Like" })).toBeVisible();
      expect(screen.queryByRole("button", { name: "Delete" })).toBeNull();
    });

    test("Clicking the like button twice calls the function twice", async () => {
      const user = userEvent.setup();
      const likeButton = screen.queryByText("Like");
      await user.click(likeButton);
      await user.click(likeButton);

      expect(mockLikes.mock.calls).toHaveLength(2);
    });
  });

  describe("while authenticated and owner", () => {
    beforeEach(() => {
      render(
        <MemoryRouter initialEntries={[`/blogs/${blogs[0].id}`]}>
          <Routes>
            <Route
              path="/blogs/:id"
              element={
                <BlogEntry
                  user={windUser}
                  blogs={blogs}
                  handleLikes={mockLikes}
                  handleDelete={mockDelete}
                />
              }
            />
          </Routes>
        </MemoryRouter>,
      );
    });

    test("the like and delete button can be seen", () => {
      expect(screen.getByRole("button", { name: "Like" })).toBeVisible();
      expect(screen.getByRole("button", { name: "Delete" })).toBeVisible();
    });
  });

  // test("blog title and author are auto rendered but not URL or likes", () => {
  //   expect(screen.getByText(blog.title)).toBeVisible();
  //   expect(screen.getByText(blog.author)).toBeVisible();
  //   expect(screen.queryByText(blog.url)).toBeNull();
  //   expect(screen.queryByText(`Likes: ${blog.likes}`)).toBeNull();
  // });

  // test("blog url and likes are shown after show details button is clicked", async () => {
  //   const user = userEvent.setup();
  //   const button = screen.getByText("View");
  //   await user.click(button);

  //   expect(await screen.findByText(blog.url)).toBeVisible();
  //   expect(screen.queryByText(`Likes: ${blog.likes}`)).toBeVisible();
  // });
});

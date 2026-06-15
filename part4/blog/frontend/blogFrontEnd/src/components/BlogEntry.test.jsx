import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogEntry from "./BlogEntry";
import { beforeEach, describe } from "vitest";

const blog = {
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
};

const mockHandler = vi.fn();

describe("<BlogEntry />", () => {
  beforeEach(() => {
    render(<BlogEntry blog={blog} handleLikes={mockHandler} />);
    console.log("Starting test");
  });

  test("blog title and author are auto rendered but not URL or likes", () => {
    expect(screen.getByText(blog.title)).toBeVisible();
    expect(screen.getByText(blog.author)).toBeVisible();
    expect(screen.queryByText(blog.url)).toBeNull();
    expect(screen.queryByText(`Likes: ${blog.likes}`)).toBeNull();
  });

  test("blog url and likes are shown after show details button is clicked", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("View");
    await user.click(button);

    expect(await screen.findByText(blog.url)).toBeVisible();
    expect(screen.queryByText(`Likes: ${blog.likes}`)).toBeVisible();
  });

  test("Clicking the like button twice calls the function twice", async () => {
    const user = userEvent.setup();
    const detailsButton = screen.getByText("View");

    await user.click(detailsButton);

    const likeButton = screen.queryByText("Like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});

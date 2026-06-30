import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";
import { beforeEach, describe } from "vitest";

const mockhandler = vi.fn();

describe("<BlogForm />", () => {
  beforeEach(() => {
    render(<BlogForm blogCreation={mockhandler} />);
  });

  test("Checking if the inputted prop values are held within the mockhandler", async () => {
    const user = userEvent.setup();
    const titleInput = screen.getByLabelText("Title:");
    const authorInput = screen.getByLabelText("Author:");
    const urlInput = screen.getByLabelText("Link:");
    const likesInput = screen.getByLabelText("Likes:");

    const submitButton = screen.getByText("Submit");

    await user.type(titleInput, "New Title 1");
    await user.type(authorInput, "New Author 2");
    await user.type(urlInput, "http://somerandomlink.co.uk");
    await user.type(likesInput, "8");
    await user.click(submitButton);

    expect(mockhandler.mock.calls[0][0]).toMatchObject({
      title: "New Title 1",
      author: "New Author 2",
      url: "http://somerandomlink.co.uk",
      likes: 8,
    });
  });
});

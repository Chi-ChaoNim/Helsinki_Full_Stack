const { test, expect, beforeEach, describe } = require("@playwright/test");

const loginWith = async (page, username, password) => {
  //await page.getByRole("button", { name: "login" }).click();
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, link, likes) => {
  await page.getByRole("link", { name: "New blog" }).click({ force: true });
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Author").fill(author);
  await page.getByRole("textbox", { name: "Link" }).fill(link, { force: true });
  await page.getByLabel("Likes").fill(likes, { force: true });
  await page.getByRole("button", { name: "Submit" }).click({ force: true });
  await expect(page.getByRole("heading", { name: "Blogs" })).toBeVisible();
};

export { loginWith, createBlog };

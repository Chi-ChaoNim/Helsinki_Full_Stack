const loginWith = async (page, username, password) => {
  //await page.getByRole("button", { name: "login" }).click();
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, title, author, link, likes) => {
  await page.getByRole("button", { name: "New blog" }).click();
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Author").fill(author);
  await page.getByLabel("Link").fill(link);
  await page.getByLabel("Likes").fill(likes);
  await page.getByRole("button", { name: "Submit" }).click();
};

export { loginWith, createBlog };

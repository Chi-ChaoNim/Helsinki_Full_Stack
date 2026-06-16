const loginWith = async (page, username, password) => {
  await page.getByRole("button", { name: "login" }).click();
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createNote = async (page, content) => {
  await page.getByRole("button", { name: "New note" }).click();
  await page.getByRole("textbox").fill(content);
  await page.getByRole("button", { name: "save" }).click();
  await page.getByText(content).waitFor();
};

export { loginWith, createNote };

const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");
const { assert } = require("node:console");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        name: "CupChunGae",
        username: "Windflint",
        password: "hardchosenseren",
      },
    });
    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Username:")).toBeVisible();
    await expect(page.getByText("Password:")).toBeVisible();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "Windflint", "hardchosenseren");
      await expect(page.getByText("CupChunGae logged in")).toBeVisible();
    });

    test("fails with incorrect credentials", async ({ page }) => {
      await loginWith(page, "Windflint", "chaosgloom");
      await expect(page.getByText("Failed to login")).toBeVisible();
    });

    describe("When logged in", () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, "Windflint", "hardchosenseren");
        await createBlog(
          page,
          "Does God Hide In His Heaven?",
          "Tara Clements",
          "http://getintherobot.com",
          "14",
        );
      });

      test("a new blog can be created", async ({ page }) => {
        await createBlog(
          page,
          "13 Reasons Why No One Wants Your Candles",
          "Samwell Taryl",
          "http://imodiumsulphate.com",
          "33",
        );

        await expect(page.getByText("Added a blog:")).toBeVisible();
        await expect(
          page.getByRole("heading", { name: "13 Reasons Why No One" }),
        ).toBeVisible();
        await expect(
          page.getByRole("heading", { name: "Samwell Taryl" }),
        ).toBeVisible();
      });

      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "View" }).click();
        await expect(page.getByText("Likes: 86")).toBeVisible();
        await page.getByRole("button", { name: "Like" }).click();
        await expect(page.getByText("Likes: 87")).toBeVisible();
      });

      test("a blog can be deleted", async ({ page }) => {
        await page.getByRole("button", { name: "View" }).click();
        page.on("dialog", (dialog) => dialog.accept());
        await page.getByRole("button", { name: "Delete" }).click();

        await expect(page.getByText("Successfully deleted blog")).toBeVisible();
        await expect(page.getByText("None available")).toBeVisible();
      });

      describe("into a different user", () => {
        beforeEach(async ({ page, request }) => {
          await request.post("http://localhost:3003/api/users", {
            data: {
              name: "Alabaster",
              username: "Guinsoo",
              password: "chaosgloom",
            },
          });
          //make a secondary user
          await page.getByRole("button", { name: "Logout" }).click();
          await loginWith(page, "Guinsoo", "chaosgloom");
        });

        test("a blog owned by a different user cannot see the delete button", async ({
          page,
        }) => {
          await page.getByRole("button", { name: "View" }).click();
          // delete button should not be rendered for a user who doesn't own the blog
          await expect(
            page.getByRole("button", { name: "Delete" }),
          ).not.toBeVisible();
        });
      });

      describe("When multiple blogs are added", () => {
        beforeEach(async ({ page }) => {
          await createBlog(
            page,
            "1st position title",
            "1st position author",
            "http://1stpositionlink.com",
            "15",
          );
          await createBlog(
            page,
            "3rd position title",
            "3rd position author",
            "http://3rdpositionlink.com",
            "3",
          );
          await createBlog(
            page,
            "4th position title",
            "4th position author",
            "http://4thpositionlink.com",
            "1",
          );
        });

        test("blogs are listed by descending like order", async ({ page }) => {
          for (let i = 0; i < 2; i++) {
            await page.getByRole("button", { name: "View" }).first().click();
          }
          await expect(
            page.locator(".blog").first().getByText("Likes"),
          ).toContainText("15");
          await expect(
            page.locator(".blog").nth(1).getByText("Likes"),
          ).toContainText("14");
          await page
            .locator(".blog")
            .nth(1)
            .getByRole("button", { name: "Like" })
            .click();
          await page.waitForTimeout(1000);
          await page
            .locator(".blog")
            .nth(1)
            .getByRole("button", { name: "Like" })
            .click();
          await expect(
            page.locator(".blog").first().getByText("Likes"),
          ).toContainText("16");
          await expect(
            page.locator(".blog").nth(1).getByText("Likes"),
          ).toContainText("15");
        });
      });
    });
  });
});

import { Micropub } from "../src"
import nock from "nock"

beforeAll(() => nock.disableNetConnect())
afterAll(() => nock.enableNetConnect())

test("updates a post", async () => {
  const scope = nock("https://example.org")
    .post("/micropub", {
      action: "update",
      url: "https://example.org/post/123",
      replace: { title: ["This is a new title"] },
      add: { category: ["foo", "bar"] },
      delete: ["syndication"],
    })
    .reply(200, "Success")

  const micropub = new Micropub({
    url: "https://example.org/micropub",
    token: "my-access-token",
  })

  const result = await micropub.update({
    url: "https://example.org/post/123",
    replace: { title: ["This is a new title"] },
    add: { category: ["foo", "bar"] },
    delete: ["syndication"],
  })

  expect(result).toEqual("Success")

  scope.done()
})

test("updates a minimal post", async () => {
  const scope = nock("https://example.org")
    .post("/micropub", {
      action: "update",
      url: "https://example.org/post/123",
      replace: { title: ["This is a new title"] },
    })
    .reply(200, { success: true })

  const micropub = new Micropub({
    url: "https://example.org/micropub",
    token: "my-access-token",
  })

  const result = await micropub.update({
    url: "https://example.org/post/123",
    replace: { title: ["This is a new title"] },
  })

  expect(result).toEqual({ success: true })

  scope.done()
})

test("errors if no actions are included", async () => {
  const scope = nock("https://example.org")
    .post("/micropub", {
      action: "update",
      url: "https://example.org/post/123",
    })
    .optionally()
    .reply(200, { success: true })

  const micropub = new Micropub({
    url: "https://example.org/micropub",
    token: "my-access-token",
  })

  await expect(
    micropub.update({
      url: "https://example.org/post/123",
    })
  ).rejects.toThrowError()

  scope.done()
})

import { Micropub } from "../src"
import nock from "nock"

beforeAll(() => nock.disableNetConnect())
afterAll(() => nock.enableNetConnect())

test("reads micropub config", async () => {
  const scope = nock("https://example.org")
    .get("/micropub")
    .query({ q: "config" })
    .reply(200, {
      "media-endpoint": "https://example.org/micropub/media",
      "post-types": [
        {
          name: "Long Boi",
          type: "article",
        },
        {
          name: "Shortie",
          type: "note",
        },
      ],
    })

  const micropub = new Micropub({
    url: "https://example.org/micropub",
    token: "my-access-token",
  })

  const config = await micropub.getConfig()

  expect(config).toMatchInlineSnapshot(`
        Object {
          "media-endpoint": "https://example.org/micropub/media",
          "post-types": Array [
            Object {
              "name": "Long Boi",
              "type": "article",
            },
            Object {
              "name": "Shortie",
              "type": "note",
            },
          ],
        }
    `)

  scope.done()
})

test("reads empty config", async () => {
  const scope = nock("https://example.org")
    .get("/micropub")
    .query({ q: "config" })
    .reply(200, {})

  const micropub = new Micropub({
    url: "https://example.org/micropub",
    token: "my-access-token",
  })

  const config = await micropub.getConfig()

  expect(config).toMatchInlineSnapshot(`Object {}`)

  scope.done()
})

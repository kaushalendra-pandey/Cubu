import fetch from "node-fetch";

test("sends invalid back if bad id sent", async () => {
  const url = "http://localhost:4000/confirmEmail/123";
  const response = await fetch(url);
  const text = await response.text();
  expect(text).toEqual("invalid");
});

import SqliteStore from "./sqlite.ts";
import TokenStore from "../tokenstore.ts";

import { assertArrayContains, assertEquals } from "https://deno.land/std@0.71.0/testing/asserts.ts";

const db = "tokens.sqlite";
const tstore = new TokenStore(new SqliteStore(db));

const timeOffset = (seconds: number) => {
  return new Date(new Date().getTime() + seconds * 1000);
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

await tstore.insert("TEST1", { active: "true", jti: "TEST 1sec", exp: timeOffset(1).getTime() });
await tstore.insert("TEST20", { active: "true", jti: "TEST 20sec", exp: timeOffset(20).getTime() });
await tstore.insert("TEST60", { active: "true", jti: "TEST 60sec", exp: timeOffset(60).getTime() });

Deno.test("Token expiry", async () => {
  const valid = await tstore.check("TEST1");
  assertEquals(valid.active, "true");
  await sleep(1000);
  const invalid = await tstore.check("TEST1");
  assertEquals(invalid.active, "false");
});

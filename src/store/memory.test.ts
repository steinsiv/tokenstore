import MemoryStore from "./memory.ts";
import TokenStore from "../tokenstore.ts";

import { assert, equal } from "https://deno.land/std@0.113.0/testing/asserts.ts";

const tstore = new TokenStore(new MemoryStore());

const timeOffset = (seconds: number) => {
  return new Date(new Date().getTime() + seconds * 1000);
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

Deno.test("Token expiry", async () => {
  await tstore.insert("TEST1", { active: true, jti: "TEST 1sec", exp: timeOffset(1).getTime() });
  await tstore.insert("TEST20", { active: true, jti: "TEST 20sec", exp: timeOffset(20).getTime() });
  const valid = await tstore.check("TEST1");
  assert(valid.active);
  await sleep(1000);
  const invalid = await tstore.check("TEST1");
  assert(!invalid.active);
  const valid20 = await tstore.check("TEST20");
  assert(valid20.active);
});

Deno.test("Token revoke", async () => {
  await tstore.insert("TEST1", { active: true, jti: "TEST 1sec", exp: timeOffset(1).getTime() });
  const valid = await tstore.check("TEST1");
  assert(valid.active);
  await tstore.revoke("TEST1");
  const invalid = await tstore.check("TEST1");
  assert(!invalid.active);
});

Deno.test("Check token equality", async () => {
  const issued = {
    active: true,
    scope: "foo",
    "client_id": "client-id",
    username: "username",
    "token_type": "access_token",
    exp: new Date().getTime(),
    iat: new Date().getTime(),
    nbf: new Date().getTime(),
    sub: "subject_testing",
    aud: "audience_deno",
    iss: "issuer",
    jti: "token_identifier",
  };

  await tstore.insert(issued.jti, issued);
  const fetched = await tstore.check(issued.jti);
  equal(issued, fetched);
});

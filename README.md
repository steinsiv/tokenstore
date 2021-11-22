# tokenstore

[https://deno.land/x/tokenstore](https://deno.land/x/tokenstore)

simple store, check and retrieval of token... that's all

- Redis
- Memory
- Sqlite3

requirements: TTL on tokens

See `src/*.test.ts` files for usage

```ts
Deno.test("Token expiry", async () => {
  await tstore.insert("TEST1", { active: true, jti: "TEST 1sec", exp: timeOffset(1).getTime() });
  await tstore.insert("TEST20", { active: true, jti: "TEST 20sec", exp: timeOffset(20).getTime() });
  const valid = await tstore.check("TEST1");
  assert(valid.active);
  await delay(1000);
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
```

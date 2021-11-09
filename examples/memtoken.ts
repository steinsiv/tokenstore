import { MemoryStore, TokenStore } from "../mod.ts";

const tstore = new TokenStore(new MemoryStore());

const addTime = (date: Date, seconds: number) => {
  return new Date(date.getTime() + seconds * 1000);
};

const sleep = (ms: number) => {
  console.log("sleeping 10sec...");
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

// Push
let expiry = addTime(new Date(), 10);
await tstore.insert("TEST 10sec", { active: "true", jti: "TEST 10sec", exp: expiry.getTime() });

expiry = addTime(new Date(), 20);
await tstore.insert("TEST 20sec", { active: "true", jti: "TEST 20sec", exp: expiry.getTime() });

// Poll
console.log(await tstore.check("TEST 10sec"));
console.log(await tstore.check("TEST 20sec"));

sleep(10001);

console.log(await tstore.check("TEST 10sec"));
console.log(await tstore.check("TEST 20sec"));

await tstore.revoke("TEST 20sec");

console.log(await tstore.check("TEST 10sec"));
console.log(await tstore.check("TEST 20sec"));

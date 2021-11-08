import { SqliteStore, TokenStore } from "../mod.ts";
const db = "tokens.sqlite";
const tstore = new TokenStore(new SqliteStore(db));

const addTime = (date: Date, seconds: number) => {
  return new Date(date.getTime() + seconds * 1000);
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Push
let expiry = addTime(new Date(), 10);
await tstore.insert("TEST 10sec", { active: "true", jti: "TEST 10sec", exp: expiry.getTime() });

expiry = addTime(new Date(), 20);
await tstore.insert("TEST 20sec", { active: "true", jti: "TEST 20sec", exp: expiry.getTime() });

console.log("Check tokens...");
console.log(await tstore.check("TEST 10sec"));
console.log(await tstore.check("TEST 20sec"));
console.log(tstore.dump());

await sleep(10001);
console.log("\n\n10sec passed...");
console.log("Check tokens...");
console.log(await tstore.check("TEST 10sec"));
console.log(await tstore.check("TEST 20sec"));
console.log(tstore.dump());

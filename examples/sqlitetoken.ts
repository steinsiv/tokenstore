import { SqliteStore, TokenStore } from "../mod.ts";
const db = "tokens.sqlite";
const tstore = new TokenStore(new SqliteStore(db));

const timeOffset = (seconds: number) => {
  return new Date(new Date().getTime() + seconds * 1000);
};

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Push
await tstore.insert("TEST10", { active: "true", jti: "TEST 10sec", exp: timeOffset(10).getTime() });
await tstore.insert("TEST20", { active: "true", jti: "TEST 20sec", exp: timeOffset(20).getTime() });
await tstore.insert("TEST20", { active: "true", jti: "TEST 20sec", exp: timeOffset(20).getTime() });

console.log("\nDump tokens...");
console.log(await tstore.check("TEST10"));
console.log(await tstore.check("TEST20"));
await sleep(10001);

console.log(tstore.dump());

console.log("\n\n10sec passed...");
console.log("Check tokens...");
console.log(await tstore.check("TEST 10sec"));
console.log(await tstore.check("TEST 20sec"));
console.log(tstore.dump());

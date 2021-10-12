import { MemoryStore, TokenStore } from "../mod.ts";

const memstore = new MemoryStore();
const tstore = new TokenStore(memstore);

const addMinutes = (date: Date, minutes: number) => {
  return new Date(date.getTime() + minutes * 60000);
};

const expiry = addMinutes(new Date(), 10);

console.log(new Date());
console.log(new Date().getTime());
console.log(expiry);
console.log(expiry.getTime());

await tstore.insert("TEST", { active: "true", jti: "TEST", exp: expiry.getTime() }, expiry);

console.log(await tstore.dump());

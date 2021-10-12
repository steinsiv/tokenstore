import { DB as SqliteDB } from "https://deno.land/x/sqlite@v3.1.1/mod.ts";
import { connect as RedisConnect, Redis } from "https://deno.land/x/redis@v0.24.0/mod.ts";

export type { Redis };
export { RedisConnect, SqliteDB };

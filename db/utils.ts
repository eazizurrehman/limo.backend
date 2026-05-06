import { sql } from "drizzle-orm";

export function prevAndNext(idCol: unknown, orderBy: unknown) {
  return {
    prevId: sql`lag(${idCol}) over (order by ${orderBy})`.as("prevId"),
    nextId: sql`lead(${idCol}) over (order by ${orderBy})`.as("nextId"),
  };
}

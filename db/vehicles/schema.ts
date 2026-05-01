import { index, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";

export const vehicle = pgTable(
  "vehicle",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    archivedAt: timestamp("archived_at"),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("vehicle_archivedAt_idx").on(table.archivedAt)],
);

export const insertVehicleSchema = createInsertSchema(vehicle);
export type TInsertVehicleSchema = z.infer<typeof insertVehicleSchema>;

export const updateVehicleSchema = createUpdateSchema(vehicle);
export type TUpdateVehicleSchema = z.infer<typeof updateVehicleSchema>;

export const selectVehicleSchema = createSelectSchema(vehicle);
export type TSelectVehicleSchema = z.infer<typeof selectVehicleSchema>;

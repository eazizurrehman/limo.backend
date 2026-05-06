import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";
import { VEHICLE_TYPES } from "@/app/vehicles/constants";

export const vehicleTypeEnum = pgEnum("vehicle_type", VEHICLE_TYPES);

export const vehicle = pgTable(
  "vehicle",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    vehicleType: vehicleTypeEnum("vehicle_type").notNull(),
    make: varchar("make").notNull(),
    model: varchar("model").notNull(),
    year: integer("year").notNull(),
    interiorColor: varchar("interior_color").notNull(),
    exteriorColor: varchar("exterior_color").notNull(),
    passengerCapacity: integer("passenger_capacity").notNull(),
    luggageCapacity: integer("luggage_capacity").notNull(),
    imageUrl: varchar("image_url").notNull(),
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

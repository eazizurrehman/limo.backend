import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { VEHICLE_TYPES } from "@/app/vehicles/constants";
import { vehicle } from "@/db/schemas";
import { stringToBoolean } from "@/lib/utils";
import { uuidSchema } from "@/lib/zod";

export class VehicleSchemas {
  readonly #base = z.object({
    vehicleType: z.enum(VEHICLE_TYPES, {
      error: `Vehicle type must be one of: ${VEHICLE_TYPES.join(", ")}`,
    }),
    make: z.string("Make is required").min(1, "Make is required"),
    model: z.string("Model is required").min(1, "Model is required"),
    year: z
      .number("Year must be a number")
      .int("Year must be an integer")
      .min(2000, "Year must be 2000 or later")
      .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
    interiorColor: z
      .string("Interior color is required")
      .min(1, "Interior color is required"),
    exteriorColor: z
      .string("Exterior color is required")
      .min(1, "Exterior color is required"),
    passengerCapacity: z
      .number("Passenger capacity must be a number")
      .int("Passenger capacity must be an integer")
      .positive("Passenger capacity must be positive"),
    luggageCapacity: z
      .number("Luggage capacity must be a number")
      .int("Luggage capacity must be an integer")
      .nonnegative("Luggage capacity cannot be negative"),
    imageUrl: z.url("Image URL must be a valid URL"),
  });

  readonly #insert = createInsertSchema(vehicle).extend(this.#base.shape);

  readonly #update = createUpdateSchema(vehicle).extend(
    this.#base.partial().shape,
  );

  public getVehiclesQuery = z
    .object({
      archived: z
        .preprocess(
          stringToBoolean,
          z.boolean("Archived must be true or false"),
        )
        .optional()
        .default(false),
    })
    .meta({ source: "query" });

  public getVehicleParams = z
    .object({
      id: uuidSchema,
    })
    .meta({ source: "params" });

  public importVehiclesBody = z
    .object({
      vehicles: z
        .array(this.#insert)
        .nonempty("At least one vehicle is required"),
    })
    .meta({ source: "body" });

  public addVehicleBody = this.#insert.meta({ source: "body" });

  public updateVehicleParams = z
    .object({
      id: uuidSchema,
    })
    .meta({ source: "params" });

  public updateVehicleBody = this.#update.meta({ source: "body" });

  public archiveVehicleParams = z
    .object({
      id: uuidSchema,
    })
    .meta({ source: "params" });

  public unarchiveVehicleParams = z
    .object({
      id: uuidSchema,
    })
    .meta({ source: "params" });

  public deleteVehicleParams = z
    .object({
      id: uuidSchema,
    })
    .meta({ source: "params" });
}

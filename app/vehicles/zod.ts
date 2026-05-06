import { z } from "zod";
import { VEHICLE_TYPES } from "@/app/vehicles/constants";

const baseSchema = z.object({
  vehicleType: z.enum(VEHICLE_TYPES, {
    error: `Vehicle type must be one of: ${VEHICLE_TYPES.join(", ")}`,
  }),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .int("Year must be an integer")
    .min(1886, "Year must be 1886 or later")
    .max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  interiorColor: z.string().min(1, "Interior color is required"),
  exteriorColor: z.string().min(1, "Exterior color is required"),
  passengerCapacity: z
    .number()
    .int("Passenger capacity must be an integer")
    .positive("Passenger capacity must be positive"),
  luggageCapacity: z
    .number()
    .int("Luggage capacity must be an integer")
    .nonnegative("Luggage capacity cannot be negative"),
  imageUrl: z.url("Image URL must be a valid URL"),
});

export const VehicleSchemas = {
  getVehicles: {
    query: z.object({
      archived: z
        .preprocess((value) => {
          if (value === "true") return true;
          if (value === "false") return false;
          return value;
        }, z.boolean())
        .optional()
        .default(false),
    }),
  },
  getVehicle: {
    params: z.object({
      id: z.string("ID is required").nonempty("ID cannot be empty"),
    }),
  },
  importVehicles: {
    body: z.object({
      vehicles: z.array(baseSchema),
    }),
  },
  addVehicle: {
    body: baseSchema,
  },
  updateVehicle: {
    params: z.object({
      id: z.string("ID is required").nonempty("ID cannot be empty"),
    }),
    body: baseSchema.partial(),
  },
  archiveVehicle: {
    params: z.object({
      id: z.string("ID is required").nonempty("ID cannot be empty"),
    }),
  },
  unarchiveVehicle: {
    params: z.object({
      id: z.string("ID is required").nonempty("ID cannot be empty"),
    }),
  },
  deleteVehicle: {
    params: z.object({
      id: z.string("ID is required").nonempty("ID cannot be empty"),
    }),
  },
} as const;

export type TGetVehiclesQuerySchema = z.infer<
  typeof VehicleSchemas.getVehicles.query
>;

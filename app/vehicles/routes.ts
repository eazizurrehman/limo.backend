import type { Router } from "express";
import express from "express";
import { VehiclesController } from "@/app/vehicles/controller";
import { VehicleSchemas } from "@/app/vehicles/zod";
import { validate } from "@/middlewares/validate";

const controller = new VehiclesController();
const vehicleSchemas = new VehicleSchemas();

export const vehiclesRouter: Router = express.Router();

vehiclesRouter.get(
  "/",
  validate(vehicleSchemas.getVehiclesQuery),
  controller.getVehicles.bind(controller),
);
vehiclesRouter.get("/list", controller.getVehiclesList.bind(controller));
vehiclesRouter.get(
  "/:id",
  validate(vehicleSchemas.getVehicleParams),
  controller.getVehicle.bind(controller),
);

vehiclesRouter.post(
  "/import",
  validate(vehicleSchemas.importVehiclesBody),
  controller.importVehicles.bind(controller),
);
vehiclesRouter.post(
  "/",
  validate(vehicleSchemas.addVehicleBody),
  controller.addVehicle.bind(controller),
);

vehiclesRouter.put(
  "/:id",
  validate(vehicleSchemas.updateVehicleParams),
  validate(vehicleSchemas.updateVehicleBody),
  controller.updateVehicle.bind(controller),
);
vehiclesRouter.put(
  "/:id/archive",
  validate(vehicleSchemas.archiveVehicleParams),
  controller.archiveVehicle.bind(controller),
);
vehiclesRouter.put(
  "/:id/unarchive",
  validate(vehicleSchemas.unarchiveVehicleParams),
  controller.unarchiveVehicle.bind(controller),
);

vehiclesRouter.delete(
  "/:id",
  validate(vehicleSchemas.deleteVehicleParams),
  controller.deleteVehicle.bind(controller),
);

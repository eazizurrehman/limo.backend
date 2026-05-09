import type { Router } from "express";
import express from "express";
import { VehiclesController } from "@/app/vehicles/controller";
import { VehicleSchemas } from "@/app/vehicles/zod";
import { validate } from "@/middlewares/validate";

const controller = new VehiclesController();
const schemas = new VehicleSchemas();

export const vehiclesRouter: Router = express.Router();

vehiclesRouter.get(
  "/",
  validate(schemas.getVehiclesQuery),
  controller.getVehicles.bind(controller),
);
vehiclesRouter.get("/list", controller.getVehiclesList.bind(controller));
vehiclesRouter.get(
  "/:id",
  validate(schemas.getVehicleParams),
  controller.getVehicle.bind(controller),
);

vehiclesRouter.post(
  "/import",
  validate(schemas.importVehiclesBody),
  controller.importVehicles.bind(controller),
);
vehiclesRouter.post(
  "/",
  validate(schemas.addVehicleBody),
  controller.addVehicle.bind(controller),
);

vehiclesRouter.put(
  "/:id",
  validate(schemas.updateVehicleParams),
  validate(schemas.updateVehicleBody),
  controller.updateVehicle.bind(controller),
);
vehiclesRouter.put(
  "/:id/archive",
  validate(schemas.archiveVehicleParams),
  controller.archiveVehicle.bind(controller),
);
vehiclesRouter.put(
  "/:id/unarchive",
  validate(schemas.unarchiveVehicleParams),
  controller.unarchiveVehicle.bind(controller),
);

vehiclesRouter.delete(
  "/:id",
  validate(schemas.deleteVehicleParams),
  controller.deleteVehicle.bind(controller),
);

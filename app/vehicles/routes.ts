import type { Router } from "express";
import express from "express";
import { VehiclesController } from "@/app/vehicles/controller";

const vehiclesController = new VehiclesController();

export const vehiclesRouter: Router = express.Router();

vehiclesRouter.get(
  "/",
  vehiclesController.getVehicles.bind(vehiclesController),
);
vehiclesRouter.get(
  "/list",
  vehiclesController.getVehiclesList.bind(vehiclesController),
);
vehiclesRouter.get(
  "/:id",
  vehiclesController.getVehicle.bind(vehiclesController),
);

vehiclesRouter.post(
  "/import",
  vehiclesController.importVehicles.bind(vehiclesController),
);
vehiclesRouter.post(
  "/",
  vehiclesController.addVehicle.bind(vehiclesController),
);

vehiclesRouter.put(
  "/:id",
  vehiclesController.updateVehicle.bind(vehiclesController),
);
vehiclesRouter.put(
  "/:id/archive",
  vehiclesController.archiveVehicle.bind(vehiclesController),
);
vehiclesRouter.put(
  "/:id/unarchive",
  vehiclesController.unarchiveVehicle.bind(vehiclesController),
);

vehiclesRouter.delete(
  "/:id",
  vehiclesController.deleteVehicle.bind(vehiclesController),
);

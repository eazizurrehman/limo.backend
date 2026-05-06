import type { Router } from "express";
import express from "express";
import { VehiclesController } from "@/app/vehicles/controller";

const controller = new VehiclesController();

export const vehiclesRouter: Router = express.Router();

vehiclesRouter.get(
  "/",

  controller.getVehicles.bind(controller),
);
vehiclesRouter.get("/list", controller.getVehiclesList.bind(controller));
vehiclesRouter.get("/:id", controller.getVehicle.bind(controller));

vehiclesRouter.post("/import", controller.importVehicles.bind(controller));
vehiclesRouter.post("/", controller.addVehicle.bind(controller));

vehiclesRouter.put("/:id", controller.updateVehicle.bind(controller));
vehiclesRouter.put("/:id/archive", controller.archiveVehicle.bind(controller));
vehiclesRouter.put(
  "/:id/unarchive",
  controller.unarchiveVehicle.bind(controller),
);

vehiclesRouter.delete("/:id", controller.deleteVehicle.bind(controller));

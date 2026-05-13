import type { Request, Response } from "express";
import { VehiclesService } from "@/app/vehicles/service";
import type { TVehiclesSchemas } from "@/app/vehicles/zod";
import { ApiResponse } from "@/lib/api-response";

export class VehiclesController {
  readonly #service = new VehiclesService();

  public async getVehicles(req: Request, res: Response) {
    const { archived } = req.validated
      .query as TVehiclesSchemas["getVehiclesQuery"];

    const vehicles = await this.#service.getAll(archived);

    if (!vehicles || vehicles.length === 0)
      return ApiResponse.noData(res, "No vehicles found");

    return ApiResponse.ok(res, "Vehicles retrieved successfully", {
      vehicles,
    });
  }

  public async getVehiclesList(_: Request, res: Response) {
    const vehiclesList = await this.#service.getList();

    if (!vehiclesList || vehiclesList.length === 0)
      return ApiResponse.noData(res, "No vehicles found");

    return ApiResponse.ok(res, "Vehicles list retrieved successfully", {
      vehiclesList,
    });
  }

  public async getVehicle(req: Request, res: Response) {
    const { id } = req.validated.params as TVehiclesSchemas["getVehicleParams"];

    const vehicle = await this.#service.getById(id);

    if (!vehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle retrieved successfully", {
      vehicle,
    });
  }

  public async importVehicles(req: Request, res: Response) {
    const { vehicles } = req.validated
      .body as TVehiclesSchemas["importVehiclesBody"];

    await this.#service.import(vehicles);

    return ApiResponse.ok(res, "Vehicles imported successfully");
  }

  public async addVehicle(req: Request, res: Response) {
    const data = req.validated.body as TVehiclesSchemas["addVehicleBody"];

    const vehicle = await this.#service.add(data);

    return ApiResponse.created(res, "Vehicle added successfully", {
      vehicle,
    });
  }

  public async updateVehicle(req: Request, res: Response) {
    const { id } = req.validated
      .params as TVehiclesSchemas["updateVehicleParams"];
    const data = req.validated.body as TVehiclesSchemas["updateVehicleBody"];

    const updatedVehicle = await this.#service.update(id, data);

    if (!updatedVehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle updated successfully", {
      vehicle: updatedVehicle,
    });
  }

  public async archiveVehicle(req: Request, res: Response) {
    const { id } = req.validated
      .params as TVehiclesSchemas["archiveVehicleParams"];

    const archivedVehicle = await this.#service.archive(id);

    if (!archivedVehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle archived successfully", {
      vehicle: archivedVehicle,
    });
  }

  public async unarchiveVehicle(req: Request, res: Response) {
    const { id } = req.validated
      .params as TVehiclesSchemas["unarchiveVehicleParams"];

    const vehicle = await this.#service.unarchive(id);

    if (!vehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle unarchived successfully", {
      vehicle,
    });
  }

  public async deleteVehicle(req: Request, res: Response) {
    const { id } = req.validated
      .params as TVehiclesSchemas["deleteVehicleParams"];

    const vehicle = await this.#service.delete(id);

    if (!vehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle deleted successfully", {
      vehicle,
    });
  }
}

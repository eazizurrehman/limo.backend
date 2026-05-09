import type { Request, Response } from "express";
import { VehiclesService } from "@/app/vehicles/service";
import { VehicleSchemas } from "@/app/vehicles/zod";
import { ApiResponse } from "@/lib/api-response";
import { validateData } from "@/lib/zod";

const vehiclesSchemas = new VehicleSchemas();

export class VehiclesController {
  readonly #service = new VehiclesService();

  public async getVehicles(req: Request, res: Response) {
    const { archived } = req.validated.query;

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
    const { id } = req.validated.params;

    const vehicle = await this.#service.getById(id);

    if (!vehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle retrieved successfully", {
      vehicle,
    });
  }

  public async importVehicles(req: Request, res: Response) {
    const { vehicles } = await validateData({
      schema: vehiclesSchemas.importVehiclesBody,
      raw: req.body,
    });

    await this.#service.import(vehicles);

    return ApiResponse.ok(res, "Vehicles imported successfully");
  }

  public async addVehicle(req: Request, res: Response) {
    const data = await validateData({
      schema: vehiclesSchemas.addVehicleBody,
      raw: req.body,
    });

    const vehicle = await this.#service.add(data);

    return ApiResponse.created(res, "Vehicle added successfully", {
      vehicle,
    });
  }

  public async updateVehicle(req: Request, res: Response) {
    const { id } = req.validated.params;

    const data = await validateData({
      schema: vehiclesSchemas.updateVehicleBody,
      raw: req.body,
    });

    const updatedVehicle = await this.#service.update(id, data);

    if (!updatedVehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle updated successfully", {
      vehicle: updatedVehicle,
    });
  }

  public async archiveVehicle(req: Request, res: Response) {
    const { id } = req.validated.params;

    const archivedVehicle = await this.#service.archive(id);

    if (!archivedVehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle archived successfully", {
      vehicle: archivedVehicle,
    });
  }

  public async unarchiveVehicle(req: Request, res: Response) {
    const { id } = req.validated.params;

    const vehicle = await this.#service.unarchive(id);

    if (!vehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle unarchived successfully", {
      vehicle,
    });
  }

  public async deleteVehicle(req: Request, res: Response) {
    const { id } = req.validated.params;

    const vehicle = await this.#service.delete(id);

    if (!vehicle) return ApiResponse.noData(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle deleted successfully", {
      vehicle,
    });
  }
}

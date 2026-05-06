import { eq, isNotNull, isNull } from "drizzle-orm";
import type { Request, Response } from "express";
import { VehicleSchemas } from "@/app/vehicles/zod";
import { db } from "@/db";
import { vehicle } from "@/db/schemas";
import { prevAndNext } from "@/db/utils";
import { ApiResponse } from "@/lib/api-response";
import { validate } from "@/lib/zod";

export class VehiclesController {
  public async getVehicles(req: Request, res: Response) {
    const { archived } = await validate({
      schema: VehicleSchemas.getVehicles.query,
      raw: req.query,
    });

    const vehicles = await db
      .select({
        id: vehicle.id,
        vehicleType: vehicle.vehicleType,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        interiorColor: vehicle.interiorColor,
        exteriorColor: vehicle.exteriorColor,
        passengerCapacity: vehicle.passengerCapacity,
        luggageCapacity: vehicle.luggageCapacity,
        imageUrl: vehicle.imageUrl,
        archivedAt: vehicle.archivedAt,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
        ...prevAndNext(vehicle.id, vehicle.id),
      })
      .from(vehicle)
      .where(
        archived ? isNotNull(vehicle.archivedAt) : isNull(vehicle.archivedAt),
      );

    if (!vehicles || vehicles.length === 0)
      return ApiResponse.notFound(res, "No vehicles found");

    return ApiResponse.ok(res, "Vehicles retrieved successfully", {
      vehicles,
    });
  }

  public async getVehiclesList(_: Request, res: Response) {
    const vehiclesList = await db
      .select({ id: vehicle.id, name: vehicle.id })
      .from(vehicle)
      .where(isNull(vehicle.archivedAt));

    if (!vehiclesList || vehiclesList.length === 0)
      return ApiResponse.notFound(res, "No vehicles found");

    return ApiResponse.ok(res, "Vehicles list retrieved successfully", {
      vehiclesList,
    });
  }

  public async getVehicle(req: Request, res: Response) {
    const { id } = await validate({
      schema: VehicleSchemas.getVehicle.params,
      raw: req.params,
    });

    // TODO: fix query to not use subquery
    const subquery = db
      .select({
        id: vehicle.id,
        vehicleType: vehicle.vehicleType,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        interiorColor: vehicle.interiorColor,
        exteriorColor: vehicle.exteriorColor,
        passengerCapacity: vehicle.passengerCapacity,
        luggageCapacity: vehicle.luggageCapacity,
        imageUrl: vehicle.imageUrl,
        archivedAt: vehicle.archivedAt,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
        ...prevAndNext(vehicle.id, vehicle.id),
      })
      .from(vehicle)
      .as("c");

    const [getVehicle] = await db
      .select()
      .from(subquery)
      .where(eq(subquery.id, id));

    if (!getVehicle) return ApiResponse.notFound(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle retrieved successfully", {
      vehicle: getVehicle,
    });
  }

  public async importVehicles(req: Request, res: Response) {
    const { vehicles } = await validate({
      schema: VehicleSchemas.importVehicles.body,
      raw: req.body,
    });

    await db.insert(vehicle).values(vehicles);

    return ApiResponse.ok(res, "Vehicles imported successfully");
  }

  public async addVehicle(req: Request, res: Response) {
    const data = await validate({
      schema: VehicleSchemas.addVehicle.body,
      raw: req.body,
    });

    const [addedVehicle] = await db.insert(vehicle).values(data).returning();

    return ApiResponse.created(res, "Vehicle added successfully", {
      vehicle: addedVehicle,
    });
  }

  public async updateVehicle(req: Request, res: Response) {
    const { id } = await validate({
      schema: VehicleSchemas.updateVehicle.params,
      raw: req.params,
    });

    const data = await validate({
      schema: VehicleSchemas.updateVehicle.body,
      raw: req.body,
    });

    const [updatedVehicle] = await db
      .update(vehicle)
      .set(data)
      .where(eq(vehicle.id, String(id)))
      .returning();

    return ApiResponse.ok(res, "Vehicle updated successfully", {
      vehicle: updatedVehicle,
    });
  }

  public async archiveVehicle(req: Request, res: Response) {
    const { id } = await validate({
      schema: VehicleSchemas.archiveVehicle.params,
      raw: req.params,
    });

    const [archivedVehicle] = await db
      .update(vehicle)
      .set({ archivedAt: new Date() })
      .where(eq(vehicle.id, String(id)))
      .returning();

    if (!archivedVehicle) return ApiResponse.notFound(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle archived successfully", {
      vehicle: archivedVehicle,
    });
  }

  public async unarchiveVehicle(req: Request, res: Response) {
    const { id } = await validate({
      schema: VehicleSchemas.unarchiveVehicle.params,
      raw: req.params,
    });

    const [unarchivedVehicle] = await db
      .update(vehicle)
      .set({ archivedAt: null })
      .where(eq(vehicle.id, String(id)))
      .returning();

    if (!unarchivedVehicle)
      return ApiResponse.notFound(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle unarchived successfully", {
      vehicle: unarchivedVehicle,
    });
  }

  public async deleteVehicle(req: Request, res: Response) {
    const { id } = await validate({
      schema: VehicleSchemas.deleteVehicle.params,
      raw: req.params,
    });

    const [deletedVehicle] = await db
      .delete(vehicle)
      .where(eq(vehicle.id, String(id)))
      .returning();

    if (!deletedVehicle) return ApiResponse.notFound(res, "Vehicle not found");

    return ApiResponse.ok(res, "Vehicle deleted successfully", {
      vehicle: deletedVehicle,
    });
  }
}

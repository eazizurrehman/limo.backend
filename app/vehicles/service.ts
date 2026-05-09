import { eq, isNotNull, isNull } from "drizzle-orm";
import { db } from "@/db";
import { vehicle } from "@/db/schemas";
import { prevAndNext } from "@/db/utils";

export class VehiclesService {
  public async getAll(archived: boolean) {
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

    return vehicles;
  }

  public async getList() {
    const vehiclesList = await db
      .select({ id: vehicle.id, name: vehicle.id })
      .from(vehicle)
      .where(isNull(vehicle.archivedAt));

    return vehiclesList;
  }

  public async getById(id: string) {
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

    const [fetchedVehicle] = await db
      .select()
      .from(subquery)
      .where(eq(subquery.id, id));

    return fetchedVehicle;
  }

  public async import(vehicles: Array<typeof vehicle.$inferInsert>) {
    await db.insert(vehicle).values(vehicles);
  }

  public async add(data: typeof vehicle.$inferInsert) {
    const [addedVehicle] = await db.insert(vehicle).values(data).returning();

    return addedVehicle;
  }

  public async update(id: string, data: Record<string, unknown>) {
    const [updatedVehicle] = await db
      .update(vehicle)
      .set(data)
      .where(eq(vehicle.id, String(id)))
      .returning();

    return updatedVehicle;
  }

  public async archive(id: string) {
    const [archivedVehicle] = await db
      .update(vehicle)
      .set({ archivedAt: new Date() })
      .where(eq(vehicle.id, String(id)))
      .returning();

    return archivedVehicle;
  }

  public async unarchive(id: string) {
    const [unarchivedVehicle] = await db
      .update(vehicle)
      .set({ archivedAt: null })
      .where(eq(vehicle.id, String(id)))
      .returning();

    return unarchivedVehicle;
  }

  public async delete(id: string) {
    const [deletedVehicle] = await db
      .delete(vehicle)
      .where(eq(vehicle.id, String(id)))
      .returning();

    return deletedVehicle;
  }
}

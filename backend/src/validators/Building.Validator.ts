import { z } from "zod";

class BuildingValidator {
    createBuildingSchema = z.object({
        name: z.string().min(1, "Name is required")
    });

    updateBuildingSchema = z.object({
        name: z.string().min(1).optional()
    });
}

export default new BuildingValidator();

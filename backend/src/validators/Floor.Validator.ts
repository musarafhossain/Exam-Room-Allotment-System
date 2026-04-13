import { z } from "zod";

class FloorValidator {
    createFloorSchema = z.object({
        name: z.string().min(1, "Name is required")
    });

    updateFloorSchema = z.object({
        name: z.string().min(1).optional()
    });
}

export default new FloorValidator();

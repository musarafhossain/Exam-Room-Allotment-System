import { z } from "zod";

class SettingValidator {
    updateSettingSchema = z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required")
    });
}

export default new SettingValidator();

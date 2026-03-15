import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validate =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }

      next(error);
    }
  };
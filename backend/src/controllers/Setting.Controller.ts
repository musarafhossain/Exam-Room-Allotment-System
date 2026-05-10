import { Request, Response } from "express";
import { SettingModel } from "../models";

class SettingController {
    getSettings = async (req: Request, res: Response) => {
        try {
            const settings = await SettingModel.find();
            res.json({
                success: true,
                message: "Settings fetched successfully",
                data: settings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    getSettingByKey = async (req: Request, res: Response) => {
        try {
            const { key } = req.params;
            const setting = await SettingModel.findOne({ key });

            if (!setting) {
                return res.status(404).json({
                    success: false,
                    message: "Setting not found"
                });
            }

            res.json({
                success: true,
                message: "Setting fetched successfully",
                data: setting
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }

    updateSetting = async (req: Request, res: Response) => {
        try {
            const { key, value } = req.body;

            const setting = await SettingModel.findOneAndUpdate(
                { key },
                { value },
                { new: true, upsert: true }
            );

            res.json({
                success: true,
                message: "Setting updated successfully",
                data: setting
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new SettingController();

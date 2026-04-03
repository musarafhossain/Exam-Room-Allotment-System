import { Request, Response } from "express";
import { TeacherRoomModel } from "../models";
import { Types } from "mongoose";

class TeacherRoomController {
    getTeacherRooms = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const rooms = await TeacherRoomModel.find().skip(skip).limit(limit);

        const total = await TeacherRoomModel.countDocuments();
        const lastPage = Math.ceil(total / limit);

        res.json({
            success: true,
            message: "Teacher rooms fetched successfully",
            items: rooms,
            total,
            currentPage: page,
            lastPage
        });
    }

    getTeacherRoom = async (req: Request, res: Response) => {
        const { id } = req.params;

        const room = await TeacherRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        res.json({
            success: true,
            message: "Room fetched successfully",
            data: room
        });
    }

    createTeacherRoom = async (req: Request, res: Response) => {
        const { name, roomNo, floor, building, time, date } = req.body;

        const roomExists = await TeacherRoomModel.findOne({ name, roomNo, date, time });

        if (roomExists) {
            return res.status(400).json({
                success: false,
                message: "Room assignment already exists"
            });
        }

        const room = new TeacherRoomModel({
            name,
            roomNo,
            floor,
            building,
            time,
            date,
        });

        await room.save();

        res.json({
            success: true,
            message: "Teacher room created successfully",
            data: room
        });
    }

    updateTeacherRoom = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, roomNo, floor, building, time, date } = req.body;

        const room = await TeacherRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        const roomExists = await TeacherRoomModel.findOne({ name, roomNo, date, time, _id: { $ne: new Types.ObjectId(id as string) } });

        if (roomExists) {
            return res.status(400).json({
                success: false,
                message: "Room assignment already exists"
            });
        }

        if (name) room.name = name as any;
        if (roomNo) room.roomNo = roomNo;
        if (floor) room.floor = floor;
        if (building) room.building = building;
        if (time) room.time = time;
        if (date) room.date = date;

        await room.save();

        res.json({
            success: true,
            message: "Teacher room updated successfully",
            data: room
        });
    }

    deleteTeacherRoom = async (req: Request, res: Response) => {
        const { id } = req.params;

        const room = await TeacherRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        await room.deleteOne();

        res.json({
            success: true,
            message: "Teacher room deleted successfully",
            data: room
        });
    }

    findTeacherRoom = async (req: Request, res: Response) => {
        try {
            const { name, date } = req.body;

            const inputDate = new Date(date);
            if (isNaN(inputDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid date format"
                });
            }

            // Alike search (partial match, case-insensitive)
            const rooms = await TeacherRoomModel.find({
                name: { $regex: name, $options: "i" },
                date: inputDate
            });

            if (!rooms || rooms.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No exam rooms found for teacher name like "${name}" on date ${inputDate.toDateString()}`
                });
            }

            return res.json({
                success: true,
                message: "Teacher room(s) found",
                data: rooms
            });

        } catch (error) {
            console.error("FindTeacherRoom Error:", error);
            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };

    bulkDeleteTeacherRoom = async (req: Request, res: Response) => {
        try {
            const { ids } = req.body;

            if (ids) {
                await TeacherRoomModel.deleteMany({ _id: { $in: ids } });
            }

            res.json({
                success: true,
                message: `Teacher rooms deleted successfully`,
                data: ids
            });
        } catch (error) {
            console.error("BulkDeleteTeacherRoom Error:", error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    }
}

export default new TeacherRoomController();

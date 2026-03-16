import { Request, Response } from "express";
import { StudentRoomModel } from "../models";
import { Types } from "mongoose";

class StudentRoomController {

    getStudentRooms = async (req: Request, res: Response) => {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const rooms = await StudentRoomModel.find().skip(skip).limit(limit);

        const total = await StudentRoomModel.countDocuments();
        const lastPage = Math.ceil(total / limit);

        res.json({
            success: true,
            message: "Student rooms fetched successfully",
            items: rooms,
            total,
            currentPage: page,
            lastPage
        });
    }

    getStudentRoom = async (req: Request, res: Response) => {
        const { id } = req.params;

        const room = await StudentRoomModel.findById(id);

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

    createStudentRoom = async (req: Request, res: Response) => {
        const { roomNo, roomName, floor, building, exams } = req.body;

        const roomExists = await StudentRoomModel.findOne({ roomNo });

        if (roomExists) {
            return res.status(400).json({
                success: false,
                message: "Room already exists"
            });
        }

        const room = new StudentRoomModel({
            roomNo,
            roomName,
            floor,
            building,
            exams
        });

        await room.save();

        res.json({
            success: true,
            message: "Student room created successfully",
            data: room
        });
    }

    updateStudentRoom = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { roomNo, roomName, floor, building, exams } = req.body;

        const room = await StudentRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        if (roomNo) {
            const exists = await StudentRoomModel.findOne({
                roomNo,
                _id: { $ne: new Types.ObjectId(id as string) }
            });

            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: "Room number already in use"
                });
            }

            room.roomNo = roomNo;
        }

        if (roomName) room.roomName = roomName;
        if (floor) room.floor = floor;
        if (building) room.building = building;
        if (exams) room.exams = exams;

        await room.save();

        res.json({
            success: true,
            message: "Student room updated successfully",
            data: room
        });
    }

    deleteStudentRoom = async (req: Request, res: Response) => {
        const { id } = req.params;

        const room = await StudentRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        await room.deleteOne();

        res.json({
            success: true,
            message: "Student room deleted successfully",
            data: room
        });
    }

}

export default new StudentRoomController();
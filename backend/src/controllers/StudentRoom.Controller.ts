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

    findStudentRoom = async (req: Request, res: Response) => {
        const { regNo, date } = req.body;

        // Normalize input date (YYYY-MM-DD)
        const inputDateStr = new Date(date).toISOString().split("T")[0];

        // SECURITY: allow room info from day-before exam
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const examDate = new Date(date);
        examDate.setHours(0, 0, 0, 0);

        const dayBeforeExam = new Date(examDate);
        dayBeforeExam.setDate(dayBeforeExam.getDate() - 1);

        // If today is before the day-before exam, block access
        /* if (today < dayBeforeExam) {
            return res.status(403).json({
                success: false,
                message: `Room info is available only from day before the exam.`
            });
        } */

        // Convert regNo to number for safe comparison
        const regNoNum = parseInt(regNo, 10);

        const result = await StudentRoomModel.aggregate([
            { $unwind: "$exams" },

            // Convert exam date to string for matching
            {
                $addFields: {
                    examDateStr: { $dateToString: { format: "%Y-%m-%d", date: "$exams.date" } }
                }
            },
            { $match: { examDateStr: inputDateStr } },

            { $unwind: "$exams.subjects" },

            // Convert regNoFrom / regNoTo to numbers
            {
                $addFields: {
                    regFromNum: { $toInt: "$exams.subjects.regNoFrom" },
                    regToNum: { $toInt: "$exams.subjects.regNoTo" }
                }
            },
            {
                $match: {
                    regFromNum: { $lte: regNoNum },
                    regToNum: { $gte: regNoNum }
                }
            },

            // Project required fields
            {
                $project: {
                    _id: 0,
                    roomNo: 1,
                    roomName: 1,
                    floor: 1,
                    building: 1,
                    semester: "$exams.subjects.semester",
                    department: "$exams.subjects.department",
                    subject: "$exams.subjects.subject",
                    paper: "$exams.subjects.paper",
                    shift: "$exams.subjects.shift",
                    startTime: "$exams.subjects.startTime",
                    endTime: "$exams.subjects.endTime",
                    duration: "$exams.subjects.duration",
                    date: "$exams.date"
                }
            },
            { $limit: 1 }
        ]);

        if (!result || result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No exam room found for this registration number"
            });
        }

        return res.json({
            success: true,
            message: "Student room found",
            data: result[0]
        });
    };
}

export default new StudentRoomController();
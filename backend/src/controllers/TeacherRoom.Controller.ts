import { Request, Response } from "express";
import { TeacherRoomModel } from "../models";
import { Types } from "mongoose";

function normalizeNameWords(name: string): string[] {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
}

function editDistance(first: string, second: string): number {
    const previous = Array.from({ length: second.length + 1 }, (_, index) => index);

    for (let firstIndex = 1; firstIndex <= first.length; firstIndex++) {
        let diagonal = previous[0];
        previous[0] = firstIndex;

        for (let secondIndex = 1; secondIndex <= second.length; secondIndex++) {
            const above = previous[secondIndex];
            previous[secondIndex] = Math.min(
                previous[secondIndex] + 1,
                previous[secondIndex - 1] + 1,
                diagonal + (first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1)
            );
            diagonal = above;
        }
    }

    return previous[second.length];
}

function wordsMatch(first: string, second: string): boolean {
    if (first.includes(second) || second.includes(first)) return true;

    // Allow one typo in names of four or more characters (e.g. Sanata/Santana).
    return first.length >= 4 && second.length >= 4 && editDistance(first, second) <= 1;
}

/**
 * Matches names regardless of capitalization or punctuation and allows a
 * single-character typo per substantial word.
 */
function nameMatches(query: string, fullName: string): boolean {
    const queryWords = normalizeNameWords(query);
    const nameWords = normalizeNameWords(fullName);

    return queryWords.every(queryWord =>
        nameWords.some(nameWord => wordsMatch(queryWord, nameWord))
    );
}

class TeacherRoomController {
    getTeacherRooms = async (req: Request, res: Response) => {
        const rooms = await TeacherRoomModel.find();

        const total = await TeacherRoomModel.countDocuments();

        res.json({
            success: true,
            message: "Teacher rooms fetched successfully",
            items: rooms,
            total
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
        const { dates, teachers } = req.body;

        const newRecords = [];
        
        for (const teacher of teachers) {
            for (let i = 0; i < dates.length; i++) {
                const dateObj = dates[i];
                if (!teacher.assignments || !teacher.assignments[i]) continue;
                
                const assignment = teacher.assignments[i];
                
                // We store the assignment even if shifts are false so the teacher is tracked
                if (dateObj.date && teacher.name) {
                    newRecords.push({
                        name: teacher.name.trim().replace(/\s+/g, ' '),
                        date: new Date(dateObj.date),
                        shift1Start: dateObj.shift1Start,
                        shift1End: dateObj.shift1End,
                        shift2Start: dateObj.shift2Start,
                        shift2End: dateObj.shift2End,
                        shift1: assignment.shift1,
                        shift2: assignment.shift2
                    });
                }
            }
        }

        // Clear out existing records to perform a full state synchronization ensuring deletions carry through
        await TeacherRoomModel.deleteMany({});
        
        const created = await TeacherRoomModel.insertMany(newRecords);

        res.json({
            success: true,
            message: "Teacher room assignments created successfully",
            data: created
        });
    }

    updateTeacherRoom = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, date, shift1Start, shift1End, shift2Start, shift2End, shift1, shift2 } = req.body;

        const room = await TeacherRoomModel.findById(id);

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Room not found"
            });
        }

        if (name !== undefined) room.name = name.trim().replace(/\s+/g, ' ');
        if (date !== undefined) room.date = date;
        if (shift1Start !== undefined) room.shift1Start = shift1Start;
        if (shift1End !== undefined) room.shift1End = shift1End;
        if (shift2Start !== undefined) room.shift2Start = shift2Start;
        if (shift2End !== undefined) room.shift2End = shift2End;
        if (shift1 !== undefined) room.shift1 = shift1;
        if (shift2 !== undefined) room.shift2 = shift2;

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

            let query: any = {};
            let dateString = "";

            if (date) {
                const inputDate = new Date(date);
                if (isNaN(inputDate.getTime())) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid date format"
                    });
                }

                dateString = ` on date ${inputDate.toDateString()}`;

                const startOfDay = new Date(inputDate);
                startOfDay.setUTCHours(0,0,0,0);
                
                const endOfDay = new Date(inputDate);
                endOfDay.setUTCHours(23,59,59,999);

                query.date = { $gte: startOfDay, $lte: endOfDay };
            }

            let rooms = await TeacherRoomModel.find(query);

            const cleanName = (name || "").trim();
            if (cleanName) {
                rooms = rooms.filter(room => nameMatches(cleanName, room.name || ""));
            }

            // Sort results by date ascending
            rooms.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


            if (!rooms || rooms.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: `No exam room assignments found for teacher name similar to "${name}"${dateString}`
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

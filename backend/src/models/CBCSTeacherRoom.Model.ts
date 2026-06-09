import mongoose from "mongoose";
import { teacherRoomSchema } from "./TeacherRoom.Model";

export default mongoose.model("CBCSTeacherRoom", teacherRoomSchema);

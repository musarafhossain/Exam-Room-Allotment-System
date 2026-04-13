import UserModel from "./User.Models";
import StudentRoomModel from "./StudentRoom.Models";
import TeacherRoomModel from "./TeacherRoom.Models";
import SubjectModel from "./Subject.Models";
import PaperModel from "./Paper.Models";
import FloorModel from "./Floor.Models";
import BuildingModel from "./Building.Models";

export interface ResponseModel<T> extends Partial<PageModel<T>> {
  data?: T
  status?: number
  message: string
  success: boolean
}

export class PageModel<T> {
  public items!: Array<T>;
  public total!: number;
  public currentPage!: number;
  public lastPage!: number;
  public unreadCount?: number;
}

export {
  UserModel,
  StudentRoomModel,
  TeacherRoomModel,
  SubjectModel,
  PaperModel,
  FloorModel,
  BuildingModel,
}
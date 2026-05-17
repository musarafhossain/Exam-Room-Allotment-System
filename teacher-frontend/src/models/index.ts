import TeacherRoomModel from "./TeacherRoom.Models";

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
  TeacherRoomModel,
}
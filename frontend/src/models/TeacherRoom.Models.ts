import { BaseModel } from "./Base.Models";

export default class TeacherRoomModel extends BaseModel {
    public name!: string;
    public roomNo!: string;
    public floor?: string;
    public building?: string;
    public time!: string;
    public date!: string;
}

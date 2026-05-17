import { BaseModel } from "./Base.Models";

export default class TeacherRoomModel extends BaseModel {
    public name!: string;
    public date!: string;
    public shift1Start?: string;
    public shift1End?: string;
    public shift2Start?: string;
    public shift2End?: string;
    public shift1?: boolean;
    public shift2?: boolean;
}

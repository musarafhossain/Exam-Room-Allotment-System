import { BaseModel } from "./Base.Models";

export default class StudentRoomModel extends BaseModel {
    public examType?: 'UG/PG' | 'Others';
    public examName?: string;
    public roomNo!: string;
    public floor?: string;
    public building?: string;
    public subject?: string;
    public paper?: string;
    public semester?: number;
    public time?: string;
    public date!: string;
    public regNoFrom!: string;
    public regNoTo!: string;
}
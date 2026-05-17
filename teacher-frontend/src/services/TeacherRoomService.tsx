import BaseService from "./BaseService";
import { ResponseModel, TeacherRoomModel } from "../models";
import { Config } from "../Config";

export default class TeacherRoomService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'teacher-rooms/';

    public static findTeacherRoom(params = {}): Promise<ResponseModel<TeacherRoomModel>> {
        TeacherRoomService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.post(`${this.API_PREFIX}find-teacher-room`, params, { cancelToken: TeacherRoomService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }
}

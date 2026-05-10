import BaseService from "./BaseService";
import { ResponseModel, StudentRoomModel } from "../models";
import { Config } from "../Config";

export default class StudentRoomService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'student-rooms/';

    public static findStudentRoom(params = {}): Promise<ResponseModel<StudentRoomModel>> {
        StudentRoomService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.post(`${this.API_PREFIX}find-student-room`, params, { cancelToken: StudentRoomService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }
}
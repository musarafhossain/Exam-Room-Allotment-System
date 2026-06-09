import BaseService from "./BaseService";
import { ResponseModel, PageModel, TeacherRoomModel } from "../models";
import { Config } from "../Config";

export default class CBCSTeacherRoomService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'cbcs-teacher-rooms/';

    public static getList(params = {}): Promise<ResponseModel<TeacherRoomModel>> {
        CBCSTeacherRoomService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX, { params, cancelToken: CBCSTeacherRoomService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static create(params = {}): Promise<ResponseModel<TeacherRoomModel>> {
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static update(id: string, params = {}): Promise<ResponseModel<TeacherRoomModel>> {
        return new Promise((resolve, reject) => {
            this.Http.patch(`${this.API_PREFIX}${id}`, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static delete(id: string): Promise<ResponseModel<TeacherRoomModel>> {
        return new Promise((resolve, reject) => {
            this.Http.delete(`${this.API_PREFIX}${id}`)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static findTeacherRoom(params = {}): Promise<ResponseModel<TeacherRoomModel>> {
        CBCSTeacherRoomService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.post(`${this.API_PREFIX}find-teacher-room`, params, { cancelToken: CBCSTeacherRoomService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static bulkDelete(ids: string[]): Promise<ResponseModel<any>> {
        return new Promise((resolve, reject) => {
            this.Http.post(`${this.API_PREFIX}bulk-delete`, { ids })
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }
}

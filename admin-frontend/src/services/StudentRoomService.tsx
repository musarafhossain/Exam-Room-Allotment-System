import BaseService from "./BaseService";
import { ResponseModel, PageModel, StudentRoomModel } from "../models";
import { Config } from "../Config";

export default class StudentRoomService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'student-rooms/';
    public static getList(params = {}): Promise<ResponseModel<StudentRoomModel>> {
        StudentRoomService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX, { params, cancelToken: StudentRoomService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static getFilterOptions(params = {}): Promise<ResponseModel<{ dates: string[], times: string[] }>> {
        return new Promise((resolve, reject) => {
            this.Http.get(`${this.API_PREFIX}filters/options`, { params })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static getById(id: string, params = {}): Promise<ResponseModel<StudentRoomModel>> {
        StudentRoomService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(`${this.API_PREFIX}${id}`, { params, cancelToken: StudentRoomService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static create(params = {}): Promise<ResponseModel<StudentRoomModel>> {
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static update(id: string, params = {}): Promise<ResponseModel<StudentRoomModel>> {
        return new Promise((resolve, reject) => {
            this.Http.patch(`${this.API_PREFIX}${id}`, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static delete(id: string, params = {}): Promise<ResponseModel<StudentRoomModel>> {
        return new Promise((resolve, reject) => {
            this.Http.delete(`${this.API_PREFIX}${id}`, {
                params,
                cancelToken: StudentRoomService.source?.token,
            })
                .then((res) => resolve(res.data))
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

    public static bulkUpdate(payload: { ids: string[], updateData: any }): Promise<ResponseModel<any>> {
        return new Promise((resolve, reject) => {
            this.Http.post(`${this.API_PREFIX}bulk-update`, payload)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }
}
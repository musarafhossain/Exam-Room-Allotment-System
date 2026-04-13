import BaseService from "./BaseService";
import { ResponseModel, PageModel, PaperModel } from "../models";
import { Config } from "../Config";

export default class PaperService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'papers/';
    
    public static getList(params = {}): Promise<ResponseModel<PaperModel>> {
        PaperService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX, { params, cancelToken: PaperService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static getById(id: string, params = {}): Promise<ResponseModel<PaperModel>> {
        PaperService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(`${this.API_PREFIX}${id}`, { params, cancelToken: PaperService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static create(params = {}): Promise<ResponseModel<PaperModel>> {
        return new Promise((resolve, reject) => {
            this.Http.post(this.API_PREFIX, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static update(id: string, params = {}): Promise<ResponseModel<PaperModel>> {
        return new Promise((resolve, reject) => {
            this.Http.patch(`${this.API_PREFIX}${id}`, params)
                .then((res) => resolve(res.data))
                .catch((err) => reject(err));
        });
    }

    public static delete(id: string, params = {}): Promise<ResponseModel<PaperModel>> {
        return new Promise((resolve, reject) => {
            this.Http.delete(`${this.API_PREFIX}${id}`, {
                params,
                cancelToken: PaperService.source?.token,
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
}

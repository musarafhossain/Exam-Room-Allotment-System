import BaseService from "./BaseService";
import { ResponseModel, SubjectModel } from "../models";
import { Config } from "../Config";

export default class SubjectService extends BaseService {
    public static API_PREFIX = Config.API.URL + 'subjects/';
    
    public static getList(params = {}): Promise<ResponseModel<SubjectModel>> {
        SubjectService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX, { params, cancelToken: SubjectService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }

    public static getExamSubjects(params = {}): Promise<ResponseModel<string[]>> {
        SubjectService.initCancelToken();
        return new Promise((resolve, reject) => {
            this.Http.get(this.API_PREFIX + 'exam-subjects', { params, cancelToken: SubjectService.source?.token })
                .then((res) => resolve(res?.data))
                .catch((err) => reject(err));
        });
    }
}

import type { HttpModel, CancelTokenSource, CancelTokenStatic } from 'Request';

import { Http, FixedHttp } from 'Request';

export default class BaseService {
  static Http: HttpModel = Http;
  static FixedHttp = FixedHttp;
  static cancelToken: CancelTokenStatic;
  static source: CancelTokenSource;

  static initCancelToken() {
    this.cancelToken = Http.CancelToken;
    this.source = this.cancelToken?.source();
  }

  static cancelRequestIfPending() {
    this.source?.cancel();
  }
}

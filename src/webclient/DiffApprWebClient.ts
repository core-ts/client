import {HttpRequest} from '../http/HttpRequest';
import {ApprWebClient, Status} from './ApprWebClient';
import {DiffWebClient} from './DiffWebClient';
import {Metadata, MetaModel} from './json';

export class DiffApprWebClient<T, ID> extends DiffWebClient<T, ID> {
  constructor(protected serviceUrl: string, protected http: HttpRequest, protected model: Metadata, metaModel?: MetaModel) {
    super(serviceUrl, http, model, metaModel);
    this.apprWebClient = new ApprWebClient(serviceUrl, http, null, this._ids);
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
  }
  private apprWebClient: ApprWebClient<ID>;
  approve(id: ID, ctx?: any): Promise<Status> {
    return this.apprWebClient.approve(id);
  }
  reject(id: ID, ctx?: any): Promise<Status> {
    return this.apprWebClient.reject(id);
  }
}

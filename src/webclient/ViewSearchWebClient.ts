import {HttpRequest} from '../http/HttpRequest';
import {SearchModel} from '../model/SearchModel';
import {SearchResult} from '../model/SearchResult';
import {Metadata} from './MetadataUtil';
import {SearchWebClient} from './SearchWebClient';
import {ViewWebClient} from './ViewWebClient';

export class ViewSearchWebClient<T, ID, S extends SearchModel> extends ViewWebClient<T, ID> {
  constructor(serviceUrl: string, http: HttpRequest, model: Metadata) {
    super(serviceUrl, http, model);
    this.searchWebClient = new SearchWebClient<T, S>(serviceUrl, http, null, this._metamodel);
  }
  protected searchWebClient: SearchWebClient<T, S>;

  search(s: S): Promise<SearchResult<T>> {
    return this.searchWebClient.search(s);
  }
}

"use strict";
var __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (_) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0: case 1: t = op; break;
        case 4: _.label++; return { value: op[1], done: false };
        case 5: _.label++; y = op[1]; op = [0]; continue;
        case 7: op = _.ops.pop(); _.trys.pop(); continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
          if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
          if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
          if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
          if (t[2]) _.ops.pop();
          _.trys.pop(); continue;
      }
      op = body.call(thisArg, _);
    } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
    if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
};
Object.defineProperty(exports,"__esModule",{value:true});
var json_1 = require("./json");
function param(obj) {
  var keys = Object.keys(obj);
  var arrs = [];
  for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
    var item = keys_1[_i];
    var str = encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]);
    arrs.push(str);
  }
  return arrs.join('&');
}
exports.param = param;
var resource = (function () {
  function resource() {
  }
  return resource;
}());
exports.resource = resource;
var DefaultCsvService = (function () {
  function DefaultCsvService(c) {
    this.c = c;
    this._csv = c;
    this.fromString = this.fromString.bind(this);
  }
  DefaultCsvService.prototype.fromString = function (value) {
    var _this = this;
    return new Promise(function (resolve) {
      _this._csv({ noheader: true, output: 'csv' }).fromString(value).then(function (v) { return resolve(v); });
    });
  };
  return DefaultCsvService;
}());
exports.DefaultCsvService = DefaultCsvService;
function fromString(value) {
  return resource.csv.fromString(value);
}
exports.fromString = fromString;
function optimizeSearchModel(s) {
  var keys = Object.keys(s);
  var o = {};
  for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
    var key = keys_2[_i];
    var p = s[key];
    if (key === 'page') {
      if (p && p >= 1) {
        o[key] = p;
      }
      else {
        o[key] = 1;
      }
    }
    else if (key === 'limit') {
      if (p && p >= 1) {
        o[key] = p;
      }
    }
    else if (key === 'firstLimit') {
      if (p && p >= 1) {
        o[key] = p;
      }
    }
    else {
      if (p && p !== '') {
        o[key] = p;
      }
    }
  }
  if (o.limit != null && o.firstLimit === o.limit) {
    delete o['firstLimit'];
  }
  if (o.page <= 1) {
    delete o['page'];
  }
  for (var _a = 0, _b = Object.keys(o); _a < _b.length; _a++) {
    var key = _b[_a];
    if (Array.isArray(o[key]) && o[key].length === 0) {
      delete o[key];
    }
  }
  return o;
}
exports.optimizeSearchModel = optimizeSearchModel;
function fromCsv(m, csv) {
  return __awaiter(this, void 0, void 0, function () {
    var items, arr, fields, i, obj, len, j, x;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4, fromString(csv)];
        case 1:
          items = _a.sent();
          arr = [];
          fields = m.fields;
          for (i = 1; i < items.length; i++) {
            obj = {};
            len = Math.min(fields.length, items[i].length);
            for (j = 0; j < len; j++) {
              obj[fields[j]] = items[i][j];
            }
            arr.push(obj);
          }
          x = {
            total: parseFloat(items[0][0]),
            results: arr,
            last: (items[0][0] === '1')
          };
          return [2, x];
      }
    });
  });
}
exports.fromCsv = fromCsv;
var ViewWebClient = (function () {
  function ViewWebClient(serviceUrl, http, model, _metamodel) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.model = model;
    this._metamodel = _metamodel;
    this._keys = [];
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.formatObject = this.formatObject.bind(this);
    this.formatObjects = this.formatObjects.bind(this);
    if (!_metamodel) {
      var m = json_1.build(this.model);
      this._metamodel = m;
    }
    this._keys = this._metamodel.keys;
  }
  ViewWebClient.prototype.keys = function () {
    return this._keys;
  };
  ViewWebClient.prototype.metadata = function () {
    return this.model;
  };
  ViewWebClient.prototype.all = function () {
    return __awaiter(this, void 0, void 0, function () {
      var res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4, this.http.get(this.serviceUrl)];
          case 1:
            res = _a.sent();
            return [2, this.formatObjects(res)];
        }
      });
    });
  };
  ViewWebClient.prototype.load = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res, err_1;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            url = this.serviceUrl + '/' + id;
            if (this._keys && this._keys.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._keys; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4, this.http.get(url)];
          case 2:
            res = _b.sent();
            return [2, this.formatObject(res)];
          case 3:
            err_1 = _b.sent();
            if (err_1 && err_1.status === 404) {
              return [2, null];
            }
            else {
              throw err_1;
            }
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  ViewWebClient.prototype.formatObjects = function (list) {
    if (!list || list.length === 0) {
      return list;
    }
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
      var obj = list_1[_i];
      json_1.json(obj, this._metamodel);
    }
    return list;
  };
  ViewWebClient.prototype.formatObject = function (obj) {
    json_1.json(obj, this._metamodel);
    return obj;
  };
  return ViewWebClient;
}());
exports.ViewWebClient = ViewWebClient;
var GenericWebClient = (function (_super) {
  __extends(GenericWebClient, _super);
  function GenericWebClient(serviceUrl, http, model, metaModel) {
    var _this = _super.call(this, serviceUrl, http, model, metaModel) || this;
    _this.formatResultInfo = _this.formatResultInfo.bind(_this);
    _this.insert = _this.insert.bind(_this);
    _this.update = _this.update.bind(_this);
    _this.patch = _this.patch.bind(_this);
    _this.delete = _this.delete.bind(_this);
    return _this;
  }
  GenericWebClient.prototype.formatResultInfo = function (result) {
    if (result && result.status === 1 && result.value && typeof result.value === 'object') {
      result.value = json_1.json(result.value, this._metamodel);
    }
    return result;
  };
  GenericWebClient.prototype.insert = function (obj) {
    return __awaiter(this, void 0, void 0, function () {
      var res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            json_1.json(obj, this._metamodel);
            return [4, this.http.post(this.serviceUrl, obj)];
          case 1:
            res = _a.sent();
            return [2, this.formatResultInfo(res)];
        }
      });
    });
  };
  GenericWebClient.prototype.update = function (obj) {
    return __awaiter(this, void 0, void 0, function () {
      var url, keys, _i, keys_3, name, res, err_2, x;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            url = this.serviceUrl;
            keys = this.keys();
            if (keys && keys.length > 0) {
              for (_i = 0, keys_3 = keys; _i < keys_3.length; _i++) {
                name = keys_3[_i];
                url += '/' + obj[name];
              }
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4, this.http.put(url, obj)];
          case 2:
            res = _a.sent();
            return [2, this.formatResultInfo(res)];
          case 3:
            err_2 = _a.sent();
            if (err_2 && err_2.status === 404) {
              x = 0;
              return [2, x];
            }
            else {
              throw err_2;
            }
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  GenericWebClient.prototype.patch = function (obj) {
    return __awaiter(this, void 0, void 0, function () {
      var url, keys, _i, keys_4, name, res, err_3, x;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            url = this.serviceUrl;
            keys = this.keys();
            if (keys && keys.length > 0) {
              for (_i = 0, keys_4 = keys; _i < keys_4.length; _i++) {
                name = keys_4[_i];
                url += '/' + obj[name];
              }
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4, this.http.patch(url, obj)];
          case 2:
            res = _a.sent();
            return [2, this.formatResultInfo(res)];
          case 3:
            err_3 = _a.sent();
            if (err_3 && err_3.status === 404) {
              x = 0;
              return [2, x];
            }
            else {
              throw err_3;
            }
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  GenericWebClient.prototype.delete = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var url, keys_6, _i, keys_5, key, res, err_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            url = this.serviceUrl + '/' + id;
            if (typeof id === 'object' && this.model) {
              keys_6 = this.keys();
              if (keys_6 && keys_6.length > 0) {
                url = this.serviceUrl;
                for (_i = 0, keys_5 = keys_6; _i < keys_5.length; _i++) {
                  key = keys_5[_i];
                  url = url + '/' + id[key];
                }
              }
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4, this.http.delete(url)];
          case 2:
            res = _a.sent();
            return [2, res];
          case 3:
            err_4 = _a.sent();
            if (err_4 && err_4.status === 404) {
              return [2, 0];
            }
            else {
              throw err_4;
            }
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  return GenericWebClient;
}(ViewWebClient));
exports.GenericWebClient = GenericWebClient;
var SearchWebClient = (function () {
  function SearchWebClient(serviceUrl, http, model, metaModel) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.formatSearch = this.formatSearch.bind(this);
    this.search = this.search.bind(this);
    this.buildSearchResult = this.buildSearchResult.bind(this);
    this.formatObjects = this.formatObjects.bind(this);
    if (metaModel) {
      this._metamodel = metaModel;
    }
    else {
      var m = json_1.build(model);
      this._metamodel = m;
    }
  }
  SearchWebClient.prototype.formatSearch = function (s) {
  };
  SearchWebClient.prototype.search = function (s) {
    return __awaiter(this, void 0, void 0, function () {
      var _i, _a, key, s2, keys2, searchUrl, res, params, searchUrl, res, postSearchUrl, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            this.formatSearch(s);
            if (this._metamodel && s.fields && s.fields.length > 0) {
              if (this._metamodel.keys && this._metamodel.keys.length > 0) {
                for (_i = 0, _a = this._metamodel.keys; _i < _a.length; _i++) {
                  key = _a[_i];
                  if (s.fields.indexOf(key) < 0) {
                    s.fields.push(key);
                  }
                }
              }
            }
            s2 = optimizeSearchModel(s);
            keys2 = Object.keys(s2);
            if (!(keys2.length === 0)) return [3, 2];
            searchUrl = this.serviceUrl + '/search';
            return [4, this.http.get(searchUrl)];
          case 1:
            res = _b.sent();
            if (typeof res === 'string') {
              return [2, fromCsv(s, res)];
            }
            else {
              return [2, this.buildSearchResult(res)];
            }
            return [3, 6];
          case 2:
            params = param(s2);
            searchUrl = this.serviceUrl + '/search' + '?' + params;
            if (!(searchUrl.length <= 1)) return [3, 4];
            return [4, this.http.get(searchUrl)];
          case 3:
            res = _b.sent();
            if (typeof res === 'string') {
              return [2, fromCsv(s, res)];
            }
            else {
              return [2, this.buildSearchResult(res)];
            }
            return [3, 6];
          case 4:
            postSearchUrl = this.serviceUrl + '/search';
            return [4, this.http.post(postSearchUrl, s2)];
          case 5:
            res = _b.sent();
            if (typeof res === 'string') {
              return [2, fromCsv(s, res)];
            }
            else {
              return [2, this.buildSearchResult(res)];
            }
            _b.label = 6;
          case 6: return [2];
        }
      });
    });
  };
  SearchWebClient.prototype.buildSearchResult = function (r) {
    if (r != null && r.results != null && r.results.length > 0) {
      this.formatObjects(r.results);
    }
    return r;
  };
  SearchWebClient.prototype.formatObjects = function (list) {
    if (!list || list.length === 0) {
      return list;
    }
    if (this._metamodel) {
      for (var _i = 0, list_2 = list; _i < list_2.length; _i++) {
        var obj = list_2[_i];
        json_1.json(obj, this._metamodel);
      }
    }
    return list;
  };
  return SearchWebClient;
}());
exports.SearchWebClient = SearchWebClient;
var DiffWebClient = (function () {
  function DiffWebClient(serviceUrl, http, metadata, metaModel) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.metadata = metadata;
    this.diff = this.diff.bind(this);
    this.keys = this.keys.bind(this);
    if (metaModel) {
      this._ids = metaModel.keys;
      this._metaModel = metaModel;
    }
    else {
      var m = json_1.build(metadata);
      this._metaModel = m;
      this._ids = m.keys;
    }
  }
  DiffWebClient.prototype.keys = function () {
    return this._ids;
  };
  DiffWebClient.prototype.diff = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res, err_5;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            url = this.serviceUrl + '/' + id + '/diff';
            if (this._ids && this._ids.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._ids; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
              url = url + '/diff';
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4, this.http.get(url)];
          case 2:
            res = _b.sent();
            if (!res) {
              return [2, null];
            }
            if (!res.value) {
              res.value = {};
            }
            if (typeof res.value === 'string') {
              res.value = JSON.parse(res.value);
            }
            if (!res.origin) {
              res.origin = {};
            }
            if (typeof res.origin === 'string') {
              res.origin = JSON.parse(res.origin);
            }
            if (res.value) {
              json_1.json(res.value, this._metaModel);
            }
            if (res.origin) {
              json_1.json(res.origin, this._metaModel);
            }
            return [2, res];
          case 3:
            err_5 = _b.sent();
            if (err_5 && err_5.status === 404) {
              return [2, null];
            }
            else {
              throw err_5;
            }
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  return DiffWebClient;
}());
exports.DiffWebClient = DiffWebClient;
var Status;
(function (Status) {
  Status[Status["DataNotFound"] = 0] = "DataNotFound";
  Status[Status["Success"] = 1] = "Success";
  Status[Status["Error"] = 2] = "Error";
  Status[Status["DataVersionError"] = 4] = "DataVersionError";
})(Status = exports.Status || (exports.Status = {}));
var ApprWebClient = (function () {
  function ApprWebClient(serviceUrl, http, model, ids) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.model = model;
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this._keys = (ids ? ids : json_1.keys(model));
  }
  ApprWebClient.prototype.approve = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res, err_6;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            url = this.serviceUrl + '/' + id + '/approve';
            if (this._keys && this._keys.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._keys; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
              url = url + '/approve';
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4, this.http.get(url)];
          case 2:
            res = _b.sent();
            return [2, res];
          case 3:
            err_6 = _b.sent();
            if (err_6 && err_6.status === 404) {
              return [2, Status.DataNotFound];
            }
            else {
              return [2, Status.Error];
            }
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  ApprWebClient.prototype.reject = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res, err_7;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            url = this.serviceUrl + '/' + id + '/reject';
            if (this._keys && this._keys.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._keys; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
              url = url + '/reject';
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 3, , 4]);
            return [4, this.http.get(url)];
          case 2:
            res = _b.sent();
            return [2, res];
          case 3:
            err_7 = _b.sent();
            if (err_7 && err_7.status === 404) {
              return [2, Status.DataNotFound];
            }
            else {
              return [2, Status.Error];
            }
            return [3, 4];
          case 4: return [2];
        }
      });
    });
  };
  return ApprWebClient;
}());
exports.ApprWebClient = ApprWebClient;
var DiffApprWebClient = (function (_super) {
  __extends(DiffApprWebClient, _super);
  function DiffApprWebClient(serviceUrl, http, model, metaModel) {
    var _this = _super.call(this, serviceUrl, http, model, metaModel) || this;
    _this.serviceUrl = serviceUrl;
    _this.http = http;
    _this.model = model;
    _this.apprWebClient = new ApprWebClient(serviceUrl, http, null, _this._ids);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  DiffApprWebClient.prototype.approve = function (id, ctx) {
    return this.apprWebClient.approve(id);
  };
  DiffApprWebClient.prototype.reject = function (id, ctx) {
    return this.apprWebClient.reject(id);
  };
  return DiffApprWebClient;
}(DiffWebClient));
exports.DiffApprWebClient = DiffApprWebClient;
var ViewSearchWebClient = (function (_super) {
  __extends(ViewSearchWebClient, _super);
  function ViewSearchWebClient(serviceUrl, http, model, metaModel) {
    var _this = _super.call(this, serviceUrl, http, model, metaModel) || this;
    _this.search = _this.search.bind(_this);
    _this.searchWebClient = new SearchWebClient(serviceUrl, http, null, _this._metamodel);
    return _this;
  }
  ViewSearchWebClient.prototype.search = function (s) {
    return this.searchWebClient.search(s);
  };
  return ViewSearchWebClient;
}(ViewWebClient));
exports.ViewSearchWebClient = ViewSearchWebClient;
var GenericSearchWebClient = (function (_super) {
  __extends(GenericSearchWebClient, _super);
  function GenericSearchWebClient(serviceUrl, http, model, metaModel) {
    var _this = _super.call(this, serviceUrl, http, model, metaModel) || this;
    _this.search = _this.search.bind(_this);
    _this.searchWebClient = new SearchWebClient(serviceUrl, http, null, _this._metamodel);
    return _this;
  }
  GenericSearchWebClient.prototype.search = function (s) {
    return this.searchWebClient.search(s);
  };
  return GenericSearchWebClient;
}(GenericWebClient));
exports.GenericSearchWebClient = GenericSearchWebClient;
var ViewSearchDiffApprWebClient = (function (_super) {
  __extends(ViewSearchDiffApprWebClient, _super);
  function ViewSearchDiffApprWebClient(serviceUrl, http, model, metaModel) {
    var _this = _super.call(this, serviceUrl, http, model, metaModel) || this;
    _this.diffWebClient = new DiffApprWebClient(serviceUrl, http, null, _this._metamodel);
    _this.diff = _this.diff.bind(_this);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  ViewSearchDiffApprWebClient.prototype.diff = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.diff(id)];
      });
    });
  };
  ViewSearchDiffApprWebClient.prototype.approve = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.approve(id)];
      });
    });
  };
  ViewSearchDiffApprWebClient.prototype.reject = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.reject(id)];
      });
    });
  };
  return ViewSearchDiffApprWebClient;
}(ViewSearchWebClient));
exports.ViewSearchDiffApprWebClient = ViewSearchDiffApprWebClient;
var GenericSearchDiffApprWebClient = (function (_super) {
  __extends(GenericSearchDiffApprWebClient, _super);
  function GenericSearchDiffApprWebClient(serviceUrl, http, model, metaModel) {
    var _this = _super.call(this, serviceUrl, http, model, metaModel) || this;
    _this.diffWebClient = new DiffApprWebClient(serviceUrl, http, null, _this._metamodel);
    _this.diff = _this.diff.bind(_this);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  GenericSearchDiffApprWebClient.prototype.diff = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.diff(id)];
      });
    });
  };
  GenericSearchDiffApprWebClient.prototype.approve = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.approve(id)];
      });
    });
  };
  GenericSearchDiffApprWebClient.prototype.reject = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.reject(id)];
      });
    });
  };
  return GenericSearchDiffApprWebClient;
}(GenericSearchWebClient));
exports.GenericSearchDiffApprWebClient = GenericSearchDiffApprWebClient;

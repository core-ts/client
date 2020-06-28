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
Object.defineProperty(exports, "__esModule", { value: true });
var MetadataUtil_1 = require("./MetadataUtil");
var WebParameterUtil = (function () {
  function WebParameterUtil() {
  }
  WebParameterUtil.param = function (obj) {
    var keys = Object.keys(obj);
    var arrs = [];
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var item = keys_1[_i];
      var str = encodeURIComponent(item) + '=' + encodeURIComponent(obj[item]);
      arrs.push(str);
    }
    return arrs.join('&');
  };
  return WebParameterUtil;
}());
exports.WebParameterUtil = WebParameterUtil;
var DefaultCsvService = (function () {
  function DefaultCsvService(c) {
    this.c = c;
    this._csv = c;
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
var CsvUtil = (function () {
  function CsvUtil() {
  }
  CsvUtil.setCsvService = function (csvService) {
    CsvUtil._csvService = csvService;
  };
  CsvUtil.fromString = function (value) {
    return CsvUtil._csvService.fromString(value);
  };
  return CsvUtil;
}());
exports.CsvUtil = CsvUtil;
var SearchUtil = (function () {
  function SearchUtil() {
  }
  SearchUtil.optimizeSearchModel = function (s) {
    var keys = Object.keys(s);
    var o = {};
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
      var key = keys_2[_i];
      var p = s[key];
      if (key === 'pageIndex') {
        if (p && p >= 1) {
          o[key] = p;
        }
        else {
          o[key] = 1;
        }
      }
      else if (key === 'pageSize') {
        if (p && p >= 1) {
          o[key] = p;
        }
      }
      else if (key === 'initPageSize') {
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
    o.includeTotal = true;
    if (o.pageSize != null && o.initPageSize === o.pageSize) {
      delete o['initPageSize'];
    }
    for (var _a = 0, _b = Object.keys(o); _a < _b.length; _a++) {
      var key = _b[_a];
      if (Array.isArray(o[key]) && o[key].length === 0) {
        delete o[key];
      }
    }
    return o;
  };
  SearchUtil.fromCsv = function (m, csv) {
    return __awaiter(this, void 0, void 0, function () {
      var items, arr, fields, i, obj, len, j, x;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4, CsvUtil.fromString(csv)];
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
              itemTotal: parseFloat(items[0][0]),
              results: arr,
              lastPage: (items[0][0] === '1')
            };
            return [2, x];
        }
      });
    });
  };
  return SearchUtil;
}());
exports.SearchUtil = SearchUtil;
var ViewWebClient = (function () {
  function ViewWebClient(serviceUrl, http, model) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.model = model;
    this._ids = [];
    this.metadata = this.metadata.bind(this);
    this.ids = this.ids.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    this.formatObject = this.formatObject.bind(this);
    this.formatObjects = this.formatObjects.bind(this);
    var metaModel = MetadataUtil_1.MetadataUtil.getMetaModel(this.model);
    var keys = metaModel.primaryKeys;
    if (keys) {
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].name && keys[i].name.length > 0) {
          this._ids.push(keys[i].name);
        }
      }
    }
    this._metamodel = metaModel;
  }
  ViewWebClient.prototype.ids = function () {
    return this._ids;
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
      var url, _i, _a, name, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            url = this.serviceUrl + '/' + id;
            if (this._ids && this._ids.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._ids; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
            }
            return [4, this.http.get(url)];
          case 1:
            res = _b.sent();
            return [2, this.formatObject(res)];
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
      MetadataUtil_1.MetadataUtil.json(obj, this._metamodel);
    }
    return list;
  };
  ViewWebClient.prototype.formatObject = function (obj) {
    MetadataUtil_1.MetadataUtil.json(obj, this._metamodel);
    return obj;
  };
  return ViewWebClient;
}());
exports.ViewWebClient = ViewWebClient;
var GenericWebClient = (function (_super) {
  __extends(GenericWebClient, _super);
  function GenericWebClient(serviceUrl, http, model) {
    var _this = _super.call(this, serviceUrl, http, model) || this;
    _this.formatResultInfo = _this.formatResultInfo.bind(_this);
    _this.insert = _this.insert.bind(_this);
    _this.update = _this.update.bind(_this);
    _this.patch = _this.patch.bind(_this);
    _this.delete = _this.delete.bind(_this);
    return _this;
  }
  GenericWebClient.prototype.formatResultInfo = function (result) {
    if (result.status === 1 && result.value) {
      result.value = MetadataUtil_1.MetadataUtil.json(result.value, this._metamodel);
    }
    return result;
  };
  GenericWebClient.prototype.insert = function (obj) {
    return __awaiter(this, void 0, void 0, function () {
      var res;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            MetadataUtil_1.MetadataUtil.json(obj, this._metamodel);
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
      var metadata, url, _i, _a, item, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            metadata = this.metadata();
            url = this.serviceUrl;
            for (_i = 0, _a = this._metamodel.primaryKeys; _i < _a.length; _i++) {
              item = _a[_i];
              url += '/' + obj[item.name];
            }
            return [4, this.http.put(url, obj)];
          case 1:
            res = _b.sent();
            return [2, this.formatResultInfo(res)];
        }
      });
    });
  };
  GenericWebClient.prototype.patch = function (obj, body) {
    return __awaiter(this, void 0, void 0, function () {
      var metadata, url, _i, _a, item, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            metadata = this.metadata();
            url = this.serviceUrl;
            for (_i = 0, _a = this._metamodel.primaryKeys; _i < _a.length; _i++) {
              item = _a[_i];
              url += '/' + obj[item.name];
            }
            return [4, this.http.patch(url, body)];
          case 1:
            res = _b.sent();
            return [2, this.formatResultInfo(res)];
        }
      });
    });
  };
  GenericWebClient.prototype.delete = function (id) {
    var url = this.serviceUrl + '/' + id;
    if (typeof id === 'object' && this.model) {
      if (this._metamodel.primaryKeys && this._metamodel.primaryKeys.length > 0) {
        url = this.serviceUrl;
        for (var _i = 0, _a = this._metamodel.primaryKeys; _i < _a.length; _i++) {
          var key = _a[_i];
          url = url + '/' + id[key.name];
        }
      }
    }
    return this.http.delete(url);
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
      var metaModel2 = MetadataUtil_1.MetadataUtil.getMetaModel(model);
      this._metamodel = metaModel2;
    }
  }
  SearchWebClient.prototype.formatSearch = function (s) {
  };
  SearchWebClient.prototype.search = function (s) {
    return __awaiter(this, void 0, void 0, function () {
      var _i, _a, id, s2, keys2, searchUrl, res, params, searchUrl, res, postSearchUrl, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            this.formatSearch(s);
            if (this._metamodel && s.fields && s.fields.length > 0) {
              if (this._metamodel.primaryKeys && this._metamodel.primaryKeys.length > 0) {
                for (_i = 0, _a = this._metamodel.primaryKeys; _i < _a.length; _i++) {
                  id = _a[_i];
                  if (s.fields.indexOf(id.name) < 0) {
                    s.fields.push(id.name);
                  }
                }
              }
            }
            s2 = SearchUtil.optimizeSearchModel(s);
            keys2 = Object.keys(s2);
            if (!(keys2.length === 0)) return [3, 2];
            searchUrl = this.serviceUrl + '/search';
            return [4, this.http.get(searchUrl)];
          case 1:
            res = _b.sent();
            if (typeof res === 'string') {
              return [2, SearchUtil.fromCsv(s, res)];
            }
            else {
              return [2, this.buildSearchResult(res)];
            }
            return [3, 6];
          case 2:
            params = WebParameterUtil.param(s2);
            searchUrl = this.serviceUrl + '/search' + '?' + params;
            if (!(searchUrl.length <= 1)) return [3, 4];
            return [4, this.http.get(searchUrl)];
          case 3:
            res = _b.sent();
            if (typeof res === 'string') {
              return [2, SearchUtil.fromCsv(s, res)];
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
              return [2, SearchUtil.fromCsv(s, res)];
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
        MetadataUtil_1.MetadataUtil.json(obj, this._metamodel);
      }
    }
    return list;
  };
  return SearchWebClient;
}());
exports.SearchWebClient = SearchWebClient;
var DiffWebClient = (function () {
  function DiffWebClient(serviceUrl, http, model, ids) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.model = model;
    this.diff = this.diff.bind(this);
    this._ids = (ids ? ids : MetadataUtil_1.MetadataUtil.ids(model));
  }
  DiffWebClient.prototype.ids = function () {
    return this._ids;
  };
  DiffWebClient.prototype.diff = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res;
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
            return [4, this.http.get(url)];
          case 1:
            res = _b.sent();
            if (!res.newValue) {
              res.newValue = {};
            }
            if (typeof res.newValue === 'string') {
              res.newValue = JSON.parse(res.newValue);
            }
            if (!res.oldValue) {
              res.oldValue = {};
            }
            if (typeof res.oldValue === 'string') {
              res.oldValue = JSON.parse(res.oldValue);
            }
            return [2, res];
        }
      });
    });
  };
  return DiffWebClient;
}());
exports.DiffWebClient = DiffWebClient;
var StatusCode;
(function (StatusCode) {
  StatusCode[StatusCode["DataNotFound"] = 0] = "DataNotFound";
  StatusCode[StatusCode["Success"] = 1] = "Success";
  StatusCode[StatusCode["Error"] = 2] = "Error";
  StatusCode[StatusCode["DataVersionError"] = 4] = "DataVersionError";
})(StatusCode = exports.StatusCode || (exports.StatusCode = {}));
var ApprWebClient = (function () {
  function ApprWebClient(serviceUrl, http, model, ids) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.model = model;
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this._ids = (ids ? ids : MetadataUtil_1.MetadataUtil.ids(model));
  }
  ApprWebClient.prototype.ids = function () {
    return this._ids;
  };
  ApprWebClient.prototype.approve = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            url = this.serviceUrl + '/' + id + '/approve';
            if (this._ids && this._ids.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._ids; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
              url = url + '/approve';
            }
            return [4, this.http.get(url)];
          case 1:
            res = _b.sent();
            return [2, res];
        }
      });
    });
  };
  ApprWebClient.prototype.reject = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            url = this.serviceUrl + '/' + id + '/reject';
            if (this._ids && this._ids.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._ids; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
              url = url + '/reject';
            }
            return [4, this.http.get(url)];
          case 1:
            res = _b.sent();
            return [2, res];
        }
      });
    });
  };
  return ApprWebClient;
}());
exports.ApprWebClient = ApprWebClient;
var DiffApprWebClient = (function (_super) {
  __extends(DiffApprWebClient, _super);
  function DiffApprWebClient(serviceUrl, http, model, ids) {
    var _this = _super.call(this, serviceUrl, http, model, ids) || this;
    _this.serviceUrl = serviceUrl;
    _this.http = http;
    _this.model = model;
    _this.diffWebClient = new DiffWebClient(serviceUrl, http, null, _this._ids);
    _this.diff = _this.diff.bind(_this);
    return _this;
  }
  DiffApprWebClient.prototype.diff = function (id) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.diff(id)];
      });
    });
  };
  return DiffApprWebClient;
}(ApprWebClient));
exports.DiffApprWebClient = DiffApprWebClient;
var ViewSearchWebClient = (function (_super) {
  __extends(ViewSearchWebClient, _super);
  function ViewSearchWebClient(serviceUrl, http, model) {
    var _this = _super.call(this, serviceUrl, http, model) || this;
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
  function GenericSearchWebClient(serviceUrl, http, model) {
    var _this = _super.call(this, serviceUrl, http, model) || this;
    _this.searchWebClient = new SearchWebClient(serviceUrl, http, null, _this._metamodel);
    return _this;
  }
  GenericSearchWebClient.prototype.search = function (s) {
    return this.searchWebClient.search(s);
  };
  return GenericSearchWebClient;
}(GenericWebClient));
exports.GenericSearchWebClient = GenericSearchWebClient;
var GenericSearchDiffApprWebClient = (function (_super) {
  __extends(GenericSearchDiffApprWebClient, _super);
  function GenericSearchDiffApprWebClient(serviceUrl, model, http) {
    var _this = _super.call(this, serviceUrl, http, model) || this;
    _this.diffWebClient = new DiffApprWebClient(serviceUrl, http, null, _this.ids());
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

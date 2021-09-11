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
  var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
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
var json_1 = require("./json");
function param(obj, fields, excluding) {
  var ks = Object.keys(obj);
  var arrs = [];
  if (!fields || fields.length === 0) {
    fields = 'fields';
  }
  if (!excluding || excluding.length === 0) {
    excluding = 'excluding';
  }
  for (var _i = 0, ks_1 = ks; _i < ks_1.length; _i++) {
    var key = ks_1[_i];
    if (key === fields) {
      if (Array.isArray(obj[key])) {
        var x = obj[key].join(',');
        var str = encodeURIComponent(key) + '=' + encodeURIComponent(x);
        arrs.push(str);
      }
    }
    else if (key === excluding) {
      var t2 = obj[key];
      if (typeof t2 === 'object') {
        if (Array.isArray(t2)) {
        }
        else {
          for (var _a = 0, t2_1 = t2; _a < t2_1.length; _a++) {
            var k2 = t2_1[_a];
            var v = t2[k2];
            if (Array.isArray(v)) {
              var arr = [];
              for (var _b = 0, v_1 = v; _b < v_1.length; _b++) {
                var y = v_1[_b];
                if (y) {
                  if (typeof y === 'string') {
                    arr.push(y);
                  }
                  else if (typeof y === 'number') {
                    arr.push(y.toString());
                  }
                }
              }
              var x = arr.join(',');
              var str = encodeURIComponent(excluding + "." + k2) + '=' + encodeURIComponent(x);
              arrs.push(str);
            }
            else {
              var str = encodeURIComponent(excluding + "." + k2) + '=' + encodeURIComponent(v);
              arrs.push(str);
            }
          }
        }
      }
    }
    else {
      var v = obj[key];
      if (Array.isArray(v)) {
        var arr = [];
        for (var _c = 0, v_2 = v; _c < v_2.length; _c++) {
          var y = v_2[_c];
          if (y) {
            if (typeof y === 'string') {
              arr.push(y);
            }
            else if (typeof y === 'number') {
              arr.push(y.toString());
            }
          }
        }
        var x = arr.join(',');
        var str = encodeURIComponent(key) + '=' + encodeURIComponent(x);
        arrs.push(str);
      }
      else {
        var str = encodeURIComponent(key) + '=' + encodeURIComponent(v);
        arrs.push(str);
      }
    }
  }
  return arrs.join('&');
}
exports.param = param;
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
  var x = json_1.resources.csv;
  if (typeof x === 'function') {
    return x(value);
  }
  else {
    return x.fromString(value);
  }
}
exports.fromString = fromString;
function optimizeSearchModel(s, page, limit, firstLimit) {
  var ks = Object.keys(s);
  var o = {};
  for (var _i = 0, ks_2 = ks; _i < ks_2.length; _i++) {
    var key = ks_2[_i];
    var p = s[key];
    if (key === page) {
      if (p && p >= 1) {
        o[key] = p;
      }
      else {
        o[key] = 1;
      }
    }
    else if (key === limit) {
      if (p && p >= 1) {
        o[key] = p;
      }
    }
    else if (key === firstLimit) {
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
  if (o[limit] && o[firstLimit] === o[limit]) {
    delete o[firstLimit];
  }
  if (o[page] <= 1) {
    delete o[page];
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
function fromCsv(m, csv, sfields) {
  return __awaiter(this, void 0, void 0, function () {
    var items, arr, fields, i, obj, len, j, x;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0: return [4, fromString(csv)];
        case 1:
          items = _a.sent();
          arr = [];
          if (!sfields || sfields.length === 0) {
            sfields = 'fields';
          }
          fields = m[sfields];
          if (Array.isArray(fields)) {
            for (i = 1; i < items.length; i++) {
              obj = {};
              len = Math.min(fields.length, items[i].length);
              for (j = 0; j < len; j++) {
                obj[fields[j]] = items[i][j];
              }
              arr.push(obj);
            }
          }
          x = {
            total: parseFloat(items[0][0]),
            list: arr
          };
          if (items[0].length > 1 && items[0][1].length > 0) {
            x.nextPageToken = items[0][1];
          }
          return [2, x];
      }
    });
  });
}
exports.fromCsv = fromCsv;
var ViewWebClient = (function () {
  function ViewWebClient(serviceUrl, http, pmodel, ignoreDate, metamodel) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this._keys = [];
    this.metadata = this.metadata.bind(this);
    this.keys = this.keys.bind(this);
    this.all = this.all.bind(this);
    this.load = this.load.bind(this);
    if (metamodel) {
      this._metamodel = metamodel;
      this._keys = metamodel.keys;
      if (pmodel && !Array.isArray(pmodel)) {
        this.attributes = pmodel;
      }
    }
    else {
      if (pmodel) {
        if (Array.isArray(pmodel)) {
          this._keys = pmodel;
        }
        else {
          this.attributes = pmodel;
          var m = json_1.build(pmodel, ignoreDate);
          this._metamodel = m;
          this._keys = m.keys;
        }
      }
      else {
        this._keys = [];
      }
    }
  }
  ViewWebClient.prototype.keys = function () {
    return this._keys;
  };
  ViewWebClient.prototype.metadata = function () {
    return this.attributes;
  };
  ViewWebClient.prototype.all = function (ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var list;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0: return [4, this.http.get(this.serviceUrl)];
          case 1:
            list = _a.sent();
            if (!this._metamodel) {
              return [2, list];
            }
            return [2, json_1.jsonArray(list, this._metamodel)];
        }
      });
    });
  };
  ViewWebClient.prototype.load = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, obj, err_1, data;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            url = this.serviceUrl + '/' + id;
            if (this._keys && this._keys.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._keys; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
            }
            return [4, this.http.get(url)];
          case 1:
            obj = _b.sent();
            if (!this._metamodel) {
              return [2, obj];
            }
            return [2, json_1.json(obj, this._metamodel)];
          case 2:
            err_1 = _b.sent();
            data = (err_1 && err_1.response) ? err_1.response : err_1;
            if (data && (data.status === 404 || data.status === 410)) {
              return [2, null];
            }
            throw err_1;
          case 3: return [2];
        }
      });
    });
  };
  return ViewWebClient;
}());
exports.ViewWebClient = ViewWebClient;
var GenericWebClient = (function (_super) {
  __extends(GenericWebClient, _super);
  function GenericWebClient(serviceUrl, http, pmodel, status, ignoreDate, metamodel) {
    var _this = _super.call(this, serviceUrl, http, pmodel, ignoreDate, metamodel) || this;
    _this.status = status;
    _this.formatResultInfo = _this.formatResultInfo.bind(_this);
    _this.insert = _this.insert.bind(_this);
    _this.update = _this.update.bind(_this);
    _this.patch = _this.patch.bind(_this);
    _this.delete = _this.delete.bind(_this);
    if (!status) {
      _this.status = json_1.resources.status;
    }
    return _this;
  }
  GenericWebClient.prototype.formatResultInfo = function (result, ctx) {
    if (this._metamodel && result && typeof result === 'object' && result.status === 1 && result.value && typeof result.value === 'object') {
      result.value = json_1.json(result.value, this._metamodel);
    }
    return result;
  };
  GenericWebClient.prototype.insert = function (obj, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var res, err_2, data, x, x;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            if (this._metamodel) {
              json_1.json(obj, this._metamodel);
            }
            return [4, this.http.post(this.serviceUrl, obj)];
          case 1:
            res = _a.sent();
            if (!this._metamodel) {
              return [2, res];
            }
            return [2, this.formatResultInfo(res, ctx)];
          case 2:
            err_2 = _a.sent();
            if (err_2) {
              data = (err_2 && err_2.response) ? err_2.response : err_2;
              if (data.status === 404 || data.status === 410) {
                x = 0;
                if (this.status && this.status.not_found) {
                  x = this.status.not_found;
                }
                return [2, x];
              }
              else if (data.status === 409) {
                x = -1;
                if (this.status && this.status.version_error) {
                  x = this.status.version_error;
                }
                return [2, x];
              }
            }
            throw err_2;
          case 3: return [2];
        }
      });
    });
  };
  GenericWebClient.prototype.update = function (obj, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var url, ks, _i, ks_3, name, res, err_3, data, x, x;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            url = this.serviceUrl;
            ks = this.keys();
            if (ks && ks.length > 0) {
              for (_i = 0, ks_3 = ks; _i < ks_3.length; _i++) {
                name = ks_3[_i];
                url += '/' + obj[name];
              }
            }
            return [4, this.http.put(url, obj)];
          case 1:
            res = _a.sent();
            if (!this._metamodel) {
              return [2, res];
            }
            return [2, this.formatResultInfo(res, ctx)];
          case 2:
            err_3 = _a.sent();
            if (err_3) {
              data = (err_3 && err_3.response) ? err_3.response : err_3;
              if (data.status === 404 || data.status === 410) {
                x = 0;
                if (this.status && this.status.not_found) {
                  x = this.status.not_found;
                }
                return [2, x];
              }
              else if (data.status === 409) {
                x = -1;
                if (this.status && this.status.version_error) {
                  x = this.status.version_error;
                }
                return [2, x];
              }
            }
            throw err_3;
          case 3: return [2];
        }
      });
    });
  };
  GenericWebClient.prototype.patch = function (obj, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var url, ks, _i, ks_4, name, res, err_4, data, x, x;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            url = this.serviceUrl;
            ks = this.keys();
            if (ks && ks.length > 0) {
              for (_i = 0, ks_4 = ks; _i < ks_4.length; _i++) {
                name = ks_4[_i];
                url += '/' + obj[name];
              }
            }
            return [4, this.http.patch(url, obj)];
          case 1:
            res = _a.sent();
            if (!this._metamodel) {
              return [2, res];
            }
            return [2, this.formatResultInfo(res, ctx)];
          case 2:
            err_4 = _a.sent();
            if (err_4) {
              data = (err_4 && err_4.response) ? err_4.response : err_4;
              if (data.status === 404 || data.status === 410) {
                x = 0;
                if (this.status && this.status.not_found) {
                  x = this.status.not_found;
                }
                return [2, x];
              }
              else if (data.status === 409) {
                x = -1;
                if (this.status && this.status.version_error) {
                  x = this.status.version_error;
                }
                return [2, x];
              }
            }
            throw err_4;
          case 3: return [2];
        }
      });
    });
  };
  GenericWebClient.prototype.delete = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var url, ks, _i, ks_5, key, res, err_5, data;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2, , 3]);
            url = this.serviceUrl + '/' + id;
            if (typeof id === 'object' && this.attributes && this.keys) {
              ks = this.keys();
              if (ks && ks.length > 0) {
                url = this.serviceUrl;
                for (_i = 0, ks_5 = ks; _i < ks_5.length; _i++) {
                  key = ks_5[_i];
                  url = url + '/' + id[key];
                }
              }
            }
            return [4, this.http.delete(url)];
          case 1:
            res = _a.sent();
            return [2, res];
          case 2:
            err_5 = _a.sent();
            if (err_5) {
              data = (err_5 && err_5.response) ? err_5.response : err_5;
              if (data && (data.status === 404 || data.status === 410)) {
                return [2, 0];
              }
              else if (data.status === 409) {
                return [2, -1];
              }
            }
            throw err_5;
          case 3: return [2];
        }
      });
    });
  };
  return GenericWebClient;
}(ViewWebClient));
exports.GenericWebClient = GenericWebClient;
var SearchWebClient = (function () {
  function SearchWebClient(serviceUrl, http, pmodel, metaModel, config, ignoreDate, searchGet) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.config = config;
    this.searchGet = searchGet;
    this._keys = [];
    this.formatSearch = this.formatSearch.bind(this);
    this.makeUrlParameters = this.makeUrlParameters.bind(this);
    this.postOnly = this.postOnly.bind(this);
    this.search = this.search.bind(this);
    this.keys = this.keys.bind(this);
    if (metaModel) {
      this._metamodel = metaModel;
      this._keys = metaModel.keys;
    }
    else {
      if (pmodel) {
        if (Array.isArray(pmodel)) {
          this._keys = pmodel;
        }
        else {
          var m = json_1.build(pmodel, ignoreDate);
          this._metamodel = m;
          this._keys = m.keys;
        }
      }
    }
  }
  SearchWebClient.prototype.postOnly = function (s) {
    return false;
  };
  SearchWebClient.prototype.formatSearch = function (s) {
  };
  SearchWebClient.prototype.makeUrlParameters = function (s, fields, excluding) {
    return param(s, fields, excluding);
  };
  SearchWebClient.prototype.keys = function () {
    return this._keys;
  };
  SearchWebClient.prototype.search = function (s, limit, offset, fields) {
    return __awaiter(this, void 0, void 0, function () {
      var c, sf, _i, _a, key, sl, sp, sn, page, sfl, s1, postSearchUrl, res, keys2, searchUrl, res, excluding, params, searchUrl, res, postSearchUrl, res;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            this.formatSearch(s);
            c = this.config;
            sf = (c && c.fields && c.fields.length > 0 ? c.fields : 'fields');
            if (fields && fields.length > 0) {
              if (this._keys && this._keys.length > 0) {
                for (_i = 0, _a = this._keys; _i < _a.length; _i++) {
                  key = _a[_i];
                  if (fields.indexOf(key) < 0) {
                    fields.push(key);
                  }
                }
              }
              s[sf] = fields;
            }
            sl = (c && c.limit && c.limit.length > 0 ? c.limit : 'limit');
            sp = (c && c.page && c.page.length > 0 ? c.page : 'page');
            s[sl] = limit;
            if (offset) {
              if (typeof offset === 'string') {
                sn = (c && c.nextPageToken && c.nextPageToken.length > 0 ? c.nextPageToken : 'nextPageToken');
                s[sn] = offset;
              }
              else {
                if (offset >= limit) {
                  page = offset / limit + 1;
                  s[sp] = page;
                }
              }
            }
            sfl = (c ? c.firstLimit : undefined);
            s1 = optimizeSearchModel(s, sp, sl, sfl);
            if (!this.postOnly(s1)) return [3, 2];
            postSearchUrl = this.serviceUrl + '/search';
            return [4, this.http.post(postSearchUrl, s1)];
          case 1:
            res = _b.sent();
            return [2, buildSearchResultByConfig(s, res, c, this._metamodel, sf)];
          case 2:
            keys2 = Object.keys(s1);
            if (!(keys2.length === 0)) return [3, 4];
            searchUrl = (this.searchGet ? this.serviceUrl + '/search' : this.serviceUrl);
            return [4, this.http.get(searchUrl)];
          case 3:
            res = _b.sent();
            return [2, buildSearchResultByConfig(s, res, c, this._metamodel, sf)];
          case 4:
            excluding = c ? c.excluding : undefined;
            params = this.makeUrlParameters(s1, sf, excluding);
            searchUrl = (this.searchGet ? this.serviceUrl + '/search' : this.serviceUrl);
            searchUrl = searchUrl + '?' + params;
            if (!(searchUrl.length <= 255)) return [3, 6];
            return [4, this.http.get(searchUrl)];
          case 5:
            res = _b.sent();
            return [2, buildSearchResultByConfig(s, res, c, this._metamodel, sf)];
          case 6:
            postSearchUrl = this.serviceUrl + '/search';
            return [4, this.http.post(postSearchUrl, s1)];
          case 7:
            res = _b.sent();
            return [2, buildSearchResultByConfig(s, res, c, this._metamodel, sf)];
        }
      });
    });
  };
  return SearchWebClient;
}());
exports.SearchWebClient = SearchWebClient;
function buildSearchResultByConfig(s, res, c, metamodel, sfields) {
  if (c && c.body && c.body.length > 0) {
    var re = res[c.body];
    return buildSearchResult(s, re, c, metamodel, sfields);
  }
  else {
    return buildSearchResult(s, res, c, metamodel, sfields);
  }
}
exports.buildSearchResultByConfig = buildSearchResultByConfig;
function buildSearchResult(s, res, c, metamodel, sfields) {
  if (typeof res === 'string') {
    return fromCsv(s, res, sfields);
  }
  else {
    if (Array.isArray(res)) {
      var result = {
        list: res,
        total: res.length
      };
      if (!metamodel) {
        return result;
      }
      return jsonSearchResult(result, metamodel);
    }
    else {
      if (!c) {
        if (!metamodel) {
          return res;
        }
        return jsonSearchResult(res, metamodel);
      }
      else {
        var res2 = {};
        if (c.list && c.list.length > 0) {
          res2.list = res[c.list];
        }
        else {
          res2.list = res.list;
        }
        if (c.total && c.total.length > 0) {
          res2.total = res[c.total];
        }
        else {
          res2.total = res.total;
        }
        if (c.last && c.last.length > 0 && res[c.last]) {
          res2.last = res[c.last];
        }
        if (!metamodel) {
          return res2;
        }
        return jsonSearchResult(res2, metamodel);
      }
    }
  }
}
exports.buildSearchResult = buildSearchResult;
function jsonSearchResult(r, metamodel) {
  if (metamodel && r != null && r.list != null && r.list.length > 0) {
    json_1.jsonArray(r.list, metamodel);
  }
  return r;
}
exports.jsonSearchResult = jsonSearchResult;
var DiffWebClient = (function () {
  function DiffWebClient(serviceUrl, http, pmodel, ignoreDate, metaModel) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.diff = this.diff.bind(this);
    if (metaModel) {
      this._metaModel = metaModel;
      this._ids = metaModel.keys;
      if (pmodel && !Array.isArray(pmodel)) {
        this.model = pmodel;
      }
    }
    else {
      if (pmodel) {
        if (Array.isArray(pmodel)) {
          this._ids = pmodel;
        }
        else {
          this.model = pmodel;
          var m = json_1.build(pmodel, ignoreDate);
          this._metaModel = m;
          this._ids = m.keys;
        }
      }
      else {
        this._ids = [];
      }
    }
  }
  DiffWebClient.prototype.keys = function () {
    return this._ids;
  };
  DiffWebClient.prototype.diff = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res, err_6, data;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
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
          case 2:
            err_6 = _b.sent();
            data = (err_6 && err_6.response) ? err_6.response : err_6;
            if (data && (data.status === 404 || data.status === 410)) {
              return [2, null];
            }
            else {
              throw err_6;
            }
            return [3, 3];
          case 3: return [2];
        }
      });
    });
  };
  return DiffWebClient;
}());
exports.DiffWebClient = DiffWebClient;
var ApprWebClient = (function () {
  function ApprWebClient(serviceUrl, http, pmodel, diffStatus, ignoreDate, metaModel) {
    this.serviceUrl = serviceUrl;
    this.http = http;
    this.diffStatus = diffStatus;
    this.approve = this.approve.bind(this);
    this.reject = this.reject.bind(this);
    this.keys = this.keys.bind(this);
    if (metaModel) {
      this._keys = metaModel.keys;
      if (pmodel && !Array.isArray(pmodel)) {
        this.model = pmodel;
      }
    }
    else {
      if (pmodel) {
        if (Array.isArray(pmodel)) {
          this._keys = pmodel;
        }
        else {
          this.model = pmodel;
          var m = json_1.build(pmodel, ignoreDate);
          this._keys = m.keys;
        }
      }
      else {
        this._keys = [];
      }
    }
    if (!diffStatus) {
      this.diffStatus = json_1.resources.diff;
    }
  }
  ApprWebClient.prototype.keys = function () {
    return this._keys;
  };
  ApprWebClient.prototype.approve = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res, err_7, data;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            url = this.serviceUrl + '/' + id + '/approve';
            if (this._keys && this._keys.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._keys; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
              url = url + '/approve';
            }
            return [4, this.http.get(url)];
          case 1:
            res = _b.sent();
            return [2, res];
          case 2:
            err_7 = _b.sent();
            if (!this.diffStatus) {
              throw err_7;
            }
            if (err_7) {
              data = (err_7 && err_7.response) ? err_7.response : err_7;
              if (data.status === 404 || data.status === 410) {
                return [2, (this.diffStatus.not_found ? this.diffStatus.not_found : 0)];
              }
              else if (data.status === 409) {
                return [2, (this.diffStatus.version_error ? this.diffStatus.version_error : 2)];
              }
            }
            if (this.diffStatus.error) {
              return [2, this.diffStatus.error];
            }
            else {
              throw err_7;
            }
            return [3, 3];
          case 3: return [2];
        }
      });
    });
  };
  ApprWebClient.prototype.reject = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      var url, _i, _a, name, res, err_8, data;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            url = this.serviceUrl + '/' + id + '/reject';
            if (this._keys && this._keys.length > 0 && typeof id === 'object') {
              url = this.serviceUrl;
              for (_i = 0, _a = this._keys; _i < _a.length; _i++) {
                name = _a[_i];
                url = url + '/' + id[name];
              }
              url = url + '/reject';
            }
            return [4, this.http.get(url)];
          case 1:
            res = _b.sent();
            return [2, res];
          case 2:
            err_8 = _b.sent();
            if (!this.diffStatus) {
              throw err_8;
            }
            if (err_8) {
              data = (err_8 && err_8.response) ? err_8.response : err_8;
              if (data.status === 404 || data.status === 410) {
                return [2, (this.diffStatus.not_found ? this.diffStatus.not_found : 0)];
              }
              else if (data.status === 409) {
                return [2, (this.diffStatus.version_error ? this.diffStatus.version_error : 2)];
              }
            }
            if (this.diffStatus.error) {
              return [2, this.diffStatus.error];
            }
            else {
              throw err_8;
            }
            return [3, 3];
          case 3: return [2];
        }
      });
    });
  };
  return ApprWebClient;
}());
exports.ApprWebClient = ApprWebClient;
var DiffApprWebClient = (function (_super) {
  __extends(DiffApprWebClient, _super);
  function DiffApprWebClient(serviceUrl, http, model, diffStatus, ignoreDate, metaModel) {
    var _this = _super.call(this, serviceUrl, http, model, ignoreDate, metaModel) || this;
    _this.serviceUrl = serviceUrl;
    _this.http = http;
    _this.apprWebClient = new ApprWebClient(serviceUrl, http, model, diffStatus, ignoreDate, _this._metaModel);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  DiffApprWebClient.prototype.approve = function (id, ctx) {
    return this.apprWebClient.approve(id, ctx);
  };
  DiffApprWebClient.prototype.reject = function (id, ctx) {
    return this.apprWebClient.reject(id, ctx);
  };
  return DiffApprWebClient;
}(DiffWebClient));
exports.DiffApprWebClient = DiffApprWebClient;
var ViewSearchWebClient = (function (_super) {
  __extends(ViewSearchWebClient, _super);
  function ViewSearchWebClient(serviceUrl, http, model, config, ignoreDate, searchGet, metamodel) {
    var _this = _super.call(this, serviceUrl, http, model, metamodel, config, ignoreDate, searchGet) || this;
    _this.viewWebClient = new ViewWebClient(serviceUrl, http, model, ignoreDate, _this._metamodel);
    _this.metadata = _this.metadata.bind(_this);
    _this.keys = _this.keys.bind(_this);
    _this.all = _this.all.bind(_this);
    _this.load = _this.load.bind(_this);
    return _this;
  }
  ViewSearchWebClient.prototype.keys = function () {
    return this.viewWebClient.keys();
  };
  ViewSearchWebClient.prototype.metadata = function () {
    return this.viewWebClient.metadata();
  };
  ViewSearchWebClient.prototype.all = function (ctx) {
    return this.viewWebClient.all(ctx);
  };
  ViewSearchWebClient.prototype.load = function (id, ctx) {
    return this.viewWebClient.load(id, ctx);
  };
  return ViewSearchWebClient;
}(SearchWebClient));
exports.ViewSearchWebClient = ViewSearchWebClient;
var GenericSearchWebClient = (function (_super) {
  __extends(GenericSearchWebClient, _super);
  function GenericSearchWebClient(serviceUrl, http, model, config, ignoreDate, searchGet, metamodel) {
    var _this = _super.call(this, serviceUrl, http, model, metamodel, config, ignoreDate, searchGet) || this;
    _this.genericWebClient = new GenericWebClient(serviceUrl, http, model, config, ignoreDate, _this._metamodel);
    _this.metadata = _this.metadata.bind(_this);
    _this.keys = _this.keys.bind(_this);
    _this.all = _this.all.bind(_this);
    _this.load = _this.load.bind(_this);
    _this.insert = _this.insert.bind(_this);
    _this.update = _this.update.bind(_this);
    _this.patch = _this.patch.bind(_this);
    _this.delete = _this.delete.bind(_this);
    return _this;
  }
  GenericSearchWebClient.prototype.keys = function () {
    return this.genericWebClient.keys();
  };
  GenericSearchWebClient.prototype.metadata = function () {
    return this.genericWebClient.metadata();
  };
  GenericSearchWebClient.prototype.all = function (ctx) {
    return this.genericWebClient.all(ctx);
  };
  GenericSearchWebClient.prototype.load = function (id, ctx) {
    return this.genericWebClient.load(id, ctx);
  };
  GenericSearchWebClient.prototype.insert = function (obj, ctx) {
    return this.genericWebClient.insert(obj, ctx);
  };
  GenericSearchWebClient.prototype.update = function (obj, ctx) {
    return this.genericWebClient.update(obj, ctx);
  };
  GenericSearchWebClient.prototype.patch = function (obj, ctx) {
    return this.genericWebClient.patch(obj, ctx);
  };
  GenericSearchWebClient.prototype.delete = function (id, ctx) {
    return this.genericWebClient.delete(id, ctx);
  };
  return GenericSearchWebClient;
}(SearchWebClient));
exports.GenericSearchWebClient = GenericSearchWebClient;
var ViewSearchDiffApprWebClient = (function (_super) {
  __extends(ViewSearchDiffApprWebClient, _super);
  function ViewSearchDiffApprWebClient(serviceUrl, http, model, config, ignoreDate, searchGet, metamodel) {
    var _this = _super.call(this, serviceUrl, http, model, config, ignoreDate, searchGet, metamodel) || this;
    _this.diffWebClient = new DiffApprWebClient(serviceUrl, http, model, config, ignoreDate, _this._metamodel);
    _this.diff = _this.diff.bind(_this);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  ViewSearchDiffApprWebClient.prototype.diff = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.diff(id, ctx)];
      });
    });
  };
  ViewSearchDiffApprWebClient.prototype.approve = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.approve(id, ctx)];
      });
    });
  };
  ViewSearchDiffApprWebClient.prototype.reject = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.reject(id, ctx)];
      });
    });
  };
  return ViewSearchDiffApprWebClient;
}(ViewSearchWebClient));
exports.ViewSearchDiffApprWebClient = ViewSearchDiffApprWebClient;
var GenericSearchDiffApprWebClient = (function (_super) {
  __extends(GenericSearchDiffApprWebClient, _super);
  function GenericSearchDiffApprWebClient(serviceUrl, http, model, config, ignoreDate, searchGet, metamodel) {
    var _this = _super.call(this, serviceUrl, http, model, config, ignoreDate, searchGet, metamodel) || this;
    _this.diffWebClient = new DiffApprWebClient(serviceUrl, http, model, config, ignoreDate, _this._metamodel);
    _this.diff = _this.diff.bind(_this);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  GenericSearchDiffApprWebClient.prototype.diff = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.diff(id, ctx)];
      });
    });
  };
  GenericSearchDiffApprWebClient.prototype.approve = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.approve(id, ctx)];
      });
    });
  };
  GenericSearchDiffApprWebClient.prototype.reject = function (id, ctx) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [2, this.diffWebClient.reject(id, ctx)];
      });
    });
  };
  return GenericSearchDiffApprWebClient;
}(GenericSearchWebClient));
exports.GenericSearchDiffApprWebClient = GenericSearchDiffApprWebClient;

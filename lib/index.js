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
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var json_1 = require("./json");
__export(require("./json"));
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
      if (typeof t2 === 'object' && Array.isArray(t2)) {
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
function optimizeFilter(s, page, limit, firstLimit) {
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
  if (limit && firstLimit && o[limit] && o[firstLimit] === o[limit]) {
    delete o[firstLimit];
  }
  if (page && o[page] <= 1) {
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
exports.optimizeFilter = optimizeFilter;
function fromCsv(m, csv, sfields) {
  return fromString(csv).then(function (items) {
    var arr = [];
    if (!sfields || sfields.length === 0) {
      sfields = 'fields';
    }
    var fields = m[sfields];
    if (Array.isArray(fields)) {
      for (var i = 1; i < items.length; i++) {
        var obj = {};
        var len = Math.min(fields.length, items[i].length);
        for (var j = 0; j < len; j++) {
          obj[fields[j]] = items[i][j];
        }
        arr.push(obj);
      }
    }
    var x = {
      total: parseFloat(items[0][0]),
      list: arr
    };
    if (items[0].length > 1 && items[0][1].length > 0) {
      x.next = items[0][1];
    }
    return x;
  });
}
exports.fromCsv = fromCsv;
var ViewClient = (function () {
  function ViewClient(http, serviceUrl, pmodel, ignoreDate, metamodel) {
    this.http = http;
    this.serviceUrl = serviceUrl;
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
  ViewClient.prototype.keys = function () {
    return this._keys;
  };
  ViewClient.prototype.metadata = function () {
    return this.attributes;
  };
  ViewClient.prototype.all = function (ctx) {
    var t = this;
    return t.http.get(t.serviceUrl).then(function (list) {
      if (!t._metamodel) {
        return list;
      }
      return json_1.jsonArray(list, t._metamodel);
    });
  };
  ViewClient.prototype.load = function (id, ctx) {
    var t = this;
    var url = t.serviceUrl + '/' + id;
    if (t._keys && t._keys.length > 0 && typeof id === 'object') {
      url = t.serviceUrl;
      for (var _i = 0, _a = t._keys; _i < _a.length; _i++) {
        var name = _a[_i];
        url = url + '/' + id[name];
      }
    }
    return t.http.get(url).then(function (obj) {
      if (!t._metamodel) {
        return obj;
      }
      return json_1.json(obj, t._metamodel);
    }).catch(function (err) {
      var data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return Promise.resolve(null);
      }
      throw err;
    });
  };
  return ViewClient;
}());
exports.ViewClient = ViewClient;
var CRUDClient = (function (_super) {
  __extends(CRUDClient, _super);
  function CRUDClient(http, serviceUrl, pmodel, status, ignoreDate, metamodel) {
    var _this = _super.call(this, http, serviceUrl, pmodel, ignoreDate, metamodel) || this;
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
  CRUDClient.prototype.formatResultInfo = function (result, ctx) {
    if (this._metamodel && result && typeof result === 'object') {
      result = json_1.json(result, this._metamodel);
    }
    return result;
  };
  CRUDClient.prototype.insert = function (obj, ctx) {
    var t = this;
    if (t._metamodel) {
      json_1.json(obj, t._metamodel);
    }
    return t.http.post(t.serviceUrl, obj).then(function (res) {
      if (!t._metamodel) {
        return res;
      }
      return t.formatResultInfo(res, ctx);
    }).catch(function (err) {
      if (err) {
        var data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          var x = 0;
          if (t.status && t.status.not_found) {
            x = t.status.not_found;
          }
          return Promise.resolve(x);
        }
        else if (data.status === 409) {
          var x = -1;
          if (t.status && t.status.version_error) {
            x = t.status.version_error;
          }
          return Promise.resolve(x);
        }
        else if (data.status === 422) {
          return Promise.resolve(data.data);
        }
      }
      throw err;
    });
  };
  CRUDClient.prototype.update = function (obj, ctx) {
    var t = this;
    var url = t.serviceUrl;
    var ks = t.keys();
    if (ks && ks.length > 0) {
      for (var _i = 0, ks_3 = ks; _i < ks_3.length; _i++) {
        var name = ks_3[_i];
        url += '/' + obj[name];
      }
    }
    return t.http.put(url, obj).then(function (res) {
      if (!t._metamodel) {
        return res;
      }
      return t.formatResultInfo(res, ctx);
    }).catch(function (err) {
      if (err) {
        var data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          var x = 0;
          if (t.status && t.status.not_found) {
            x = t.status.not_found;
          }
          return Promise.resolve(x);
        }
        else if (data.status === 409) {
          var x = -1;
          if (t.status && t.status.version_error) {
            x = t.status.version_error;
          }
          return Promise.resolve(x);
        }
        else if (data.status === 422) {
          return Promise.resolve(data.data);
        }
      }
      throw err;
    });
  };
  CRUDClient.prototype.patch = function (obj, ctx) {
    var t = this;
    var url = t.serviceUrl;
    var ks = t.keys();
    if (ks && ks.length > 0) {
      for (var _i = 0, ks_4 = ks; _i < ks_4.length; _i++) {
        var name = ks_4[_i];
        url += '/' + obj[name];
      }
    }
    return t.http.patch(url, obj).then(function (res) {
      if (!t._metamodel) {
        return res;
      }
      return t.formatResultInfo(res, ctx);
    }).catch(function (err) {
      var _a;
      if (err) {
        var data = (err && err.response) ? err.response : err;
        if ((data === null || data === void 0 ? void 0 : data.status) === 404 || data.status === 410) {
          var statusCode = 0;
          if ((t === null || t === void 0 ? void 0 : t.status) && ((_a = t.status) === null || _a === void 0 ? void 0 : _a.not_found)) {
            statusCode = t.status.not_found;
          }
          return Promise.resolve(statusCode);
        }
        else if (data.status === 409) {
          var statusCode = -1;
          if (t.status && t.status.version_error) {
            statusCode = t.status.version_error;
          }
          return Promise.resolve(statusCode);
        }
        else if (data.status === 422) {
          return Promise.resolve(data.data);
        }
      }
      throw err;
    });
  };
  CRUDClient.prototype.delete = function (id, ctx) {
    var t = this;
    var url = this.serviceUrl + '/' + id;
    if (typeof id === 'object' && t.attributes && t.keys) {
      var ks = t.keys();
      if (ks && ks.length > 0) {
        url = t.serviceUrl;
        for (var _i = 0, ks_5 = ks; _i < ks_5.length; _i++) {
          var key = ks_5[_i];
          url = url + '/' + id[key];
        }
      }
    }
    return t.http.delete(url).then(function (r) { return r; }).catch(function (err) {
      if (err) {
        var data = (err && err.response) ? err.response : err;
        if (data && (data.status === 404 || data.status === 410)) {
          return Promise.resolve(0);
        }
        else if (data.status === 409) {
          return Promise.resolve(2);
        }
        else if (data.status === 410) {
          return Promise.resolve(data.data);
        }
      }
      throw err;
    });
  };
  return CRUDClient;
}(ViewClient));
exports.CRUDClient = CRUDClient;
var GenericClient = (function (_super) {
  __extends(GenericClient, _super);
  function GenericClient(http, serviceUrl, pmodel, status, ignoreDate, metamodel) {
    var _this = _super.call(this, http, serviceUrl, pmodel, status, ignoreDate, metamodel) || this;
    _this.status = status;
    return _this;
  }
  return GenericClient;
}(CRUDClient));
exports.GenericClient = GenericClient;
var SearchWebClient = (function () {
  function SearchWebClient(http, serviceUrl, pmodel, metaModel, config, ignoreDate, searchGet) {
    this.http = http;
    this.serviceUrl = serviceUrl;
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
    var t = this;
    t.formatSearch(s);
    var c = t.config;
    var sf = (c && c.fields && c.fields.length > 0 ? c.fields : 'fields');
    if (fields && fields.length > 0) {
      if (t._keys && t._keys.length > 0) {
        for (var _i = 0, _a = t._keys; _i < _a.length; _i++) {
          var key = _a[_i];
          if (fields.indexOf(key) < 0) {
            fields.push(key);
          }
        }
      }
      s[sf] = fields;
    }
    var sl = (c && c.limit && c.limit.length > 0 ? c.limit : 'limit');
    var sp = (c && c.page && c.page.length > 0 ? c.page : 'page');
    s[sl] = limit;
    if (limit && offset) {
      if (typeof offset === 'string') {
        var sn = (c && c.next && c.next.length > 0 ? c.next : 'next');
        s[sn] = offset;
      }
      else {
        if (offset >= limit) {
          var page = offset / limit + 1;
          s[sp] = page;
        }
      }
    }
    var sfl = (c ? c.firstLimit : undefined);
    var s1 = optimizeFilter(s, sp, sl, sfl);
    if (t.postOnly(s1)) {
      var postSearchUrl = t.serviceUrl + '/search';
      return t.http.post(postSearchUrl, s1).then(function (res) { return buildSearchResultByConfig(s, res, c, t._metamodel, sf); });
    }
    var keys2 = Object.keys(s1);
    if (keys2.length === 0) {
      var searchUrl = (t.searchGet ? t.serviceUrl + '/search' : t.serviceUrl);
      return t.http.get(searchUrl).then(function (res) { return buildSearchResultByConfig(s, res, c, t._metamodel, sf); });
    }
    else {
      var excluding = c ? c.excluding : undefined;
      var params = t.makeUrlParameters(s1, sf, excluding);
      var searchUrl = (t.searchGet ? t.serviceUrl + '/search' : t.serviceUrl);
      searchUrl = searchUrl + '?' + params;
      if (searchUrl.length <= 255) {
        return t.http.get(searchUrl).then(function (res) { return buildSearchResultByConfig(s, res, c, t._metamodel, sf); });
      }
      else {
        var postSearchUrl = t.serviceUrl + '/search';
        return t.http.post(postSearchUrl, s1).then(function (res) { return buildSearchResultByConfig(s, res, c, t._metamodel, sf); });
      }
    }
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
var DiffClient = (function () {
  function DiffClient(http, serviceUrl, pmodel, ignoreDate, metaModel) {
    this.http = http;
    this.serviceUrl = serviceUrl;
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
  DiffClient.prototype.keys = function () {
    return this._ids;
  };
  DiffClient.prototype.diff = function (id, ctx) {
    var t = this;
    var url = t.serviceUrl + '/' + id + '/diff';
    if (t._ids && t._ids.length > 0 && typeof id === 'object') {
      url = t.serviceUrl;
      for (var _i = 0, _a = t._ids; _i < _a.length; _i++) {
        var name = _a[_i];
        url = url + '/' + id[name];
      }
      url = url + '/diff';
    }
    return t.http.get(url).then(function (res) {
      if (!res) {
        return null;
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
        json_1.json(res.value, t._metaModel);
      }
      if (res.origin) {
        json_1.json(res.origin, t._metaModel);
      }
      return res;
    }).catch(function (err) {
      var data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return Promise.resolve(null);
      }
      else {
        throw err;
      }
    });
  };
  return DiffClient;
}());
exports.DiffClient = DiffClient;
var ApprClient = (function () {
  function ApprClient(http, serviceUrl, pmodel, diffStatus, ignoreDate, metaModel) {
    this.http = http;
    this.serviceUrl = serviceUrl;
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
  ApprClient.prototype.keys = function () {
    return this._keys;
  };
  ApprClient.prototype.approve = function (id, ctx) {
    var t = this;
    var url = t.serviceUrl + '/' + id + '/approve';
    if (t._keys && t._keys.length > 0 && typeof id === 'object') {
      url = t.serviceUrl;
      for (var _i = 0, _a = t._keys; _i < _a.length; _i++) {
        var name = _a[_i];
        url = url + '/' + id[name];
      }
      url = url + '/approve';
    }
    return t.http.patch(url, '').then(function (r) { return r; }).catch(function (err) {
      var _a, _b;
      if (!t.diffStatus) {
        throw err;
      }
      if (err) {
        var data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          return Promise.resolve(((_a = t.diffStatus) === null || _a === void 0 ? void 0 : _a.not_found) ? t.diffStatus.not_found : 0);
        }
        else if (data.status === 409) {
          return Promise.resolve(((_b = t.diffStatus) === null || _b === void 0 ? void 0 : _b.version_error) ? t.diffStatus.version_error : -1);
        }
      }
      if (t.diffStatus.error) {
        return Promise.resolve(t.diffStatus.error);
      }
      else {
        throw err;
      }
    });
  };
  ApprClient.prototype.reject = function (id, ctx) {
    var t = this;
    var url = t.serviceUrl + '/' + id + '/reject';
    if (t._keys && t._keys.length > 0 && typeof id === 'object') {
      url = t.serviceUrl;
      for (var _i = 0, _a = t._keys; _i < _a.length; _i++) {
        var name = _a[_i];
        url = url + '/' + id[name];
      }
      url = url + '/reject';
    }
    return t.http.patch(url, '').then(function (r) { return r; }).catch(function (err) {
      if (!t.diffStatus) {
        throw err;
      }
      if (err) {
        var data = (err && err.response) ? err.response : err;
        if (data.status === 404 || data.status === 410) {
          return Promise.resolve(t.diffStatus.not_found ? t.diffStatus.not_found : 0);
        }
        else if (data.status === 409) {
          return Promise.resolve(t.diffStatus.version_error ? t.diffStatus.version_error : -1);
        }
      }
      if (t.diffStatus.error) {
        return Promise.resolve(t.diffStatus.error);
      }
      else {
        throw err;
      }
    });
  };
  return ApprClient;
}());
exports.ApprClient = ApprClient;
var DiffApprClient = (function (_super) {
  __extends(DiffApprClient, _super);
  function DiffApprClient(http, serviceUrl, model, diffStatus, ignoreDate, metaModel) {
    var _this = _super.call(this, http, serviceUrl, model, ignoreDate, metaModel) || this;
    _this.http = http;
    _this.serviceUrl = serviceUrl;
    _this.apprWebClient = new ApprClient(http, serviceUrl, model, diffStatus, ignoreDate, _this._metaModel);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  DiffApprClient.prototype.approve = function (id, ctx) {
    return this.apprWebClient.approve(id, ctx);
  };
  DiffApprClient.prototype.reject = function (id, ctx) {
    return this.apprWebClient.reject(id, ctx);
  };
  return DiffApprClient;
}(DiffClient));
exports.DiffApprClient = DiffApprClient;
var SearchClient = (function (_super) {
  __extends(SearchClient, _super);
  function SearchClient(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) {
    var _this = _super.call(this, http, serviceUrl, model, metamodel, config, ignoreDate, searchGet) || this;
    _this.viewWebClient = new ViewClient(http, serviceUrl, model, ignoreDate, _this._metamodel);
    _this.metadata = _this.metadata.bind(_this);
    _this.keys = _this.keys.bind(_this);
    _this.all = _this.all.bind(_this);
    _this.load = _this.load.bind(_this);
    return _this;
  }
  SearchClient.prototype.keys = function () {
    return this.viewWebClient.keys();
  };
  SearchClient.prototype.metadata = function () {
    return this.viewWebClient.metadata();
  };
  SearchClient.prototype.all = function (ctx) {
    return this.viewWebClient.all(ctx);
  };
  SearchClient.prototype.load = function (id, ctx) {
    return this.viewWebClient.load(id, ctx);
  };
  return SearchClient;
}(SearchWebClient));
exports.SearchClient = SearchClient;
exports.ViewSearchClient = SearchClient;
exports.Query = SearchClient;
var GenericSearchClient = (function (_super) {
  __extends(GenericSearchClient, _super);
  function GenericSearchClient(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) {
    var _this = _super.call(this, http, serviceUrl, model, metamodel, config, ignoreDate, searchGet) || this;
    _this.genericWebClient = new CRUDClient(http, serviceUrl, model, config, ignoreDate, _this._metamodel);
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
  GenericSearchClient.prototype.keys = function () {
    return this.genericWebClient.keys();
  };
  GenericSearchClient.prototype.metadata = function () {
    return this.genericWebClient.metadata();
  };
  GenericSearchClient.prototype.all = function (ctx) {
    return this.genericWebClient.all(ctx);
  };
  GenericSearchClient.prototype.load = function (id, ctx) {
    return this.genericWebClient.load(id, ctx);
  };
  GenericSearchClient.prototype.insert = function (obj, ctx) {
    return this.genericWebClient.insert(obj, ctx);
  };
  GenericSearchClient.prototype.update = function (obj, ctx) {
    return this.genericWebClient.update(obj, ctx);
  };
  GenericSearchClient.prototype.patch = function (obj, ctx) {
    return this.genericWebClient.patch(obj, ctx);
  };
  GenericSearchClient.prototype.delete = function (id, ctx) {
    return this.genericWebClient.delete(id, ctx);
  };
  return GenericSearchClient;
}(SearchWebClient));
exports.GenericSearchClient = GenericSearchClient;
var Client = (function (_super) {
  __extends(Client, _super);
  function Client(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) {
    return _super.call(this, http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) || this;
  }
  return Client;
}(GenericSearchClient));
exports.Client = Client;
var ViewSearchDiffApprClient = (function (_super) {
  __extends(ViewSearchDiffApprClient, _super);
  function ViewSearchDiffApprClient(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) {
    var _this = _super.call(this, http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) || this;
    _this.diffWebClient = new DiffApprClient(http, serviceUrl, model, config, ignoreDate, _this._metamodel);
    _this.diff = _this.diff.bind(_this);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  ViewSearchDiffApprClient.prototype.diff = function (id, ctx) {
    return this.diffWebClient.diff(id, ctx);
  };
  ViewSearchDiffApprClient.prototype.approve = function (id, ctx) {
    return this.diffWebClient.approve(id, ctx);
  };
  ViewSearchDiffApprClient.prototype.reject = function (id, ctx) {
    return this.diffWebClient.reject(id, ctx);
  };
  return ViewSearchDiffApprClient;
}(SearchClient));
exports.ViewSearchDiffApprClient = ViewSearchDiffApprClient;
var CRUDSearchDiffApprClient = (function (_super) {
  __extends(CRUDSearchDiffApprClient, _super);
  function CRUDSearchDiffApprClient(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) {
    var _this = _super.call(this, http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) || this;
    _this.diffWebClient = new DiffApprClient(http, serviceUrl, model, config, ignoreDate, _this._metamodel);
    _this.diff = _this.diff.bind(_this);
    _this.approve = _this.approve.bind(_this);
    _this.reject = _this.reject.bind(_this);
    return _this;
  }
  CRUDSearchDiffApprClient.prototype.diff = function (id, ctx) {
    return this.diffWebClient.diff(id, ctx);
  };
  CRUDSearchDiffApprClient.prototype.approve = function (id, ctx) {
    return this.diffWebClient.approve(id, ctx);
  };
  CRUDSearchDiffApprClient.prototype.reject = function (id, ctx) {
    return this.diffWebClient.reject(id, ctx);
  };
  return CRUDSearchDiffApprClient;
}(GenericSearchClient));
exports.CRUDSearchDiffApprClient = CRUDSearchDiffApprClient;
var GenericSearchDiffApprClient = (function (_super) {
  __extends(GenericSearchDiffApprClient, _super);
  function GenericSearchDiffApprClient(http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) {
    return _super.call(this, http, serviceUrl, model, config, ignoreDate, searchGet, metamodel) || this;
  }
  return GenericSearchDiffApprClient;
}(CRUDSearchDiffApprClient));
exports.GenericSearchDiffApprClient = GenericSearchDiffApprClient;
var QueryClient = (function () {
  function QueryClient(http, url, keyword, max) {
    this.http = http;
    this.url = url;
    this.keyword = (keyword && keyword.length > 0 ? keyword : 'q');
    this.max = (max && max.length > 0 ? max : 'max');
    this.query = this.query.bind(this);
  }
  QueryClient.prototype.query = function (keyword, max) {
    var query = this.url + ("?" + this.keyword + "=" + keyword);
    if (max && max > 0) {
      query += "&" + this.max + "=" + max;
    }
    return this.http.get(query).catch(function (err) {
      var data = (err && err.response) ? err.response : err;
      if (data && (data.status === 404 || data.status === 410)) {
        return Promise.resolve([]);
      }
      throw err;
    });
  };
  return QueryClient;
}());
exports.QueryClient = QueryClient;
var RatesClient = (function (_super) {
  __extends(RatesClient, _super);
  function RatesClient(http, serviceUrl, sg, po) {
    var _this = _super.call(this, http, serviceUrl) || this;
    _this.http = http;
    _this.serviceUrl = serviceUrl;
    _this.po = po;
    _this.searchGet = sg;
    _this.search = _this.search.bind(_this);
    return _this;
  }
  RatesClient.prototype.postOnly = function (s) {
    return (this.po ? this.po : false);
  };
  RatesClient.prototype.search = function (s, limit, offset, fields) {
    return _super.prototype.search.call(this, s, limit, offset, fields).then(function (r) {
      formatTime(r.list);
      return r;
    });
  };
  return RatesClient;
}(SearchWebClient));
exports.RatesClient = RatesClient;
function formatTime(l) {
  if (l && l.length > 0) {
    for (var i = 0; i < l.length; i++) {
      var c = l[i];
      var h = c.histories;
      if (h && h.length > 0) {
        for (var j = 0; j < h.length; j++) {
          var s = h[j];
          if (s.time) {
            s.time = new Date(s.time);
          }
        }
      }
      if (c.time) {
        c.time = new Date(c.time);
      }
    }
  }
}
exports.formatTime = formatTime;
var CommentsClient = (function (_super) {
  __extends(CommentsClient, _super);
  function CommentsClient(http, serviceUrl, sg, po) {
    var _this = _super.call(this, http, serviceUrl) || this;
    _this.http = http;
    _this.serviceUrl = serviceUrl;
    _this.po = po;
    _this.searchGet = sg;
    _this.search = _this.search.bind(_this);
    return _this;
  }
  CommentsClient.prototype.postOnly = function (s) {
    return (this.po ? this.po : false);
  };
  CommentsClient.prototype.search = function (s, limit, offset, fields) {
    return _super.prototype.search.call(this, s, limit, offset, fields).then(function (r) {
      formatTime(r.list);
      return r;
    });
  };
  return CommentsClient;
}(SearchWebClient));
exports.CommentsClient = CommentsClient;
var ModuleClient = (function () {
  function ModuleClient(http, url) {
    var _this = this;
    this.http = http;
    this.url = url;
    this.all = function () { return _this.http.get(_this.url); };
  }
  return ModuleClient;
}());
exports.ModuleClient = ModuleClient;

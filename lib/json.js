"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resources = (function () {
  function resources() {
  }
  return resources;
}());
exports.resources = resources;
function build(attributes, ignoreDate) {
  var primaryKeys = new Array();
  var dateFields = new Array();
  var objectFields = new Array();
  var arrayFields = new Array();
  var ids = Object.keys(attributes);
  for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++) {
    var key = ids_1[_i];
    var attr = attributes[key];
    if (attr) {
      attr.name = key;
      if (attr.ignored !== true) {
        if (attr.key === true) {
          primaryKeys.push(attr.name);
        }
      }
      switch (attr.type) {
        case 'datetime': {
          dateFields.push(attr.name);
          break;
        }
        case 'date': {
          if (ignoreDate) {
            dateFields.push(attr.name);
          }
          break;
        }
        case 'object': {
          if (attr.typeof) {
            var x = build(attr.typeof, ignoreDate);
            x.attributeName = key;
            objectFields.push(x);
          }
          break;
        }
        case 'array': {
          if (attr.typeof) {
            var y = build(attr.typeof, ignoreDate);
            y.attributeName = key;
            arrayFields.push(y);
          }
          break;
        }
        default:
          break;
      }
    }
  }
  var metadata = { attributes: attributes, keys: primaryKeys };
  if (primaryKeys.length > 0) {
    metadata.keys = primaryKeys;
  }
  if (dateFields.length > 0) {
    metadata.dateFields = dateFields;
  }
  if (objectFields.length > 0) {
    metadata.objectFields = objectFields;
  }
  if (arrayFields.length > 0) {
    metadata.arrayFields = arrayFields;
  }
  return metadata;
}
exports.build = build;
function buildKeys(attributes) {
  if (!attributes) {
    return [];
  }
  var ids = Object.keys(attributes);
  var pks = [];
  for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++) {
    var key = ids_2[_i];
    var attr = attributes[key];
    if (attr && attr.ignored !== true && attr.key === true && attr.name && attr.name.length > 0) {
      pks.push(attr.name);
    }
  }
  return pks;
}
exports.buildKeys = buildKeys;
var _datereg = '/Date(';
var _re = /-?\d+/;
function jsonToDate(obj, fields) {
  if (!obj || !fields) {
    return obj;
  }
  if (!Array.isArray(obj)) {
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
      var field = fields_1[_i];
      var v = obj[field];
      if (v && !(v instanceof Date)) {
        obj[field] = toDate(v);
      }
    }
  }
}
function toDate(v) {
  if (!v) {
    return null;
  }
  if (v instanceof Date) {
    return v;
  }
  else if (typeof v === 'number') {
    return new Date(v);
  }
  var i = v.indexOf(_datereg);
  if (i >= 0) {
    var m = _re.exec(v);
    if (m !== null) {
      var d = parseInt(m[0], 10);
      return new Date(d);
    }
    else {
      return null;
    }
  }
  else {
    if (isNaN(v)) {
      return new Date(v);
    }
    else {
      var d = parseInt(v, 10);
      return new Date(d);
    }
  }
}
function json(obj, meta) {
  if (!meta) {
    return obj;
  }
  jsonToDate(obj, meta.dateFields);
  if (meta.objectFields) {
    for (var _i = 0, _a = meta.objectFields; _i < _a.length; _i++) {
      var of = _a[_i];
      if (of.attributeName && obj[of.attributeName]) {
        json(obj[of.attributeName], of);
      }
    }
  }
  if (meta.arrayFields) {
    for (var _b = 0, _c = meta.arrayFields; _b < _c.length; _b++) {
      var af = _c[_b];
      if (af.attributeName && obj[af.attributeName]) {
        var arr = obj[af.attributeName];
        if (Array.isArray(arr)) {
          for (var _d = 0, arr_1 = arr; _d < arr_1.length; _d++) {
            var a = arr_1[_d];
            json(a, af);
          }
        }
      }
    }
  }
  return obj;
}
exports.json = json;
function jsonArray(list, metaModel) {
  if (!metaModel) {
    return list;
  }
  if (!list || list.length === 0) {
    return list;
  }
  for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
    var obj = list_1[_i];
    json(obj, metaModel);
  }
  return list;
}
exports.jsonArray = jsonArray;

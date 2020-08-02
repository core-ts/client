"use strict";
Object.defineProperty(exports,"__esModule",{value:true});
var Type;
(function (Type){
  Type["Date"] = "date";
  Type["Object"] = "object";
  Type["Array"] = "array";
})(Type = exports.Type || (exports.Type = {}));
function build(model){
  if (model && !model.source){
    model.source = model.name;
  }
  var primaryKeys = new Array();
  var dateFields = new Array();
  var objectFields = new Array();
  var arrayFields = new Array();
  var ids = Object.keys(model.attributes);
  for (var _i = 0, ids_1 = ids; _i < ids_1.length; _i++){
    var key = ids_1[_i];
    var attr = model.attributes[key];
    if (attr){
      attr.name = key;
      if (attr.ignored !== true){
        if (attr.key === true){
          primaryKeys.push(attr.name);
        }
      }
      switch (attr.type){
        case Type.Date: {
          dateFields.push(attr.name);
          break;
        }
        case Type.Object: {
          if (attr.typeof){
            var x = build(attr.typeof);
            x.attributeName = key;
            objectFields.push(x);
          }
          break;
        }
        case Type.Array: {
          if (attr.typeof){
            var y = build(attr.typeof);
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
  var metadata = { model: model };
  if (primaryKeys.length > 0){
    metadata.keys = primaryKeys;
  }
  if (dateFields.length > 0){
    metadata.dateFields = dateFields;
  }
  if (objectFields.length > 0){
    metadata.objectFields = objectFields;
  }
  if (arrayFields.length > 0){
    metadata.arrayFields = arrayFields;
  }
  return metadata;
}
exports.build = build;
function buildKeys(model){
  var ids = Object.keys(model.attributes);
  var pks = [];
  for (var _i = 0, ids_2 = ids; _i < ids_2.length; _i++){
    var key = ids_2[_i];
    var attr = model.attributes[key];
    if (attr && attr.ignored !== true && attr.key === true && attr.name && attr.name.length > 0){
      pks.push(attr.name);
    }
  }
  return pks;
}
exports.buildKeys = buildKeys;
var _rd = '/Date(';
var _rn = /-?\d+/;
function jsonToDate(obj, fields){
  if (!obj || !fields){
    return obj;
  }
  if (!Array.isArray(obj)){
    for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++){
      var field = fields_1[_i];
      var v = obj[field];
      if (v && !(v instanceof Date)){
        obj[field] = toDate(v);
      }
    }
  }
}
function toDate(v){
  if (!v || v === ''){
    return null;
  }
  if (v instanceof Date){
    return v;
  }
  else if (typeof v === 'number'){
    return new Date(v);
  }
  var i = v.indexOf(_rd);
  if (i >= 0){
    var m = _rn.exec(v);
    var d = parseInt(m[0], null);
    return new Date(d);
  }
  else {
    if (isNaN(v)){
      return new Date(v);
    }
    else {
      var d = parseInt(v, null);
      return new Date(d);
    }
  }
}
function json(obj, meta){
  jsonToDate(obj, meta.dateFields);
  if (meta.objectFields){
    for (var _i = 0, _a = meta.objectFields; _i < _a.length; _i++){
      var objectField = _a[_i];
      if (obj[objectField.attributeName]){
        json(obj[objectField.attributeName], objectField);
      }
    }
  }
  if (meta.arrayFields){
    for (var _b = 0, _c = meta.arrayFields; _b < _c.length; _b++){
      var arrayField = _c[_b];
      if (obj[arrayField.attributeName]){
        var arr = obj[arrayField.attributeName];
        if (Array.isArray(arr)){
          for (var _d = 0, arr_1 = arr; _d < arr_1.length; _d++){
            var a = arr_1[_d];
            json(a, arrayField);
          }
        }
      }
    }
  }
  return obj;
}
exports.json = json;
function jsonArray(list, metaModel){
  if (!list || list.length === 0){
    return list;
  }
  for (var _i = 0, list_1 = list; _i < list_1.length; _i++){
    var obj = list_1[_i];
    json(obj, metaModel);
  }
  return list;
}
exports.jsonArray = jsonArray;

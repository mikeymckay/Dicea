var Checklist, GoogleSpreadsheet, GoogleUrl;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
GoogleUrl = function() {
  function GoogleUrl(sourceIdentifier) {
    this.sourceIdentifier = sourceIdentifier;
    if (this.sourceIdentifier.match(/http(s)*:/)) {
      this.url = this.sourceIdentifier;
      try {
        this.key = this.url.match(/key=(.*?)&/)[1];
      } catch (error) {
        this.key = this.url.match(/list\/(.*?)\//)[1];
      }
    } else {
      this.key = this.sourceIdentifier;
    }
    this.jsonUrl = "http://spreadsheets.google.com/feeds/list/" + this.key + "/od6/public/basic?alt=json-in-script";
  }
  return GoogleUrl;
}();
GoogleSpreadsheet = function() {
  function GoogleSpreadsheet() {}
  GoogleSpreadsheet.prototype.load = function(callback) {
    var intervalId, jsonUrl, safetyCounter, url, waitUntilLoaded;
    url = this.jsonUrl + "&callback=GoogleSpreadsheet.callback";
    $('body').append("<script src='" + url + "'/>");
    jsonUrl = this.jsonUrl;
    safetyCounter = 0;
    waitUntilLoaded = function() {
      var result;
      result = GoogleSpreadsheet.find({
        jsonUrl: jsonUrl
      });
      if (safetyCounter++ > 20 || ((result != null) && (result.data != null))) {
        clearInterval(intervalId);
        return callback();
      }
    };
    intervalId = setInterval(waitUntilLoaded, 200);
    if (typeof result != "undefined" && result !== null) {
      return result;
    }
  };
  GoogleSpreadsheet.prototype.url = function(url) {
    return this.googleUrl(new GoogleUrl(url));
  };
  GoogleSpreadsheet.prototype.googleUrl = function(googleUrl) {
    if (typeof googleUrl === "string") {
      throw "Invalid url, expecting object not string";
    }
    this.url = googleUrl.url;
    this.key = googleUrl.key;
    return this.jsonUrl = "http://spreadsheets.google.com/feeds/list/" + this.key + "/od6/public/basic?alt=json-in-script";
  };
  GoogleSpreadsheet.prototype.save = function() {
    return localStorage["GoogleSpreadsheet." + this.type] = JSON.stringify(this);
  };
  return GoogleSpreadsheet;
}();
GoogleSpreadsheet.bless = function(object) {
  var key, result, value;
  result = new GoogleSpreadsheet();
  for (key in object) {
    value = object[key];
    result[key] = value;
  }
  return result;
};
GoogleSpreadsheet.find = function(params) {
  var item, itemObject, key, value, _i, _len;
  try {
    for (item in localStorage) {
      if (item.match(/^GoogleSpreadsheet\./)) {
        itemObject = JSON.parse(localStorage[item]);
        for (key in params) {
          value = params[key];
          if (itemObject[key] === value) {
            return GoogleSpreadsheet.bless(itemObject);
          }
        }
      }
    }
  } catch (error) {
    for (_i = 0, _len = localStorage.length; _i < _len; _i++) {
      item = localStorage[_i];
      if (item.match(/^GoogleSpreadsheet\./)) {
        itemObject = JSON.parse(localStorage[item]);
        for (key in params) {
          value = params[key];
          if (itemObject[key] === value) {
            return GoogleSpreadsheet.bless(itemObject);
          }
        }
      }
    }
  }
  return null;
};
GoogleSpreadsheet.callback = function(data) {
  var cell, googleSpreadsheet, googleUrl, result, row, rowData, _i, _j, _len, _len2, _ref, _ref2;
  result = [];
  _ref = data.feed.entry;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    row = _ref[_i];
    rowData = {};
    _ref2 = row.content.$t.split(", ");
    for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
      cell = _ref2[_j];
      cell = cell.split(": ");
      rowData[cell[0]] = cell[1];
    }
    result.push(rowData);
  }
  googleUrl = new GoogleUrl(data.feed.id.$t);
  googleSpreadsheet = GoogleSpreadsheet.find({
    jsonUrl: googleUrl.jsonUrl
  });
  if (googleSpreadsheet === null) {
    googleSpreadsheet = new GoogleSpreadsheet();
    googleSpreadsheet.googleUrl(googleUrl);
  }
  googleSpreadsheet.data = result;
  googleSpreadsheet.save();
  return googleSpreadsheet;
};
Checklist = function() {
  function Checklist() {
    Checklist.__super__.constructor.apply(this, arguments);
  }
  __extends(Checklist, GoogleSpreadsheet);
  Checklist.prototype.loadFromGoogleSpreadhseet = function(googleSpreadsheet) {
    var key, value, _results;
    _results = [];
    for (key in googleSpreadsheet) {
      value = googleSpreadsheet[key];
      _results.push(this[key] = value);
    }
    return _results;
  };
  Checklist.prototype.form = function(className) {
    var i, item, result, _len, _ref;
    result = "";
    _ref = this.data;
    for (i = 0, _len = _ref.length; i < _len; i++) {
      item = _ref[i];
      result += "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' /><label for='checkbox-" + i + "'>" + item.text + "</label>";
    }
    return result;
  };
  Checklist.prototype.jqueryMobileForm = function() {
    return "<div data-role='fieldcontain'>  <fieldset data-role='controlgroup'>    " + (this.form()) + "  </fieldset></div>";
  };
  return Checklist;
}();
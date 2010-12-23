var GoogleSpreadsheet, GoogleUrl;
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
  GoogleSpreadsheet.prototype.load = function() {
    var url;
    console.log("yo");
    url = this.jsonUrl + "&callback=GoogleSpreadsheet.callback";
    return $('body').append("<script src='" + url + "'/>");
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
    this.jsonUrl = "http://spreadsheets.google.com/feeds/list/" + this.key + "/od6/public/basic?alt=json-in-script";
    return this.data = null;
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
    result['key'] = value;
  }
  return result;
};
GoogleSpreadsheet.find = function(params) {
  var item, itemObject, key, value, _i, _len;
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
};
GoogleSpreadsheet.callback = function(data) {
  var cell, jsonUrl, result, row, rowData, target, _i, _j, _len, _len2, _ref, _ref2;
  console.log("YOYO");
  console.log(JSON.stringify(data));
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
  jsonUrl = new GoogleSpreadsheet(data.feed.id.$t).jsonUrl;
  target = GoogleSpreadsheet.find({
    jsonUrl: jsonUrl
  });
  target.data = result;
  console.log("callback:");
  console.log(JSON.stringify(target));
  return target.save();
};
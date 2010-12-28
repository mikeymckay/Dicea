$(document).ready(function() {
  var url;
  module("Basic Unit Test");
  test("Sample test", function() {
    expect(1);
    return equals(4 / 2, 2);
  });
  module("Google Spreadsheet");
  url = "https://spreadsheets.google.com/pub?key=0Ago31JQPZxZrdHF2bWNjcTJFLXJ6UUM5SldEakdEaXc&hl=en&output=html";
  test("Load from URL", function() {
    var expectedJsonUrl, expectedKey, googleUrl;
    expect(2);
    expectedKey = "0Ago31JQPZxZrdHF2bWNjcTJFLXJ6UUM5SldEakdEaXc";
    expectedJsonUrl = "http://spreadsheets.google.com/feeds/list/" + expectedKey + "/od6/public/basic?alt=json-in-script";
    googleUrl = new GoogleUrl(url);
    equals(googleUrl.key, expectedKey);
    return equals(googleUrl.jsonUrl, expectedJsonUrl);
  });
  test("Save and find", function() {
    var googleSpreadsheet, result;
    googleSpreadsheet = new GoogleSpreadsheet();
    googleSpreadsheet.url(url);
    googleSpreadsheet.type = "test";
    googleSpreadsheet.save();
    result = GoogleSpreadsheet.find({
      url: url
    });
    return equals(JSON.stringify(result), JSON.stringify(googleSpreadsheet));
  });
  test("Parsing", function() {
    result = null;    jQuery.getJSON("testCallbackData.json", function(data) {
      var result;
      console.log("Callbback!");
      result = GoogleSpreadsheet.callback(data);
      return console.log(result);
    });
    return equals(result.length, 10);
  });
  return test("Load and parse", function() {
    var googleSpreadsheet;
    googleSpreadsheet = new GoogleSpreadsheet();
    googleSpreadsheet.url(url);
    return googleSpreadsheet.load();
  });
});
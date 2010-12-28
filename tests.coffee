$(document).ready ->
  module "Basic Unit Test"
  test "Sample test", ->
    expect(1)
    equals(4/2,2)
  module "Google Spreadsheet"
  url = "https://spreadsheets.google.com/pub?key=0Ago31JQPZxZrdHF2bWNjcTJFLXJ6UUM5SldEakdEaXc&hl=en&output=html"

  test "Load from URL", ->
    expect(2)
    expectedKey = "0Ago31JQPZxZrdHF2bWNjcTJFLXJ6UUM5SldEakdEaXc"
    expectedJsonUrl = "http://spreadsheets.google.com/feeds/list/" + expectedKey + "/od6/public/basic?alt=json-in-script"
    googleUrl = new GoogleUrl(url)
    equals(googleUrl.key, expectedKey)
    equals(googleUrl.jsonUrl, expectedJsonUrl)

  test "Save and find", ->
    googleSpreadsheet = new GoogleSpreadsheet()
    googleSpreadsheet.url(url)
    googleSpreadsheet.type = "test"
    googleSpreadsheet.save()
    result = GoogleSpreadsheet.find({url:url})
    equals(JSON.stringify(result),JSON.stringify(googleSpreadsheet))

  test "Parsing", ->
    `result = null`
    jQuery.getJSON "testCallbackData.json", (data) ->
      console.log "Callbback!"
      result = GoogleSpreadsheet.callback(data)
      console.log result
      # I don't think this equals works
    #"foo" while result == null
    equals(result.length,10)


  test "Load and parse", ->
    googleSpreadsheet = new GoogleSpreadsheet()
    googleSpreadsheet.url(url)
    googleSpreadsheet.load()

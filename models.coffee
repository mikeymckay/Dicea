class GoogleUrl
  constructor: (@sourceIdentifier) ->
    if (@sourceIdentifier.match(/http(s)*:/))
      @url = @sourceIdentifier
      try
        @key = @url.match(/key=(.*?)&/)[1]
      catch error
        @key = @url.match(/list\/(.*?)\//)[1]
    else
      @key = @sourceIdentifier
    @jsonUrl = "http://spreadsheets.google.com/feeds/list/" + @key + "/od6/public/basic?alt=json-in-script"

class GoogleSpreadsheet
  load: ->
    url = @jsonUrl + "&callback=GoogleSpreadsheet.callback"
    $('body').append("<script src='" +url+ "'/>")

  url: (url) ->
    this.googleUrl(new GoogleUrl(url))

  googleUrl: (googleUrl) ->
    throw "Invalid url, expecting object not string" if typeof(googleUrl) == "string"
    @url = googleUrl.url
    @key = googleUrl.key
    @jsonUrl = "http://spreadsheets.google.com/feeds/list/" + @key + "/od6/public/basic?alt=json-in-script"

  save: ->
    localStorage["GoogleSpreadsheet."+@type] = JSON.stringify(this)

GoogleSpreadsheet.bless = (object) ->
  result = new GoogleSpreadsheet()
  for key,value of object
    result[key]=value
  result

GoogleSpreadsheet.find = (params) ->
  for item in localStorage
    if item.match(/^GoogleSpreadsheet\./)
      itemObject = JSON.parse(localStorage[item])
      for key,value of params
        if itemObject[key] == value
          return GoogleSpreadsheet.bless(itemObject)

GoogleSpreadsheet.callback = (data) ->
  result = []
  for row in data.feed.entry
    rowData = {}
    for cell in row.content.$t.split(", ")
      cell = cell.split(": ")
      rowData[cell[0]]=cell[1]
    result.push(rowData)
  jsonUrl = new GoogleSpreadsheet(data.feed.id.$t).jsonUrl
  target = GoogleSpreadsheet.find({jsonUrl:jsonUrl})
  target.data = result
  target.save()
  result

class Checklist
  googleSpreadsheet: (googleSpreadsheet) ->
  toTable: ->
  reload: ->
  submit: ->

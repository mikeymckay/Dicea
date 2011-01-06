jQuery.getJSON "testsCallbackData.json", (data) ->
  checklist = new Checklist()
  checklist.loadFromGoogleSpreadhseet(GoogleSpreadsheet.callback(data))
  $("div[data-role='content']").html(checklist.jqueryMobileForm()).page()


jQuery.getJSON("testsCallbackData.json", function(data) {
  var checklist;
  checklist = new Checklist();
  checklist.loadFromGoogleSpreadhseet(GoogleSpreadsheet.callback(data));
  return $("div[data-role='content']").html(checklist.jqueryMobileForm()).page();
});
// Google Apps Script bound to a spreadsheet.
// 1. Create a sheet named Scoops quotes.
// 2. Extensions → Apps Script, paste this file, and save.
// 3. Deploy → New deployment → Web app.
//    Execute as: Me
//    Who has access: Anyone
// 4. Copy the web app URL into public/js/config.js as window.SCOOPS_LEAD_URL.

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted",
      "Name",
      "Phone",
      "Email",
      "Address",
      "Dogs",
      "Frequency",
      "Yard size",
      "Last cleaned",
      "Price",
      "Price unit",
      "Initial fee"
    ]);
  }
  sheet.appendRow([
    data.submittedAt || new Date(),
    data.name || "",
    data.phone || "",
    data.email || "",
    data.address || "",
    data.dogs || "",
    data.frequency || "",
    data.yardSize || "",
    data.lastCleaned || "",
    data.price || "",
    data.priceUnit || "",
    data.initialFee || 0
  ]);
  return ContentService.createTextOutput("ok");
}

function testEmail() {
  GmailApp.sendEmail("sumithnalla24@ifheindia.org", "Test", "This is a test email from Apps Script");
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 1. Create all headers if the sheet is completely empty (This acts as the "Create Sheet" step)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Mobile', 'Email', 'Background', 'Message', 'Source']);
    sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    sheet.setFrozenRows(1);
  } else {
    // 2. Automatically add missing headers on an existing sheet
    if (sheet.getRange(1, 5).getValue() !== 'Background') {
      sheet.getRange(1, 5).setValue('Background').setFontWeight("bold");
    }
    if (sheet.getRange(1, 6).getValue() !== 'Message') {
      sheet.getRange(1, 6).setValue('Message').setFontWeight("bold");
    }
    // Automatically adds the 'Source' header if it's missing on an older sheet
    if (sheet.getRange(1, 7).getValue() !== 'Source') {
      sheet.getRange(1, 7).setValue('Source').setFontWeight("bold");
    }
  }
  
  // 3. Extract the variables (Adding 'Source')
  var name       = e.parameter.Name;
  var mobile     = e.parameter.Mobile;
  var email      = e.parameter.Email;
  var background = e.parameter.Background; 
  var message    = e.parameter.Message || "No message provided"; 
  var source     = e.parameter.Source || "No source provided"; 
  
  // 4. Put the data into the sheet
  sheet.appendRow([new Date(), name, mobile, email, background, message, source]);
  
  // 5. Build and send the notification email
  var clientEmail = "Mohammednadeem9@gmail.com,quickinsightsolutions@gmail.com"; 
  var subject = " New Demo Booking! " + name;
  
  var htmlBody = 
    "<div style='font-family:Arial,sans-serif;max-width:500px;'>" +
    "<h2 style='color:#0284c7;'>New Demo Booking!</h2>" +
    "<table style='width:100%;border-collapse:collapse;'>" +
    "<tr><td style='padding:8px;background:#f1f5f9;font-weight:bold;width:30%'>Role</td>" +
    "<td style='padding:8px;border-bottom:1px solid #e2e8f0;'>" + background + "</td></tr>" +
    "<tr><td style='padding:8px;background:#f1f5f9;font-weight:bold;width:30%'>Name</td>" +
    "<td style='padding:8px;border-bottom:1px solid #e2e8f0;'>" + name + "</td></tr>" +
    "<tr><td style='padding:8px;background:#f1f5f9;font-weight:bold;'>Mobile</td>" +
    "<td style='padding:8px;border-bottom:1px solid #e2e8f0;'>" + mobile + "</td></tr>" +
    "<tr><td style='padding:8px;background:#f1f5f9;font-weight:bold;'>Email</td>" +
    "<td style='padding:8px;border-bottom:1px solid #e2e8f0;'>" + email + "</td></tr>" +
    "<tr><td style='padding:8px;background:#f1f5f9;font-weight:bold;'>Message</td>" +
    "<td style='padding:8px;border-bottom:1px solid #e2e8f0;'>" + message + "</td></tr>" +
    "<tr><td style='padding:8px;background:#f1f5f9;font-weight:bold;'>Source</td>" +
    "<td style='padding:8px;border-bottom:1px solid #e2e8f0;'>" + source + "</td></tr>" +
    "<tr><td style='padding:8px;background:#f1f5f9;font-weight:bold;'>Time</td>" +
    "<td style='padding:8px;'>" + new Date() + "</td></tr>" +
    "</table>" +
    "<p style='color:#64748b;font-size:13px;margin-top:16px;'>This lead was submitted via your Global Coach IT Academy website.</p>" +
    "</div>";
  
  GmailApp.sendEmail(clientEmail, subject, "", { htmlBody: htmlBody });
  
  // 6. Return success to the web page
  return ContentService.createTextOutput(JSON.stringify({ "result": "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}
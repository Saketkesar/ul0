/**
 * ==============================================================================
 * UL0 SPLIT & HISAB - GOOGLE APPS SCRIPT WEBHOOK RECEIVER
 * ==============================================================================
 * 
 * This script turns your Google Sheet into a real-time admin backend for UL0 Split.
 * Every time someone creates a split, claims a payment, confirms or disputes a payment,
 * or gets a reminder, a new row is instantly logged here with full details.
 * 
 * ------------------------------------------------------------------------------
 * SETUP INSTRUCTIONS (Takes 1 Minute):
 * ------------------------------------------------------------------------------
 * 1. Open Google Sheets in your browser: https://sheets.new
 * 2. Rename your sheet to: "UL0 Split Admin Live"
 * 3. In the top menu, click: Extensions -> Apps Script
 * 4. Delete any code in the editor, and PASTE this entire script.
 * 5. Click the "Save" icon (or press Ctrl+S / Cmd+S).
 * 6. (Optional Test): Select "testLogEvent" from the function dropdown and click "Run".
 *    Grant permissions if prompted. You will see a test row appear in your sheet!
 * 7. Click the blue "Deploy" button (top right) -> "New deployment".
 * 8. Click the gear icon next to "Select type" and choose "Web app".
 * 9. Configure the deployment:
 *    - Description: "UL0 Split Admin Webhook"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone"  <--- (IMPORTANT: Select "Anyone" so webhook can POST)
 * 10. Click "Deploy".
 * 11. Copy the "Web app URL" (looks like: https://script.google.com/macros/s/.../exec).
 * 12. Add this URL to your environment variables:
 *     In Vercel / .env: GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 *     In Pella.app dashboard: GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 * ==============================================================================
 */

const HEADERS = [
  "Timestamp (IST)",
  "Event Type",
  "Split Slug",
  "Split Title",
  "Total Amount (₹)",
  "Organizer Name",
  "Organizer UPI",
  "Organizer Email",
  "Member / Payer",
  "Member Share (₹)",
  "Member Contact",
  "Status",
  "Notes / Reference",
  "Split URL"
];

function setupSheetHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    
    // Style header row (UL0 Pine theme)
    var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#1B685C"); // UL0 Pine Emerald
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Roboto");
    headerRange.setFontSize(10);
    headerRange.setHorizontalAlignment("center");
    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);

    // Auto fit column widths
    for (var i = 1; i <= HEADERS.length; i++) {
      sheet.setColumnWidth(i, 160);
    }
    sheet.setColumnWidth(1, 170); // Timestamp
    sheet.setColumnWidth(4, 200); // Title
    sheet.setColumnWidth(13, 220); // Notes
    sheet.setColumnWidth(14, 220); // URL
  }
}

function formatIST(date) {
  return Utilities.formatDate(date || new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupSheetHeaders(sheet);

    var rawData = e && e.postData && e.postData.contents ? e.postData.contents : "{}";
    var data = JSON.parse(rawData);

    var timestamp = formatIST(new Date());
    var eventType = data.event_type || data.eventType || "event";
    var splitSlug = data.split_slug || data.slug || "";
    var title = data.title || data.split_name || "";
    var totalAmount = data.total_amount || data.total || 0;
    var organizerName = data.organizer_name || data.collector_name || "";
    var organizerUpi = data.organizer_upi || data.upi_id || "";
    var organizerEmail = data.organizer_email || data.email || "";
    var memberName = data.member_name || data.friend_name || "";
    var memberShare = data.member_share || data.amount || 0;
    var memberContact = data.member_contact || data.telegram || data.phone || "";
    var status = data.status || "Active";
    var notes = data.notes || data.reason || data.utr || "";
    var splitUrl = data.split_url || data.settle_url || (splitSlug ? "https://ul0.site/split/" + splitSlug : "");

    var row = [
      timestamp,
      eventType,
      splitSlug,
      title,
      Number(totalAmount) || 0,
      organizerName,
      organizerUpi,
      organizerEmail,
      memberName,
      Number(memberShare) || 0,
      memberContact,
      status,
      notes,
      splitUrl
    ];

    sheet.appendRow(row);
    var newRowIndex = sheet.getLastRow();

    // Subtle row styling
    var rowRange = sheet.getRange(newRowIndex, 1, 1, HEADERS.length);
    rowRange.setFontFamily("Roboto");
    rowRange.setFontSize(10);
    rowRange.setVerticalAlignment("middle");
    
    // Status color highlights
    var statusCell = sheet.getRange(newRowIndex, 12);
    var st = String(status).toLowerCase();
    if (st.indexOf("confirm") !== -1 || st.indexOf("settled") !== -1 || st.indexOf("paid") !== -1) {
      statusCell.setBackground("#DDF5EE"); // UL0 Mint
      statusCell.setFontColor("#0E4B40");
      statusCell.setFontWeight("bold");
    } else if (st.indexOf("dispute") !== -1 || st.indexOf("not received") !== -1) {
      statusCell.setBackground("#FEE2E2"); // Light red
      statusCell.setFontColor("#991B1B");
      statusCell.setFontWeight("bold");
    } else if (st.indexOf("claimed") !== -1 || st === "paid") {
      statusCell.setBackground("#FEF3C7"); // Yellow
      statusCell.setFontColor("#92400E");
    } else if (st.indexOf("unsub") !== -1) {
      statusCell.setBackground("#F3F4F6"); // Neutral Gray
      statusCell.setFontColor("#4B5563");
      statusCell.setFontWeight("bold");
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      row: newRowIndex,
      timestamp: timestamp,
      eventType: eventType
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  setupSheetHeaders(sheet);
  var rowCount = sheet.getLastRow();

  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    service: "UL0 Split Google Sheets Logger",
    sheet_name: sheet.getName(),
    total_records: Math.max(0, rowCount - 1),
    timestamp: formatIST(new Date())
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this function in the Apps Script editor to verify setup
 */
function testLogEvent() {
  var mockEvent = {
    postData: {
      contents: JSON.stringify({
        event_type: "split_created",
        split_slug: "sample-split-101",
        title: "Weekend Dinner Split",
        total_amount: 2400,
        organizer_name: "Organizer",
        organizer_upi: "organizer@okaxis",
        organizer_email: "organizer@example.com",
        member_name: "Friend 1",
        member_share: 600,
        member_contact: "@friend1",
        status: "Active",
        notes: "Test automated row from UL0 Apps Script test",
        split_url: "https://ul0.site/split/sample-split-101"
      })
    }
  };

  var res = doPost(mockEvent);
  Logger.log("Result: " + res.getContent());
}

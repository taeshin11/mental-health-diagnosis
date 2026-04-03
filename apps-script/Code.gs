// NPD Self-Check — Google Apps Script Web App
// Handles: POST (quiz results) + GET (visitor tracking)
// Deploy as: Execute as Me, Access Anyone

var SHEET_NAME_RESULTS  = 'Results';
var SHEET_NAME_VISITORS = 'Visitors';

function getOrCreateSheet(ss, name, headers) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
  }
  return sh;
}

function getSpreadsheet() {
  // Uses the spreadsheet this script is bound to.
  // If standalone, create one on first run and cache its ID in Script Properties.
  var props = PropertiesService.getScriptProperties();
  var ssId  = props.getProperty('SPREADSHEET_ID');
  var ss;
  if (ssId) {
    ss = SpreadsheetApp.openById(ssId);
  } else {
    ss = SpreadsheetApp.create('NPD-Self-Check-Results');
    props.setProperty('SPREADSHEET_ID', ss.getId());
  }
  return ss;
}

// ─── POST handler ───────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = getSpreadsheet();

    if (data.type === 'result') {
      var sh = getOrCreateSheet(ss, SHEET_NAME_RESULTS, [
        'timestamp','score','grade','userAgent','language','referrer','sessionId'
      ]);
      sh.appendRow([
        data.timestamp || new Date().toISOString(),
        data.score,
        data.grade,
        data.userAgent || '',
        data.language  || '',
        data.referrer  || 'direct',
        data.sessionId || '',
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── GET handler (visitor counter) ──────────────────
function doGet(e) {
  try {
    var params = e.parameter || {};
    var ss = getSpreadsheet();
    var sh = getOrCreateSheet(ss, SHEET_NAME_VISITORS, [
      'timestamp','date','sessionId','userAgent'
    ]);

    // Record this visit
    var today = params.date || new Date().toISOString().slice(0, 10);
    sh.appendRow([
      new Date().toISOString(),
      today,
      params.sessionId || '',
      params.userAgent || '',
    ]);

    // Count visits
    var data  = sh.getDataRange().getValues();
    var total = data.length - 1; // exclude header row
    var todayCount = data.slice(1).filter(function(row) {
      return row[1] === today;
    }).length;

    var result = ContentService
      .createTextOutput(JSON.stringify({ today: todayCount, total: total }))
      .setMimeType(ContentService.MimeType.JSON);

    return result;
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ today: 0, total: 0, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

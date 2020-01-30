import { toBool } from './handlers';
const googleSpreadsheet = require('google-spreadsheet');
import creds from './google_client_secret.json';

function loadData() {
  return new Promise((resolve, reject) => {
    const doc = new googleSpreadsheet(process.env.SPREAD_SHEET_ID);
    doc.useServiceAccountAuth(creds, (err: any) => {
      // Get all of the rows from the spreadsheet.
      doc.getRows(1, function (err: any, rows: any) {
        let arr: any[] = [];
        rows.forEach((row: any) => {
          arr.push({
            'location': row['지역'],
            'name': row['식당이름'],
            'isLunch': toBool(row['점심인지']),
            'isDinner': toBool(row['저녁인지']),
            'isDining': toBool(row['회식인지']),
            'alcohols': row['주종'].split('/'),
            'isPayco': toBool(row['페이코인지아닌지'])
          });
        });
        console.log(`fetched! -- ${arr.length} rows.`);
        resolve(arr);
      });
    });
  })
  
}

export {loadData};
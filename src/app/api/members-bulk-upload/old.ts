// import { NextResponse } from 'next/server';
// import { google } from 'googleapis';
// import { parseSheetRowToMember } from '@/services/member/bulkService';
// import { syncMembersToFirebase } from '@/services/member';

// export async function GET() {
//   try {
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//       },
//       scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
//     });

//     const sheets = google.sheets({ version: 'v4', auth, timeout: 30000 });

//     const SHEET_ID = '1KrDOAPA7GV-G1HWyNv-aGODIGjzVIMTwTlKVS4wgKNs';
//     const RANGE = 'Sheet1!A3:Q8';

//     console.log('Fetching from range:', RANGE);

//     const res = await sheets.spreadsheets.values.get({
//       spreadsheetId: SHEET_ID,
//       range: RANGE,
//     });

//     console.log('Sheets response:', res.status, res.data.values?.length);

//     const values = res.data.values || [];

//     if (values.length === 0) {
//       return NextResponse.json({
//         error: 'No data found in sheet',
//         totalRows: 0,
//       });
//     }

//     const parsedMembers = values.map((row: any, index: number) =>
//       parseSheetRowToMember(row, index + 2)
//     );

//     const syncResults = await syncMembersToFirebase(parsedMembers);

//     return NextResponse.json({
//       totalRows: values.length,
//       totalProcessed: parsedMembers.length,
//       ...syncResults,
//     });
//   } catch (error: any) {
//     console.error('Sheets API error details:', {
//       message: error.message,
//       code: error.code,
//       status: error.status,
//     });

//     return NextResponse.json(
//       {
//         error: 'Failed to fetch sheet data',
//         details: error.message,
//         code: error.code,
//       },
//       { status: 500 }
//     );
//   }
// }

// // async function getSheetData(sheets: any, spreadsheetId: string, range: string, retries = 3) {
// //   for (let i = 0; i < retries; i++) {
// //     try {
// //       return await sheets.spreadsheets.values.get({
// //         spreadsheetId,
// //         range,
// //       });
// //     } catch (error: any) {
// //       if (i === retries - 1) throw error;
// //       console.log(`Retry ${i + 1} after error:`, error.code);
// //       await new Promise((resolve) => setTimeout(resolve, 2000)); // 2s delay
// //     }
// //   }
// // }

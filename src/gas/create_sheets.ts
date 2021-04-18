export const createSheets = () => {
  try {
    const Spreadshhet = SpreadsheetApp.getActiveSpreadsheet();

    try {
      Spreadshhet.deleteSheet(Spreadshhet.getSheetByName("channels"));
    } catch (e) {
      console.error(e);
    }

    try {
      Spreadshhet.deleteSheet(Spreadshhet.getSheetByName("users"));
    } catch (e) {
      console.error(e);
    }

    const channelsSheetColumnNames = ["id", "name"];
    const ChannelsSheet = Spreadshhet.insertSheet("channels");
    ChannelsSheet.getRange(1, 1, 1, channelsSheetColumnNames.length).setValues([channelsSheetColumnNames]);

    const usersSheetColumnNames = ["id", "name", "real_name", "image", "email"];
    const UsersSheet = Spreadshhet.insertSheet("users");
    UsersSheet.getRange(1, 1, 1, usersSheetColumnNames.length).setValues([usersSheetColumnNames]);
  } catch (e) {
    console.error(e);
    return "NG";
  }
  return "success";
};
global.createSheets = createSheets;

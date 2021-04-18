declare module NodeJS {
  interface Global {
    onOpen(e: GoogleAppsScript.Events.DocsOnOpen);
    onEdit(e: GoogleAppsScript.Events.DocsOnOpen);
    doGet(e: GoogleAppsScript.Events.DoGet);
    doPost(e: GoogleAppsScript.Events.DoPost);
    [x: string]: any;
  }
}

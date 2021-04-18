import { default as ENV } from "@root/.env";

export const homeDirectoryPath = ENV[process.platform == "win32" ? "USERPROFILE" : "HOME"];

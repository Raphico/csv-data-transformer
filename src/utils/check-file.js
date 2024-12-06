import fs from "node:fs";

export function isValidCSVFile(file) {
    return /\.csv$/.test(file);
}

export function isValidJSONFile(file) {
    return /\.json$/.test(file);
}

export function isValidFile(file) {
    return fs.existsSync(file) && fs.lstatSync(file).isFile();
}

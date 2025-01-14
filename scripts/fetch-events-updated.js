"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var __dirname = path.resolve();
function fetchEvents() {
    return __awaiter(this, void 0, void 0, function () {
        var sheetId, sheetName, apiKey, response, data, rows, formattedEvents, filePath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    console.log('Fetching data from Google Sheets...');
                    sheetId = '1184qmC-7mpZtpg15R--il4K3tVxSTAcJUZxpWf9KFAs';
                    sheetName = 'Sheet1';
                    apiKey = process.env.VITE_GOOGLE_SHEETS_API_KEY;
                    if (!apiKey) {
                        throw new Error('Google Sheets API key is missing');
                    }
                    return [4 /*yield*/, fetch("https://sheets.googleapis.com/v4/spreadsheets/".concat(sheetId, "/values/").concat(sheetName, "?key=").concat(apiKey))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    console.log('Google Sheets API response:', data);
                    if (!data.values) {
                        throw new Error('Invalid sheet data format');
                    }
                    rows = data.values.slice(1);
                    formattedEvents = rows.map(function (row) { return ({
                        title: row[0],
                        date: row[1],
                        time: row[2],
                        location: row[3],
                        type: row[4],
                        url: row[5],
                        imageUrl: row[6],
                    }); });
                    // Sort events by date
                    formattedEvents.sort(function (a, b) {
                        var parseDate = function (dateString) {
                            var parts = dateString.split(' - ')[0].split(', ');
                            var date;
                            if (parts.length > 1) {
                                // Handle format like "Sexta, 10 de Jan"
                                var _a = parts[1].split(' de '), day = _a[0], month = _a[1];
                                var year = '2025'; // Assuming the year is always 2025 for this dataset
                                date = new Date("".concat(month, " ").concat(day, ", ").concat(year));
                            }
                            else {
                                // Handle format like "07/01/2025"
                                var _b = dateString.split('/'), day = _b[0], month = _b[1], year = _b[2];
                                date = new Date("".concat(year, "-").concat(month, "-").concat(day));
                            }
                            return date.getTime();
                        };
                        return parseDate(a.date) - parseDate(b.date);
                    });
                    console.log('Sorted events:', formattedEvents);
                    filePath = path.resolve(__dirname, '../src/data/events.json');
                    fs.writeFileSync(filePath, JSON.stringify(formattedEvents, null, 2));
                    console.log('Successfully wrote events to src/data/events.json');
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
fetchEvents();

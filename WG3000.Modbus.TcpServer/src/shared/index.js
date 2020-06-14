"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var vue_1 = require("vue");
var client_1 = require("@servicestack/client");
exports.client = new client_1.JsonServiceClient('/');
var desktop_1 = require("@servicestack/desktop");
var Roles;
(function (Roles) {
    Roles["Admin"] = "Admin";
})(Roles = exports.Roles || (exports.Roles = {}));
exports.store = {
    debug: global.CONFIG.debug,
    desktop: global.CONFIG.desktop,
    hasExcel: global.CONFIG.hasExcel,
    tables: global.CONFIG.tables,
    totals: {},
    columns: {},
    getColumnTotal: function (db, table) {
        var ret = this.totals[db] && this.totals[db][table];
        return ret != null ? ret : null;
    },
    getColumnSchemas: function (db, table) {
        return this.columns[db] && this.columns[db][table] || [];
    },
};
var EventBus = /** @class */ (function (_super) {
    __extends(EventBus, _super);
    function EventBus() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.store = exports.store;
        return _this;
    }
    return EventBus;
}(vue_1.default));
exports.bus = new EventBus({ data: exports.store });
var settings = {};
var settingsLoaded = false;
function loadSettings() {
    return __awaiter(this, void 0, void 0, function () {
        var settingsJson, _a, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, 5, 6]);
                    if (!exports.store.desktop) return [3 /*break*/, 2];
                    return [4 /*yield*/, desktop_1.desktopTextFile('settings.json')];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = localStorage.getItem('settings.json');
                    _b.label = 3;
                case 3:
                    settingsJson = _a;
                    if (settingsJson) {
                        settings = JSON.parse(settingsJson) || {};
                        log('loaded', settings);
                        exports.bus.$emit('settings');
                    }
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _b.sent();
                    log("Could not retrieve desktopTextFile 'settings.json'", e_1);
                    return [3 /*break*/, 6];
                case 5:
                    settingsLoaded = true;
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.loadSettings = loadSettings;
function saveSettings() {
    return __awaiter(this, void 0, void 0, function () {
        var settingsJson, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    settingsJson = JSON.stringify(settings);
                    if (!exports.store.desktop) return [3 /*break*/, 2];
                    return [4 /*yield*/, desktop_1.desktopSaveTextFile('settings.json', settingsJson)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    localStorage.setItem('settings.json', settingsJson);
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    log("Could not retrieve saveDesktopTextFile 'settings.json'", e_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.saveSettings = saveSettings;
function getTableSettings(db, table) {
    return settings[db] && settings[db][table] || null;
}
exports.getTableSettings = getTableSettings;
function saveTableSettings(db, table, tableSettings) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!settingsLoaded)
                        return [2 /*return*/];
                    if (!settings[db]) {
                        settings[db] = {};
                    }
                    if (tableSettings) {
                        settings[db][table] = tableSettings;
                    }
                    else {
                        delete settings[db][table];
                    }
                    return [4 /*yield*/, saveSettings()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.saveTableSettings = saveTableSettings;
function log() {
    var o = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        o[_i] = arguments[_i];
    }
    if (exports.store.debug)
        console.log.apply(console, arguments);
    return o;
}
exports.log = log;
exports.dateFmtHMS = function (d) {
    if (d === void 0) { d = new Date(); }
    return "" + (d.getFullYear() - 2000) + client_1.padInt(d.getMonth() + 1) + client_1.padInt(d.getDate()) + "-" + client_1.padInt(d.getHours()) + client_1.padInt(d.getMinutes()) + client_1.padInt(d.getSeconds());
};
function openUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!exports.store.desktop) return [3 /*break*/, 2];
                    return [4 /*yield*/, desktop_1.evaluateCode("openUrl('" + url + "')")];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    window.open(url);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.openUrl = openUrl;
function exec(c, fn) {
    return __awaiter(this, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    c.loading = true;
                    c.responseStatus = null;
                    return [4 /*yield*/, fn()];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    e_3 = _a.sent();
                    log(e_3);
                    c.responseStatus = e_3.responseStatus || (typeof e_3 == 'string' ? { errorCode: 'Error', message: e_3 } : null) || e_3;
                    c.$emit('error', c.responseStatus);
                    return [3 /*break*/, 4];
                case 3:
                    c.loading = false;
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.exec = exec;
function loadTable(c, db, table) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (exports.store.getColumnSchemas(db, table).length > 0)
                        return [2 /*return*/];
                    return [4 /*yield*/, exec(c, function () { return __awaiter(_this, void 0, void 0, function () {
                            var r, json, obj;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, fetch("/db/" + db + "/" + table + "/meta?format=json")];
                                    case 1:
                                        r = _a.sent();
                                        return [4 /*yield*/, r.text()];
                                    case 2:
                                        json = _a.sent();
                                        if (json) {
                                            obj = JSON.parse(json);
                                            if (!exports.store.columns[db])
                                                vue_1.default.set(exports.store.columns, db, {});
                                            vue_1.default.set(exports.store.columns[db], table, obj);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.loadTable = loadTable;
function sharpData(db, table, args) {
    return __awaiter(this, void 0, void 0, function () {
        var url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = "/db/" + db + "/" + table + "?format=json";
                    if (args) {
                        url = client_1.appendQueryString(url, args);
                    }
                    return [4 /*yield*/, fetch(url)];
                case 1: return [4 /*yield*/, (_a.sent()).json()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.sharpData = sharpData;
vue_1.default.filter('upper', function (value) {
    return value === null || value === void 0 ? void 0 : value.toUpperCase();
});
vue_1.default.filter('json', function (value) {
    return value && JSON.stringify(value);
});
(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, loadSettings()];
        case 1:
            _a.sent();
            return [2 /*return*/];
    }
}); }); })();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _loop_1, _a, _b, _i, db;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _loop_1 = function (db) {
                    var r, json, kvps, columnTotals_1, e_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, fetch("/db/" + db + "/totals?format=json")];
                            case 1:
                                r = _a.sent();
                                return [4 /*yield*/, r.text()];
                            case 2:
                                json = _a.sent();
                                if (json) {
                                    kvps = JSON.parse(json);
                                    columnTotals_1 = {};
                                    kvps.forEach(function (x) {
                                        columnTotals_1[x.key] = x.value;
                                    });
                                    vue_1.default.set(exports.store.totals, db, columnTotals_1);
                                }
                                return [3 /*break*/, 4];
                            case 3:
                                e_4 = _a.sent();
                                log("Can't retrieve totals for '" + db + "':", e_4);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                _a = [];
                for (_b in exports.store.tables)
                    _a.push(_b);
                _i = 0;
                _c.label = 1;
            case 1:
                if (!(_i < _a.length)) return [3 /*break*/, 4];
                db = _a[_i];
                return [5 /*yield**/, _loop_1(db)];
            case 2:
                _c.sent();
                _c.label = 3;
            case 3:
                _i++;
                return [3 /*break*/, 1];
            case 4: return [2 /*return*/];
        }
    });
}); })();
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, e_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = exports.store;
                return [4 /*yield*/, desktop_1.desktopInfo()];
            case 1:
                _a.desktop = _b.sent();
                log('In Desktop app:', exports.store.desktop);
                return [3 /*break*/, 3];
            case 2:
                e_5 = _b.sent();
                log("Not in Desktop app:", e_5);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();

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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var vue_property_decorator_1 = require("vue-property-decorator");
var shared_1 = require("../../shared");
var client_1 = require("@servicestack/client");
var desktop_1 = require("@servicestack/desktop");
var all_1 = require("../Custom/all");
var FormatString = /** @class */ (function (_super) {
    __extends(FormatString, _super);
    function FormatString() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(FormatString.prototype, "lower", {
        get: function () { return ("" + this.value).toLowerCase(); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormatString.prototype, "isUrl", {
        get: function () { return typeof this.value == "string" && this.value.startsWith('http'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormatString.prototype, "url", {
        get: function () { return typeof this.value == "string" && this.value.substring(this.value.indexOf('://') + 3); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FormatString.prototype, "format", {
        get: function () { return typeof this.value == "string" && this.value.startsWith('/Date(') ? client_1.toDateFmt(this.value) : this.value; },
        enumerable: true,
        configurable: true
    });
    __decorate([
        vue_property_decorator_1.Prop({ default: '' })
    ], FormatString.prototype, "value", void 0);
    FormatString = __decorate([
        vue_property_decorator_1.Component({ template: "<a v-if=\"isUrl\" :href=\"value\" target=\"_blank\">{{url}}</a>\n     <i v-else-if=\"lower == 'false'\" class=\"svg svg-md bool-off-muted\"></i>\n     <i v-else-if=\"lower == 'true'\" class=\"svg svg-md bool-on-muted\"></i>\n     <span v-else>{{format}}</span>\n" })
    ], FormatString);
    return FormatString;
}(vue_1.default));
vue_1.default.component('format', FormatString);
var Results = /** @class */ (function (_super) {
    __extends(Results, _super);
    function Results() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.showSelectColumns = false;
        _this.skip = 0;
        _this.take = 100;
        _this.total = null;
        _this.orderBy = '';
        _this.filters = {};
        _this.fields = [];
        _this.results = [];
        _this.openComponents = [];
        _this.loading = false;
        _this.responseStatus = null;
        return _this;
    }
    Object.defineProperty(Results.prototype, "store", {
        get: function () { return shared_1.store; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Results.prototype, "columns", {
        get: function () { return shared_1.store.getColumnSchemas(this.db, this.table); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Results.prototype, "dirty", {
        get: function () { return this.skip || this.orderBy || Object.keys(this.filters).length > 0 || this.fields.length > 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Results.prototype, "rowComponent", {
        get: function () { return all_1.getRowComponent(this.db, this.table); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Results.prototype, "fieldNames", {
        get: function () {
            var _this = this;
            var _a;
            var ret = (_a = this.columns) === null || _a === void 0 ? void 0 : _a.map(function (x) { return x.columnName; });
            if (this.fields.length > 0) {
                ret = ret.filter(function (x) { return _this.fields.indexOf(x) >= 0; });
            }
            return ret;
        },
        enumerable: true,
        configurable: true
    });
    Results.prototype.showRowComponent = function (rowIndex) { return this.openComponents.indexOf(rowIndex) >= 0; };
    Results.prototype.toggleRowComponent = function (rowIndex) {
        if (this.showRowComponent(rowIndex))
            this.openComponents = this.openComponents.filter(function (x) { return x != rowIndex; });
        else
            this.openComponents.push(rowIndex);
    };
    Results.prototype.rowComponentClass = function (rowIndex) {
        return "svg svg-chevron-" + (this.showRowComponent(rowIndex) ? 'down' : 'right') + " svg-md btn-link align-top";
    };
    Results.prototype.min = function (num1, num2) { return Math.min(num1, num2); };
    Results.prototype.onUrlChange = function (newVal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reset()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, shared_1.saveTableSettings(this.db, this.table, null)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.reset()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.reset = function () {
        return __awaiter(this, void 0, void 0, function () {
            var settings;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = shared_1.getTableSettings(this.db, this.table) || {};
                        this.skip = settings.skip || 0;
                        this.orderBy = settings.orderBy || '';
                        this.filters = settings.filters || {};
                        this.fields = settings.fields || [];
                        this.results = [];
                        return [4 /*yield*/, shared_1.loadTable(this, this.db, this.table)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.search()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.handleSelectColumns = function (e) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.showSelectColumns = false;
                        return [4 /*yield*/, this.search()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.viewNext = function (skip) {
        return __awaiter(this, void 0, void 0, function () {
            var lastPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.skip += skip;
                        if (typeof this.total != 'number')
                            return [2 /*return*/];
                        lastPage = Math.floor(this.total / 100) * 100;
                        if (this.skip > lastPage) {
                            this.skip = lastPage;
                        }
                        if (this.skip < 0) {
                            this.skip = 0;
                        }
                        return [4 /*yield*/, this.search()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Object.defineProperty(Results.prototype, "filterQuery", {
        get: function () {
            var _this = this;
            var url = '';
            Object.keys(this.filters).forEach(function (k) {
                if (_this.filters[k]) {
                    url += '&';
                    url += encodeURIComponent(k) + '=' + encodeURIComponent(_this.filters[k]);
                }
            });
            return url;
        },
        enumerable: true,
        configurable: true
    });
    Results.prototype.filterSearch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.skip = 0;
                        return [4 /*yield*/, this.search()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.createFilteredUrl = function (format) {
        if (format === void 0) { format = "json"; }
        var url = "/db/" + this.db + "/" + this.table + "?format=" + format;
        url += this.filterQuery;
        if (this.fields.length > 0) {
            url += '&fields=' + encodeURIComponent(this.fields.join(','));
        }
        if (this.orderBy) {
            url += '&orderBy=' + encodeURIComponent(this.orderBy);
        }
        return url;
    };
    Results.prototype.createUrl = function (format) {
        if (format === void 0) { format = "json"; }
        var url = this.createFilteredUrl(format);
        if (this.skip > 0) {
            url += '&skip=' + this.skip;
        }
        if (this.take) {
            url += '&take=' + this.take;
        }
        //log('createUrl, filters', this.filters, 'orderBy', this.orderBy, 'take', this.take, 'URL', url);
        return url;
    };
    Results.prototype.search = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.openComponents = [];
                        _a = this;
                        return [4 /*yield*/, shared_1.exec(this, function () { return __awaiter(_this, void 0, void 0, function () {
                                var url, r, json;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            url = this.createUrl();
                                            return [4 /*yield*/, fetch(url)];
                                        case 1:
                                            r = _a.sent();
                                            return [4 /*yield*/, r.text()];
                                        case 2:
                                            json = _a.sent();
                                            return [2 /*return*/, json && JSON.parse(json) || []];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.results = _c.sent();
                        _b = this;
                        return [4 /*yield*/, shared_1.exec(this, function () { return __awaiter(_this, void 0, void 0, function () {
                                var url, r, txtTotal;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            url = "/db/" + this.db + "/" + this.table + "/total?format=json";
                                            url += this.filterQuery;
                                            return [4 /*yield*/, fetch(url)];
                                        case 1:
                                            r = _a.sent();
                                            return [4 /*yield*/, r.text()];
                                        case 2:
                                            txtTotal = _a.sent();
                                            return [2 /*return*/, parseInt(txtTotal) || null];
                                    }
                                });
                            }); })];
                    case 2:
                        _b.total = _c.sent();
                        return [4 /*yield*/, shared_1.saveTableSettings(this.db, this.table, {
                                skip: this.skip,
                                filters: this.filters,
                                orderBy: this.orderBy,
                                fields: this.fields,
                            })];
                    case 3:
                        _c.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.openCsv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, downloadUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.createFilteredUrl("csv");
                        downloadUrl = desktop_1.desktopSaveDownloadUrl(this.db + "-" + this.table + "-" + shared_1.dateFmtHMS() + ".csv", url) + "?open=true";
                        if (shared_1.store.hasExcel) {
                            downloadUrl += '&start=excel';
                        }
                        return [4 /*yield*/, fetch(downloadUrl)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.open = function (format) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = this.createUrl(format);
                        return [4 /*yield*/, shared_1.openUrl(url)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.mounted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        shared_1.bus.$on('settings', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, this.reset()];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        }); }); });
                        return [4 /*yield*/, this.reset()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.humanize = function (s) { return client_1.humanize(s); };
    Results.prototype.renderValue = function (o) {
        return Array.isArray(o)
            ? o.join(', ')
            : typeof o == "undefined"
                ? ""
                : typeof o == "object"
                    ? JSON.stringify(o)
                    : o + "";
    };
    Results.prototype.getField = function (o, name) { return client_1.getField(o, name); };
    Results.prototype.setOrderBy = function (field) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.orderBy == field) {
                            this.orderBy = '-' + field;
                        }
                        else if (this.orderBy == '-' + field) {
                            this.orderBy = '';
                        }
                        else {
                            this.orderBy = field;
                        }
                        return [4 /*yield*/, this.search()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Results.prototype.helpFilters = function () {
        return "Search Filters:\n  Use '=null' or '!=null' to search NULL columns\n  Use '<= < > >= <> !=' prefix to search with that operator\n  Use ',' suffix to perform an IN(values) search on integers\n  Use '%' prefix or suffix to perform a LIKE wildcard search\n  Use '=' prefix to perform an exact coerced search\nOtherwise a 'string equality' search is performed";
    };
    __decorate([
        vue_property_decorator_1.Prop()
    ], Results.prototype, "db", void 0);
    __decorate([
        vue_property_decorator_1.Prop()
    ], Results.prototype, "table", void 0);
    __decorate([
        vue_property_decorator_1.Watch('$route', { immediate: true, deep: true })
    ], Results.prototype, "onUrlChange", null);
    Results = __decorate([
        vue_property_decorator_1.Component({ template: "<div>\n    <div v-if=\"!loading\" class=\"main-query\">\n        <span class=\"btn svg svg-fields svg-2x\" title=\"View Columns\" @click=\"showSelectColumns=!showSelectColumns\"></span>\n        <button class=\"btn first-link svg-2x\" :disabled=\"skip==0\" title=\"<< first\" @click=\"viewNext(-total)\"></button>\n        <button class=\"btn left-link svg-2x\"  :disabled=\"skip==0\" title=\"< previous\" @click=\"viewNext(-100)\"></button>\n        <button class=\"btn right-link svg-2x\" :disabled=\"results.length < take\" title=\"next >\" @click=\"viewNext(100)\"></button>\n        <button class=\"btn last-link svg-2x\"  :disabled=\"results.length < take\" title=\"last >>\" @click=\"viewNext(total)\"></button>\n        <span class=\"px-1 results-label\">Showing Results {{skip+1}} - {{min(skip + results.length,total)}} <span v-if=\"total!=null\">of {{total}}</span></span>\n        <button v-if=\"dirty\" class=\"btn svg-clear svg-lg\" @click=\"clear()\" title=\"reset query\"></button>\n        <button v-if=\"store.hasExcel\" class=\"btn btn-outline-success btn-sm btn-compact\" @click=\"openCsv()\" \n            :title=\"store.hasExcel ? 'Open in Excel' : 'Open CSV'\"><i class=\"svg-md svg-excel\"></i>{{store.hasExcel ? 'excel' : 'csv' }}</button>\n        <span class=\"btn btn-sm px-1\" @click=\"open('html')\"><i class=\"svg-md svg-external-link\"></i> html</span>\n        <span class=\"btn btn-sm px-0\" @click=\"open('csv')\"><i class=\"svg-md svg-external-link\"></i> csv</span>\n        <span class=\"btn btn-sm pl-1\" @click=\"open('json')\"><i class=\"svg-md svg-external-link\"></i> json</span>\n    </div>\n    <div v-else class=\"loading-query\">\n        <span class=\"svg svg-loading svg-2x ml-1\"></span>Loading {{ this.columns?.length ? 'results' : 'schema' }}...             \n    </div>\n    <div v-if=\"showSelectColumns\">\n        <select-columns :columns=\"columns\" v-model=\"fields\" @done=\"handleSelectColumns($event)\" />\n    </div>\n    <table class=\"results\">\n        <thead><tr class=\"noselect\">\n            <th v-for=\"f in fieldNames\" :key=\"f\" @click=\"setOrderBy(f)\" class=\"th-link\">\n                <div class=\"text-nowrap\">\n                    {{ humanize(f) }}\n                    <span v-if=\"orderBy==f\" class=\"svg svg-chevron-up svg-md align-top\"></span>\n                    <span v-else-if=\"orderBy=='-'+f\" class=\"svg svg-chevron-down svg-md align-top\"></span>\n                </div>\n            </th>\n        </tr></thead>\n        <tbody>\n            <tr class=\"filters\">\n                <td v-for=\"(f,j) in fieldNames\">\n                    <input type=\"text\" v-model=\"filters[f]\" @keydown.enter.stop=\"filterSearch()\">\n                    <span v-if=\"j==fieldNames.length-1\" style=\"position:absolute;margin-left:-20px;\"><i class=\"svg svg-btn svg-filter svg-md\" :title=\"helpFilters()\" /></span>\n                </td>\n            </tr>\n            <template v-for=\"(r,i) in results\">\n            <tr :key=\"i\">\n                <td v-for=\"(f,j) in fieldNames\" :key=\"j\" :title=\"renderValue(getField(r,f))\">\n                    <span v-if=\"j == 0 && rowComponent\" :class=\"rowComponentClass(i)\" @click=\"toggleRowComponent(i)\"></span>\n                    <format :value=\"getField(r,f)\" />\n                </td>\n            </tr>\n            <tr v-if=\"showRowComponent(i)\">\n                <td :colspan=\"fieldNames.length\">\n                    <component :is=\"rowComponent\" :db=\"db\" :table=\"table\" :row=\"r\" :columns=\"columns\"></component>\n                </td>                \n            </tr>\n            </template>\n        </tbody>\n    </table>\n    <error-view :responseStatus=\"responseStatus\" />\n</div>",
        })
    ], Results);
    return Results;
}(vue_1.default));
exports.Results = Results;
exports.default = Results;
vue_1.default.component('results', Results);

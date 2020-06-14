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
var vue_property_decorator_1 = require("vue-property-decorator");
var shared_1 = require("../../shared");
var Viewer = /** @class */ (function (_super) {
    __extends(Viewer, _super);
    function Viewer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.txtFilter = '';
        _this.results = [];
        _this.loading = false;
        _this.responseStatus = null;
        return _this;
    }
    Object.defineProperty(Viewer.prototype, "store", {
        get: function () { return shared_1.store; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Viewer.prototype, "db", {
        get: function () { return this.$route.params.db; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Viewer.prototype, "table", {
        get: function () { return this.$route.params.table; },
        enumerable: true,
        configurable: true
    });
    Viewer.prototype.filtered = function (tables) {
        var _this = this;
        return this.txtFilter
            ? tables.filter(function (x) { return x.toLowerCase().indexOf(_this.txtFilter.toLowerCase()) >= 0; })
            : tables;
    };
    Viewer.prototype.link = function (d, t) { return "/" + d + "/" + t; };
    Viewer.prototype.mounted = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    Viewer.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, shared_1.exec(this, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/];
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        vue_property_decorator_1.Prop({ default: '' })
    ], Viewer.prototype, "name", void 0);
    Viewer = __decorate([
        vue_property_decorator_1.Component({ template: "<section id=\"home\" class=\"grid-layout\">\n        <header id=\"header\">\n            <h1>\n                <nav class=\"site-breadcrumbs\">\n                    <ol class=\"breadcrumb\">\n                        <li class=\"breadcrumb-item\">\n                            <router-link to=\"/\"><i class=\"home-link svg-3x mb-1\" title=\"home\" /></router-link>\n                        </li>\n                        <li v-if=\"db\" class=\"breadcrumb-item\">{{db}}</li>\n                        <li v-if=\"table\" class=\"breadcrumb-item active\">{{table}}</li>\n                        <li v-if=\"!db && !table\" class=\"breadcrumb-item\">Select Table</li>\n                        <li v-if=\"loading\"><i class=\"svg-loading svg-lg ml-2 mb-1\" title=\"loading...\" /></li>\n                    </ol>\n                </nav>\n            </h1>\n            <h1 v-else-if=\"loading\">\n              <i class=\"fab fa-loading\"></i>\n              Loading...\n            </h1>\n            <div v-else-if=\"responseStatus\">\n                <error-summary :responseStatus=\"responseStatus\" />\n            </div>\n        </header>\n        \n        <nav id=\"left\">\n            <div id=\"nav-filter\">\n                <i v-if=\"txtFilter\" class=\"text-close\" style=\"position:absolute;margin:0 0 0 265px;\" title=\"clear\" @click=\"txtFilter=''\"></i>\n                <v-input v-model=\"txtFilter\" id=\"txtFilter\" placeholder=\"filter\" inputClass=\"form-control\" />\n            </div>\n            <div id=\"sidebar\" class=\"\">\n                <div>\n                    <div v-for=\"(tables,d) in store.tables\" class=\"ml-1 mt-2\">\n                        <h4>\n                            <i class=\"svg-db svg-2x\"></i>\n                            {{d}}\n                        </h4>\n                        <div v-for=\"t in filtered(tables)\" :key=\"t\" :class=\"['datamodel',{selected:t==table}]\" :title=\"t\">\n                            <router-link class=\"ml-3\" :to=\"link(d,t)\">{{t}}</router-link>\n                            <span v-if=\"store.getColumnTotal(d,t) != null\" class=\"text-muted\">({{store.getColumnTotal(d,t)}})</span>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </nav>\n        \n        <main v-if=\"db && table\">\n            <div v-if=\"!responseStatus\" class=\"main-container\">\n                <results :db=\"db\" :table=\"table\" />\n            </div>\n            <div v-else><error-view :responseStatus=\"responseStatus\" class=\"mt-5\" /></div>\n        </main>\n        \n    </section>",
        })
    ], Viewer);
    return Viewer;
}(vue_property_decorator_1.Vue));
exports.Viewer = Viewer;
exports.default = Viewer;
vue_property_decorator_1.Vue.component('viewer', Viewer);

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
Object.defineProperty(exports, "__esModule", { value: true });
var vue_property_decorator_1 = require("vue-property-decorator");
var client_1 = require("@servicestack/client");
var show = function (k) { return typeof k !== "string" || k.substr(0, 2) !== "__"; };
var keyFmt = function (t) { return client_1.humanize(client_1.toPascalCase(t)); };
var uniqueKeys = function (m) {
    var h = {};
    for (var i = 0, len = m.length; i < len; i++) {
        var values = m[i];
        for (var k in values) {
            if (values.hasOwnProperty(k) && show(k)) {
                h[k] = k;
            }
        }
    }
    return h;
};
var valueFmt = function (k, v, vFmt) { return vFmt; };
var num = function (m) { return m; };
var date = function (s) { return client_1.toDate(s); };
var pad = function (d) { return d < 10 ? '0' + d : d; };
var dmft = function (d) { return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()); };
var str = function (m) { return m.substr(0, 6) === '/Date(' ? dmft(date(m)) : m; };
var obj = function (m) {
    return ("<dl>\n            " + Object.keys(m).filter(show).map(function (k) { return ("<dt class=\"ib\">" + keyFmt(k) + "</dt><dd>" + valueFmt(k, m[k], val(m[k])) + "</dd>"); }).join('') + "\n        </dl>");
};
var arr = function (m) {
    if (typeof m[0] == 'string' || typeof m[0] == 'number')
        return "<span>" + m.join(', ') + "</span>";
    var h = uniqueKeys(m);
    return ("\n        <table>\n        <thead>\n            <tr>\n                " + Object.keys(h).map(function (k) { return ("<th><b></b>" + keyFmt(k) + "</th>"); }).join('') + "\n            </tr>\n        </thead>\n        <tbody>\n        " + m.map(function (row) { return ("<tr>\n                " + Object.keys(h).filter(show).map(function (k) { return "<td>" + valueFmt(k, row[k], val(row[k])) + "</td>"; }).join('') + "\n            </tr>"); }).join('') + "\n        </tbody>\n    </table>");
};
var val = function (m, valueFn) {
    if (valueFn)
        valueFmt = valueFn;
    if (m == null)
        return "";
    if (typeof m == "number")
        return "" + num(m);
    if (typeof m == "string")
        return str(m);
    if (typeof m == "boolean")
        return m ? "true" : "false";
    return m.length ? arr(m) : obj(m);
};
var JsonViewer = /** @class */ (function (_super) {
    __extends(JsonViewer, _super);
    function JsonViewer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(JsonViewer.prototype, "html", {
        get: function () { return this.json ? val(JSON.parse(this.json)) : val(this.value); },
        enumerable: true,
        configurable: true
    });
    __decorate([
        vue_property_decorator_1.Prop({ default: null })
    ], JsonViewer.prototype, "value", void 0);
    __decorate([
        vue_property_decorator_1.Prop({ default: null })
    ], JsonViewer.prototype, "json", void 0);
    JsonViewer = __decorate([
        vue_property_decorator_1.Component({ template: "<div class=\"jsonviewer\">\n        <div v-html=\"html\"></div>\n        <span class=\"clearfix\"></span>\n    </div>"
        })
    ], JsonViewer);
    return JsonViewer;
}(vue_property_decorator_1.Vue));
exports.JsonViewer = JsonViewer;
exports.default = JsonViewer;
vue_property_decorator_1.Vue.component('jsonviewer', JsonViewer);

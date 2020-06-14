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
var ErrorView = /** @class */ (function (_super) {
    __extends(ErrorView, _super);
    function ErrorView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.showStackTrace = false;
        return _this;
    }
    __decorate([
        vue_property_decorator_1.Prop({ default: null })
    ], ErrorView.prototype, "responseStatus", void 0);
    ErrorView = __decorate([
        vue_property_decorator_1.Component({ template: "<div v-if=\"responseStatus\" class=\"noplugin-error alert alert-danger mt-3 mr-3\">\n    <div>{{responseStatus.errorCode}}: {{responseStatus.message}}</div>\n    <div v-if=\"responseStatus.stackTrace\">\n        <button v-if=\"!showStackTrace\" class=\"btn btn-link\" style=\"margin-left: -1em\" @click=\"showStackTrace=true\">\n            <i class=\"svg-chevron-right svg-lg mb-1\" title=\"expand\" />StackTrace</button>\n        <div v-if=\"showStackTrace\" class=\"stacktrace\">{{responseStatus.stackTrace}}</div>\n    </div>\n</div>"
        })
    ], ErrorView);
    return ErrorView;
}(vue_property_decorator_1.Vue));
exports.ErrorView = ErrorView;
exports.default = ErrorView;
vue_property_decorator_1.Vue.component('error-view', ErrorView);

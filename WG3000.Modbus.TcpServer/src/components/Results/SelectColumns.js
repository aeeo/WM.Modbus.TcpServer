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
var vue_1 = require("vue");
var vue_property_decorator_1 = require("vue-property-decorator");
var SelectColumns = /** @class */ (function (_super) {
    __extends(SelectColumns, _super);
    function SelectColumns() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selectedColumns = [];
        return _this;
    }
    SelectColumns.prototype.mounted = function () {
        this.selectedColumns = this.value;
        this.$nextTick(function () { var _a; return (_a = document.querySelector('.modal')) === null || _a === void 0 ? void 0 : _a.focus(); });
    };
    SelectColumns.prototype.onInputValues = function (e) {
        return this.selectedColumns;
    };
    __decorate([
        vue_property_decorator_1.Prop()
    ], SelectColumns.prototype, "columns", void 0);
    __decorate([
        vue_property_decorator_1.Prop({ default: function () { return ([]); } })
    ], SelectColumns.prototype, "value", void 0);
    __decorate([
        vue_property_decorator_1.Emit('input')
    ], SelectColumns.prototype, "onInputValues", null);
    SelectColumns = __decorate([
        vue_property_decorator_1.Component({ template: "<div class=\"modal\" tabindex=\"-1\" role=\"dialog\" @keyup.esc=\"$emit('done')\" style=\"display:block;background:rgba(0,0,0,.25)\">\n  <div class=\"modal-dialog\" role=\"document\" style=\"margin-top:120px\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h5 class=\"modal-title noselect\">\n            Column Preferences\n        </h5>\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\" @click=\"$emit('done')\">\n          <span aria-hidden=\"true\">&times;</span>\n        </button>\n      </div>\n      <div class=\"modal-body ml-2\">\n        <div class=\"form-check\">\n            <input class=\"form-check-input\" type=\"radio\" name=\"exampleRadios\" id=\"allColumns\" :checked=\"selectedColumns.length==0\" \n                @click=\"selectedColumns=[]\" @change=\"onInputValues\">\n            <label class=\"form-check-label noselect\" for=\"allColumns\">View all columns</label>\n        </div>\n        <hr>\n        <div v-for=\"c in columns\" :key=\"c.columnName\" class=\"form-check\">\n          <input class=\"form-check-input\" type=\"checkbox\" :id=\"c.columnName\" :value=\"c.columnName\" v-model=\"selectedColumns\" @change=\"onInputValues\">\n          <label class=\"form-check-label noselect\" :for=\"c.columnName\">{{c.columnName}}</label>\n        </div>\n        <div class=\"form-group text-right\">\n            <span class=\"btn btn-link\" @click=\"$emit('done')\">Close</span>\n            <button class=\"btn btn-primary\" @click=\"$emit('done')\">Done</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>",
        })
    ], SelectColumns);
    return SelectColumns;
}(vue_1.default));
vue_1.default.component('select-columns', SelectColumns);

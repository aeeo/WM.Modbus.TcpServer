"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var rowComponents = {};
function getRowComponent(db, table) {
    db = db.toLowerCase();
    table = table.toLowerCase();
    return rowComponents[db] && rowComponents[db][table] || null;
}
exports.getRowComponent = getRowComponent;
function registerRowComponent(db, table, constructor, component) {
    vue_1.default.component(component, constructor);
    db = db.toLowerCase();
    table = table.toLowerCase();
    if (!rowComponents[db])
        rowComponents[db] = {};
    rowComponents[db][table] = component;
}
exports.registerRowComponent = registerRowComponent;

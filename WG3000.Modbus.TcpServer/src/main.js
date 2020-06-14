"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./app.scss");
require("es6-shim");
var vue_1 = require("vue");
var vue_2 = require("@servicestack/vue");
vue_1.default.use(vue_2.default);
var App_1 = require("./App");
var router_1 = require("./shared/router");
var app = new vue_1.default({
    el: '#app',
    render: function (h) { return h(App_1.App); },
    router: router_1.router,
});

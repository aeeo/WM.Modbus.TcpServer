"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var vue_2 = require("@servicestack/vue");
var Viewer_1 = require("../components/Viewer");
var Routes;
(function (Routes) {
    Routes["Home"] = "/";
    Routes["ViewTable"] = "/:db/:table";
    Routes["Forbidden"] = "/forbidden";
})(Routes = exports.Routes || (exports.Routes = {}));
vue_1.default.use(vue_router_1.default);
var routes = [
    { path: Routes.Home, component: Viewer_1.Viewer },
    { path: Routes.ViewTable, component: Viewer_1.Viewer },
    { path: Routes.Forbidden, component: vue_2.Forbidden },
    { path: '*', redirect: '/' },
];
exports.router = new vue_router_1.default({
    mode: 'history',
    linkActiveClass: 'active',
    routes: routes,
});
exports.default = exports.router;
exports.redirect = function (path) {
    var externalUrl = path.indexOf('://') >= 0;
    if (!externalUrl) {
        exports.router.push({ path: path });
    }
    else {
        location.href = path;
    }
};

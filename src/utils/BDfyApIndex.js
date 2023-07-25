!function () {
    "use strict";
    function e() {
        return (e = Object.assign || function (e) {
            for (var t = 1; t < arguments.length; t++) {
                var n, r = arguments[t];
                for (n in r)
                    Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n])
            }
            return e
        }
        ).apply(this, arguments)
    }
    function t(e, t) {
        e.prototype = Object.create(t.prototype),
            e.prototype.constructor = e,
            n(e, t)
    }
    function n(e, t) {
        return (n = Object.setPrototypeOf || function (e, t) {
            return e.__proto__ = t,
                e
        }
        )(e, t)
    }
    function r(e) {
        if (void 0 === e)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        return e
    }
    function o(e, t, n) {
        return void 0 === e[t] ? n : e[t]
    }
    function a(e, t) {
        return function (n, r) {
            var o = !1;
            function a(e, t) {
                o || (o = !0,
                    r(e, t))
            }
            setTimeout((function () {
                var e = new Error("Timeout.");
                t && c(e, t),
                    a(e)
            }
            ), e),
                n(a)
        }
    }
    function i() {
        return (new Date).getTime()
    }
    function c(e, t) {
        e.code || (e.originMsg = e.message),
            e.code = t,
            e.message = "Error code: [" + t + "]. " + e.originMsg
    }
    Object.create || (Object.create = function (e) {
        if ("object" != typeof e && "function" != typeof e)
            throw new TypeError("Object prototype may only be an Object: " + e);
        if (null === e)
            throw new Error("This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument.");
        function t() { }
        return t.prototype = e,
            new t
    }
    );
    var l = function (t, n) {
        var r, a = !1, i = [];
        function c() {
            for (; i.length;)
                i.shift().call(null, r)
        }
        return function (l, u, s, f) {
            return l = e({}, s, {
                src: l,
                retryCnt: o(f, "mainCDNRetryCnt", 1),
                mainReportRetryCnt: o(f, "mainReportRetryCnt", 1),
                secondReportRetryCnt: o(f, "secondReportRetryCnt", 0)
            }),
                r = new n(t, l),
                u ? r.getTarget((function (i, l) {
                    a = !0,
                        !i && l || (i = e({}, s, {
                            src: u,
                            retryCnt: o(f, "secondCDNRetryCnt", 0),
                            mainReportRetryCnt: o(f, "mainReportRetryCnt", 1),
                            secondReportRetryCnt: o(f, "secondReportRetryCnt", 0)
                        }),
                            r = new n(t, i)),
                        c()
                }
                )) : (a = !0,
                    c()),
                function (e) {
                    a ? e(r) : i.push(e)
                }
        }
    }
        , u = "auto-report"
        , s = "active-report"
        , f = "acs-get-sign"
        , d = "1.0.1-beta.0"
        , p = !1
        , v = function () {
            function e(e, t) {
                this.sid = e,
                    this.group = t
            }
            var t = e.prototype;
            return t.log = function (e) {
                console.log(">>>log ", e)
                if (p) {
                    var t = (e = {
                        url: "https://miao.baidu.com/sdk_log",
                        data: JSON.stringify(e)
                    }).url
                        , n = e.data
                        , r = e.success
                        , o = e.error
                        , a = void 0 === (i = e.headers) ? {} : i
                        , i = e.withCredentials;
                    if (void 0 === i && (i = !0),
                        e = window.XDomainRequest) {
                        var c = new e;
                        c.open("post", t, !0),
                            i && (c.withCredentials = !0),
                            c.onerror = function (e) {
                                o && o(e)
                            }
                            ,
                            c.onload = function () {
                                var e = c.responseText;
                                r && r(e)
                            }
                            ,
                            c.send(n)
                    } else {
                        var l, u = new XMLHttpRequest;
                        for (l in u.open("POST", t, !0),
                            a)
                            u.setRequestHeader(l, a[l]);
                        i && (u.withCredentials = !0),
                            u.onreadystatechange = function (e) {
                                var t;
                                4 === u.readyState && 200 === u.status && (t = u.responseText,
                                    r && r(t, u))
                            }
                            ,
                            u.onerror = function (e) {
                                o && o(e)
                            }
                            ,
                            u.send(n)
                    }
                }
            }
                ,
                t.error = function (e, t, n) {
                    var r = this.sid
                        , o = this.group
                        , a = n.code || 600;
                    r = {
                        sid: r,
                        group: o,
                        type: e,
                        total: t,
                        status: 1,
                        error: n.message + "\n" + n.stack,
                        extra: {
                            errorCode: a,
                            version: d
                        }
                    },
                        this.log(r)
                }
                ,
                t.success = function (e, t) {
                    var n = this.sid
                        , r = this.group;
                    this.log({
                        sid: n,
                        group: r,
                        type: e,
                        total: t,
                        status: 0,
                        error: "",
                        extra: {
                            version: d
                        }
                    })
                }
                ,
                e
        }();
    function h(e) {
        var t;
        return (e = void 0 === e ? "" : e) && (t = 0 < e.indexOf("?") ? "&" : "?",
            e = e + t + "_o=" + encodeURIComponent(location.protocol + "//" + location.host)),
            e
    }
    var m = function () {
        function e(e, t) {
            this.loadController = null,
                this.state = 1,
                this.evalData = null,
                this.autoResponse = "",
                this.autoError = null,
                this.reportCnt = 0,
                this.monitor = null,
                this.autoResponseQueue = [],
                this.loadController = t,
                this.monitor = new v(e, "abclite")
        }
        var t = e.prototype;
        return t.handleTargetError = function (e) {
            this.state = 2,
                this.autoError = e,
                this.evalAutoQueue(e)
        }
            ,
            t.autoReportInit = function () {
                var e = this
                    , t = this.loadController
                    , n = t.opts;
                t.getTarget((function (t, r) {
                    if (t)
                        e.handleTargetError(t);
                    else {
                        t = r,
                            e.state = 3;
                        try {
                            t.initData(n, (function (t) {
                                e.evalData = t,
                                    e.autoReport()
                            }
                            ))
                        } catch (t) {
                            return e.state = 4,
                                r = new Error("Eval error, msg: " + t.message),
                                c(r, 551),
                                e.autoError = r,
                                void e.evalAutoQueue(r)
                        }
                    }
                }
                ))
            }
            ,
            t.autoReport = function (e) {
                var t = this
                    , n = this.loadController
                    , r = n.opts
                    , o = r.reportTimeout
                    , i = r.mainReportUrl;
                n.getTarget((function (n, r) {
                    var l;
                    n ? t.handleTargetError(n) : (t.reportCnt++,
                        l = r,
                        t.state = 5,
                        a(o, 561)((function (n) {
                            e = e || h(i),
                                l.report({
                                    url: e,
                                    data: t.evalData,
                                    success: function (e) {
                                        n(null, e)
                                    },
                                    error: function (e) {
                                        c(e, 571),
                                            n(e)
                                    }
                                })
                        }
                        ), (function (e, n) {
                            if (e)
                                return t.state = 6,
                                    t.autoError = e,
                                    void t.evalAutoQueue(e, null);
                            t.state = 7,
                                t.autoResponse = n,
                                t.autoError = null,
                                t.evalAutoQueue(null, n)
                        }
                        )))
                }
                ))
            }
            ,
            t.pushAutoQueue = function (e) {
                this.autoResponseQueue.push(e)
            }
            ,
            t.evalAutoQueue = function () {
                for (; this.autoResponseQueue.length && 2 !== this.autoResponseQueue.shift().apply(null, arguments);)
                    ;
            }
            ,
            t.getAutoResponse = function (e) {
                var t = this
                    , n = this.state
                    , r = this.loadController
                    , o = this.monitor
                    , a = i()
                    , c = (r = r.opts).mainReportRetryCnt
                    , l = r.secondReportRetryCnt
                    , s = r.secondReportUrl
                    , f = function n(r, f) {
                        if (6 === t.state) {
                            if (t.reportCnt - 1 < c)
                                return t.autoReport(),
                                    t.pushAutoQueue(n),
                                    2;
                            if (t.reportCnt - 1 - c < l + 1)
                                return t.autoReport(h(s)),
                                    t.pushAutoQueue(n),
                                    2
                        }
                        try {
                            d = r,
                                p = f,
                                v = i() - a,
                                d ? o.error(u, v, d) : (o.success(u, v),
                                    e(d, p))
                        } finally {
                            return 1
                        }
                        var d, p, v
                    };
                1 === n || 3 === n || 5 === n ? this.pushAutoQueue(f) : f(this.error, this.autoResponse)
            }
            ,
            t.activeReport = function (e, t, n, r) {
                var o = this
                    , i = (void 0 === n && (n = 0),
                        this.loadController)
                    , l = i.opts
                    , u = l.mainReportRetryCnt
                    , s = l.reportTimeout
                    , f = l.mainReportUrl
                    , d = l.secondReportRetryCnt;
                n++,
                    i.getTarget((function (i, p) {
                        if (i)
                            return t && t(i);
                        var v = p;
                        a(s, 562)((function (t) {
                            r = r || h(f),
                                v.report({
                                    url: r,
                                    data: e,
                                    success: function (e) {
                                        t(null, e)
                                    },
                                    error: function (e) {
                                        c(e, 570),
                                            t(e)
                                    }
                                })
                        }
                        ), (function (r, a) {
                            if (r)
                                return n - 1 < u ? void o.activeReport(e, t, n) : n - 1 - u < d + 1 ? void o.activeReport(e, t, n, h(l.secondReportUrl)) : t && t(r);
                            t && t(null, a)
                        }
                        ))
                    }
                    ))
            }
            ,
            t.getActiveResponse = function (e, t) {
                var n = this
                    , r = this.state
                    , o = this.loadController
                    , a = this.monitor
                    , l = i();
                function u(e, n) {
                    var r = i() - l;
                    e ? a.error(s, r, e) : (a.success(s, r),
                        t(e, n))
                }
                var f = function () {
                    o.getTarget((function (t, r) {
                        if (t)
                            return u(t);
                        t = r;
                        try {
                            t.initActiveData(e, (function (e) {
                                n.activeReport(e, u)
                            }
                            ))
                        } catch (e) {
                            r = new Error("Eval error. msg: " + e.message),
                                c(r, 552),
                                u(r)
                        }
                    }
                    ))
                };
                1 === r ? this.pushAutoQueue(f) : f()
            }
            ,
            e
    }();
    function g(e, t) {
        e.onload = function () {
            this.onerror = this.onload = null,
                t(null, e)
        }
            ,
            e.onerror = function () {
                this.onerror = this.onload = null,
                    t(new Error("Failed to load " + this.src), e)
            }
    }
    function y(e, t) {
        e.onreadystatechange = function () {
            "complete" != this.readyState && "loaded" != this.readyState || (this.onreadystatechange = null,
                t(null, e))
        }
    }
    var b, x, w = function () {
        function e(e) {
            this.state = 0,
                this.queue = [],
                this.error = null,
                this.opts = {},
                this.loadCnt = 0,
                this.opts = e,
                this.doLoad()
        }
        var t = e.prototype;
        return t.doLoad = function () {
            var e = this
                , t = (this.error = null,
                    this.loadCnt++,
                    this.state = 1,
                    this.opts)
                , n = t.timeout
                , r = t.src;
            a(n)((function (t) {
                !function (e, t, n) {
                    var r = !1
                        , a = o(t, "timeout", 5e3)
                        , i = (t = o(t, "clientCacheTTL", 0),
                            e);
                    function c(e, t) {
                        r || (r = !0,
                            n(e, t))
                    }
                    if (e) {
                        t && (l = +new Date,
                            l = "_=" + parseInt(l % (6e4 * t), 10),
                            i = 0 < i.indexOf("?") ? i + "&" + l : i + "?" + l),
                            a && setTimeout((function () {
                                c(new Error("Load " + e + " timeout"), null)
                            }
                            ), a),
                            t = i;
                        var l = c
                            , u = (a = void 0,
                                i = document.head || document.getElementsByTagName("head")[0],
                                document.createElement("script"));
                        if ("function" == typeof l && (a = l,
                            l = {}),
                            a = a || function () { }
                            ,
                            u.type = (l = l || {}).type || "text/javascript",
                            u.charset = l.charset || "utf8",
                            u.async = !("async" in l) || !!l.async,
                            u.src = t,
                            l.attrs) {
                            var s, f = u, d = l.attrs;
                            for (s in d)
                                f.setAttribute(s, d[s])
                        }
                        l.text && (u.text = "" + l.text),
                            ("onload" in u ? g : y)(u, a),
                            u.onload || g(u, a),
                            i.appendChild(u)
                    } else
                        c(new Error("Load script miss src"))
                }(r, e.opts, t)
            }
            ), (function (t, n) {
                t ? (e.error = t,
                    e.state = 3) : e.state = 2,
                    e.evalQueue(t, n)
            }
            ))
        }
            ,
            t.pushQueue = function (e) {
                this.queue.push(e)
            }
            ,
            t.evalQueue = function () {
                for (; this.queue.length && 2 !== this.queue.shift().apply(null, arguments);)
                    ;
            }
            ,
            t.clearQueue = function () {
                this.queue = []
            }
            ,
            t.getTarget = function (e) {
                var t = this
                    , n = this.state
                    , r = this.opts
                    , o = function n(o) {
                        if (o) {
                            var a = r.retryCnt;
                            if (t.loadCnt - 1 < a)
                                return t.doLoad(),
                                    t.pushQueue(n),
                                    2
                        }
                        try {
                            var i = window[t.targetKey];
                            if (i)
                                return e(null, i);
                            o ? c(o, 400) : i || c(o = new Error("Load for eval error."), 550),
                                e(o, i)
                        } catch (e) { }
                        return 1
                    };
                0 === n || 1 === n ? this.pushQueue(o) : o(this.error)
            }
            ,
            e
    }(), E = function (e) {
        function n(t, n) {
            return (n = e.call(this, n) || this).targetKey = null,
                n.instance = null,
                n.targetKey = "BCat_" + t,
                window["__abbaidu_" + t + "_advanced"] = !0,
                window["__abbaidu_" + t + "_paris"] = !0,
                n.instance = new m(t, r(n)),
                n.init(),
                n
        }
        return t(n, e),
            n.prototype.init = function () {
                this.instance.autoReportInit()
            }
            ,
            n
    }(w), C = function () {
        function e(e, t) {
            this.loadController = null,
                this.state = 1,
                this.monitor = null,
                this.loadController = t,
                this.monitor = new v(e, "acs")
        }
        return e.prototype.getSign = function (e, t) {
            var n = this.monitor
                , r = i()
                , o = function (t, o) {
                    var a = i() - r;
                    t ? n.error(f, a, t) : (n.success(f, a),
                        e(t, o))
                };
            this.loadController.getTarget((function (e, n) {
                if (e)
                    return o(e);
                e = n;
                try {
                    e.gs((function (e, t) {
                        o(t, e)
                    }
                    ), t)
                } catch (e) {
                    c(e = new Error("Eval error. msg: " + e.message), 553),
                        o(e)
                }
            }
            ))
        }
            ,
            e
    }(), k = function (e) {
        function n(t, n) {
            return (n = e.call(this, n) || this).targetKey = null,
                n.instance = null,
                n.targetKey = "$BSB_" + t,
                n.instance = new C(t, r(n)),
                n
        }
        return t(n, e),
            n
    }(w), S = !1;
    window.Paris = {
        init: function (t) {
            var n = t.abcliteUrl
                , r = t.acsUrl
                , a = t.sid
                , i = void 0 === (i = t.disasterConfig) ? {} : i
                , c = void 0 === (c = t.abcliteFields) ? {} : c;
            if (!a)
                throw new Error("Missing param `sid`");
            var u, s = o(t, "monitoring", !(S = !0));
            p = s,
                s = {
                    timeout: o(t, "timeout", 5e3),
                    clientCacheTTL: o(t, "clientCacheTTL", 0),
                    mainReportUrl: o(i, "mainReportUrl"),
                    secondReportUrl: o(i, "secondReportUrl"),
                    reportTimeout: o(i, "reportTimeout", 5e3)
                },
                n && (t = l(a, E),
                    u = o(i, "abcliteUrl"),
                    b = t(n, u, e({}, s, {
                        subid: o(c, "subid"),
                        extraData: o(c, "extraData")
                    }), i)),
                r && (n = l(a, k),
                    u = o(i, "acsUrl"),
                    x = n(r, u, s, i))
        },
        getAbcliteInstance: function (e) {
            S ? b ? b((function (t) {
                t.getTarget((function (n) {
                    if (n)
                        return e(n);
                    e(null, t.instance)
                }
                ))
            }
            )) : e(null, new Error("Missing param `abcliteUrl` during initialization")) : e(null, new Error("You must initialize before getting an instance"))
        },
        getAcsInstance: function (e) {
            S ? x ? x((function (t) {
                t.getTarget((function (n) {
                    if (n)
                        return e(n);
                    e(null, t.instance)
                }
                ))
            }
            )) : e(null, new Error("Missing param `acsUrl` during initialization")) : e(null, new Error("You must initialize before getting an instance"))
        }
    }
}();

function BaiduFnaYiApiInit() {
    if (!window?.Paris?.init) {
        ElNotification({
            title: 'Error',
            message: '百度翻译接口初始化失败',
            type: 'error',
        })
        return
    }
    let i = "2060";
    window.Paris.init({
        sid: i,
        timeout: 5e3,
        // abcliteUrl: "https://dlswbr.baidu.com/heicha/mw/abclite-".concat(i, "-s.js"),
        abcliteUrl: null,
        abcliteFields: {
            subid: function () {
                return window.parisSubId
            }
        },
        acsUrl: "https://dlswbr.baidu.com/heicha/mm/".concat(i, "/acs-").concat(i, ".js"),
        // acsUrl: null,
        disasterConfig: {
            // abcliteUrl: "https://miaowu.baidu.com/sdk/heicha/mw/abclite-".concat(i, "-s.js"),
            abcliteUrl: null,
            secondReportUrl: "https://miaowu.baidu.com/slim/abdr",
            acsUrl: "https://miaowu.baidu.com/sdk/heicha/mm/".concat(i, "/acs-").concat(i, ".js")
        }
    })
}
BaiduFnaYiApiInit()
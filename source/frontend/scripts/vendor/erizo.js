(function(b, a) {
    b.version = "0.9.6";
    b.protocol = 1;
    b.transports = [];
    b.j = [];
    b.sockets = {};
    b.connect = function(c, e) {
        var d = b.util.parseUri(c),
            g, h;
        a && a.location && (d.protocol = d.protocol || a.location.protocol.slice(0, -1), d.host = d.host || (a.document ? a.document.domain : a.location.hostname), d.port = d.port || a.location.port);
        g = b.util.uniqueUri(d);
        var i = {
            host: d.host,
            secure: "https" == d.protocol,
            port: d.port || ("https" == d.protocol ? 443 : 80),
            query: d.query || ""
        };
        b.util.merge(i, e);
        if (i["force new connection"] || !b.sockets[g]) h = new b.Socket(i);
        !i["force new connection"] && h && (b.sockets[g] = h);
        h = h || b.sockets[g];
        return h.of(1 < d.path.length ? d.path : "")
    }
})("object" === typeof module ? module.exports : this.io = {}, this);
(function(b, a) {
    var c = b.util = {},
        e = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
        d = "source,protocol,authority,userInfo,user,password,host,port,relative,path,directory,file,query,anchor".split(",");
    c.parseUri = function(a) {
        for (var a = e.exec(a || ""), c = {}, f = 14; f--;) c[d[f]] = a[f] || "";
        return c
    };
    c.uniqueUri = function(d) {
        var c = d.protocol,
            f = d.host,
            d = d.port;
        "document" in
        a ? (f = f || document.domain, d = d || ("https" == c && "https:" !== document.location.protocol ? 443 : document.location.port)) : (f = f || "localhost", !d && "https" == c && (d = 443));
        return (c || "http") + "://" + f + ":" + (d || 80)
    };
    c.query = function(a, d) {
        var f = c.chunkQuery(a || ""),
            e = [];
        c.merge(f, c.chunkQuery(d || ""));
        for (var b in f) f.hasOwnProperty(b) && e.push(b + "=" + f[b]);
        return e.length ? "?" + e.join("&") : ""
    };
    c.chunkQuery = function(a) {
        for (var d = {}, a = a.split("&"), f = 0, c = a.length, e; f < c; ++f) e = a[f].split("="), e[0] && (d[e[0]] = e[1]);
        return d
    };
    var g = !1;
    c.load = function(d) {
        if ("document" in a && "complete" === document.readyState || g) return d();
        c.on(a, "load", d, !1)
    };
    c.on = function(a, d, f, c) {
        a.attachEvent ? a.attachEvent("on" + d, f) : a.addEventListener && a.addEventListener(d, f, c)
    };
    c.request = function(a) {
        if (a && "undefined" != typeof XDomainRequest) return new XDomainRequest;
        if ("undefined" != typeof XMLHttpRequest && (!a || c.ua.hasCORS)) return new XMLHttpRequest;
        if (!a) try {
            return new(window[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
        } catch (d) {}
        return null
    };
    "undefined" !=
    typeof window && c.load(function() {
        g = !0
    });
    c.defer = function(a) {
        if (!c.ua.webkit || "undefined" != typeof importScripts) return a();
        c.load(function() {
            setTimeout(a, 100)
        })
    };
    c.merge = function(a, d, f, e) {
        var e = e || [],
            f = "undefined" == typeof f ? 2 : f,
            b;
        for (b in d) d.hasOwnProperty(b) && 0 > c.indexOf(e, b) && ("object" !== typeof a[b] || !f ? (a[b] = d[b], e.push(d[b])) : c.merge(a[b], d[b], f - 1, e));
        return a
    };
    c.mixin = function(a, d) {
        c.merge(a.prototype, d.prototype)
    };
    c.inherit = function(a, d) {
        function f() {}
        f.prototype = d.prototype;
        a.prototype = new f
    };
    c.isArray = Array.isArray || function(a) {
        return "[object Array]" === Object.prototype.toString.call(a)
    };
    c.intersect = function(a, d) {
        for (var f = [], e = a.length > d.length ? a : d, b = a.length > d.length ? d : a, g = 0, t = b.length; g < t; g++) ~c.indexOf(e, b[g]) && f.push(b[g]);
        return f
    };
    c.indexOf = function(a, d, f) {
        for (var b = a.length, f = 0 > f ? 0 > f + b ? 0 : f + b : f || 0; f < b && a[f] !== d; f++);
        return b <= f ? -1 : f
    };
    c.toArray = function(a) {
        for (var d = [], f = 0, b = a.length; f < b; f++) d.push(a[f]);
        return d
    };
    c.ua = {};
    c.ua.hasCORS = "undefined" != typeof XMLHttpRequest && function() {
        try {
            var a =
                new XMLHttpRequest
        } catch (d) {
            return !1
        }
        return void 0 != a.withCredentials
    }();
    c.ua.webkit = "undefined" != typeof navigator && /webkit/i.test(navigator.userAgent)
})("undefined" != typeof io ? io : module.exports, this);
(function(b, a) {
    function c() {}
    b.EventEmitter = c;
    c.prototype.on = function(b, d) {
        this.$events || (this.$events = {});
        this.$events[b] ? a.util.isArray(this.$events[b]) ? this.$events[b].push(d) : this.$events[b] = [this.$events[b], d] : this.$events[b] = d;
        return this
    };
    c.prototype.addListener = c.prototype.on;
    c.prototype.once = function(a, d) {
        function b() {
            c.removeListener(a, b);
            d.apply(this, arguments)
        }
        var c = this;
        b.listener = d;
        this.on(a, b);
        return this
    };
    c.prototype.removeListener = function(b, d) {
        if (this.$events && this.$events[b]) {
            var c =
                this.$events[b];
            if (a.util.isArray(c)) {
                for (var h = -1, i = 0, f = c.length; i < f; i++)
                    if (c[i] === d || c[i].listener && c[i].listener === d) {
                        h = i;
                        break
                    }
                if (0 > h) return this;
                c.splice(h, 1);
                c.length || delete this.$events[b]
            } else(c === d || c.listener && c.listener === d) && delete this.$events[b]
        }
        return this
    };
    c.prototype.removeAllListeners = function(a) {
        this.$events && this.$events[a] && (this.$events[a] = null);
        return this
    };
    c.prototype.listeners = function(b) {
        this.$events || (this.$events = {});
        this.$events[b] || (this.$events[b] = []);
        a.util.isArray(this.$events[b]) ||
            (this.$events[b] = [this.$events[b]]);
        return this.$events[b]
    };
    c.prototype.emit = function(b) {
        if (!this.$events) return !1;
        var d = this.$events[b];
        if (!d) return !1;
        var c = Array.prototype.slice.call(arguments, 1);
        if ("function" == typeof d) d.apply(this, c);
        else if (a.util.isArray(d))
            for (var d = d.slice(), h = 0, i = d.length; h < i; h++) d[h].apply(this, c);
        else return !1;
        return !0
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a) {
    function c(a) {
        return 10 > a ? "0" + a : a
    }

    function e(a) {
        i.lastIndex = 0;
        return i.test(a) ? '"' + a.replace(i, function(a) {
            var f = l[a];
            return "string" === typeof f ? f : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }) + '"' : '"' + a + '"'
    }

    function d(a, b) {
        var g, h, i, l, o = f,
            s, q = b[a];
        q instanceof Date && (q = isFinite(a.valueOf()) ? a.getUTCFullYear() + "-" + c(a.getUTCMonth() + 1) + "-" + c(a.getUTCDate()) + "T" + c(a.getUTCHours()) + ":" + c(a.getUTCMinutes()) + ":" + c(a.getUTCSeconds()) + "Z" : null);
        "function" === typeof m && (q = m.call(b, a,
            q));
        switch (typeof q) {
            case "string":
                return e(q);
            case "number":
                return isFinite(q) ? "" + q : "null";
            case "boolean":
            case "null":
                return "" + q;
            case "object":
                if (!q) return "null";
                f += j;
                s = [];
                if ("[object Array]" === Object.prototype.toString.apply(q)) {
                    l = q.length;
                    for (g = 0; g < l; g += 1) s[g] = d(g, q) || "null";
                    i = 0 === s.length ? "[]" : f ? "[\n" + f + s.join(",\n" + f) + "\n" + o + "]" : "[" + s.join(",") + "]";
                    f = o;
                    return i
                }
                if (m && "object" === typeof m) {
                    l = m.length;
                    for (g = 0; g < l; g += 1) "string" === typeof m[g] && (h = m[g], (i = d(h, q)) && s.push(e(h) + (f ? ": " : ":") + i))
                } else
                    for (h in q) Object.prototype.hasOwnProperty.call(q,
                        h) && (i = d(h, q)) && s.push(e(h) + (f ? ": " : ":") + i);
                i = 0 === s.length ? "{}" : f ? "{\n" + f + s.join(",\n" + f) + "\n" + o + "}" : "{" + s.join(",") + "}";
                f = o;
                return i
        }
    }
    if (a && a.parse) return b.JSON = {
        parse: a.parse,
        stringify: a.stringify
    };
    var g = b.JSON = {},
        h = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        i = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        f, j, l = {
            "\u0008": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\u000c": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
        },
        m;
    g.stringify = function(a, b, c) {
        var g;
        j = f = "";
        if ("number" === typeof c)
            for (g = 0; g < c; g += 1) j += " ";
        else "string" === typeof c && (j = c);
        if ((m = b) && "function" !== typeof b && ("object" !== typeof b || "number" !== typeof b.length)) throw Error("JSON.stringify");
        return d("", {
            "": a
        })
    };
    g.parse = function(a, f) {
        function d(a, b) {
            var c, g, e = a[b];
            if (e && "object" === typeof e)
                for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (g = d(e, c), void 0 !== g ? e[c] = g : delete e[c]);
            return f.call(a, b, e)
        }
        var b, a = "" + a;
        h.lastIndex =
            0;
        h.test(a) && (a = a.replace(h, function(a) {
            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
        }));
        if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return b = eval("(" + a + ")"), "function" === typeof f ? d({
            "": b
        }, "") : b;
        throw new SyntaxError("JSON.parse");
    }
})("undefined" != typeof io ? io : module.exports, "undefined" !== typeof JSON ? JSON : void 0);
(function(b, a) {
    var c = b.parser = {},
        e = c.packets = "disconnect,connect,heartbeat,message,json,event,ack,error,noop".split(","),
        d = c.reasons = ["transport not supported", "client not handshaken", "unauthorized"],
        g = c.advice = ["reconnect"],
        h = a.JSON,
        i = a.util.indexOf;
    c.encodePacket = function(a) {
        var f = i(e, a.type),
            b = a.id || "",
            c = a.endpoint || "",
            r = a.ack,
            p = null;
        switch (a.type) {
            case "error":
                var u = a.reason ? i(d, a.reason) : "",
                    a = a.advice ? i(g, a.advice) : "";
                if ("" !== u || "" !== a) p = u + ("" !== a ? "+" + a : "");
                break;
            case "message":
                "" !== a.data &&
                    (p = a.data);
                break;
            case "event":
                p = {
                    name: a.name
                };
                a.args && a.args.length && (p.args = a.args);
                p = h.stringify(p);
                break;
            case "json":
                p = h.stringify(a.data);
                break;
            case "connect":
                a.qs && (p = a.qs);
                break;
            case "ack":
                p = a.ackId + (a.args && a.args.length ? "+" + h.stringify(a.args) : "")
        }
        f = [f, b + ("data" == r ? "+" : ""), c];
        null !== p && void 0 !== p && f.push(p);
        return f.join(":")
    };
    c.encodePayload = function(a) {
        var f = "";
        if (1 == a.length) return a[0];
        for (var d = 0, b = a.length; d < b; d++) f += "\ufffd" + a[d].length + "\ufffd" + a[d];
        return f
    };
    var f = /([^:]+):([0-9]+)?(\+)?:([^:]+)?:?([\s\S]*)?/;
    c.decodePacket = function(a) {
        var b = a.match(f);
        if (!b) return {};
        var c = b[2] || "",
            a = b[5] || "",
            i = {
                type: e[b[1]],
                endpoint: b[4] || ""
            };
        c && (i.id = c, i.ack = b[3] ? "data" : !0);
        switch (i.type) {
            case "error":
                b = a.split("+");
                i.reason = d[b[0]] || "";
                i.advice = g[b[1]] || "";
                break;
            case "message":
                i.data = a || "";
                break;
            case "event":
                try {
                    var r = h.parse(a);
                    i.name = r.name;
                    i.args = r.args
                } catch (p) {}
                i.args = i.args || [];
                break;
            case "json":
                try {
                    i.data = h.parse(a)
                } catch (u) {}
                break;
            case "connect":
                i.qs = a || "";
                break;
            case "ack":
                if (b = a.match(/^([0-9]+)(\+)?(.*)/))
                    if (i.ackId =
                        b[1], i.args = [], b[3]) try {
                        i.args = b[3] ? h.parse(b[3]) : []
                    } catch (v) {}
        }
        return i
    };
    c.decodePayload = function(a) {
        if ("\ufffd" == a.charAt(0)) {
            for (var f = [], d = 1, b = ""; d < a.length; d++) "\ufffd" == a.charAt(d) ? (f.push(c.decodePacket(a.substr(d + 1).substr(0, b))), d += Number(b) + 1, b = "") : b += a.charAt(d);
            return f
        }
        return [c.decodePacket(a)]
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a) {
    function c(a, d) {
        this.socket = a;
        this.sessid = d
    }
    b.Transport = c;
    a.util.mixin(c, a.EventEmitter);
    c.prototype.onData = function(b) {
        this.clearCloseTimeout();
        (this.socket.connected || this.socket.connecting || this.socket.reconnecting) && this.setCloseTimeout();
        if ("" !== b && (b = a.parser.decodePayload(b)) && b.length)
            for (var d = 0, c = b.length; d < c; d++) this.onPacket(b[d]);
        return this
    };
    c.prototype.onPacket = function(a) {
        this.socket.setHeartbeatTimeout();
        if ("heartbeat" == a.type) return this.onHeartbeat();
        if ("connect" ==
            a.type && "" == a.endpoint) this.onConnect();
        "error" == a.type && "reconnect" == a.advice && (this.open = !1);
        this.socket.onPacket(a);
        return this
    };
    c.prototype.setCloseTimeout = function() {
        if (!this.closeTimeout) {
            var a = this;
            this.closeTimeout = setTimeout(function() {
                a.onDisconnect()
            }, this.socket.closeTimeout)
        }
    };
    c.prototype.onDisconnect = function() {
        this.close && this.open && this.close();
        this.clearTimeouts();
        this.socket.onDisconnect();
        return this
    };
    c.prototype.onConnect = function() {
        this.socket.onConnect();
        return this
    };
    c.prototype.clearCloseTimeout =
        function() {
            this.closeTimeout && (clearTimeout(this.closeTimeout), this.closeTimeout = null)
        };
    c.prototype.clearTimeouts = function() {
        this.clearCloseTimeout();
        this.reopenTimeout && clearTimeout(this.reopenTimeout)
    };
    c.prototype.packet = function(b) {
        this.send(a.parser.encodePacket(b))
    };
    c.prototype.onHeartbeat = function() {
        this.packet({
            type: "heartbeat"
        })
    };
    c.prototype.onOpen = function() {
        this.open = !0;
        this.clearCloseTimeout();
        this.socket.onOpen()
    };
    c.prototype.onClose = function() {
        this.open = !1;
        this.socket.onClose();
        this.onDisconnect()
    };
    c.prototype.prepareUrl = function() {
        var b = this.socket.options;
        return this.scheme() + "://" + b.host + ":" + b.port + "/" + b.resource + "/" + a.protocol + "/" + this.name + "/" + this.sessid
    };
    c.prototype.ready = function(a, b) {
        b.call(this)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function e(b) {
        this.options = {
            port: 80,
            secure: !1,
            document: "document" in c ? document : !1,
            resource: "socket.io",
            transports: a.transports,
            "connect timeout": 1E4,
            "try multiple transports": !0,
            reconnect: !0,
            "reconnection delay": 500,
            "reconnection limit": Infinity,
            "reopen delay": 3E3,
            "max reconnection attempts": 10,
            "sync disconnect on unload": !0,
            "auto connect": !0,
            "flash policy port": 10843
        };
        a.util.merge(this.options, b);
        this.reconnecting = this.connecting = this.open = this.connected = !1;
        this.namespaces = {};
        this.buffer = [];
        this.doBuffer = !1;
        if (this.options["sync disconnect on unload"] && (!this.isXDomain() || a.util.ua.hasCORS)) {
            var d = this;
            a.util.on(c, "unload", function() {
                d.disconnectSync()
            }, !1)
        }
        this.options["auto connect"] && this.connect()
    }

    function d() {}
    b.Socket = e;
    a.util.mixin(e, a.EventEmitter);
    e.prototype.of = function(b) {
        this.namespaces[b] || (this.namespaces[b] = new a.SocketNamespace(this, b), "" !== b && this.namespaces[b].packet({
            type: "connect"
        }));
        return this.namespaces[b]
    };
    e.prototype.publish = function() {
        this.emit.apply(this,
            arguments);
        var a, b;
        for (b in this.namespaces) this.namespaces.hasOwnProperty(b) && (a = this.of(b), a.$emit.apply(a, arguments))
    };
    e.prototype.handshake = function(b) {
        function c(a) {
            if (a instanceof Error) e.onError(a.message);
            else b.apply(null, a.split(":"))
        }
        var e = this,
            f = this.options,
            f = ["http" + (f.secure ? "s" : "") + ":/", f.host + ":" + f.port, f.resource, a.protocol, a.util.query(this.options.query, "t=" + +new Date)].join("/");
        if (this.isXDomain() && !a.util.ua.hasCORS) {
            var j = document.getElementsByTagName("script")[0],
                l = document.createElement("script");
            l.src = f + "&jsonp=" + a.j.length;
            j.parentNode.insertBefore(l, j);
            a.j.push(function(a) {
                c(a);
                l.parentNode.removeChild(l)
            })
        } else {
            var m = a.util.request();
            m.open("GET", f, !0);
            m.withCredentials = !0;
            m.onreadystatechange = function() {
                4 == m.readyState && (m.onreadystatechange = d, 200 == m.status ? c(m.responseText) : !e.reconnecting && e.onError(m.responseText))
            };
            m.send(null)
        }
    };
    e.prototype.getTransport = function(b) {
        for (var b = b || this.transports, d = 0, c; c = b[d]; d++)
            if (a.Transport[c] && a.Transport[c].check(this) && (!this.isXDomain() || a.Transport[c].xdomainCheck())) return new a.Transport[c](this,
                this.sessionid);
        return null
    };
    e.prototype.connect = function(b) {
        if (this.connecting) return this;
        var d = this;
        this.handshake(function(c, f, e, l) {
            function m(a) {
                d.transport && d.transport.clearTimeouts();
                d.transport = d.getTransport(a);
                if (!d.transport) return d.publish("connect_failed");
                d.transport.ready(d, function() {
                    d.connecting = !0;
                    d.publish("connecting", d.transport.name);
                    d.transport.open();
                    d.options["connect timeout"] && (d.connectTimeoutTimer = setTimeout(function() {
                        if (!d.connected && (d.connecting = !1, d.options["try multiple transports"])) {
                            d.remainingTransports ||
                                (d.remainingTransports = d.transports.slice(0));
                            for (var a = d.remainingTransports; 0 < a.length && a.splice(0, 1)[0] != d.transport.name;);
                            a.length ? m(a) : d.publish("connect_failed")
                        }
                    }, d.options["connect timeout"]))
                })
            }
            d.sessionid = c;
            d.closeTimeout = 1E3 * e;
            d.heartbeatTimeout = 1E3 * f;
            d.transports = l ? a.util.intersect(l.split(","), d.options.transports) : d.options.transports;
            d.setHeartbeatTimeout();
            m(d.transports);
            d.once("connect", function() {
                clearTimeout(d.connectTimeoutTimer);
                b && "function" == typeof b && b()
            })
        });
        return this
    };
    e.prototype.setHeartbeatTimeout = function() {
        clearTimeout(this.heartbeatTimeoutTimer);
        var a = this;
        this.heartbeatTimeoutTimer = setTimeout(function() {
            a.transport.onClose()
        }, this.heartbeatTimeout)
    };
    e.prototype.packet = function(a) {
        this.connected && !this.doBuffer ? this.transport.packet(a) : this.buffer.push(a);
        return this
    };
    e.prototype.setBuffer = function(a) {
        this.doBuffer = a;
        !a && this.connected && this.buffer.length && (this.transport.payload(this.buffer), this.buffer = [])
    };
    e.prototype.disconnect = function() {
        if (this.connected ||
            this.connecting) this.open && this.of("").packet({
            type: "disconnect"
        }), this.onDisconnect("booted");
        return this
    };
    e.prototype.disconnectSync = function() {
        a.util.request().open("GET", this.resource + "/" + a.protocol + "/" + this.sessionid, !0);
        this.onDisconnect("booted")
    };
    e.prototype.isXDomain = function() {
        var a = c.location.port || ("https:" == c.location.protocol ? 443 : 80);
        return this.options.host !== c.location.hostname || this.options.port != a
    };
    e.prototype.onConnect = function() {
        this.connected || (this.connected = !0, this.connecting = !1, this.doBuffer || this.setBuffer(!1), this.emit("connect"))
    };
    e.prototype.onOpen = function() {
        this.open = !0
    };
    e.prototype.onClose = function() {
        this.open = !1;
        clearTimeout(this.heartbeatTimeoutTimer)
    };
    e.prototype.onPacket = function(a) {
        this.of(a.endpoint).onPacket(a)
    };
    e.prototype.onError = function(a) {
        if (a && a.advice && "reconnect" === a.advice && (this.connected || this.connecting)) this.disconnect(), this.options.reconnect && this.reconnect();
        this.publish("error", a && a.reason ? a.reason : a)
    };
    e.prototype.onDisconnect = function(a) {
        var d =
            this.connected,
            b = this.connecting;
        this.open = this.connecting = this.connected = !1;
        if (d || b) this.transport.close(), this.transport.clearTimeouts(), d && (this.publish("disconnect", a), "booted" != a && this.options.reconnect && !this.reconnecting && this.reconnect())
    };
    e.prototype.reconnect = function() {
        function a() {
            if (b.connected) {
                for (var f in b.namespaces) b.namespaces.hasOwnProperty(f) && "" !== f && b.namespaces[f].packet({
                    type: "connect"
                });
                b.publish("reconnect", b.transport.name, b.reconnectionAttempts)
            }
            clearTimeout(b.reconnectionTimer);
            b.removeListener("connect_failed", d);
            b.removeListener("connect", d);
            b.reconnecting = !1;
            delete b.reconnectionAttempts;
            delete b.reconnectionDelay;
            delete b.reconnectionTimer;
            delete b.redoTransports;
            b.options["try multiple transports"] = c
        }

        function d() {
            if (b.reconnecting) {
                if (b.connected) return a();
                if (b.connecting && b.reconnecting) return b.reconnectionTimer = setTimeout(d, 1E3);
                b.reconnectionAttempts++ >= f ? b.redoTransports ? (b.publish("reconnect_failed"), a()) : (b.on("connect_failed", d), b.options["try multiple transports"] = !0, b.transport = b.getTransport(), b.redoTransports = !0, b.connect()) : (b.reconnectionDelay < e && (b.reconnectionDelay *= 2), b.connect(), b.publish("reconnecting", b.reconnectionDelay, b.reconnectionAttempts), b.reconnectionTimer = setTimeout(d, b.reconnectionDelay))
            }
        }
        this.reconnecting = !0;
        this.reconnectionAttempts = 0;
        this.reconnectionDelay = this.options["reconnection delay"];
        var b = this,
            f = this.options["max reconnection attempts"],
            c = this.options["try multiple transports"],
            e = this.options["reconnection limit"];
        this.options["try multiple transports"] = !1;
        this.reconnectionTimer = setTimeout(d, this.reconnectionDelay);
        this.on("connect", d)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c(a, b) {
        this.socket = a;
        this.name = b || "";
        this.flags = {};
        this.json = new e(this, "json");
        this.ackPackets = 0;
        this.acks = {}
    }

    function e(a, b) {
        this.namespace = a;
        this.name = b
    }
    b.SocketNamespace = c;
    a.util.mixin(c, a.EventEmitter);
    c.prototype.$emit = a.EventEmitter.prototype.emit;
    c.prototype.of = function() {
        return this.socket.of.apply(this.socket, arguments)
    };
    c.prototype.packet = function(a) {
        a.endpoint = this.name;
        this.socket.packet(a);
        this.flags = {};
        return this
    };
    c.prototype.send = function(a, b) {
        var c = {
            type: this.flags.json ?
                "json" : "message",
            data: a
        };
        "function" == typeof b && (c.id = ++this.ackPackets, c.ack = !0, this.acks[c.id] = b);
        return this.packet(c)
    };
    c.prototype.emit = function(a) {
        var b = Array.prototype.slice.call(arguments, 1),
            c = b[b.length - 1],
            e = {
                type: "event",
                name: a
            };
        "function" == typeof c && (e.id = ++this.ackPackets, e.ack = "data", this.acks[e.id] = c, b = b.slice(0, b.length - 1));
        e.args = b;
        return this.packet(e)
    };
    c.prototype.disconnect = function() {
        "" === this.name ? this.socket.disconnect() : (this.packet({
            type: "disconnect"
        }), this.$emit("disconnect"));
        return this
    };
    c.prototype.onPacket = function(b) {
        function c() {
            e.packet({
                type: "ack",
                args: a.util.toArray(arguments),
                ackId: b.id
            })
        }
        var e = this;
        switch (b.type) {
            case "connect":
                this.$emit("connect");
                break;
            case "disconnect":
                if ("" === this.name) this.socket.onDisconnect(b.reason || "booted");
                else this.$emit("disconnect", b.reason);
                break;
            case "message":
            case "json":
                var i = ["message", b.data];
                "data" == b.ack ? i.push(c) : b.ack && this.packet({
                    type: "ack",
                    ackId: b.id
                });
                this.$emit.apply(this, i);
                break;
            case "event":
                i = [b.name].concat(b.args);
                "data" == b.ack && i.push(c);
                this.$emit.apply(this, i);
                break;
            case "ack":
                this.acks[b.ackId] && (this.acks[b.ackId].apply(this, b.args), delete this.acks[b.ackId]);
                break;
            case "error":
                if (b.advice) this.socket.onError(b);
                else "unauthorized" == b.reason ? this.$emit("connect_failed", b.reason) : this.$emit("error", b.reason)
        }
    };
    e.prototype.send = function() {
        this.namespace.flags[this.name] = !0;
        this.namespace.send.apply(this.namespace, arguments)
    };
    e.prototype.emit = function() {
        this.namespace.flags[this.name] = !0;
        this.namespace.emit.apply(this.namespace,
            arguments)
    }
})("undefined" != typeof io ? io : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function e(b) {
        a.Transport.apply(this, arguments)
    }
    b.websocket = e;
    a.util.inherit(e, a.Transport);
    e.prototype.name = "websocket";
    e.prototype.open = function() {
        var b = a.util.query(this.socket.options.query),
            e = this,
            h;
        h || (h = c.MozWebSocket || c.WebSocket);
        this.websocket = new h(this.prepareUrl() + b);
        this.websocket.onopen = function() {
            e.onOpen();
            e.socket.setBuffer(!1)
        };
        this.websocket.onmessage = function(a) {
            e.onData(a.data)
        };
        this.websocket.onclose = function() {
            e.onClose();
            e.socket.setBuffer(!0)
        };
        this.websocket.onerror =
            function(a) {
                e.onError(a)
            };
        return this
    };
    e.prototype.send = function(a) {
        this.websocket.send(a);
        return this
    };
    e.prototype.payload = function(a) {
        for (var b = 0, c = a.length; b < c; b++) this.packet(a[b]);
        return this
    };
    e.prototype.close = function() {
        this.websocket.close();
        return this
    };
    e.prototype.onError = function(a) {
        this.socket.onError(a)
    };
    e.prototype.scheme = function() {
        return this.socket.options.secure ? "wss" : "ws"
    };
    e.check = function() {
        return "WebSocket" in c && !("__addTask" in WebSocket) || "MozWebSocket" in c
    };
    e.xdomainCheck = function() {
        return !0
    };
    a.transports.push("websocket")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c() {
        a.Transport.websocket.apply(this, arguments)
    }
    b.flashsocket = c;
    a.util.inherit(c, a.Transport.websocket);
    c.prototype.name = "flashsocket";
    c.prototype.open = function() {
        var b = this,
            d = arguments;
        WebSocket.__addTask(function() {
            a.Transport.websocket.prototype.open.apply(b, d)
        });
        return this
    };
    c.prototype.send = function() {
        var b = this,
            d = arguments;
        WebSocket.__addTask(function() {
            a.Transport.websocket.prototype.send.apply(b, d)
        });
        return this
    };
    c.prototype.close = function() {
        WebSocket.__tasks.length =
            0;
        a.Transport.websocket.prototype.close.call(this);
        return this
    };
    c.prototype.ready = function(b, d) {
        function g() {
            var a = b.options,
                f = a["flash policy port"],
                g = ["http" + (a.secure ? "s" : "") + ":/", a.host + ":" + a.port, a.resource, "static/flashsocket", "WebSocketMain" + (b.isXDomain() ? "Insecure" : "") + ".swf"];
            c.loaded || ("undefined" === typeof WEB_SOCKET_SWF_LOCATION && (WEB_SOCKET_SWF_LOCATION = g.join("/")), 843 !== f && WebSocket.loadFlashPolicyFile("xmlsocket://" + a.host + ":" + f), WebSocket.__initialize(), c.loaded = !0);
            d.call(h)
        }
        var h =
            this;
        if (document.body) return g();
        a.util.load(g)
    };
    c.check = function() {
        return "undefined" == typeof WebSocket || !("__initialize" in WebSocket) || !swfobject ? !1 : 10 <= swfobject.getFlashPlayerVersion().major
    };
    c.xdomainCheck = function() {
        return !0
    };
    "undefined" != typeof window && (WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = !0);
    a.transports.push("flashsocket")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
if ("undefined" != typeof window) var swfobject = function() {
    function b() {
        if (!B) {
            try {
                var a = n.getElementsByTagName("body")[0].appendChild(n.createElement("span"));
                a.parentNode.removeChild(a)
            } catch (b) {
                return
            }
            B = !0;
            for (var a = E.length, d = 0; d < a; d++) E[d]()
        }
    }

    function a(a) {
        B ? a() : E[E.length] = a
    }

    function c(a) {
        if (typeof x.addEventListener != o) x.addEventListener("load", a, !1);
        else if (typeof n.addEventListener != o) n.addEventListener("load", a, !1);
        else if (typeof x.attachEvent != o) r(x, "onload", a);
        else if ("function" == typeof x.onload) {
            var b =
                x.onload;
            x.onload = function() {
                b();
                a()
            }
        } else x.onload = a
    }

    function e() {
        var a = n.getElementsByTagName("body")[0],
            b = n.createElement(s);
        b.setAttribute("type", q);
        var f = a.appendChild(b);
        if (f) {
            var c = 0;
            (function() {
                if (typeof f.GetVariable != o) {
                    var e = f.GetVariable("$version");
                    e && (e = e.split(" ")[1].split(","), k.pv = [parseInt(e[0], 10), parseInt(e[1], 10), parseInt(e[2], 10)])
                } else if (10 > c) {
                    c++;
                    setTimeout(arguments.callee, 10);
                    return
                }
                a.removeChild(b);
                f = null;
                d()
            })()
        } else d()
    }

    function d() {
        var a = z.length;
        if (0 < a)
            for (var b = 0; b <
                a; b++) {
                var d = z[b].id,
                    c = z[b].callbackFn,
                    e = {
                        success: !1,
                        id: d
                    };
                if (0 < k.pv[0]) {
                    var j = t(d);
                    if (j)
                        if (p(z[b].swfVersion) && !(k.wk && 312 > k.wk)) v(d, !0), c && (e.success = !0, e.ref = g(d), c(e));
                        else if (z[b].expressInstall && h()) {
                        e = {};
                        e.data = z[b].expressInstall;
                        e.width = j.getAttribute("width") || "0";
                        e.height = j.getAttribute("height") || "0";
                        j.getAttribute("class") && (e.styleclass = j.getAttribute("class"));
                        j.getAttribute("align") && (e.align = j.getAttribute("align"));
                        for (var m = {}, j = j.getElementsByTagName("param"), l = j.length, r = 0; r <
                            l; r++) "movie" != j[r].getAttribute("name").toLowerCase() && (m[j[r].getAttribute("name")] = j[r].getAttribute("value"));
                        i(e, m, d, c)
                    } else f(j), c && c(e)
                } else if (v(d, !0), c) {
                    if ((d = g(d)) && typeof d.SetVariable != o) e.success = !0, e.ref = d;
                    c(e)
                }
            }
    }

    function g(a) {
        var b = null;
        if ((a = t(a)) && "OBJECT" == a.nodeName) typeof a.SetVariable != o ? b = a : (a = a.getElementsByTagName(s)[0]) && (b = a);
        return b
    }

    function h() {
        return !F && p("6.0.65") && (k.win || k.mac) && !(k.wk && 312 > k.wk)
    }

    function i(a, b, d, f) {
        F = !0;
        I = f || null;
        K = {
            success: !1,
            id: d
        };
        var c = t(d);
        if (c) {
            "OBJECT" ==
            c.nodeName ? (D = j(c), G = null) : (D = c, G = d);
            a.id = M;
            if (typeof a.width == o || !/%$/.test(a.width) && 310 > parseInt(a.width, 10)) a.width = "310";
            if (typeof a.height == o || !/%$/.test(a.height) && 137 > parseInt(a.height, 10)) a.height = "137";
            n.title = n.title.slice(0, 47) + " - Flash Player Installation";
            f = k.ie && k.win ? ["Active"].concat("").join("X") : "PlugIn";
            f = "MMredirectURL=" + x.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + f + "&MMdoctitle=" + n.title;
            b.flashvars = typeof b.flashvars != o ? b.flashvars + ("&" + f) : f;
            k.ie && k.win && 4 !=
                c.readyState && (f = n.createElement("div"), d += "SWFObjectNew", f.setAttribute("id", d), c.parentNode.insertBefore(f, c), c.style.display = "none", function() {
                    c.readyState == 4 ? c.parentNode.removeChild(c) : setTimeout(arguments.callee, 10)
                }());
            l(a, b, d)
        }
    }

    function f(a) {
        if (k.ie && k.win && 4 != a.readyState) {
            var b = n.createElement("div");
            a.parentNode.insertBefore(b, a);
            b.parentNode.replaceChild(j(a), b);
            a.style.display = "none";
            (function() {
                4 == a.readyState ? a.parentNode.removeChild(a) : setTimeout(arguments.callee, 10)
            })()
        } else a.parentNode.replaceChild(j(a),
            a)
    }

    function j(a) {
        var b = n.createElement("div");
        if (k.win && k.ie) b.innerHTML = a.innerHTML;
        else if (a = a.getElementsByTagName(s)[0])
            if (a = a.childNodes)
                for (var d = a.length, f = 0; f < d; f++) !(1 == a[f].nodeType && "PARAM" == a[f].nodeName) && 8 != a[f].nodeType && b.appendChild(a[f].cloneNode(!0));
        return b
    }

    function l(a, b, d) {
        var f, c = t(d);
        if (k.wk && 312 > k.wk) return f;
        if (c)
            if (typeof a.id == o && (a.id = d), k.ie && k.win) {
                var e = "",
                    j;
                for (j in a) a[j] != Object.prototype[j] && ("data" == j.toLowerCase() ? b.movie = a[j] : "styleclass" == j.toLowerCase() ? e +=
                    ' class="' + a[j] + '"' : "classid" != j.toLowerCase() && (e += " " + j + '="' + a[j] + '"'));
                j = "";
                for (var g in b) b[g] != Object.prototype[g] && (j += '<param name="' + g + '" value="' + b[g] + '" />');
                c.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + e + ">" + j + "</object>";
                H[H.length] = a.id;
                f = t(a.id)
            } else {
                g = n.createElement(s);
                g.setAttribute("type", q);
                for (var h in a) a[h] != Object.prototype[h] && ("styleclass" == h.toLowerCase() ? g.setAttribute("class", a[h]) : "classid" != h.toLowerCase() && g.setAttribute(h, a[h]));
                for (e in b) b[e] !=
                    Object.prototype[e] && "movie" != e.toLowerCase() && (a = g, j = e, h = b[e], d = n.createElement("param"), d.setAttribute("name", j), d.setAttribute("value", h), a.appendChild(d));
                c.parentNode.replaceChild(g, c);
                f = g
            }
        return f
    }

    function m(a) {
        var b = t(a);
        b && "OBJECT" == b.nodeName && (k.ie && k.win ? (b.style.display = "none", function() {
            if (4 == b.readyState) {
                var d = t(a);
                if (d) {
                    for (var f in d) "function" == typeof d[f] && (d[f] = null);
                    d.parentNode.removeChild(d)
                }
            } else setTimeout(arguments.callee, 10)
        }()) : b.parentNode.removeChild(b))
    }

    function t(a) {
        var b =
            null;
        try {
            b = n.getElementById(a)
        } catch (d) {}
        return b
    }

    function r(a, b, d) {
        a.attachEvent(b, d);
        C[C.length] = [a, b, d]
    }

    function p(a) {
        var b = k.pv,
            a = a.split(".");
        a[0] = parseInt(a[0], 10);
        a[1] = parseInt(a[1], 10) || 0;
        a[2] = parseInt(a[2], 10) || 0;
        return b[0] > a[0] || b[0] == a[0] && b[1] > a[1] || b[0] == a[0] && b[1] == a[1] && b[2] >= a[2] ? !0 : !1
    }

    function u(a, b, d, f) {
        if (!k.ie || !k.mac) {
            var c = n.getElementsByTagName("head")[0];
            if (c) {
                d = d && "string" == typeof d ? d : "screen";
                f && (J = y = null);
                if (!y || J != d) f = n.createElement("style"), f.setAttribute("type", "text/css"),
                    f.setAttribute("media", d), y = c.appendChild(f), k.ie && k.win && typeof n.styleSheets != o && 0 < n.styleSheets.length && (y = n.styleSheets[n.styleSheets.length - 1]), J = d;
                k.ie && k.win ? y && typeof y.addRule == s && y.addRule(a, b) : y && typeof n.createTextNode != o && y.appendChild(n.createTextNode(a + " {" + b + "}"))
            }
        }
    }

    function v(a, b) {
        if (N) {
            var d = b ? "visible" : "hidden";
            B && t(a) ? t(a).style.visibility = d : u("#" + a, "visibility:" + d)
        }
    }

    function w(a) {
        return null != /[\\\"<>\.;]/.exec(a) && typeof encodeURIComponent != o ? encodeURIComponent(a) : a
    }
    var o = "undefined",
        s = "object",
        q = "application/x-shockwave-flash",
        M = "SWFObjectExprInst",
        x = window,
        n = document,
        A = navigator,
        O = !1,
        E = [function() {
            O ? e() : d()
        }],
        z = [],
        H = [],
        C = [],
        D, G, I, K, B = !1,
        F = !1,
        y, J, N = !0,
        k = function() {
            var a = typeof n.getElementById != o && typeof n.getElementsByTagName != o && typeof n.createElement != o,
                b = A.userAgent.toLowerCase(),
                d = A.platform.toLowerCase(),
                f = d ? /win/.test(d) : /win/.test(b),
                d = d ? /mac/.test(d) : /mac/.test(b),
                b = /webkit/.test(b) ? parseFloat(b.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : !1,
                c = !+"\v1",
                e = [0, 0, 0],
                j = null;
            if (typeof A.plugins != o && typeof A.plugins["Shockwave Flash"] == s) {
                if ((j = A.plugins["Shockwave Flash"].description) && !(typeof A.mimeTypes != o && A.mimeTypes[q] && !A.mimeTypes[q].enabledPlugin)) O = !0, c = !1, j = j.replace(/^.*\s+(\S+\s+\S+$)/, "$1"), e[0] = parseInt(j.replace(/^(.*)\..*$/, "$1"), 10), e[1] = parseInt(j.replace(/^.*\.(.*)\s.*$/, "$1"), 10), e[2] = /[a-zA-Z]/.test(j) ? parseInt(j.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            } else if (typeof x[["Active"].concat("Object").join("X")] != o) try {
                var g = new(window[["Active"].concat("Object").join("X")])("ShockwaveFlash.ShockwaveFlash");
                if (g && (j = g.GetVariable("$version"))) c = !0, j = j.split(" ")[1].split(","), e = [parseInt(j[0], 10), parseInt(j[1], 10), parseInt(j[2], 10)]
            } catch (h) {}
            return {
                w3: a,
                pv: e,
                wk: b,
                ie: c,
                win: f,
                mac: d
            }
        }();
    (function() {
        k.w3 && ((typeof n.readyState != o && "complete" == n.readyState || typeof n.readyState == o && (n.getElementsByTagName("body")[0] || n.body)) && b(), B || (typeof n.addEventListener != o && n.addEventListener("DOMContentLoaded", b, !1), k.ie && k.win && (n.attachEvent("onreadystatechange", function() {
            "complete" == n.readyState && (n.detachEvent("onreadystatechange",
                arguments.callee), b())
        }), x == top && function() {
            if (!B) {
                try {
                    n.documentElement.doScroll("left")
                } catch (a) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                b()
            }
        }()), k.wk && function() {
            B || (/loaded|complete/.test(n.readyState) ? b() : setTimeout(arguments.callee, 0))
        }(), c(b)))
    })();
    (function() {
        k.ie && k.win && window.attachEvent("onunload", function() {
            for (var a = C.length, b = 0; b < a; b++) C[b][0].detachEvent(C[b][1], C[b][2]);
            a = H.length;
            for (b = 0; b < a; b++) m(H[b]);
            for (var d in k) k[d] = null;
            k = null;
            for (var f in swfobject) swfobject[f] = null;
            swfobject =
                null
        })
    })();
    return {
        registerObject: function(a, b, d, f) {
            if (k.w3 && a && b) {
                var c = {};
                c.id = a;
                c.swfVersion = b;
                c.expressInstall = d;
                c.callbackFn = f;
                z[z.length] = c;
                v(a, !1)
            } else f && f({
                success: !1,
                id: a
            })
        },
        getObjectById: function(a) {
            if (k.w3) return g(a)
        },
        embedSWF: function(b, d, f, c, e, j, g, m, t, r) {
            var n = {
                success: !1,
                id: d
            };
            k.w3 && !(k.wk && 312 > k.wk) && b && d && f && c && e ? (v(d, !1), a(function() {
                f += "";
                c += "";
                var a = {};
                if (t && typeof t === s)
                    for (var k in t) a[k] = t[k];
                a.data = b;
                a.width = f;
                a.height = c;
                k = {};
                if (m && typeof m === s)
                    for (var u in m) k[u] = m[u];
                if (g &&
                    typeof g === s)
                    for (var q in g) k.flashvars = typeof k.flashvars != o ? k.flashvars + ("&" + q + "=" + g[q]) : q + "=" + g[q];
                if (p(e)) u = l(a, k, d), a.id == d && v(d, !0), n.success = !0, n.ref = u;
                else {
                    if (j && h()) {
                        a.data = j;
                        i(a, k, d, r);
                        return
                    }
                    v(d, !0)
                }
                r && r(n)
            })) : r && r(n)
        },
        switchOffAutoHideShow: function() {
            N = !1
        },
        ua: k,
        getFlashPlayerVersion: function() {
            return {
                major: k.pv[0],
                minor: k.pv[1],
                release: k.pv[2]
            }
        },
        hasFlashPlayerVersion: p,
        createSWF: function(a, b, d) {
            if (k.w3) return l(a, b, d)
        },
        showExpressInstall: function(a, b, d, f) {
            k.w3 && h() && i(a, b, d, f)
        },
        removeSWF: function(a) {
            k.w3 &&
                m(a)
        },
        createCSS: function(a, b, d, f) {
            k.w3 && u(a, b, d, f)
        },
        addDomLoadEvent: a,
        addLoadEvent: c,
        getQueryParamValue: function(a) {
            var b = n.location.search || n.location.hash;
            if (b) {
                /\?/.test(b) && (b = b.split("?")[1]);
                if (null == a) return w(b);
                for (var b = b.split("&"), d = 0; d < b.length; d++)
                    if (b[d].substring(0, b[d].indexOf("=")) == a) return w(b[d].substring(b[d].indexOf("=") + 1))
            }
            return ""
        },
        expressInstallCallback: function() {
            if (F) {
                var a = t(M);
                a && D && (a.parentNode.replaceChild(D, a), G && (v(G, !0), k.ie && k.win && (D.style.display = "block")),
                    I && I(K));
                F = !1
            }
        }
    }
}();
(function() {
    if (!("undefined" == typeof window || window.WebSocket)) {
        var b = window.console;
        if (!b || !b.log || !b.error) b = {
            log: function() {},
            error: function() {}
        };
        swfobject.hasFlashPlayerVersion("10.0.0") ? ("file:" == location.protocol && b.error("WARNING: web-socket-js doesn't work in file:///... URL unless you set Flash Security Settings properly. Open the page via Web server i.e. http://..."), WebSocket = function(a, b, e, d, g) {
                var h = this;
                h.__id = WebSocket.__nextId++;
                WebSocket.__instances[h.__id] = h;
                h.readyState = WebSocket.CONNECTING;
                h.bufferedAmount = 0;
                h.__events = {};
                b ? "string" == typeof b && (b = [b]) : b = [];
                setTimeout(function() {
                    WebSocket.__addTask(function() {
                        WebSocket.__flash.create(h.__id, a, b, e || null, d || 0, g || null)
                    })
                }, 0)
            }, WebSocket.prototype.send = function(a) {
                if (this.readyState == WebSocket.CONNECTING) throw "INVALID_STATE_ERR: Web Socket connection has not been established";
                a = WebSocket.__flash.send(this.__id, encodeURIComponent(a));
                if (0 > a) return !0;
                this.bufferedAmount += a;
                return !1
            }, WebSocket.prototype.close = function() {
                this.readyState == WebSocket.CLOSED ||
                    this.readyState == WebSocket.CLOSING || (this.readyState = WebSocket.CLOSING, WebSocket.__flash.close(this.__id))
            }, WebSocket.prototype.addEventListener = function(a, b) {
                a in this.__events || (this.__events[a] = []);
                this.__events[a].push(b)
            }, WebSocket.prototype.removeEventListener = function(a, b) {
                if (a in this.__events)
                    for (var e = this.__events[a], d = e.length - 1; 0 <= d; --d)
                        if (e[d] === b) {
                            e.splice(d, 1);
                            break
                        }
            }, WebSocket.prototype.dispatchEvent = function(a) {
                for (var b = this.__events[a.type] || [], e = 0; e < b.length; ++e) b[e](a);
                (b = this["on" +
                    a.type]) && b(a)
            }, WebSocket.prototype.__handleEvent = function(a) {
                "readyState" in a && (this.readyState = a.readyState);
                "protocol" in a && (this.protocol = a.protocol);
                if ("open" == a.type || "error" == a.type) a = this.__createSimpleEvent(a.type);
                else if ("close" == a.type) a = this.__createSimpleEvent("close");
                else if ("message" == a.type) a = this.__createMessageEvent("message", decodeURIComponent(a.message));
                else throw "unknown event type: " + a.type;
                this.dispatchEvent(a)
            }, WebSocket.prototype.__createSimpleEvent = function(a) {
                if (document.createEvent &&
                    window.Event) {
                    var b = document.createEvent("Event");
                    b.initEvent(a, !1, !1);
                    return b
                }
                return {
                    type: a,
                    bubbles: !1,
                    cancelable: !1
                }
            }, WebSocket.prototype.__createMessageEvent = function(a, b) {
                if (document.createEvent && window.MessageEvent && !window.opera) {
                    var e = document.createEvent("MessageEvent");
                    e.initMessageEvent("message", !1, !1, b, null, null, window, null);
                    return e
                }
                return {
                    type: a,
                    data: b,
                    bubbles: !1,
                    cancelable: !1
                }
            }, WebSocket.CONNECTING = 0, WebSocket.OPEN = 1, WebSocket.CLOSING = 2, WebSocket.CLOSED = 3, WebSocket.__flash = null, WebSocket.__instances = {}, WebSocket.__tasks = [], WebSocket.__nextId = 0, WebSocket.loadFlashPolicyFile = function(a) {
                WebSocket.__addTask(function() {
                    WebSocket.__flash.loadManualPolicyFile(a)
                })
            }, WebSocket.__initialize = function() {
                if (!WebSocket.__flash)
                    if (WebSocket.__swfLocation && (window.WEB_SOCKET_SWF_LOCATION = WebSocket.__swfLocation), window.WEB_SOCKET_SWF_LOCATION) {
                        var a = document.createElement("div");
                        a.id = "webSocketContainer";
                        a.style.position = "absolute";
                        WebSocket.__isFlashLite() ? (a.style.left = "0px", a.style.top = "0px") : (a.style.left =
                            "-100px", a.style.top = "-100px");
                        var c = document.createElement("div");
                        c.id = "webSocketFlash";
                        a.appendChild(c);
                        document.body.appendChild(a);
                        swfobject.embedSWF(WEB_SOCKET_SWF_LOCATION, "webSocketFlash", "1", "1", "10.0.0", null, null, {
                            hasPriority: !0,
                            swliveconnect: !0,
                            allowScriptAccess: "always"
                        }, null, function(a) {
                            a.success || b.error("[WebSocket] swfobject.embedSWF failed")
                        })
                    } else b.error("[WebSocket] set WEB_SOCKET_SWF_LOCATION to location of WebSocketMain.swf")
            }, WebSocket.__onFlashInitialized = function() {
                setTimeout(function() {
                    WebSocket.__flash =
                        document.getElementById("webSocketFlash");
                    WebSocket.__flash.setCallerUrl(location.href);
                    WebSocket.__flash.setDebug(!!window.WEB_SOCKET_DEBUG);
                    for (var a = 0; a < WebSocket.__tasks.length; ++a) WebSocket.__tasks[a]();
                    WebSocket.__tasks = []
                }, 0)
            }, WebSocket.__onFlashEvent = function() {
                setTimeout(function() {
                    try {
                        for (var a = WebSocket.__flash.receiveEvents(), c = 0; c < a.length; ++c) WebSocket.__instances[a[c].webSocketId].__handleEvent(a[c])
                    } catch (e) {
                        b.error(e)
                    }
                }, 0);
                return !0
            }, WebSocket.__log = function(a) {
                b.log(decodeURIComponent(a))
            },
            WebSocket.__error = function(a) {
                b.error(decodeURIComponent(a))
            }, WebSocket.__addTask = function(a) {
                WebSocket.__flash ? a() : WebSocket.__tasks.push(a)
            }, WebSocket.__isFlashLite = function() {
                if (!window.navigator || !window.navigator.mimeTypes) return !1;
                var a = window.navigator.mimeTypes["application/x-shockwave-flash"];
                return !a || !a.enabledPlugin || !a.enabledPlugin.filename ? !1 : a.enabledPlugin.filename.match(/flashlite/i) ? !0 : !1
            }, window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION || (window.addEventListener ? window.addEventListener("load",
                function() {
                    WebSocket.__initialize()
                }, !1) : window.attachEvent("onload", function() {
                WebSocket.__initialize()
            }))) : b.error("Flash Player >= 10.0.0 is required.")
    }
})();
(function(b, a, c) {
    function e(b) {
        b && (a.Transport.apply(this, arguments), this.sendBuffer = [])
    }

    function d() {}
    b.XHR = e;
    a.util.inherit(e, a.Transport);
    e.prototype.open = function() {
        this.socket.setBuffer(!1);
        this.onOpen();
        this.get();
        this.setCloseTimeout();
        return this
    };
    e.prototype.payload = function(b) {
        for (var d = [], c = 0, f = b.length; c < f; c++) d.push(a.parser.encodePacket(b[c]));
        this.send(a.parser.encodePayload(d))
    };
    e.prototype.send = function(a) {
        this.post(a);
        return this
    };
    e.prototype.post = function(a) {
        function b() {
            if (4 ==
                this.readyState)
                if (this.onreadystatechange = d, f.posting = !1, 200 == this.status) f.socket.setBuffer(!1);
                else f.onClose()
        }

        function e() {
            this.onload = d;
            f.socket.setBuffer(!1)
        }
        var f = this;
        this.socket.setBuffer(!0);
        this.sendXHR = this.request("POST");
        c.XDomainRequest && this.sendXHR instanceof XDomainRequest ? this.sendXHR.onload = this.sendXHR.onerror = e : this.sendXHR.onreadystatechange = b;
        this.sendXHR.send(a)
    };
    e.prototype.close = function() {
        this.onClose();
        return this
    };
    e.prototype.request = function(b) {
        var d = a.util.request(this.socket.isXDomain()),
            c = a.util.query(this.socket.options.query, "t=" + +new Date);
        d.open(b || "GET", this.prepareUrl() + c, !0);
        if ("POST" == b) try {
            d.setRequestHeader ? d.setRequestHeader("Content-type", "text/plain;charset=UTF-8") : d.contentType = "text/plain"
        } catch (f) {}
        return d
    };
    e.prototype.scheme = function() {
        return this.socket.options.secure ? "https" : "http"
    };
    e.check = function(b, d) {
        try {
            var e = a.util.request(d),
                f = c.XDomainRequest && e instanceof XDomainRequest,
                j = (b && b.options && b.options.secure ? "https:" : "http:") != c.location.protocol;
            if (e && (!f ||
                    !j)) return !0
        } catch (l) {}
        return !1
    };
    e.xdomainCheck = function() {
        return e.check(null, !0)
    }
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a) {
    function c(b) {
        a.Transport.XHR.apply(this, arguments)
    }
    b.htmlfile = c;
    a.util.inherit(c, a.Transport.XHR);
    c.prototype.name = "htmlfile";
    c.prototype.get = function() {
        this.doc = new(window[["Active"].concat("Object").join("X")])("htmlfile");
        this.doc.open();
        this.doc.write("<html></html>");
        this.doc.close();
        this.doc.parentWindow.s = this;
        var b = this.doc.createElement("div");
        b.className = "socketio";
        this.doc.body.appendChild(b);
        this.iframe = this.doc.createElement("iframe");
        b.appendChild(this.iframe);
        var d =
            this,
            b = a.util.query(this.socket.options.query, "t=" + +new Date);
        this.iframe.src = this.prepareUrl() + b;
        a.util.on(window, "unload", function() {
            d.destroy()
        })
    };
    c.prototype._ = function(a, b) {
        this.onData(a);
        try {
            var c = b.getElementsByTagName("script")[0];
            c.parentNode.removeChild(c)
        } catch (h) {}
    };
    c.prototype.destroy = function() {
        if (this.iframe) {
            try {
                this.iframe.src = "about:blank"
            } catch (a) {}
            this.doc = null;
            this.iframe.parentNode.removeChild(this.iframe);
            this.iframe = null;
            CollectGarbage()
        }
    };
    c.prototype.close = function() {
        this.destroy();
        return a.Transport.XHR.prototype.close.call(this)
    };
    c.check = function() {
        if ("undefined" != typeof window && ["Active"].concat("Object").join("X") in window) try {
            return new(window[["Active"].concat("Object").join("X")])("htmlfile") && a.Transport.XHR.check()
        } catch (b) {}
        return !1
    };
    c.xdomainCheck = function() {
        return !1
    };
    a.transports.push("htmlfile")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports);
(function(b, a, c) {
    function e() {
        a.Transport.XHR.apply(this, arguments)
    }

    function d() {}
    b["xhr-polling"] = e;
    a.util.inherit(e, a.Transport.XHR);
    a.util.merge(e, a.Transport.XHR);
    e.prototype.name = "xhr-polling";
    e.prototype.open = function() {
        a.Transport.XHR.prototype.open.call(this);
        return !1
    };
    e.prototype.get = function() {
        function a() {
            if (4 == this.readyState)
                if (this.onreadystatechange = d, 200 == this.status) f.onData(this.responseText), f.get();
                else f.onClose()
        }

        function b() {
            this.onerror = this.onload = d;
            f.onData(this.responseText);
            f.get()
        }

        function e() {
            f.onClose()
        }
        if (this.open) {
            var f = this;
            this.xhr = this.request();
            c.XDomainRequest && this.xhr instanceof XDomainRequest ? (this.xhr.onload = b, this.xhr.onerror = e) : this.xhr.onreadystatechange = a;
            this.xhr.send(null)
        }
    };
    e.prototype.onClose = function() {
        a.Transport.XHR.prototype.onClose.call(this);
        if (this.xhr) {
            this.xhr.onreadystatechange = this.xhr.onload = this.xhr.onerror = d;
            try {
                this.xhr.abort()
            } catch (b) {}
            this.xhr = null
        }
    };
    e.prototype.ready = function(b, d) {
        var c = this;
        a.util.defer(function() {
            d.call(c)
        })
    };
    a.transports.push("xhr-polling")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
(function(b, a, c) {
    function e(b) {
        a.Transport["xhr-polling"].apply(this, arguments);
        this.index = a.j.length;
        var d = this;
        a.j.push(function(a) {
            d._(a)
        })
    }
    var d = c.document && "MozAppearance" in c.document.documentElement.style;
    b["jsonp-polling"] = e;
    a.util.inherit(e, a.Transport["xhr-polling"]);
    e.prototype.name = "jsonp-polling";
    e.prototype.post = function(b) {
        function d() {
            c();
            f.socket.setBuffer(!1)
        }

        function c() {
            f.iframe && f.form.removeChild(f.iframe);
            try {
                r = document.createElement('<iframe name="' + f.iframeId + '">')
            } catch (a) {
                r =
                    document.createElement("iframe"), r.name = f.iframeId
            }
            r.id = f.iframeId;
            f.form.appendChild(r);
            f.iframe = r
        }
        var f = this,
            e = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
        if (!this.form) {
            var l = document.createElement("form"),
                m = document.createElement("textarea"),
                t = this.iframeId = "socketio_iframe_" + this.index,
                r;
            l.className = "socketio";
            l.style.position = "absolute";
            l.style.top = "0px";
            l.style.left = "0px";
            l.style.display = "none";
            l.target = t;
            l.method = "POST";
            l.setAttribute("accept-charset", "utf-8");
            m.name = "d";
            l.appendChild(m);
            document.body.appendChild(l);
            this.form = l;
            this.area = m
        }
        this.form.action = this.prepareUrl() + e;
        c();
        this.area.value = a.JSON.stringify(b);
        try {
            this.form.submit()
        } catch (p) {}
        this.iframe.attachEvent ? r.onreadystatechange = function() {
            "complete" == f.iframe.readyState && d()
        } : this.iframe.onload = d;
        this.socket.setBuffer(!0)
    };
    e.prototype.get = function() {
        var b = this,
            c = document.createElement("script"),
            e = a.util.query(this.socket.options.query, "t=" + +new Date + "&i=" + this.index);
        this.script && (this.script.parentNode.removeChild(this.script),
            this.script = null);
        c.async = !0;
        c.src = this.prepareUrl() + e;
        c.onerror = function() {
            b.onClose()
        };
        e = document.getElementsByTagName("script")[0];
        e.parentNode.insertBefore(c, e);
        this.script = c;
        d && setTimeout(function() {
            var a = document.createElement("iframe");
            document.body.appendChild(a);
            document.body.removeChild(a)
        }, 100)
    };
    e.prototype._ = function(a) {
        this.onData(a);
        this.open && this.get();
        return this
    };
    e.prototype.ready = function(b, c) {
        var e = this;
        if (!d) return c.call(this);
        a.util.load(function() {
            c.call(e)
        })
    };
    e.check = function() {
        return "document" in
            c
    };
    e.xdomainCheck = function() {
        return !0
    };
    a.transports.push("jsonp-polling")
})("undefined" != typeof io ? io.Transport : module.exports, "undefined" != typeof io ? io : module.parent.exports, this);
var Erizo = Erizo || {};
Erizo.EventDispatcher = function(b) {
    var a = {};
    b.dispatcher = {};
    b.dispatcher.eventListeners = {};
    a.addEventListener = function(a, e) {
        void 0 === b.dispatcher.eventListeners[a] && (b.dispatcher.eventListeners[a] = []);
        b.dispatcher.eventListeners[a].push(e)
    };
    a.removeEventListener = function(a, e) {
        var d;
        d = b.dispatcher.eventListeners[a].indexOf(e); - 1 !== d && b.dispatcher.eventListeners[a].splice(d, 1)
    };
    a.dispatchEvent = function(a) {
        var e;
        L.Logger.debug("Event: " + a.type);
        for (e in b.dispatcher.eventListeners[a.type])
            if (b.dispatcher.eventListeners[a.type].hasOwnProperty(e)) b.dispatcher.eventListeners[a.type][e](a)
    };
    return a
};
Erizo.LicodeEvent = function(b) {
    var a = {};
    a.type = b.type;
    return a
};
Erizo.RoomEvent = function(b) {
    var a = Erizo.LicodeEvent(b);
    a.streams = b.streams;
    return a
};
Erizo.StreamEvent = function(b) {
    var a = Erizo.LicodeEvent(b);
    a.stream = b.stream;
    a.msg = b.msg;
    return a
};
Erizo.PublisherEvent = function(b) {
    return Erizo.LicodeEvent(b)
};
Erizo = Erizo || {};
Erizo.FcStack = function() {
    return {
        addStream: function() {}
    }
};
Erizo = Erizo || {};
Erizo.FirefoxStack = function(b) {
    var a = {},
        c = mozRTCPeerConnection,
        e = mozRTCSessionDescription,
        d = !1;
    a.pc_config = {
        iceServers: []
    };
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({
        url: b.stunServerUrl
    });
    void 0 === b.audio && (b.audio = !0);
    void 0 === b.video && (b.video = !0);
    a.mediaConstraints = {
        optional: [],
        mandatory: {
            OfferToReceiveAudio: b.audio,
            OfferToReceiveVideo: b.video,
            MozDontOfferDataChannel: !0
        }
    };
    a.roapSessionId = 103;
    a.peerConnection = new c;
    a.peerConnection.onicecandidate = function(d) {
        L.Logger.debug("PeerConnection: ", b.session_id);
        if (d.candidate) a.iceCandidateCount = a.iceCandidateCount + 1;
        else {
            L.Logger.debug("State: " + a.peerConnection.iceGatheringState);
            if (a.ices === void 0) a.ices = 0;
            a.ices = a.ices + 1;
            L.Logger.debug(a.ices);
            if (a.ices >= 1 && a.moreIceComing) {
                a.moreIceComing = false;
                a.markActionNeeded()
            }
        }
    };
    L.Logger.debug('Created webkitRTCPeerConnnection with config "' + JSON.stringify(a.pc_config) + '".');
    a.processSignalingMessage = function(b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        if (a.state === "new")
            if (b.messageType ===
                "OFFER") {
                b = {
                    sdp: b.sdp,
                    type: "offer"
                };
                a.peerConnection.setRemoteDescription(new e(b));
                a.state = "offer-received";
                a.markActionNeeded()
            } else a.error("Illegal message for this state: " + b.messageType + " in state " + a.state);
        else if (a.state === "offer-sent")
            if (b.messageType === "ANSWER") {
                b.sdp = b.sdp.replace(/ generation 0/g, "");
                b.sdp = b.sdp.replace(/ udp /g, " UDP ");
                b = {
                    sdp: b.sdp,
                    type: "answer"
                };
                L.Logger.debug("Received ANSWER: ", b.sdp);
                a.peerConnection.setRemoteDescription(new e(b));
                a.sendOK();
                a.state = "established"
            } else if (b.messageType ===
            "pr-answer") {
            b = {
                sdp: b.sdp,
                type: "pr-answer"
            };
            a.peerConnection.setRemoteDescription(new e(b))
        } else b.messageType === "offer" ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state);
        else if (a.state === "established")
            if (b.messageType === "OFFER") {
                b = {
                    sdp: b.sdp,
                    type: "offer"
                };
                a.peerConnection.setRemoteDescription(new e(b));
                a.state = "offer-received";
                a.markActionNeeded()
            } else a.error("Illegal message for this state: " + b.messageType + " in state " + a.state)
    };
    a.addStream =
        function(b) {
            d = true;
            a.peerConnection.addStream(b);
            a.markActionNeeded()
        };
    a.removeStream = function() {
        a.markActionNeeded()
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function() {
        a.actionNeeded = true;
        a.doLater(function() {
            a.onstablestate()
        })
    };
    a.doLater = function(a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function() {
        var b;
        if (a.actionNeeded) {
            if (a.state === "new" || a.state === "established") {
                L.Logger.debug("Creating offer");
                if (d) a.mediaConstraints = void 0;
                (function() {
                    a.peerConnection.createOffer(function(b) {
                        var d =
                            b.sdp;
                        L.Logger.debug("Changed", b.sdp);
                        if (d !== a.prevOffer) {
                            a.peerConnection.setLocalDescription(b);
                            a.state = "preparing-offer";
                            a.markActionNeeded()
                        } else L.Logger.debug("Not sending a new offer")
                    }, function(a) {
                        L.Logger.debug("Ups! Something went wrong ", a)
                    }, a.mediaConstraints)
                })()
            } else if (a.state === "preparing-offer") {
                if (a.moreIceComing) return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: ", a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if (a.state ===
                "offer-received") a.peerConnection.createAnswer(function(b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                if (a.iceStarted) a.markActionNeeded();
                else {
                    L.Logger.debug((new Date).getTime() + ": Starting ICE in responder");
                    a.iceStarted = true
                }
            }, function() {
                L.Logger.debug("Ups! Something went wrong")
            });
            else if (a.state === "offer-received-preparing-answer") {
                if (a.moreIceComing) return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " +
                a.state + ", stopping here");
            a.actionNeeded = false
        }
    };
    a.sendOK = function() {
        a.sendMessage("OK")
    };
    a.sendMessage = function(b, d) {
        var c = {};
        c.messageType = b;
        c.sdp = d;
        if (b === "OFFER") {
            c.offererSessionId = a.sessionId;
            c.answererSessionId = a.otherSessionId;
            c.seq = a.sequenceNumber = a.sequenceNumber + 1;
            c.tiebreaker = Math.floor(Math.random() * 429496723 + 1)
        } else {
            c.offererSessionId = a.incomingMessage.offererSessionId;
            c.answererSessionId = a.sessionId;
            c.seq = a.incomingMessage.seq
        }
        a.onsignalingmessage(JSON.stringify(c))
    };
    a.error = function(a) {
        throw "Error in RoapOnJsep: " +
        a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = b.callback;
    a.peerConnection.onopen = function() {
        if (a.onopen) a.onopen()
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange = function(b) {
        if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
    };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
Erizo = Erizo || {};
Erizo.ChromeStableStack = function(b) {
    var a = {},
        c = webkitRTCPeerConnection;
    a.pc_config = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({
        url: b.stunServerUrl
    });
    (b.turnServer || {}).url && a.pc_config.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    if (void 0 === b.audio || b.nop2p) b.audio = !0;
    if (void 0 === b.video || b.nop2p) b.video = !0;
    a.mediaConstraints = {
        mandatory: {
            OfferToReceiveVideo: b.video,
            OfferToReceiveAudio: b.audio
        }
    };
    a.roapSessionId = 103;
    a.peerConnection = new c(a.pc_config, a.con);
    a.peerConnection.onicecandidate = function(d) {
        L.Logger.debug("PeerConnection: ", b.session_id);
        if (d.candidate) a.iceCandidateCount += 1;
        else if (L.Logger.debug("State: " + a.peerConnection.iceGatheringState), void 0 === a.ices && (a.ices = 0), a.ices += 1, 1 <= a.ices && a.moreIceComing) a.moreIceComing = !1, a.markActionNeeded()
    };
    var e = function(a) {
        if (b.maxVideoBW) var c = a.match(/m=video.*\r\n/),
            e = c[0] + "b=AS:" + b.maxVideoBW + "\r\n",
            a = a.replace(c[0], e);
        b.maxAudioBW &&
            (c = a.match(/m=audio.*\r\n/), e = c[0] + "b=AS:" + b.maxAudioBW + "\r\n", a = a.replace(c[0], e));
        return a
    };
    a.processSignalingMessage = function(b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        "new" === a.state ? "OFFER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "offer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state) : "offer-sent" === a.state ?
            "ANSWER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "answer"
            }, L.Logger.debug("Received ANSWER: ", b.sdp), b.sdp = e(b.sdp), a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.sendOK(), a.state = "established") : "pr-answer" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "pr-answer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b))) : "offer" === b.messageType ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state) : "established" === a.state && ("OFFER" ===
                b.messageType ? (b = {
                    sdp: b.sdp,
                    type: "offer"
                }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state))
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b);
        a.markActionNeeded()
    };
    a.removeStream = function() {
        a.markActionNeeded()
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function() {
        a.actionNeeded = !0;
        a.doLater(function() {
            a.onstablestate()
        })
    };
    a.doLater = function(a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function() {
        var b;
        if (a.actionNeeded) {
            if ("new" === a.state || "established" === a.state) a.peerConnection.createOffer(function(b) {
                b.sdp = e(b.sdp);
                L.Logger.debug("Changed", b.sdp);
                b.sdp !== a.prevOffer ? (a.peerConnection.setLocalDescription(b), a.state = "preparing-offer", a.markActionNeeded()) : L.Logger.debug("Not sending a new offer")
            }, null, a.mediaConstraints);
            else if ("preparing-offer" === a.state) {
                if (a.moreIceComing) return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: " + a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if ("offer-received" === a.state) a.peerConnection.createAnswer(function(b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                a.iceStarted ? a.markActionNeeded() : (L.Logger.debug((new Date).getTime() + ": Starting ICE in responder"), a.iceStarted = !0)
            }, null, a.mediaConstraints);
            else if ("offer-received-preparing-answer" === a.state) {
                if (a.moreIceComing) return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
            a.actionNeeded = !1
        }
    };
    a.sendOK = function() {
        a.sendMessage("OK")
    };
    a.sendMessage = function(b, c) {
        var e = {};
        e.messageType = b;
        e.sdp = c;
        "OFFER" === b ? (e.offererSessionId = a.sessionId, e.answererSessionId = a.otherSessionId, e.seq = a.sequenceNumber += 1, e.tiebreaker = Math.floor(429496723 * Math.random() + 1)) : (e.offererSessionId = a.incomingMessage.offererSessionId, e.answererSessionId = a.sessionId, e.seq = a.incomingMessage.seq);
        a.onsignalingmessage(JSON.stringify(e))
    };
    a.error = function(a) {
        throw "Error in RoapOnJsep: " + a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = b.callback;
    a.peerConnection.onopen = function() {
        if (a.onopen) a.onopen()
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange =
        function(b) {
            if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
        };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
Erizo = Erizo || {};
Erizo.ChromeCanaryStack = function(b) {
    var a = {},
        c = webkitRTCPeerConnection;
    a.pc_config = {
        iceServers: []
    };
    a.con = {
        optional: [{
            DtlsSrtpKeyAgreement: !0
        }]
    };
    void 0 !== b.stunServerUrl && a.pc_config.iceServers.push({
        url: b.stunServerUrl
    });
    (b.turnServer || {}).url && a.pc_config.iceServers.push({
        username: b.turnServer.username,
        credential: b.turnServer.password,
        url: b.turnServer.url
    });
    if (void 0 === b.audio || b.nop2p) b.audio = !0;
    if (void 0 === b.video || b.nop2p) b.video = !0;
    a.mediaConstraints = {
        mandatory: {
            OfferToReceiveVideo: b.video,
            OfferToReceiveAudio: b.audio
        }
    };
    a.roapSessionId = 103;
    a.peerConnection = new c(a.pc_config, a.con);
    a.peerConnection.onicecandidate = function(d) {
        L.Logger.debug("PeerConnection: ", b.session_id);
        if (d.candidate) a.iceCandidateCount += 1;
        else if (L.Logger.debug("State: " + a.peerConnection.iceGatheringState), void 0 === a.ices && (a.ices = 0), a.ices += 1, 1 <= a.ices && a.moreIceComing) a.moreIceComing = !1, a.markActionNeeded()
    };
    var e = function(a) {
        if (b.maxVideoBW) var c = a.match(/m=video.*\r\n/),
            e = c[0] + "b=AS:" + b.maxVideoBW + "\r\n",
            a = a.replace(c[0], e);
        b.maxAudioBW &&
            (c = a.match(/m=audio.*\r\n/), e = c[0] + "b=AS:" + b.maxAudioBW + "\r\n", a = a.replace(c[0], e));
        return a
    };
    a.processSignalingMessage = function(b) {
        L.Logger.debug("Activity on conn " + a.sessionId);
        b = JSON.parse(b);
        a.incomingMessage = b;
        "new" === a.state ? "OFFER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "offer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state) : "offer-sent" === a.state ?
            "ANSWER" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "answer"
            }, L.Logger.debug("Received ANSWER: ", b.sdp), b.sdp = e(b.sdp), a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.sendOK(), a.state = "established") : "pr-answer" === b.messageType ? (b = {
                sdp: b.sdp,
                type: "pr-answer"
            }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b))) : "offer" === b.messageType ? a.error("Not written yet") : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state) : "established" === a.state && ("OFFER" ===
                b.messageType ? (b = {
                    sdp: b.sdp,
                    type: "offer"
                }, a.peerConnection.setRemoteDescription(new RTCSessionDescription(b)), a.state = "offer-received", a.markActionNeeded()) : a.error("Illegal message for this state: " + b.messageType + " in state " + a.state))
    };
    a.addStream = function(b) {
        a.peerConnection.addStream(b);
        a.markActionNeeded()
    };
    a.removeStream = function() {
        a.markActionNeeded()
    };
    a.close = function() {
        a.state = "closed";
        a.peerConnection.close()
    };
    a.markActionNeeded = function() {
        a.actionNeeded = !0;
        a.doLater(function() {
            a.onstablestate()
        })
    };
    a.doLater = function(a) {
        window.setTimeout(a, 1)
    };
    a.onstablestate = function() {
        var b;
        if (a.actionNeeded) {
            if ("new" === a.state || "established" === a.state) a.peerConnection.createOffer(function(b) {
                b.sdp = e(b.sdp);
                L.Logger.debug("Changed", b.sdp);
                b.sdp !== a.prevOffer ? (a.peerConnection.setLocalDescription(b), a.state = "preparing-offer", a.markActionNeeded()) : L.Logger.debug("Not sending a new offer")
            }, null, a.mediaConstraints);
            else if ("preparing-offer" === a.state) {
                if (a.moreIceComing) return;
                a.prevOffer = a.peerConnection.localDescription.sdp;
                L.Logger.debug("Sending OFFER: " + a.prevOffer);
                a.sendMessage("OFFER", a.prevOffer);
                a.state = "offer-sent"
            } else if ("offer-received" === a.state) a.peerConnection.createAnswer(function(b) {
                a.peerConnection.setLocalDescription(b);
                a.state = "offer-received-preparing-answer";
                a.iceStarted ? a.markActionNeeded() : (L.Logger.debug((new Date).getTime() + ": Starting ICE in responder"), a.iceStarted = !0)
            }, null, a.mediaConstraints);
            else if ("offer-received-preparing-answer" === a.state) {
                if (a.moreIceComing) return;
                b = a.peerConnection.localDescription.sdp;
                a.sendMessage("ANSWER", b);
                a.state = "established"
            } else a.error("Dazed and confused in state " + a.state + ", stopping here");
            a.actionNeeded = !1
        }
    };
    a.sendOK = function() {
        a.sendMessage("OK")
    };
    a.sendMessage = function(b, c) {
        var e = {};
        e.messageType = b;
        e.sdp = c;
        "OFFER" === b ? (e.offererSessionId = a.sessionId, e.answererSessionId = a.otherSessionId, e.seq = a.sequenceNumber += 1, e.tiebreaker = Math.floor(429496723 * Math.random() + 1)) : (e.offererSessionId = a.incomingMessage.offererSessionId, e.answererSessionId = a.sessionId, e.seq = a.incomingMessage.seq);
        a.onsignalingmessage(JSON.stringify(e))
    };
    a.error = function(a) {
        throw "Error in RoapOnJsep: " + a;
    };
    a.sessionId = a.roapSessionId += 1;
    a.sequenceNumber = 0;
    a.actionNeeded = !1;
    a.iceStarted = !1;
    a.moreIceComing = !0;
    a.iceCandidateCount = 0;
    a.onsignalingmessage = b.callback;
    a.peerConnection.onopen = function() {
        if (a.onopen) a.onopen()
    };
    a.peerConnection.onaddstream = function(b) {
        if (a.onaddstream) a.onaddstream(b)
    };
    a.peerConnection.onremovestream = function(b) {
        if (a.onremovestream) a.onremovestream(b)
    };
    a.peerConnection.oniceconnectionstatechange =
        function(b) {
            if (a.oniceconnectionstatechange) a.oniceconnectionstatechange(b.currentTarget.iceConnectionState)
        };
    a.onaddstream = null;
    a.onremovestream = null;
    a.state = "new";
    a.markActionNeeded();
    return a
};
Erizo = Erizo || {};
Erizo.sessionId = 103;
Erizo.Connection = function(b) {
    var a = {};
    b.session_id = Erizo.sessionId += 1;
    a.browser = "";
    if ("undefined" !== typeof module && module.exports) L.Logger.error("Publish/subscribe video/audio streams not supported in erizofc yet"), a = Erizo.FcStack(b);
    else if (null !== window.navigator.userAgent.match("Firefox")) a.browser = "mozilla", a = Erizo.FirefoxStack(b);
    else if (26 <= window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1]) L.Logger.debug("Stable"), a = Erizo.ChromeStableStack(b), a.browser = "chrome-stable";
    else if ("25" ===
        window.navigator.appVersion.match(/Bowser\/([\w\W]*?)\./)[1]) a.browser = "bowser";
    else throw a.browser = "none", "WebRTC stack not available";
    return a
};
Erizo.GetUserMedia = function(b, a, c) {
    navigator.getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    if (b.screen)
        if (L.Logger.debug("Screen access requested"), 34 <= !window.navigator.appVersion.match(/Chrome\/([\w\W]*?)\./)[1]) c({
            code: "This browser does not support screen sharing"
        });
        else {
            var e = "okeephmleflklcdebijnponpabbmmgeo";
            b.extensionId && (L.Logger.debug("extensionId supplied, using " + b.extensionId), e = b.extensionId);
            L.Logger.debug("Screen access on chrome stable, looking for extension");
            try {
                chrome.runtime.sendMessage(e, {
                    getStream: !0
                }, function(d) {
                    if (d == void 0) {
                        L.Logger.debug("Access to screen denied");
                        c({
                            code: "Access to screen denied"
                        })
                    } else {
                        b = {
                            video: {
                                mandatory: {
                                    chromeMediaSource: "desktop",
                                    chromeMediaSourceId: d.streamId
                                }
                            }
                        };
                        navigator.getMedia(b, a, c)
                    }
                })
            } catch (d) {
                L.Logger.debug("Lynckia screensharing plugin is not accessible "), c({
                    code: "no_plugin_present"
                })
            }
        } else "undefined" !== typeof module && module.exports ? L.Logger.error("Video/audio streams not supported in erizofc yet") : navigator.getMedia(b,
        a, c)
};
Erizo = Erizo || {};
Erizo.Stream = function(b) {
    var a = Erizo.EventDispatcher(b),
        c;
    a.stream = b.stream;
    a.url = b.url;
    a.recording = b.recording;
    a.room = void 0;
    a.showing = !1;
    a.local = !1;
    a.video = b.video;
    a.audio = b.audio;
    a.screen = b.screen;
    a.videoSize = b.videoSize;
    a.extensionId = b.extensionId;
    if (void 0 !== a.videoSize && (!(a.videoSize instanceof Array) || 4 != a.videoSize.length)) throw Error("Invalid Video Size");
    if (void 0 === b.local || !0 === b.local) a.local = !0;
    a.getID = function() {
        return b.streamID
    };
    a.getAttributes = function() {
        return b.attributes
    };
    a.setAttributes =
        function() {
            L.Logger.error("Failed to set attributes data. This Stream object has not been published.")
        };
    a.updateLocalAttributes = function(a) {
        b.attributes = a
    };
    a.hasAudio = function() {
        return b.audio
    };
    a.hasVideo = function() {
        return b.video
    };
    a.hasData = function() {
        return b.data
    };
    a.hasScreen = function() {
        return b.screen
    };
    a.sendData = function() {
        L.Logger.error("Failed to send data. This Stream object has not that channel enabled.")
    };
    a.init = function() {
        try {
            if ((b.audio || b.video || b.screen) && void 0 === b.url) {
                L.Logger.debug("Requested access to local media");
                var c = b.video || b.screen;
                !0 == c && void 0 !== a.videoSize && (c = {
                    mandatory: {
                        minWidth: a.videoSize[0],
                        minHeight: a.videoSize[1],
                        maxWidth: a.videoSize[2],
                        maxHeight: a.videoSize[3]
                    }
                });
                var d = {
                    video: c,
                    audio: b.audio,
                    fake: b.fake,
                    screen: b.screen,
                    extensionId: a.extensionId
                };
                L.Logger.debug(d);
                Erizo.GetUserMedia(d, function(b) {
                    L.Logger.info("User has granted access to local media.");
                    a.stream = b;
                    b = Erizo.StreamEvent({
                        type: "access-accepted"
                    });
                    a.dispatchEvent(b)
                }, function(b) {
                    L.Logger.error("Failed to get access to local media. Error code was " +
                        b.code + ".");
                    b = Erizo.StreamEvent({
                        type: "access-denied"
                    });
                    a.dispatchEvent(b)
                })
            } else {
                var g = Erizo.StreamEvent({
                    type: "access-accepted"
                });
                a.dispatchEvent(g)
            }
        } catch (h) {
            L.Logger.error("Error accessing to local media", h)
        }
    };
    a.close = function() {
        a.local && (void 0 !== a.room && a.room.unpublish(a), a.hide(), void 0 !== a.stream && a.stream.stop(), a.stream = void 0)
    };
    a.play = function(b, c) {
        c = c || {};
        a.elementID = b;
        if (a.hasVideo() || this.hasScreen()) {
            if (void 0 !== b) {
                var g = new Erizo.VideoPlayer({
                    id: a.getID(),
                    stream: a,
                    elementID: b,
                    options: c
                });
                a.player = g;
                a.showing = !0
            }
        } else a.hasAudio && (g = new Erizo.AudioPlayer({
            id: a.getID(),
            stream: a,
            elementID: b,
            options: c
        }), a.player = g, a.showing = !0)
    };
    a.stop = function() {
        a.showing && void 0 !== a.player && (a.player.destroy(), a.showing = !1)
    };
    a.show = a.play;
    a.hide = a.stop;
    c = function() {
        if (void 0 !== a.player && void 0 !== a.stream) {
            var b = a.player.video,
                c = document.defaultView.getComputedStyle(b),
                g = parseInt(c.getPropertyValue("width"), 10),
                h = parseInt(c.getPropertyValue("height"), 10),
                i = parseInt(c.getPropertyValue("left"), 10),
                c = parseInt(c.getPropertyValue("top"),
                    10),
                f = document.getElementById(a.elementID),
                j = document.defaultView.getComputedStyle(f),
                f = parseInt(j.getPropertyValue("width"), 10),
                j = parseInt(j.getPropertyValue("height"), 10),
                l = document.createElement("canvas");
            l.id = "testing";
            l.width = f;
            l.height = j;
            l.setAttribute("style", "display: none");
            l.getContext("2d").drawImage(b, i, c, g, h);
            return l
        }
        return null
    };
    a.getVideoFrameURL = function(a) {
        var b = c();
        return null !== b ? a ? b.toDataURL(a) : b.toDataURL() : null
    };
    a.getVideoFrame = function() {
        var a = c();
        return null !== a ? a.getContext("2d").getImageData(0,
            0, a.width, a.height) : null
    };
    return a
};
Erizo = Erizo || {};
Erizo.Room = function(b) {
    var a = Erizo.EventDispatcher(b),
        c, e, d, g, h, i;
    a.remoteStreams = {};
    a.localStreams = {};
    a.roomID = "";
    a.socket = {};
    a.state = 0;
    a.p2p = !1;
    a.addEventListener("room-disconnected", function() {
        var b, c;
        a.state = 0;
        for (b in a.remoteStreams) a.remoteStreams.hasOwnProperty(b) && (c = a.remoteStreams[b], i(c), delete a.remoteStreams[b], c = Erizo.StreamEvent({
            type: "stream-removed",
            stream: c
        }), a.dispatchEvent(c));
        a.remoteStreams = {};
        for (b in a.localStreams) a.localStreams.hasOwnProperty(b) && (c = a.localStreams[b], c.pc.close(),
            delete a.localStreams[b]);
        try {
            a.socket.disconnect()
        } catch (d) {
            L.Logger.debug("Socket already disconnected")
        }
        a.socket = void 0
    });
    i = function(a) {
        void 0 !== a.stream && (a.hide(), a.pc.close(), a.local && a.stream.stop())
    };
    g = function(a, b) {
        a.local ? e("sendDataStream", {
            id: a.getID(),
            msg: b
        }) : L.Logger.error("You can not send data through a remote stream")
    };
    h = function(a, b) {
        a.local ? (a.updateLocalAttributes(b), e("updateStreamAttributes", {
            id: a.getID(),
            attrs: b
        })) : L.Logger.error("You can not update attributes in a remote stream")
    };
    c = function(c, j, l) {
        console.log(c);
        a.socket = io.connect(c.host, {
            reconnect: !1,
            secure: c.secure,
            "force new connection": !0
        });
        a.socket.on("onAddStream", function(b) {
            var c = Erizo.Stream({
                streamID: b.id,
                local: !1,
                audio: b.audio,
                video: b.video,
                data: b.data,
                screen: b.screen,
                attributes: b.attributes
            });
            a.remoteStreams[b.id] = c;
            b = Erizo.StreamEvent({
                type: "stream-added",
                stream: c
            });
            a.dispatchEvent(b)
        });
        a.socket.on("onSubscribeP2P", function(b) {
            var c = a.localStreams[b.streamId];
            void 0 === c.pc && (c.pc = {});
            c.pc[b.subsSocket] = Erizo.Connection({
                callback: function(a) {
                    d("publish", {
                        state: "p2pSignaling",
                        streamId: b.streamId,
                        subsSocket: b.subsSocket
                    }, a, function(a) {
                        a === "error" && callbackError && callbackError(a);
                        c.pc[b.subsSocket].onsignalingmessage = function() {
                            c.pc[b.subsSocket].onsignalingmessage = function() {}
                        };
                        c.pc[b.subsSocket].processSignalingMessage(a)
                    })
                },
                audio: c.hasAudio(),
                video: c.hasVideo(),
                stunServerUrl: a.stunServerUrl,
                turnServer: a.turnServer
            });
            c.pc[b.subsSocket].addStream(c.stream);
            c.pc[b.subsSocket].oniceconnectionstatechange = function(a) {
                if (a === "disconnected") {
                    c.pc[b.subsSocket].close();
                    delete c.pc[b.subsSocket]
                }
            }
        });
        a.socket.on("onPublishP2P", function(c, f) {
            var d = a.remoteStreams[c.streamId];
            d.pc = Erizo.Connection({
                callback: function() {},
                stunServerUrl: a.stunServerUrl,
                turnServer: a.turnServer,
                maxAudioBW: b.maxAudioBW,
                maxVideoBW: b.maxVideoBW
            });
            d.pc.onsignalingmessage = function(a) {
                d.pc.onsignalingmessage = function() {};
                f(a)
            };
            d.pc.processSignalingMessage(c.sdp);
            d.pc.onaddstream = function(b) {
                L.Logger.info("Stream subscribed");
                d.stream = b.stream;
                b = Erizo.StreamEvent({
                    type: "stream-subscribed",
                    stream: d
                });
                a.dispatchEvent(b)
            }
        });
        a.socket.on("onDataStream", function(b) {
            var c = a.remoteStreams[b.id],
                b = Erizo.StreamEvent({
                    type: "stream-data",
                    msg: b.msg,
                    stream: c
                });
            c.dispatchEvent(b)
        });
        a.socket.on("onUpdateAttributeStream", function(b) {
            var c = a.remoteStreams[b.id],
                f = Erizo.StreamEvent({
                    type: "stream-attributes-update",
                    attrs: b.attrs,
                    stream: c
                });
            c.updateLocalAttributes(b.attrs);
            c.dispatchEvent(f)
        });
        a.socket.on("onRemoveStream", function(b) {
            var c = a.remoteStreams[b.id];
            delete a.remoteStreams[b.id];
            i(c);
            b = Erizo.StreamEvent({
                type: "stream-removed",
                stream: c
            });
            a.dispatchEvent(b)
        });
        a.socket.on("disconnect", function() {
            L.Logger.info("Socket disconnected");
            if (0 !== a.state) {
                var b = Erizo.RoomEvent({
                    type: "room-disconnected"
                });
                a.dispatchEvent(b)
            }
        });
        e("token", c, j, l)
    };
    e = function(b, c, d, e) {
        a.socket.emit(b, c, function(a, b) {
            "success" === a ? void 0 !== d && d(b) : void 0 !== e && e(b)
        })
    };
    d = function(b, c, d, e) {
        a.socket.emit(b, c, d, function(a, b) {
            void 0 !== e && e(a, b)
        })
    };
    a.connect = function() {
        var f = L.Base64.decodeBase64(b.token);
        0 !== a.state && L.Logger.error("Room already connected");
        a.state = 1;
        c(JSON.parse(f), function(c) {
            var f = 0,
                d = [],
                e, g, h;
            e = c.streams;
            a.p2p = c.p2p;
            g = c.id;
            a.stunServerUrl = c.stunServerUrl;
            a.turnServer = c.turnServer;
            a.state = 2;
            b.defaultVideoBW = c.defaultVideoBW;
            b.maxVideoBW = c.maxVideoBW;
            for (f in e) e.hasOwnProperty(f) && (h = e[f], c = Erizo.Stream({
                streamID: h.id,
                local: !1,
                audio: h.audio,
                video: h.video,
                data: h.data,
                screen: h.screen,
                attributes: h.attributes
            }), d.push(c), a.remoteStreams[h.id] = c);
            a.roomID = g;
            L.Logger.info("Connected to room " + a.roomID);
            f = Erizo.RoomEvent({
                type: "room-connected",
                streams: d
            });
            a.dispatchEvent(f)
        }, function(a) {
            L.Logger.error("Not Connected! Error: " + a)
        })
    };
    a.disconnect = function() {
        var b = Erizo.RoomEvent({
            type: "room-disconnected"
        });
        a.dispatchEvent(b)
    };
    a.publish = function(c, e, l, m) {
        e = e || {};
        e.maxVideoBW = e.maxVideoBW || b.defaultVideoBW;
        e.maxVideoBW > b.maxVideoBW && (e.maxVideoBW = b.maxVideoBW);
        if (c.local && void 0 === a.localStreams[c.getID()])
            if (c.hasAudio() || c.hasVideo() || c.hasScreen())
                if (void 0 !== c.url || void 0 !== c.recording) {
                    var i;
                    c.url ? (e = "url", i = c.url) : (e = "recording", i = c.recording);
                    d("publish", {
                        state: e,
                        data: c.hasData(),
                        audio: c.hasAudio(),
                        video: c.hasVideo(),
                        screen: c.hasScreen(),
                        attributes: c.getAttributes()
                    }, i, function(b, d) {
                        if (b === "success") {
                            L.Logger.info("Stream published");
                            c.getID = function() {
                                return d
                            };
                            c.sendData = function(a) {
                                g(c, a)
                            };
                            c.setAttributes = function(a) {
                                h(c, a)
                            };
                            a.localStreams[d] = c;
                            c.room = a;
                            l && l()
                        } else {
                            L.Logger.info("Error when publishing the stream", b);
                            m && m(b)
                        }
                    })
                } else a.p2p ? (b.maxAudioBW = e.maxAudioBW, b.maxVideoBW = e.maxVideoBW, d("publish", {
                    state: "p2p",
                    data: c.hasData(),
                    audio: c.hasAudio(),
                    video: c.hasVideo(),
                    screen: c.hasScreen(),
                    attributes: c.getAttributes()
                }, void 0, function(b, d) {
                    b === "error" && m && m(b);
                    L.Logger.info("Stream published");
                    c.getID = function() {
                        return d
                    };
                    if (c.hasData()) c.sendData = function(a) {
                        g(c, a)
                    };
                    c.setAttributes = function(a) {
                        h(c, a)
                    };
                    a.localStreams[d] = c;
                    c.room = a
                })) : (c.pc = Erizo.Connection({
                    callback: function(b) {
                        d("publish", {
                            state: "offer",
                            data: c.hasData(),
                            audio: c.hasAudio(),
                            video: c.hasVideo(),
                            screen: c.hasScreen(),
                            attributes: c.getAttributes()
                        }, b, function(b, e) {
                            if (b === "error") m && m(b);
                            else {
                                c.pc.onsignalingmessage = function(b) {
                                    c.pc.onsignalingmessage =
                                        function() {};
                                    d("publish", {
                                        state: "ok",
                                        streamId: e,
                                        data: c.hasData(),
                                        audio: c.hasAudio(),
                                        video: c.hasVideo(),
                                        screen: c.hasScreen(),
                                        attributes: c.getAttributes()
                                    }, b);
                                    L.Logger.info("Stream published");
                                    c.getID = function() {
                                        return e
                                    };
                                    if (c.hasData()) c.sendData = function(a) {
                                        g(c, a)
                                    };
                                    c.setAttributes = function(a) {
                                        h(c, a)
                                    };
                                    a.localStreams[e] = c;
                                    c.room = a
                                };
                                c.pc.processSignalingMessage(b)
                            }
                        })
                    },
                    stunServerUrl: a.stunServerUrl,
                    turnServer: a.turnServer,
                    maxAudioBW: e.maxAudioBW,
                    maxVideoBW: e.maxVideoBW
                }), c.pc.addStream(c.stream));
        else c.hasData() &&
            d("publish", {
                state: "data",
                data: c.hasData(),
                audio: !1,
                video: !1,
                screen: !1,
                attributes: c.getAttributes()
            }, void 0, function(b, d) {
                if (b === "error") m && m(b);
                else {
                    L.Logger.info("Stream published");
                    c.getID = function() {
                        return d
                    };
                    c.sendData = function(a) {
                        g(c, a)
                    };
                    c.setAttributes = function(a) {
                        h(c, a)
                    };
                    a.localStreams[d] = c;
                    c.room = a
                }
            })
    };
    a.startRecording = function(a, b, c) {
        L.Logger.debug("Start Recording streamaa: " + a.getID());
        e("startRecorder", {
            to: a.getID()
        }, b, c)
    };
    a.stopRecording = function(a, b, c) {
        e("stopRecorder", {
            id: a
        }, b, c)
    };
    a.unpublish = function(b) {
        if (b.local) {
            e("unpublish", b.getID());
            b.room = void 0;
            if ((b.hasAudio() || b.hasVideo() || b.hasScreen()) && void 0 === b.url) b.pc.close(), b.pc = void 0;
            delete a.localStreams[b.getID()];
            b.getID = function() {};
            b.sendData = function() {};
            b.setAttributes = function() {}
        }
    };
    a.subscribe = function(b, c, e) {
        c = c || {};
        if (!b.local) {
            if (b.hasVideo() || b.hasAudio() || b.hasScreen()) a.p2p ? d("subscribe", {
                streamId: b.getID()
            }) : (b.pc = Erizo.Connection({
                callback: function(a) {
                    d("subscribe", {
                        streamId: b.getID(),
                        audio: c.audio,
                        video: c.video,
                        data: c.data
                    }, a, function(a) {
                        "error" === a ? e && e(a) : (a.match(/a=ssrc:55543/) && (a = a.replace(/a=sendrecv\\r\\na=mid:video/, "a=recvonly\\r\\na=mid:video"), a = a.split("a=ssrc:55543")[0] + '"}'), b.pc.processSignalingMessage(a))
                    })
                },
                nop2p: !0,
                audio: b.hasAudio(),
                video: b.hasVideo(),
                stunServerUrl: a.stunServerUrl,
                turnServer: a.turnServer
            }), b.pc.onaddstream = function(c) {
                L.Logger.info("Stream subscribed");
                b.stream = c.stream;
                c = Erizo.StreamEvent({
                    type: "stream-subscribed",
                    stream: b
                });
                a.dispatchEvent(c)
            });
            else if (b.hasData() &&
                !1 !== c.data) d("subscribe", {
                streamId: b.getID(),
                data: c.data
            }, void 0, function(c) {
                "error" === c ? e && e(c) : (L.Logger.info("Stream subscribed"), c = Erizo.StreamEvent({
                    type: "stream-subscribed",
                    stream: b
                }), a.dispatchEvent(c))
            });
            else {
                L.Logger.info("Subscribing to anything");
                return
            }
            L.Logger.info("Subscribing to: " + b.getID())
        }
    };
    a.unsubscribe = function(b, c) {
        void 0 !== a.socket && (b.local || e("unsubscribe", b.getID(), function() {
            "error" === answer ? c && c(answer) : i(b)
        }, function() {
            L.Logger.error("Error calling unsubscribe.")
        }))
    };
    a.getStreamsByAttribute = function(b, c) {
        var d = [],
            e, g;
        for (e in a.remoteStreams) a.remoteStreams.hasOwnProperty(e) && (g = a.remoteStreams[e], void 0 !== g.getAttributes() && void 0 !== g.getAttributes()[b] && g.getAttributes()[b] === c && d.push(g));
        return d
    };
    return a
};
var L = L || {};
L.Logger = function(b) {
    return {
        DEBUG: 0,
        TRACE: 1,
        INFO: 2,
        WARNING: 3,
        ERROR: 4,
        NONE: 5,
        enableLogPanel: function() {
            b.Logger.panel = document.createElement("textarea");
            b.Logger.panel.setAttribute("id", "licode-logs");
            b.Logger.panel.setAttribute("style", "width: 100%; height: 100%; display: none");
            b.Logger.panel.setAttribute("rows", 20);
            b.Logger.panel.setAttribute("cols", 20);
            b.Logger.panel.setAttribute("readOnly", !0);
            document.body.appendChild(b.Logger.panel)
        },
        setLogLevel: function(a) {
            a > b.Logger.NONE ? a = b.Logger.NONE : a <
                b.Logger.DEBUG && (a = b.Logger.DEBUG);
            b.Logger.logLevel = a
        },
        log: function(a) {
            var c = "";
            if (!(a < b.Logger.logLevel)) {
                a === b.Logger.DEBUG ? c += "DEBUG" : a === b.Logger.TRACE ? c += "TRACE" : a === b.Logger.INFO ? c += "INFO" : a === b.Logger.WARNING ? c += "WARNING" : a === b.Logger.ERROR && (c += "ERROR");
                for (var c = c + ": ", e = [], d = 0; d < arguments.length; d++) e[d] = arguments[d];
                e = e.slice(1);
                e = [c].concat(e);
                if (void 0 !== b.Logger.panel) {
                    c = "";
                    for (d = 0; d < e.length; d++) c += e[d];
                    b.Logger.panel.value = b.Logger.panel.value + "\n" + c
                } else console.log.apply(console,
                    e)
            }
        },
        debug: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.DEBUG].concat(a))
        },
        trace: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.TRACE].concat(a))
        },
        info: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.INFO].concat(a))
        },
        warning: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.WARNING].concat(a))
        },
        error: function() {
            for (var a = [], c = 0; c < arguments.length; c++) a[c] = arguments[c];
            b.Logger.log.apply(b.Logger, [b.Logger.ERROR].concat(a))
        }
    }
}(L);
L = L || {};
L.Base64 = function() {
    var b, a, c, e, d, g, h, i, f;
    b = "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,0,1,2,3,4,5,6,7,8,9,+,/".split(",");
    a = [];
    for (d = 0; d < b.length; d += 1) a[b[d]] = d;
    g = function(a) {
        c = a;
        e = 0
    };
    h = function() {
        var a;
        if (!c || e >= c.length) return -1;
        a = c.charCodeAt(e) & 255;
        e += 1;
        return a
    };
    i = function() {
        if (!c) return -1;
        for (;;) {
            if (e >= c.length) return -1;
            var b = c.charAt(e);
            e += 1;
            if (a[b]) return a[b];
            if ("A" === b) return 0
        }
    };
    f = function(a) {
        a = a.toString(16);
        1 === a.length && (a =
            "0" + a);
        return unescape("%" + a)
    };
    return {
        encodeBase64: function(a) {
            var c, d, e;
            g(a);
            a = "";
            c = Array(3);
            d = 0;
            for (e = !1; !e && -1 !== (c[0] = h());)
                if (c[1] = h(), c[2] = h(), a += b[c[0] >> 2], -1 !== c[1] ? (a += b[c[0] << 4 & 48 | c[1] >> 4], -1 !== c[2] ? (a += b[c[1] << 2 & 60 | c[2] >> 6], a += b[c[2] & 63]) : (a += b[c[1] << 2 & 60], a += "=", e = !0)) : (a += b[c[0] << 4 & 48], a += "=", a += "=", e = !0), d += 4, 76 <= d) a += "\n", d = 0;
            return a
        },
        decodeBase64: function(a) {
            var b, c;
            g(a);
            a = "";
            b = Array(4);
            for (c = !1; !c && -1 !== (b[0] = i()) && -1 !== (b[1] = i());) b[2] = i(), b[3] = i(), a += f(b[0] << 2 & 255 | b[1] >> 4), -1 !==
                b[2] ? (a += f(b[1] << 4 & 255 | b[2] >> 2), -1 !== b[3] ? a += f(b[2] << 6 & 255 | b[3]) : c = !0) : c = !0;
            return a
        }
    }
}(L);
(function() {
    function b() {
        (new L.ElementQueries).init()
    }
    this.L = this.L || {};
    this.L.ElementQueries = function() {
        function a(a) {
            a || (a = document.documentElement);
            a = getComputedStyle(a, "fontSize");
            return parseFloat(a) || 16
        }

        function b(c, d) {
            var e = d.replace(/[0-9]*/, ""),
                d = parseFloat(d);
            switch (e) {
                case "px":
                    return d;
                case "em":
                    return d * a(c);
                case "rem":
                    return d * a();
                case "vw":
                    return d * document.documentElement.clientWidth / 100;
                case "vh":
                    return d * document.documentElement.clientHeight / 100;
                case "vmin":
                case "vmax":
                    return d *
                        (0, Math["vmin" === e ? "min" : "max"])(document.documentElement.clientWidth / 100, document.documentElement.clientHeight / 100);
                default:
                    return d
            }
        }

        function e(a) {
            this.element = a;
            this.options = [];
            var d, e, g, h = 0,
                i = 0,
                p, u, v, w, o;
            this.addOption = function(a) {
                this.options.push(a)
            };
            var s = ["min-width", "min-height", "max-width", "max-height"];
            this.call = function() {
                h = this.element.offsetWidth;
                i = this.element.offsetHeight;
                v = {};
                d = 0;
                for (e = this.options.length; d < e; d++) g = this.options[d], p = b(this.element, g.value), u = "width" == g.property ? h :
                    i, o = g.mode + "-" + g.property, w = "", "min" == g.mode && u >= p && (w += g.value), "max" == g.mode && u <= p && (w += g.value), v[o] || (v[o] = ""), w && -1 === (" " + v[o] + " ").indexOf(" " + w + " ") && (v[o] += " " + w);
                for (var a in s) v[s[a]] ? this.element.setAttribute(s[a], v[s[a]].substr(1)) : this.element.removeAttribute(s[a])
            }
        }

        function d(a, b) {
            a.elementQueriesSetupInformation ? a.elementQueriesSetupInformation.addOption(b) : (a.elementQueriesSetupInformation = new e(a), a.elementQueriesSetupInformation.addOption(b), new ResizeSensor(a, function() {
                a.elementQueriesSetupInformation.call()
            }));
            a.elementQueriesSetupInformation.call()
        }

        function g(a) {
            for (var b, a = a.replace(/'/g, '"'); null !== (b = i.exec(a));)
                if (5 < b.length) {
                    var c = b[1] || b[5],
                        e = b[2],
                        g = b[3];
                    b = b[4];
                    var h = void 0;
                    document.querySelectorAll && (h = document.querySelectorAll.bind(document));
                    !h && "undefined" !== typeof $$ && (h = $$);
                    !h && "undefined" !== typeof jQuery && (h = jQuery);
                    if (!h) throw "No document.querySelectorAll, jQuery or Mootools's $$ found.";
                    for (var c = h(c), h = 0, p = c.length; h < p; h++) d(c[h], {
                        mode: e,
                        property: g,
                        value: b
                    })
                }
        }

        function h(a) {
            var b = "";
            if (a)
                if ("string" ===
                    typeof a) a = a.toLowerCase(), (-1 !== a.indexOf("min-width") || -1 !== a.indexOf("max-width")) && g(a);
                else
                    for (var c = 0, d = a.length; c < d; c++) 1 === a[c].type ? (b = a[c].selectorText || a[c].cssText, -1 !== b.indexOf("min-height") || -1 !== b.indexOf("max-height") ? g(b) : (-1 !== b.indexOf("min-width") || -1 !== b.indexOf("max-width")) && g(b)) : 4 === a[c].type && h(a[c].cssRules || a[c].rules)
        }
        var i = /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;
        this.init = function() {
            for (var a = 0, b = document.styleSheets.length; a <
                b; a++) h(document.styleSheets[a].cssText || document.styleSheets[a].cssRules || document.styleSheets[a].rules)
        }
    };
    window.addEventListener ? window.addEventListener("load", b, !1) : window.attachEvent("onload", b);
    this.L.ResizeSensor = function(a, b) {
        function e(a, b) {
            window.OverflowEvent ? a.addEventListener("overflowchanged", function(a) {
                b.call(this, a)
            }) : (a.addEventListener("overflow", function(a) {
                b.call(this, a)
            }), a.addEventListener("underflow", function(a) {
                b.call(this, a)
            }))
        }

        function d() {
            this.q = [];
            this.add = function(a) {
                this.q.push(a)
            };
            var a, b;
            this.call = function() {
                a = 0;
                for (b = this.q.length; a < b; a++) this.q[a].call()
            }
        }

        function g(a, b) {
            function c() {
                var b = !1,
                    d = a.resizeSensor.offsetWidth,
                    e = a.resizeSensor.offsetHeight;
                h != d && (p.width = d - 1 + "px", u.width = d + 1 + "px", b = !0, h = d);
                i != e && (p.height = e - 1 + "px", u.height = e + 1 + "px", b = !0, i = e);
                return b
            }
            if (a.resizedAttached) {
                if (a.resizedAttached) {
                    a.resizedAttached.add(b);
                    return
                }
            } else a.resizedAttached = new d, a.resizedAttached.add(b);
            var g = function() {
                c() && a.resizedAttached.call()
            };
            a.resizeSensor = document.createElement("div");
            a.resizeSensor.className = "resize-sensor";
            a.resizeSensor.style.cssText = "position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;";
            a.resizeSensor.innerHTML = '<div class="resize-sensor-overflow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;"><div></div></div><div class="resize-sensor-underflow" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; overflow: hidden; z-index: -1;"><div></div></div>';
            a.appendChild(a.resizeSensor);
            if ("absolute" !== (a.currentStyle ? a.currentStyle.position : window.getComputedStyle ? window.getComputedStyle(a, null).getPropertyValue("position") : a.style.position)) a.style.position = "relative";
            var h = -1,
                i = -1,
                p = a.resizeSensor.firstElementChild.firstChild.style,
                u = a.resizeSensor.lastElementChild.firstChild.style;
            c();
            e(a.resizeSensor, g);
            e(a.resizeSensor.firstElementChild, g);
            e(a.resizeSensor.lastElementChild, g)
        }
        if ("array" === typeof a || "undefined" !== typeof jQuery && a instanceof jQuery || "undefined" !== typeof Elements &&
            a instanceof Elements)
            for (var h = 0, i = a.length; h < i; h++) g(a[h], b);
        else g(a, b)
    }
})();
Erizo = Erizo || {};
Erizo.View = function() {
    var b = Erizo.EventDispatcher({});
    b.url = "http://chotis2.dit.upm.es:3000";
    return b
};
Erizo = Erizo || {};
Erizo.VideoPlayer = function(b) {
    var a = Erizo.View({});
    a.id = b.id;
    a.stream = b.stream.stream;
    a.elementID = b.elementID;
    a.destroy = function() {
        a.video.pause();
        delete a.resizer;
        a.parentNode.removeChild(a.div)
    };
    a.resize = function() {
        var c = a.container.offsetWidth,
            e = a.container.offsetHeight;
        if (b.stream.screen || !1 === b.options.crop) 0.75 * c < e ? (a.video.style.width = c + "px", a.video.style.height = 0.75 * c + "px", a.video.style.top = -(0.75 * c / 2 - e / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = e + "px", a.video.style.width = 4 / 3 *
            e + "px", a.video.style.left = -(4 / 3 * e / 2 - c / 2) + "px", a.video.style.top = "0px");
        else if (c !== a.containerWidth || e !== a.containerHeight) 0.75 * c > e ? (a.video.style.width = c + "px", a.video.style.height = 0.75 * c + "px", a.video.style.top = -(0.75 * c / 2 - e / 2) + "px", a.video.style.left = "0px") : (a.video.style.height = e + "px", a.video.style.width = 4 / 3 * e + "px", a.video.style.left = -(4 / 3 * e / 2 - c / 2) + "px", a.video.style.top = "0px");
        a.containerWidth = c;
        a.containerHeight = e
    };
    L.Logger.debug("Creating URL from stream " + a.stream);
    a.stream_url = (window.URL ||
        webkitURL).createObjectURL(a.stream);
    a.div = document.createElement("div");
    a.div.setAttribute("id", "player_" + a.id);
    a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;");
    a.loader = document.createElement("img");
    a.loader.setAttribute("style", "width: 16px; height: 16px; position: absolute; top: 50%; left: 50%; margin-top: -8px; margin-left: -8px");
    a.loader.setAttribute("id", "back_" + a.id);
    a.loader.setAttribute("src", a.url + "/assets/loader.gif");
    a.video = document.createElement("video");
    a.video.setAttribute("id", "stream" + a.id);
    a.video.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.video.setAttribute("autoplay", "autoplay");
    b.stream.local && (a.video.volume = 0);
    void 0 !== a.elementID ? (document.getElementById(a.elementID).appendChild(a.div), a.container = document.getElementById(a.elementID)) : (document.body.appendChild(a.div), a.container = document.body);
    a.parentNode = a.div.parentNode;
    a.div.appendChild(a.loader);
    a.div.appendChild(a.video);
    a.containerWidth = 0;
    a.containerHeight = 0;
    a.resizer = new L.ResizeSensor(a.container, a.resize);
    a.resize();
    a.bar = new Erizo.Bar({
        elementID: "player_" + a.id,
        id: a.id,
        stream: b.stream,
        media: a.video,
        options: b.options
    });
    a.div.onmouseover = function() {
        a.bar.display()
    };
    a.div.onmouseout = function() {
        a.bar.hide()
    };
    a.video.src = a.stream_url;
    return a
};
Erizo = Erizo || {};
Erizo.AudioPlayer = function(b) {
    var a = Erizo.View({}),
        c, e;
    a.id = b.id;
    a.stream = b.stream.stream;
    a.elementID = b.elementID;
    L.Logger.debug("Creating URL from stream " + a.stream);
    a.stream_url = (window.URL || webkitURL).createObjectURL(a.stream);
    a.audio = document.createElement("audio");
    a.audio.setAttribute("id", "stream" + a.id);
    a.audio.setAttribute("style", "width: 100%; height: 100%; position: absolute");
    a.audio.setAttribute("autoplay", "autoplay");
    b.stream.local && (a.audio.volume = 0);
    b.stream.local && (a.audio.volume = 0);
    void 0 !== a.elementID ? (a.destroy = function() {
        a.audio.pause();
        a.parentNode.removeChild(a.div)
    }, c = function() {
        a.bar.display()
    }, e = function() {
        a.bar.hide()
    }, a.div = document.createElement("div"), a.div.setAttribute("id", "player_" + a.id), a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; overflow: hidden;"), document.getElementById(a.elementID).appendChild(a.div), a.container = document.getElementById(a.elementID), a.parentNode = a.div.parentNode, a.div.appendChild(a.audio), a.bar = new Erizo.Bar({
        elementID: "player_" +
            a.id,
        id: a.id,
        stream: b.stream,
        media: a.audio,
        options: b.options
    }), a.div.onmouseover = c, a.div.onmouseout = e) : (a.destroy = function() {
        a.audio.pause();
        a.parentNode.removeChild(a.audio)
    }, document.body.appendChild(a.audio), a.parentNode = document.body);
    a.audio.src = a.stream_url;
    return a
};
Erizo = Erizo || {};
Erizo.Bar = function(b) {
    var a = Erizo.View({}),
        c, e;
    a.elementID = b.elementID;
    a.id = b.id;
    a.div = document.createElement("div");
    a.div.setAttribute("id", "bar_" + a.id);
    a.bar = document.createElement("div");
    a.bar.setAttribute("style", "width: 100%; height: 15%; max-height: 30px; position: absolute; bottom: 0; right: 0; background-color: rgba(255,255,255,0.62)");
    a.bar.setAttribute("id", "subbar_" + a.id);
    a.link = document.createElement("a");
    a.link.setAttribute("href", "http://www.lynckia.com/");
    a.link.setAttribute("target", "_blank");
    a.logo = document.createElement("img");
    a.logo.setAttribute("style", "width: 100%; height: 100%; max-width: 30px; position: absolute; top: 0; left: 2px;");
    a.logo.setAttribute("alt", "Lynckia");
    a.logo.setAttribute("src", a.url + "/assets/star.svg");
    e = function(b) {
        "block" !== b ? b = "none" : clearTimeout(c);
        a.div.setAttribute("style", "width: 100%; height: 100%; position: relative; bottom: 0; right: 0; display:" + b)
    };
    a.display = function() {
        e("block")
    };
    a.hide = function() {
        c = setTimeout(e, 1E3)
    };
    document.getElementById(a.elementID).appendChild(a.div);
    a.div.appendChild(a.bar);
    a.bar.appendChild(a.link);
    a.link.appendChild(a.logo);
    if (!b.stream.screen && (void 0 === b.options || void 0 === b.options.speaker || !0 === b.options.speaker)) a.speaker = new Erizo.Speaker({
        elementID: "subbar_" + a.id,
        id: a.id,
        stream: b.stream,
        media: b.media
    });
    a.display();
    a.hide();
    return a
};
Erizo = Erizo || {};
Erizo.Speaker = function(b) {
    var a = Erizo.View({}),
        c, e, d, g = 50;
    a.elementID = b.elementID;
    a.media = b.media;
    a.id = b.id;
    a.stream = b.stream;
    a.div = document.createElement("div");
    a.div.setAttribute("style", "width: 40%; height: 100%; max-width: 32px; position: absolute; right: 0;z-index:0;");
    a.icon = document.createElement("img");
    a.icon.setAttribute("id", "volume_" + a.id);
    a.icon.setAttribute("src", a.url + "/assets/sound48.png");
    a.icon.setAttribute("style", "width: 80%; height: 100%; position: absolute;");
    a.div.appendChild(a.icon);
    a.stream.local ? (e = function() {
        a.media.muted = !0;
        a.icon.setAttribute("src", a.url + "/assets/mute48.png");
        a.stream.stream.getAudioTracks()[0].enabled = !1
    }, d = function() {
        a.media.muted = !1;
        a.icon.setAttribute("src", a.url + "/assets/sound48.png");
        a.stream.stream.getAudioTracks()[0].enabled = !0
    }, a.icon.onclick = function() {
        a.media.muted ? d() : e()
    }) : (a.picker = document.createElement("input"), a.picker.setAttribute("id", "picker_" + a.id), a.picker.type = "range", a.picker.min = 0, a.picker.max = 100, a.picker.step = 10, a.picker.value =
        g, a.picker.orient = "vertical", a.div.appendChild(a.picker), a.media.volume = a.picker.value / 100, a.media.muted = !1, a.picker.oninput = function() {
            0 < a.picker.value ? (a.media.muted = !1, a.icon.setAttribute("src", a.url + "/assets/sound48.png")) : (a.media.muted = !0, a.icon.setAttribute("src", a.url + "/assets/mute48.png"));
            a.media.volume = a.picker.value / 100
        }, c = function(b) {
            a.picker.setAttribute("style", "width: 32px; height: 100px; position: absolute; bottom: 90%; z-index: 1;" + a.div.offsetHeight + "px; right: 0px; -webkit-appearance: slider-vertical; display: " +
                b)
        }, e = function() {
            a.icon.setAttribute("src", a.url + "/assets/mute48.png");
            g = a.picker.value;
            a.picker.value = 0;
            a.media.volume = 0;
            a.media.muted = !0
        }, d = function() {
            a.icon.setAttribute("src", a.url + "/assets/sound48.png");
            a.picker.value = g;
            a.media.volume = a.picker.value / 100;
            a.media.muted = !1
        }, a.icon.onclick = function() {
            a.media.muted ? d() : e()
        }, a.div.onmouseover = function() {
            c("block")
        }, a.div.onmouseout = function() {
            c("none")
        }, c("none"));
    document.getElementById(a.elementID).appendChild(a.div);
    return a
};
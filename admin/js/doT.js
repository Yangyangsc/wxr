/* Laura Doktorova https://github.com/olado/doT */
!function () {
    "use strict";
    function e(n, t, r) {
        return ("string" == typeof t ? t : t.toString()).replace(n.define || a, function (e, t, o, a) {
            return 0 === t.indexOf("def.") && (t = t.substring(4)), t in r || (":" === o ? (n.defineParams && a.replace(n.defineParams, function (e, n, o) {
                r[t] = { arg: n, text: o }
            }), t in r || (r[t] = a)) : new Function("def", "def['" + t + "']=" + a)(r)), ""
        }).replace(n.use || a, function (t, o) {
            n.useParams && (o = o.replace(n.useParams, function (e, n, t, o) {
                if (r[t] && r[t].arg && o) {
                    var a = (t + ":" + o).replace(/'|\\/g, "_");
                    return r.__exp = r.__exp || {}, r.__exp[a] = r[t].text.replace(new RegExp("(^|[^\\w$])" + r[t].arg + "([^\\w$])", "g"), "$1" + o + "$2"), n + "def.__exp['" + a + "']"
                }
            }));
            var a = new Function("def", "return " + o)(r);
            return a ? e(n, a, r) : a
        })
    }
    function n(e) {
        return e.replace(/\\('|\\)/g, "$1").replace(/[\r\t\n]/g, " ")
    }
    var t, r = {
        engine: "doT", version: "1.1.1", templateSettings: {
            evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g, interpolate: /\{\{=([\s\S]+?)\}\}/g, encode: /\{\{!([\s\S]+?)\}\}/g, use: /\{\{#([\s\S]+?)\}\}/g, useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g, define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g, defineParams: /^\s*([\w$]+):([\s\S]+)/, conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g, iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g, varname: "it", strip: !0, append: !0, selfcontained: !1, doNotSkipEncoded: !1
        }, template: void 0, compile: void 0, log: !0
    };
    r.encodeHTMLSource = function (e) {
        var n = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" }, t = e ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
        return function (e) {
            return e ? e.toString().replace(t, function (e) { return n[e] || e }) : ""
        }
    }, t = function () {
        return this || (0, eval)("this")
    }(), "undefined" != typeof module && module.exports ? module.exports = r : "function" == typeof define && define.amd ? define(function () { return r }) : t.doT = r;
    var o = { append: { start: "'+(", end: ")+'", startencode: "'+encodeHTML(" }, split: { start: "';out+=(", end: ");out+='", startencode: "';out+=encodeHTML(" } }, a = /$^/; r.template = function (c, i, u) {
        i = i || r.templateSettings; var d, s, p = i.append ? o.append : o.split, l = 0, f = i.use || i.define ? e(i, c, u || {}) : c;
        f = ("var out='" + (i.strip ? f.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g, " ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g, "") : f).replace(/'|\\/g, "\\$&").replace(i.interpolate || a, function (e, t) {
            return p.start + n(t) + p.end
        }).replace(i.encode || a, function (e, t) { return d = !0, p.startencode + n(t) + p.end }).replace(i.conditional || a, function (e, t, r) { return t ? r ? "';}else if(" + n(r) + "){out+='" : "';}else{out+='" : r ? "';if(" + n(r) + "){out+='" : "';}out+='" }).replace(i.iterate || a, function (e, t, r, o) {
            return t ? (l += 1, s = o || "i" + l, t = n(t), "';var arr" + l + "=" + t + ";if(arr" + l + "){var " + r + "," + s + "=-1,l" + l + "=arr" + l + ".length-1;while(" + s + "<l" + l + "){" + r + "=arr" + l + "[" + s + "+=1];out+='") : "';} } out+='"
        }).replace(i.evaluate || a, function (e, t) { return "';" + n(t) + "out+='" }) + "';return out;").replace(/\n/g, "\\n").replace(/\t/g, "\\t").replace(/\r/g, "\\r").replace(/(\s|;|\}|^|\{)out\+='';/g, "$1").replace(/\+''/g, ""), d && (i.selfcontained || !t || t._encodeHTML || (t._encodeHTML = r.encodeHTMLSource(i.doNotSkipEncoded)), f = "var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : (" + r.encodeHTMLSource.toString() + "(" + (i.doNotSkipEncoded || "") + "));" + f);
        try { return new Function(i.varname, f) } catch (e) {
            throw "undefined" != typeof console && console.log("Could not create a template function: " + f), e
        }
    }, r.compile = function (e, n) { return r.template(e, null, n) }
}();
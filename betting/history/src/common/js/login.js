// 获得subp中的登录信息
window.__ctLoginInfo = function () {
  var ctLoginInfo = {
    isLogin: false,
    uid: ''
  };

  var getCookie = function (name) {
    var Res = (new RegExp(name + "=([^;]+)")).exec(document.cookie);
    return Res == null ? null : Res[1]
  };

  var ctSinaSSOEncoder = {};
  ctSinaSSOEncoder.base64 = {
    encode: function (n) {
      n = "" + n;
      if (n == "") {
        return ""
      }
      var l = "";
      var u, s, q = "";
      var t, r, p, o = "";
      var m = 0;
      do {
        u = n.charCodeAt(m++);
        s = n.charCodeAt(m++);
        q = n.charCodeAt(m++);
        t = u >> 2;
        r = ((u & 3) << 4) | (s >> 4);
        p = ((s & 15) << 2) | (q >> 6);
        o = q & 63;
        if (isNaN(s)) {
          p = o = 64
        } else {
          if (isNaN(q)) {
            o = 64
          }
        }
        l = l + this._keys.charAt(t) + this._keys.charAt(r) + this._keys.charAt(p) + this._keys.charAt(o);
        u = s = q = "";
        t = r = p = o = ""
      } while (m < n.length);
      return l
    },
    decode: function (t, q, m) {
      var s = function (C, E) {
        for (var D = 0; D < C.length; D++) {
          if (C[D] === E) {
            return D
          }
        }
        return -1
      };
      if (typeof (t) == "string") {
        t = t.split("")
      }
      var n = [];
      var B, z, w = "";
      var A, y, v, u = "";
      if (t.length % 4 != 0) {
      }
      var l = /[^A-Za-z0-9+\/=]/;
      var x = this._keys.split("");
      if (q == "urlsafe") {
        l = /[^A-Za-z0-9-_=]/;
        x = this._keys_urlsafe.split("")
      }
      if (q == "subp_v2") {
        l = /[^A-Za-z0-9_=-]/;
        x = this._subp_v2_keys.split("")
      }
      if (q == "subp_v3_3") {
        l = /[^A-Za-z0-9-_.-]/;
        x = this._subp_v3_keys_3.split("")
      }
      var p = 0;
      if (q == "binnary") {
        x = [];
        for (p = 0; p <= 64; p++) {
          x[p] = p + 128
        }
      }
      if (q != "binnary" && l.test(t.join(""))) {
        return m == "array" ? [] : ""
      }
      p = 0;
      do {
        A = s(x, t[p++]);
        y = s(x, t[p++]);
        v = s(x, t[p++]);
        u = s(x, t[p++]);
        B = (A << 2) | (y >> 4);
        z = ((y & 15) << 4) | (v >> 2);
        w = ((v & 3) << 6) | u;
        n.push(B);
        if (v != 64 && v != -1) {
          n.push(z)
        }
        if (u != 64 && u != -1) {
          n.push(w)
        }
        B = z = w = "";
        A = y = v = u = ""
      } while (p < t.length);
      if (m == "array") {
        return n
      }
      var r = ""
        , o = 0;
      for (; o < n.lenth; o++) {
        r += String.fromCharCode(n[o])
      }
      return r
    },
    _keys: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    _keys_urlsafe: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=",
    _subp_v2_keys: "uAL715W8e3jJCcNU0lT_FSXVgxpbEDdQ4vKaIOH2GBPtfzqsmYZo-wRM9i6hynrk=",
    _subp_v3_keys_3: "5WFh28sGziZTeS1lBxCK-HgPq9IdMUwknybo.LJrQD3uj_Va7pE0XfcNR4AOYvm6t"
  };
  ctSinaSSOEncoder.getSUBPCookie = {
    __parse: function (o) {
      var y, m, p, n, x, r = 0, q, t = {}, l = "", u = "";
      if (!o) {
        return t
      }
      do {
        m = o[r];
        y = ++r;
        for (q = r; q < m + y; q++,
          r++) {
          l += String.fromCharCode(o[q])
        }
        n = o[r];
        y = ++r;
        if (l == "status" || l == "flag") {
          for (q = r; q < n + y; q++,
            r++) {
            u += o[q]
          }
        } else {
          u = o.slice(y, n + y);
          try {
            u = j(u)
          } catch (w) {
            u = ""
          }
          r += n
        }
        t[l] = u;
        l = "";
        u = ""
      } while (r < o.length);
      return t
    },
    decode: function (o) {
      var n = [], p, m = o.substr(0, 3), l = decodeURIComponent(o.substr(3));
      switch (m) {
        case "002":
          n = sinaSSOEncoder.base64.decode(l, "subp_v2", "array");
          return sinaSSOEncoder.getSUBPCookie.__parse(n);
        case "003":
          p = l.substr(0, 1);
          l = l.substr(1);
          n = sinaSSOEncoder.base64.decode(l, "subp_v3_" + p, "array");
          return sinaSSOEncoder.getSUBPCookie.__parse(n);
        default:
          return decodeURIComponent(o)
      }
    }
  }
  ctSinaSSOEncoder.getSinaCookie = function (strict) {
    var subp = getCookie("SUBP");
    if (!subp) {
      return null
    }
    var arrSubp = sinaSSOEncoder.getSUBPCookie.decode(subp);
    try {
      arrSubp.uid = arrSubp.uid.replace(/(^\s*)|(\s*$)/g, "");
      if (arrSubp.uid) {
        ctLoginInfo.isLogin = true;
        ctLoginInfo.uid = arrSubp.uid;
      }
    } catch (err) {
      return null
    }
    return arrSubp
  };

  ctSinaSSOEncoder.getSinaCookie();

  return ctLoginInfo;
};
window.curCtLoginInfo = window.__ctLoginInfo();


window.util = {};
util.alert = function(msg,callback){
  alert(msg);
  callback&&callback();
};
util.debug = false;
util.log = function () {
  if (util.debug) {
    console.log.apply(console, arguments);
  }
};
util.windowOpen = function (url, target) {
  var a = document.createElement("a");
  a.setAttribute("href", url);
  if (target == null) {
    target = '_blank';
  }
  a.setAttribute("target", target);
  document.body.appendChild(a);
  if (a.click) {
    a.click();
  } else {
    try {
      var evt = document.createEvent('Event');
      a.initEvent('click', true, true);
      a.dispatchEvent(evt);
    } catch (e) {
      window.open(url, '_self');
    }
  }
  document.body.removeChild(a);
}
/**
 * 将 Date 转化为指定格式的String
 * @param date Object
 * @param fmt String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * date = date.replace(/-/g,"/"); util.dateFormatFmt(new Date(date),"MM月dd日")
 * util.dateFormatFmt( new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * util.dateFormatFmt( new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */

util.dateFormatFmt = function (date, fmt) {
  if (Object.prototype.toString.call(date) == "[object String]") {
    date = date.replace(/-/g, '/');
  }
  date = new Date(date);
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
util.WEEK_NAME = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
util.getQueryString = function (name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURIComponent(r[2]);
  return null;
}
util.byId = function (id) {
  return document.getElementById(id)
}

util.toThousands = function(num) {
  var num = (num || 0).toString(), result = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) { result = num + result; }
  return result;
}
// jsonp
util.jsonp = function (url, callback, callbackName) {
  if (!url) {
    return;
  }
  var head = document.getElementsByTagName('head')[0];
  var ojs = util.byId(url);
  ojs && head.removeChild(ojs);
  if (url.indexOf('?') === -1) {
    url += '?callback=';
  } else {
    url += '&callback=';
  }
  url += callbackName;
  var remote_script = document.createElement('script');
  window[callbackName] = function (data) {
    callback && callback(data);
  }
  remote_script.src = url;
  remote_script.id = url;
  remote_script.type = 'text/javascript';
  remote_script.language = "javascript";
  head.appendChild(remote_script);
};
util.jsonp1 = function (json) {
  json.data = json.data || {};
  json.timeout = json.timeout || 0;
  json.callback = json.callback || 'callback';
  var fnName = 'jsonp_' + Math.random();
  fnName = fnName.replace('.', '');
  window[fnName] = function (result) {
    jsonp_timer && clearTimeout(jsonp_timer);
    json.success && json.success(result);
    json.complete && json.complete();
    oHead.removeChild(oS);
    window[fnName] = null;
  };
  json.data[json.callback] = fnName;
  var arr = [];
  for (var i in json.data) {
    arr.push(i + '=' + encodeURIComponent(json.data[i]));
  }
  var sData = arr.join('&');
  var oS = document.createElement('script');
  oS.src = json.url + sData;
  var oHead = document.getElementsByTagName('head')[0];
  oHead.appendChild(oS);
  if (json.timeout) {
    var jsonp_timer = setTimeout(function () {
      json.error && json.error();
      json.complete && json.complete();
      oHead.removeChild(oS);
      window[fnName] = null;
    }, json.timeout);
  }
}
util.extend = function (target, source, deep) {
  target = target || {};
  var sType = typeof source,
    i = 1,
    options;
  if (sType === 'undefined' || sType === 'boolean') {
    deep = sType === 'boolean' ? source : false;
    source = target;
    target = this;
  }
  if (typeof source !== 'object' && Object.prototype.toString.call(source) !== '[object Function]') {
    source = {}
  }
  while (i <= 2) {
    options = i === 1 ? target : source;
    if (options !== null) {
      for (var name in options) {
        var src = target[name],
          copy = options[name];
        if (target === copy) {
          continue
        }
        if (deep && copy && typeof copy === 'object' && !copy.nodeType) {
          target[name] = this.extend(src || (copy.length !== null ? [] : {}), copy, deep)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
    i++
  }
  return target
}

util.viewData = function () {
  var e = 0, l = 0, i = 0, g = 0, f = 0, m = 0;
  var j = window, h = document, k = h.documentElement;
  e = k.clientWidth || h.body.clientWidth || 0;
  l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
  g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
  i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
  f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
  m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
  return {scrollTop: g, scrollLeft: i, documentWidth: f, documentHeight: m, viewWidth: e, viewHeight: l};
};

util.cookie = (function (doc, win) {
  return {
    getItem: function (key) {
      var cookieKey = key + '=';
      var result = '';
      if (doc.cookie.length > 0) {
        var index = doc.cookie.indexOf(cookieKey);
        if (index != -1) {
          index += cookieKey.length;
          var lastIndex = doc.cookie.indexOf(';', index);
          if (lastIndex == -1) {
            lastIndex = doc.cookie.length;
          }
          result = win.decodeURIComponent(doc.cookie.substring(index, lastIndex));
        }
      }
      return result;
    },
    setItem: function (key, value, expiresDays) {
      var time = new Date();
      if (expiresDays) {
        //将time设置为 expiresDays 天以后的时间
        time.setTime(time.getTime() + expiresDays * 24 * 3600 * 1000);
      } else {
        time.setFullYear(time.getFullYear() + 1);
      }

      if (expiresDays == 0) {

        doc.cookie = key + '=' + win.encodeURIComponent(value) + ';';
      } else {

        doc.cookie = key + '=' + win.encodeURIComponent(value) + '; expires=' + time.toGMTString() + ';';
      }

    },
    removeItem: function (key) {
      // alert(key);
      var time = new Date();
      time.setDate(time.getDate() - 1);
      doc.cookie = key + '=0; expires=' + time.toGMTString();
      // alert(util.cookie.getItem("fstar_cityLoc"));
      //   var self = this;
      //   var exp = new Date();
      //   exp.setTime(exp.getTime() + (-1 * 24 * 60 * 60 * 1000));
      //   var cval = self.getItem(key);
      //   alert(cval);
      //   document.cookie = key + "=" + cval + "; expires=" + exp.toGMTString();
      // alert(key);
      // alert(util.cookie.getItem(key));
      var cval = util.cookie.getItem(key);
      if (cval) {
        util.cookie.setItem(key, "0");
      }
    }
  };
})(document, window);

util.storage = (function (doc, win) {
  var localStorage = window.localStorage;
  // 优先使用localStorage
  if (localStorage) {
    return {
      getItem: function (key) {
        return localStorage.getItem(key);
      },
      setItem: function (key, value) {
        // 在一些设备下, setItem之前必须调用removeItem
        localStorage.removeItem(key);
        localStorage.setItem(key, value);
      },
      removeItem: function (key) {
        localStorage.removeItem(key);
      }
    };
  } else {
    return {
      getItem: util.cookie.getItem,
      setItem: util.cookie.setItem,
      removeItem: util.cookie.removeItem
    };
  }
})(document, window);

util.setSinaWbCookie = function (name, value, domain, expires) {
  domain = domain || document.domain;
  if (typeof(expires) == 'undefiend' || expires == null || expires == '') {
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=" + "/" + "; domain=" + domain;
  } else {
    var expTimes = expires * 1000;
    var expDate = new Date();
    expDate.setTime(expDate.getTime() + expTimes);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expDate.toGMTString() + "; path=" + "/" + "; domain=" + domain;
  }
}

util.getSinaWbCookieVal = function (name) {
  var cookieArr = document.cookie.replace(/\s/g, "").split(';');
  for (var i = 0; i < cookieArr.length; i++) {
    var tempObj = cookieArr[i].split('=');
    if (tempObj[0] == name)
      return decodeURIComponent(tempObj[1]);
  }
  return null;
}


function setSinaWbCookie(name, value, domain, expires) {
  domain = domain || document.domain;
  if (typeof(expires) == 'undefiend' || expires == null || expires == '') {
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=" + "/" + "; domain=" + domain;
  } else {
    var expTimes = expires * 1000;
    var expDate = new Date();
    expDate.setTime(expDate.getTime() + expTimes);
    document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + expDate.toGMTString() + "; path=" + "/" + "; domain=" + domain;
  }
}

function getSinaWbCookieVal(name) {
  var cookieArr = document.cookie.replace(/\s/g, "").split(';');
  for (var i = 0; i < cookieArr.length; i++) {
    var tempObj = cookieArr[i].split('=');
    if (tempObj[0] == name)
      return decodeURIComponent(tempObj[1]);
  }
  return null;
}

util.scrollEnd = (function () {
  var timeout = null;
  var _onScrollEnd = null;
  var viewData = function () {
    var e = 0, l = 0, i = 0, g = 0, f = 0, m = 0;
    var j = window, h = document, k = h.documentElement;
    e = k.clientWidth || h.body.clientWidth || 0;
    l = j.innerHeight || k.clientHeight || h.body.clientHeight || 0;
    g = h.body.scrollTop || k.scrollTop || j.pageYOffset || 0;
    i = h.body.scrollLeft || k.scrollLeft || j.pageXOffset || 0;
    f = Math.max(h.body.scrollWidth, k.scrollWidth || 0);
    m = Math.max(h.body.scrollHeight, k.scrollHeight || 0, l);
    return {scrollTop: g, scrollLeft: i, documentWidth: f, documentHeight: m, viewWidth: e, viewHeight: l};
  };

  function _onScroll() {
    if (timeout) {
      window.clearTimeout(timeout);
    }
    timeout = setTimeout(function () {
      checkScrollEnd();
    }, 200);
  }

  function checkScrollEnd() {
    var vd = viewData();
    if (vd.viewHeight + vd.scrollTop + 30 >= vd.documentHeight) {
      _onScrollEnd();
    }
  }

  return function (onScrollEnd, enable) {
    _onScrollEnd = onScrollEnd;
    if (enable) {
      $(window).unbind("scroll");
      $(window).scroll(function (event) {
        _onScroll();
        window.onScrollTab && onScrollTab();
      });
      // window.removeEventListener('scroll', _onScroll, false);
      // window.addEventListener('scroll', _onScroll, false);
    } else {
      // window.removeEventListener('scroll', _onScroll, false);
      $(window).unbind("scroll");
    }
  };
})();

Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
util.leftpad = function (str, len, ch) {
  str = String(str);
  var i = -1;
  if (!ch && ch !== 0) ch = ' ';
  len = len - str.length;
  while (++i < len) {
    str = ch + str;
  }
  return str;
};
util.countDown = function (dateEnd) {
  dateEnd = dateEnd.replace(/-/g, "/");
  var nowtime = new Date();
  var endtime = new Date(dateEnd);
  var lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000);
  // var d = parseInt(lefttime / (24 * 60 * 60));
  // var h = parseInt(lefttime / (60 * 60) % 24);
  var h = parseInt(lefttime / 60 / 60);
  var m = parseInt(lefttime / 60 % 60);
  var s = parseInt(lefttime % 60);
  // d =util.leftpad(d, 2, 0);
  h = util.leftpad(h, 2, 0);
  m = util.leftpad(m, 2, 0);
  s = util.leftpad(s, 2, 0);
  var html = h + ":" + m + ":" + s;
  return {
    dom: html,
    left: lefttime
  };
}

// 微信遮罩提示
window.tapClick = 'ontouchstart' in window ? "tap" : "click";
if (window.navigator.userAgent.toLowerCase().indexOf('micromessenger') >= 0) {
  var $wxbox = $(".wx_box");
  if ($wxbox.length > 0) {
    $wxbox.show();
    $wxbox.on("click", function () {
      $wxbox.hide();
    })
  }
}


util.openApp = function (openUrl, appUrl) {
  //检查app是否打开
  function checkOpen() {
    var _clickTime = +(new Date());

    function check(elsTime) {
      if (elsTime > 3000 || document.hidden || document.webkitHidden) {
        // alert("调用app成功");
      } else {
        // _hmt.push(['_trackPageview', '/download/real']);
        window.location.href = appUrl;
      }
    }
    //启动间隔20ms运行的定时器，并检测累计消耗时间是否超过3000ms，超过则结束
    var _count = 0,
      intHandle;
    intHandle = setInterval(function () {
      _count++;
      var elsTime = +(new Date()) - _clickTime;
      if (_count >= 100 || elsTime > 3000) {
        clearInterval(intHandle);
        check(elsTime);
      }
    }, 20);
  }

  //在iframe 中打开APP
  var ifr = document.createElement('iframe');
  ifr.src = openUrl;
  ifr.style.display = 'none';
  checkOpen();

  document.body.appendChild(ifr);
  setTimeout(function () {
    document.body.removeChild(ifr);
  }, 2000);
}

window.browser = {
  versions: function () {
    var u = navigator.userAgent;
    return {
      mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
      weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
      qq: u.match(/\sQQ/i) == " qq" || u.match(/\sQQ/i) == " QQ", //是否QQ

      trident: u.indexOf('Trident') > -1, //IE内核
      presto: u.indexOf('Presto') > -1, //opera内核
      webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
      iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1, //是否iPad
      webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部

    };
  }()
}

util.aphoneDLink = "";
// scheme
util.schemeDLink = "lotterylaunch://com.sina.lottery.gai/open";

window.maxW = 960;

(function(){
  var supportOrientation = (typeof window.orientation === 'number' &&
  typeof window.onorientationchange === 'object');
  var init = function(){
    var htmlNode = document.body.parentNode,
      orientation;
    var timer = null;
    var updateOrientation = function(flag){
      if(supportOrientation){
        orientation = window.orientation;
        switch(orientation){
          case 90:
          case -90:
            orientation = 'landscape';
            break;
          default:
            orientation = 'portrait';
            break;
        }
      }else{
        orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
      }
      htmlNode.setAttribute('class',orientation);
      if(flag == 'init') { return;}
      clearTimeout(timer)
      timer = setTimeout(function() {
        window.location.reload();
      }, 200 )
    };
    if(supportOrientation){
      window.addEventListener('orientationchange',updateOrientation,false);
    }else{
      //监听resize事件
      window.addEventListener('resize',updateOrientation,false);
    }
    updateOrientation('init');
  };
  window.addEventListener('DOMContentLoaded',init,false);
})();
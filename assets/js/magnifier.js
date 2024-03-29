!(function (C) {
    C.fn.magnify = function (W) {
        W = C.extend(
            { src: "", speed: 100, timeout: -1, touchBottomOffset: 0, finalWidth: null, finalHeight: null, magnifiedWidth: null, magnifiedHeight: null, limitBounds: !1, mobileCloseEvent: "touchstart", afterLoad: function () {} },
            W
        );
        var t = this,
            x = C("html"),
            i = 0,
            M = function () {
                clearTimeout(i),
                    (i = setTimeout(function () {
                        t.destroy(), t.magnify(W);
                    }, 100));
            };
        return (
            (this.destroy = function () {
                return (
                    this.each(function () {
                        var t = C(this),
                            i = t.prev("div.magnify-lens"),
                            e = t.data("originalStyle");
                        t.parent("div.magnify").length && i.length && (e ? t.attr("style", e) : t.removeAttr("style"), t.unwrap(), i.remove());
                    }),
                    C(window).off("resize", M),
                    t
                );
            }),
            C(window).resize(M),
            this.each(function () {
                !(function (t) {
                    var s = C(t),
                        i = s.closest("a"),
                        n = {};
                    for (var e in W) n[e] = s.attr("data-magnify-" + e.toLowerCase());
                    var a = n.src || W.src || i.attr("href") || "";
                    if (a) {
                        function o() {
                            var t = l.offset();
                            return (
                                (B = {
                                    top: s.offset().top - t.top + parseInt(s.css("border-top-width")) + parseInt(s.css("padding-top")),
                                    left: s.offset().left - t.left + parseInt(s.css("border-left-width")) + parseInt(s.css("padding-left")),
                                }),
                                (t.top += B.top),
                                (t.left += B.left),
                                t
                            );
                        }
                        function r() {
                            d.is(":visible") &&
                                d.fadeOut(W.speed, function () {
                                    x.removeClass("magnifying").trigger("magnifyend");
                                });
                        }
                        function f(t) {
                            if (u) {
                                if (
                                    (t
                                        ? (t.preventDefault(), (v = t.pageX || t.originalEvent.touches[0].pageX), (y = t.pageY || t.originalEvent.touches[0].pageY), s.data("lastPos", { x: v, y: y }))
                                        : ((v = s.data("lastPos").x), (y = s.data("lastPos").y)),
                                    (b = v - N.left),
                                    (w = y - N.top - W.touchBottomOffset),
                                    d.is(":animated") || (k < b && b < c - k && E < w && w < u - E ? d.is(":hidden") && (x.addClass("magnifying").trigger("magnifystart"), d.fadeIn(W.speed)) : r()),
                                    d.is(":visible"))
                                ) {
                                    var i = "";
                                    if (h && g) {
                                        var e = -Math.round((b / c) * h - m / 2),
                                            n = -Math.round((w / u) * g - p / 2);
                                        if (W.limitBounds) {
                                            var a = -Math.round(((c - k) / c) * h - m / 2),
                                                o = -Math.round(((u - E) / u) * g - p / 2);
                                            0 < e ? (e = 0) : e < a && (e = a), 0 < n ? (n = 0) : n < o && (n = o);
                                        }
                                        i = e + "px " + n + "px";
                                    }
                                    d.css({ top: Math.round(w - p / 2) + B.top + "px", left: Math.round(b - m / 2) + B.left + "px", "background-position": i });
                                }
                            } else M();
                        }
                        var l,
                            d,
                            c,
                            u,
                            h,
                            g,
                            m,
                            p,
                            v,
                            y,
                            b,
                            w,
                            N,
                            B,
                            k = 0,
                            E = 0;
                        isNaN(+n.speed) || (W.speed = +n.speed),
                            isNaN(+n.timeout) || (W.timeout = +n.timeout),
                            isNaN(+n.finalWidth) || (W.finalWidth = +n.finalWidth),
                            isNaN(+n.finalHeight) || (W.finalHeight = +n.finalHeight),
                            isNaN(+n.magnifiedWidth) || (W.magnifiedWidth = +n.magnifiedWidth),
                            isNaN(+n.magnifiedHeight) || (W.magnifiedHeight = +n.magnifiedHeight),
                            "true" === n.limitBounds && (W.limitBounds = !0),
                            "function" == typeof window[n.afterLoad] && (W.afterLoad = window[n.afterLoad]),
                            /\b(Android|BlackBerry|IEMobile|iPad|iPhone|Mobile|Opera Mini)\b/.test(navigator.userAgent) ? isNaN(+n.touchBottomOffset) || (W.touchBottomOffset = +n.touchBottomOffset) : (W.touchBottomOffset = 0),
                            s.data("originalStyle", s.attr("style"));
                        var H = new Image();
                        C(H).on({
                            load: function () {
                                s.css("display", "block"),
                                    s.parent(".magnify").length || s.wrap('<div class="magnify"></div>'),
                                    (l = s.parent(".magnify")),
                                    s.prev(".magnify-lens").length
                                        ? l.children(".magnify-lens").css("background-image", "url('" + a + "')")
                                        : s.before('<div class="magnify-lens loading" style="background:url(\'' + a + "') 0 0 no-repeat\"></div>"),
                                    (d = l.children(".magnify-lens")).removeClass("loading"),
                                    (c = W.finalWidth || s.width()),
                                    (u = W.finalHeight || s.height()),
                                    (h = W.magnifiedWidth || H.width),
                                    (g = W.magnifiedHeight || H.height),
                                    (m = d.width()),
                                    (p = d.height()),
                                    (N = o()),
                                    W.limitBounds && ((k = m / 2 / (h / c)), (E = p / 2 / (g / u))),
                                    (h === H.width && g === H.height) || d.css("background-size", h + "px " + g + "px"),
                                    s.data("zoomSize", { width: h, height: g }),
                                    l.data("mobileCloseEvent", n.mobileCloseEvent || W.mobileCloseEvent),
                                    (H = null),
                                    W.afterLoad(),
                                    d.is(":visible") && f(),
                                    l.off().on({
                                        "mousemove touchmove": f,
                                        mouseenter: function () {
                                            N = o();
                                        },
                                        mouseleave: r,
                                    }),
                                    0 <= W.timeout &&
                                        l.on("touchend", function () {
                                            setTimeout(r, W.timeout);
                                        }),
                                    C("body").not(l).on("touchstart", r);
                                var t = s.attr("usemap");
                                if (t) {
                                    var e = C("map[name=" + t.slice(1) + "]");
                                    s.after(e),
                                        l.click(function (t) {
                                            if (t.clientX || t.clientY) {
                                                d.hide();
                                                var i = document.elementFromPoint(t.clientX || t.originalEvent.touches[0].clientX, t.clientY || t.originalEvent.touches[0].clientY);
                                                "AREA" === i.nodeName
                                                    ? i.click()
                                                    : C("area", e).each(function () {
                                                          var t = C(this).attr("coords").split(",");
                                                          if (b >= t[0] && b <= t[2] && w >= t[1] && w <= t[3]) return this.click(), !1;
                                                      });
                                            }
                                        });
                                }
                                i.length &&
                                    (i.css("display", "inline-block"),
                                    !i.attr("href") ||
                                        n.src ||
                                        W.src ||
                                        i.click(function (t) {
                                            t.preventDefault();
                                        }));
                            },
                            error: function () {
                                H = null;
                            },
                        }),
                            (H.src = a);
                    }
                })(this);
            })
        );
    };
})(jQuery);

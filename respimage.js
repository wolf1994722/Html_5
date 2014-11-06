/*! respimage - v1.1.3 - 2014-11-06
 Licensed MIT */
!function(window, document, undefined) {
    "use strict";
    function trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function updateMetrics() {
        (isVwDirty || DPR != window.devicePixelRatio) && (isVwDirty = !1, DPR = window.devicePixelRatio, 
        cssCache = {}, sizeLengthCache = {}, cfg.uT || (ri.DPR = Math.min(DPR || 1, 3), 
        ri.DPR > 2.5 && (ri.DPR /= 1.12)), dprM = ri.DPR * cfg.xQuant, tLow = cfg.tLow * dprM, 
        greed = cfg.greed * dprM, tHigh = cfg.tHigh, tMemory = 2 + dprM, units.width = window.innerWidth || docElem.offsetWidth, 
        units.height = window.innerHeight || docElem.offsetHeight, units.orienation = units[units.width > units.height ? "landscape" : "portrait"], 
        units.resolution = dprM, units.vw = units.width / 100, units.vh = units.height / 100, 
        units.em = ri.getEmValue(), units.rem = units.em);
    }
    function parseDescriptor(descriptor) {
        if (!(descriptor in memDescriptor)) {
            var descriptorObj = {
                val: 1,
                type: "x"
            }, parsedDescriptor = trim(descriptor || "");
            parsedDescriptor && (parsedDescriptor = parsedDescriptor.replace(regHDesc, ""), 
            parsedDescriptor.match(regDescriptor) ? (descriptorObj.val = 1 * RegExp.$1, descriptorObj.type = RegExp.$2) : descriptorObj = !1), 
            memDescriptor[descriptor] = descriptorObj;
        }
        return memDescriptor[descriptor];
    }
    function chooseLowRes(lowRes, diff, dpr) {
        return lowRes += diff * greed, diff > tHigh && (lowRes += tLow), lowRes > dpr;
    }
    function inView(el) {
        if (!el.getBoundingClientRect) return !0;
        var bottom, right, left, top, rect = el.getBoundingClientRect();
        return !!((bottom = rect.bottom) >= -9 && (top = rect.top) <= units.height + 9 && (right = rect.right) >= -9 && (left = rect.left) <= units.height + 9 && (bottom || right || left || top));
    }
    function applyBestCandidate(img) {
        var srcSetCandidates, matchingSet = ri.getSet(img), evaluated = !1;
        "pending" != matchingSet && (evaluated = !0, matchingSet && (srcSetCandidates = ri.setRes(matchingSet), 
        evaluated = ri.applySetCandidate(srcSetCandidates, img))), img[ri.ns].evaled = evaluated;
    }
    function ascendingSort(a, b) {
        return a.res - b.res;
    }
    function setSrcToCur(img, src, set) {
        var candidate;
        return !set && src && (set = img[ri.ns].sets, set = set && set[set.length - 1]), 
        candidate = getCandidateForSrc(src, set), candidate && (src = ri.makeUrl(src), img[ri.ns].curSrc = src, 
        img[ri.ns].curCan = candidate, currentSrcSupported || (img.currentSrc = src), candidate.res || setResolution(candidate, candidate.set.sizes)), 
        candidate;
    }
    function getCandidateForSrc(src, set) {
        var i, candidate, candidates;
        if (src && set) for (candidates = ri.parseSet(set), src = ri.makeUrl(src), i = 0; i < candidates.length; i++) if (src == ri.makeUrl(candidates[i].url)) {
            candidate = candidates[i];
            break;
        }
        return candidate;
    }
    function hasOneX(set) {
        var i, ret, candidates, desc;
        if (set) for (candidates = ri.parseSet(set), i = 0; i < candidates.length; i++) if (desc = candidates[i].desc, 
        "x" == desc.type && 1 == desc.val) {
            ret = !0;
            break;
        }
        return ret;
    }
    function hasWDescripor(set) {
        if (!set) return !1;
        var candidates = ri.parseSet(set);
        return candidates[0] && "w" == candidates[0].desc.type;
    }
    function getAllSourceElements(picture, candidates) {
        var i, len, source, srcset, sources = picture.getElementsByTagName("source");
        for (i = 0, len = sources.length; len > i; i++) source = sources[i], source[ri.ns] = !0, 
        srcset = source.getAttribute("srcset"), srcset && candidates.push({
            srcset: srcset,
            media: source.getAttribute("media"),
            type: source.getAttribute("type"),
            sizes: source.getAttribute("sizes")
        });
    }
    function setResolution(candidate, sizesattr) {
        var descriptor = candidate.desc;
        return "w" == descriptor.type ? (candidate.cWidth = ri.calcListLength(sizesattr || "100vw"), 
        candidate.res = descriptor.val / candidate.cWidth) : candidate.res = descriptor.val, 
        candidate;
    }
    document.createElement("picture");
    var currentSrcSupported, curSrcProp, ri = {}, noop = function() {}, image = document.createElement("img"), getImgAttr = image.getAttribute, setImgAttr = image.setAttribute, removeImgAttr = image.removeAttribute, docElem = document.documentElement, types = {}, cfg = {
        xQuant: 1,
        tLow: .1,
        tHigh: .5,
        tLazy: .3,
        greed: .33
    }, srcAttr = "data-risrc", srcsetAttr = srcAttr + "set", supportAbort = /rident/.test(navigator.userAgent);
    ri.ns = ("ri" + new Date().getTime()).substr(0, 9), curSrcProp = "currentSrc", (currentSrcSupported = curSrcProp in image) || (curSrcProp = "src"), 
    ri.supSrcset = "srcset" in image, ri.supSizes = "sizes" in image, ri.selShort = "picture>img,img[srcset]", 
    ri.sel = ri.selShort, ri.cfg = cfg, ri.supSrcset && (ri.sel += ",img[" + srcsetAttr + "]");
    var anchor = document.createElement("a");
    ri.makeUrl = function(src) {
        return anchor.href = src, anchor.href;
    }, ri.qsa = function(context, sel) {
        return context.querySelectorAll(sel);
    };
    {
        var on = (window.console && console.warn ? function(message) {
            console.warn(message);
        } : noop, function(obj, evt, fn, capture) {
            obj.addEventListener ? obj.addEventListener(evt, fn, capture || !1) : obj.attachEvent && obj.attachEvent("on" + evt, fn);
        }), off = function(obj, evt, fn, capture) {
            obj.removeEventListener ? obj.removeEventListener(evt, fn, capture || !1) : obj.detachEvent && obj.detachEvent("on" + evt, fn);
        };
        "https:" == location.protocol;
    }
    ri.matchesMedia = function() {
        return ri.matchesMedia = window.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches ? function(media) {
            return !media || matchMedia(media).matches;
        } : ri.mMQ, ri.matchesMedia.apply(this, arguments);
    };
    var dprM, tLow, greed, tHigh, tMemory, isWinComplete, isVwDirty = !0, cssCache = {}, sizeLengthCache = {}, DPR = window.devicePixelRatio, units = {
        px: 1,
        portrait: 2,
        landscape: 1,
        "in": 96,
        dpi: 1 / 96
    };
    ri.DPR = DPR || 1, ri.u = units, ri.mMQ = function(media) {
        return media ? evalCSS(media) : !0;
    };
    var evalCSS = function() {
        var cache = {}, regLength = /^([\d\.]+)(em|vw|px)$/, replace = function() {
            for (var args = arguments, index = 0, string = args[0]; ++index in args; ) string = string.replace(args[index], args[++index]);
            return string;
        }, buidlStr = function(css) {
            return cache[css] || (cache[css] = "return " + replace((css || "").toLowerCase(), /\band\b/g, "&&", /,/g, "||", /min-([a-z-\s]+):/g, "e.$1>=", /max-([a-z-\s]+):/g, "e.$1<=", /calc([^)]+)/g, "($1)", /([a-z-\s]+):/g, "e.$1==", /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi, "") + ";"), 
            cache[css];
        };
        return function(css, length) {
            var parsedLength;
            if (!(css in cssCache)) if (cssCache[css] = !1, length && (parsedLength = css.match(regLength))) cssCache[css] = parsedLength[1] * units[parsedLength[2]]; else try {
                cssCache[css] = new Function("e", buidlStr(css))(units);
            } catch (e) {}
            return cssCache[css];
        };
    }();
    ri.calcLength = function(sourceSizeValue) {
        var value = evalCSS(sourceSizeValue, !0) || !1;
        return 0 > value && (value = !1), value;
    }, ri.types = types, types["image/jpeg"] = !0, types["image/gif"] = !0, types["image/png"] = !0, 
    types["image/svg+xml"] = document.implementation.hasFeature("http://wwwindow.w3.org/TR/SVG11/feature#Image", "1.1"), 
    ri.supportsType = function(type) {
        return type ? types[type] : !0;
    };
    var regSize = /(\([^)]+\))?\s*(.+)/, memSize = {};
    ri.parseSize = function(sourceSizeStr) {
        var match;
        return memSize[sourceSizeStr] || (match = (sourceSizeStr || "").match(regSize), 
        memSize[sourceSizeStr] = {
            media: match && match[1],
            length: match && match[2]
        }), memSize[sourceSizeStr];
    }, ri.parseSet = function(set) {
        if (!set.cands) {
            var pos, url, descriptor, last, descpos, srcset = set.srcset;
            for (set.cands = []; srcset; ) srcset = srcset.replace(/^\s+/g, ""), pos = srcset.search(/\s/g), 
            descriptor = null, -1 != pos ? (url = srcset.slice(0, pos), last = url.charAt(url.length - 1), 
            "," != last && url || (url = url.replace(/,+$/, ""), descriptor = ""), srcset = srcset.slice(pos + 1), 
            null == descriptor && (descpos = srcset.indexOf(","), -1 != descpos ? (descriptor = srcset.slice(0, descpos), 
            srcset = srcset.slice(descpos + 1)) : (descriptor = srcset, srcset = ""))) : (url = srcset, 
            srcset = ""), url && (descriptor = parseDescriptor(descriptor)) && set.cands.push({
                url: url.replace(/^,+/, ""),
                desc: descriptor,
                set: set
            });
        }
        return set.cands;
    };
    var eminpx, memDescriptor = {}, regDescriptor = /^([\+eE\d\.]+)(w|x)$/, regHDesc = /\s*\d+h\s*/, baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)", fsCss = "font-size:100%!important;";
    ri.getEmValue = function() {
        var body;
        if (!eminpx && (body = document.body)) {
            var div = document.createElement("div"), originalHTMLCSS = docElem.style.cssText, originalBodyCSS = body.style.cssText;
            div.style.cssText = baseStyle, docElem.style.cssText = fsCss, body.style.cssText = fsCss, 
            body.appendChild(div), eminpx = div.offsetWidth, body.removeChild(div), eminpx = parseFloat(eminpx, 10), 
            docElem.style.cssText = originalHTMLCSS, body.style.cssText = originalBodyCSS;
        }
        return eminpx || 16;
    }, ri.calcListLength = function(sourceSizeListStr) {
        if (!(sourceSizeListStr in sizeLengthCache) || cfg.uT) {
            var sourceSize, parsedSize, length, media, i, len, sourceSizeList = trim(sourceSizeListStr).split(/\s*,\s*/), winningLength = !1;
            for (i = 0, len = sourceSizeList.length; len > i && (sourceSize = sourceSizeList[i], 
            parsedSize = ri.parseSize(sourceSize), length = parsedSize.length, media = parsedSize.media, 
            !length || !ri.matchesMedia(media) || (winningLength = ri.calcLength(length)) === !1); i++) ;
            sizeLengthCache[sourceSizeListStr] = winningLength ? winningLength : units.width;
        }
        return sizeLengthCache[sourceSizeListStr];
    }, ri.setRes = function(set) {
        var candidates, candidate;
        if (set) {
            candidates = ri.parseSet(set);
            for (var i = 0, len = candidates.length; len > i; i++) candidate = candidates[i], 
            candidate.descriptor || setResolution(candidate, set.sizes);
        }
        return candidates;
    }, ri.applySetCandidate = function(candidates, img) {
        if (candidates.length) {
            var candidate, dpr, i, j, diff, length, bestCandidate, curSrc, curCan, isSameSet, candidateSrc, oldRes, imageData = img[ri.ns], evaled = !0;
            if (curSrc = imageData.curSrc || img[curSrcProp], curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set), 
            dpr = ri.getX(candidates, curCan), curSrc && (curCan && curCan.res < dpr && (oldRes = curCan.res, 
            curCan.res += cfg.tLazy * Math.pow(curCan.res - .2, 2)), isSameSet = !imageData.pic || curCan && curCan.set == candidates[0].set, 
            curCan && isSameSet && curCan.res >= dpr && (oldRes || tMemory > curCan.res) ? bestCandidate = curCan : supportAbort || img.complete || !getImgAttr.call(img, "src") || img.lazyload || (isSameSet || !inView(img)) && (bestCandidate = curCan, 
            candidateSrc = curSrc, evaled = "L", isWinComplete && reevaluateAfterLoad(img))), 
            !bestCandidate) for (candidates.sort(ascendingSort), length = candidates.length, 
            bestCandidate = candidates[length - 1], i = 0; length > i; i++) if (candidate = candidates[i], 
            candidate.res >= dpr) {
                j = i - 1, bestCandidate = candidates[j] && (diff = candidate.res - dpr) && curSrc != ri.makeUrl(candidate.url) && chooseLowRes(candidates[j].res, diff, dpr) ? candidates[j] : candidate;
                break;
            }
            return oldRes && (curCan.res = oldRes), bestCandidate && (candidateSrc = ri.makeUrl(bestCandidate.url), 
            currentSrcSupported || (img.currentSrc = candidateSrc), imageData.curSrc = candidateSrc, 
            imageData.curCan = bestCandidate, candidateSrc != curSrc ? ri.setSrc(img, bestCandidate) : ri.setSize(img)), 
            evaled;
        }
    };
    ri.getX = function() {
        return ri.DPR * cfg.xQuant;
    }, ri.setSrc = function(img, bestCandidate) {
        var origWidth;
        img.src = bestCandidate.url, "image/svg+xml" == bestCandidate.set.type && (origWidth = img.style.width, 
        img.style.width = img.offsetWidth + 1 + "px", img.offsetWidth + 1 && (img.style.width = origWidth)), 
        ri.setSize(img);
    }, ri.setSize = noop, ri.getSet = function(img) {
        var i, set, supportsType, match = !1, sets = img[ri.ns].sets;
        for (i = 0; i < sets.length && !match; i++) if (set = sets[i], set.srcset && ri.matchesMedia(set.media) && (supportsType = ri.supportsType(set.type))) {
            "pending" == supportsType && (set = supportsType), match = set;
            break;
        }
        return match;
    };
    var alwaysCheckWDescriptor = ri.supSrcset && !ri.supSizes;
    ri.parseSets = function(element, parent) {
        var srcsetAttribute, fallbackCandidate, isWDescripor, srcsetParsed, hasPicture = "PICTURE" == parent.nodeName.toUpperCase(), imageData = element[ri.ns];
        imageData.src === undefined && (imageData.src = getImgAttr.call(element, "src"), 
        imageData.src ? setImgAttr.call(element, srcAttr, imageData.src) : removeImgAttr.call(element, srcAttr)), 
        imageData.srcset === undefined && (srcsetAttribute = getImgAttr.call(element, "srcset"), 
        imageData.srcset = srcsetAttribute, srcsetParsed = !0), imageData.sets = [], hasPicture && (imageData.pic = !0, 
        getAllSourceElements(parent, imageData.sets)), imageData.srcset ? (fallbackCandidate = {
            srcset: imageData.srcset,
            sizes: getImgAttr.call(element, "sizes")
        }, imageData.sets.push(fallbackCandidate), isWDescripor = alwaysCheckWDescriptor || imageData.src ? hasWDescripor(fallbackCandidate) : !1, 
        isWDescripor || !imageData.src || getCandidateForSrc(imageData.src, fallbackCandidate) || hasOneX(fallbackCandidate) || (fallbackCandidate.srcset += ", " + imageData.src, 
        fallbackCandidate.cands = !1)) : imageData.src && imageData.sets.push({
            srcset: imageData.src,
            sizes: null
        }), imageData.curCan = null, imageData.supported = !(hasPicture || fallbackCandidate && !ri.supSrcset || isWDescripor), 
        srcsetParsed && ri.supSrcset && !imageData.supported && (srcsetAttribute ? (setImgAttr.call(element, srcsetAttr, srcsetAttribute), 
        element.srcset = "") : removeImgAttr.call(element, srcsetAttr)), imageData.parsed = !0;
    };
    var reevaluateAfterLoad = function() {
        var onload = function() {
            off(this, "load", onload), off(this, "error", onload), ri.fillImgs({
                elements: [ this ]
            });
        };
        return function(img) {
            off(img, "load", onload), off(img, "error", onload), on(img, "error", onload), on(img, "load", onload);
        };
    }();
    ri.fillImg = function(element, options) {
        var parent, imageData, extreme = options.reparse || options.reevaluate;
        if (element[ri.ns] || (element[ri.ns] = {}), imageData = element[ri.ns], "L" == imageData.evaled && element.complete && (imageData.evaled = !1), 
        extreme || !imageData.evaled) {
            if (!imageData.parsed || options.reparse) {
                if (parent = element.parentNode, !parent) return;
                ri.parseSets(element, parent, options);
            }
            imageData.supported ? imageData.evaled = !0 : applyBestCandidate(element);
        }
    };
    var resizeThrottle;
    ri.setupRun = function(options) {
        (!alreadyRun || options.reevaluate || isVwDirty) && (updateMetrics(), options.elements || options.context || clearTimeout(resizeThrottle));
    }, ri.teardownRun = noop;
    var alreadyRun = !1, respimage = function(opt) {
        var elements, i, plen, options = opt || {};
        if (options.elements && 1 == options.elements.nodeType && ("IMG" == options.elements.nodeName.toUpperCase() ? options.elements = [ options.elements ] : (options.context = options.elements, 
        options.elements = null)), elements = options.elements || ri.qsa(options.context || document, options.reevaluate || options.reparse ? ri.sel : ri.selShort), 
        plen = elements.length) {
            for (ri.setupRun(options), alreadyRun = !0, i = 0; plen > i; i++) ri.fillImg(elements[i], options);
            ri.teardownRun(options);
        }
    };
    ri.fillImgs = respimage, window.HTMLPictureElement ? (respimage = noop, ri.fillImg = noop) : !function() {
        var lDelay;
        lDelay = supportAbort ? 180 : 400;
        var run = function() {
            var readyState = document.readyState || "";
            clearTimeout(timerId), timerId = setTimeout(run, "loading" == readyState ? lDelay : 4e3), 
            document.body && (/d$|^c/.test(readyState) && (isWinComplete = !0, clearTimeout(timerId), 
            off(document, "readystatechange", run)), ri.fillImgs());
        }, resizeEval = function() {
            ri.fillImgs({
                reevaluate: !0
            });
        }, onResize = function() {
            clearTimeout(resizeThrottle), isVwDirty = !0, resizeThrottle = setTimeout(resizeEval, 99);
        }, timerId = setTimeout(run, document.body ? 9 : 99);
        on(window, "resize", onResize), on(document, "readystatechange", run);
    }(), respimage._ = ri, respimage.config = function(name, value, value2) {
        if ("addType" == name) {
            if (types[value] = value2, "pending" == value2) return;
        } else cfg[name] = value;
        alreadyRun && ri.fillImgs({
            reevaluate: !0
        });
    }, window.respimage = respimage;
}(window, document);
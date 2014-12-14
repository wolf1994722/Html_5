/*! respimage - v1.2.0 - 2014-12-14
 Licensed MIT */
!function(window, document, undefined) {
    "use strict";
    function trim(str) {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
    }
    function updateMetrics() {
        var dprM;
        isVwDirty = !1, DPR = window.devicePixelRatio, cssCache = {}, sizeLengthCache = {}, 
        dprM = (DPR || 1) * cfg.xQuant, cfg.uT || (cfg.maxX = Math.max(1.3, cfg.maxX), dprM = Math.min(dprM, cfg.maxX), 
        ri.DPR = dprM), units.width = Math.max(window.innerWidth || 0, docElem.clientWidth), 
        units.height = Math.max(window.innerHeight || 0, docElem.clientHeight), units.vw = units.width / 100, 
        units.vh = units.height / 100, units.em = ri.getEmValue(), units.rem = units.em, 
        lazyFactor = cfg.lazyFactor / 2, lazyFactor = lazyFactor * dprM + lazyFactor, substractCurRes = .1 * dprM, 
        lowTreshHold = .5 + .2 * dprM, partialLowTreshHold = .5 + .25 * dprM, (isLandscape = units.width > units.height) || (lazyFactor *= .9), 
        supportAbort && (lazyFactor *= .9);
    }
    function parseDescriptor(descriptor) {
        if (!(descriptor in memDescriptor)) {
            var descriptorObj = [ 1, "x" ], parsedDescriptor = trim(descriptor || "");
            parsedDescriptor && (parsedDescriptor = parsedDescriptor.replace(regHDesc, ""), 
            descriptorObj = parsedDescriptor.match(regDescriptor) ? [ 1 * RegExp.$1, RegExp.$2 ] : !1), 
            memDescriptor[descriptor] = descriptorObj;
        }
        return memDescriptor[descriptor];
    }
    function chooseLowRes(lowRes, diff, dpr) {
        var add = diff * Math.pow(lowRes, 2);
        return isLandscape || (add /= 1.6), lowRes += add, lowRes > dpr;
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
        img[ri.ns].curCan = candidate, candidate.res || setResolution(candidate, candidate.set.sizes)), 
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
    function hasOneX(set) {
        var i, ret, candidates;
        if (set) for (candidates = ri.parseSet(set), i = 0; i < candidates.length; i++) if (1 == candidates[i].x) {
            ret = !0;
            break;
        }
        return ret;
    }
    document.createElement("picture");
    var lowTreshHold, isWindloaded, partialLowTreshHold, isLandscape, lazyFactor, substractCurRes, eminpx, alwaysCheckWDescriptor, resizeThrottle, ri = {}, noop = function() {}, image = document.createElement("img"), getImgAttr = image.getAttribute, setImgAttr = image.setAttribute, removeImgAttr = image.removeAttribute, docElem = document.documentElement, types = {}, cfg = {
        xQuant: 1,
        lazyFactor: .4,
        maxX: 2
    }, srcAttr = "data-risrc", srcsetAttr = srcAttr + "set", ua = navigator.userAgent, supportAbort = /rident/.test(ua) || /ecko/.test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35, curSrcProp = "currentSrc", regWDesc = /\s+\+?\d+(e\d+)?w/, regSize = /(\([^)]+\))?\s*(.+)/, regDescriptor = /^([\+eE\d\.]+)(w|x)$/, regHDesc = /\s*\d+h\s*/, setOptions = window.respimgCFG, baseStyle = ("https:" == location.protocol, 
    "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)"), fsCss = "font-size:100%!important;", isVwDirty = !0, memSize = {}, memDescriptor = {}, cssCache = {}, sizeLengthCache = {}, DPR = window.devicePixelRatio, units = {
        px: 1,
        "in": 96
    }, anchor = document.createElement("a"), alreadyRun = !1, on = function(obj, evt, fn, capture) {
        obj.addEventListener ? obj.addEventListener(evt, fn, capture || !1) : obj.attachEvent && obj.attachEvent("on" + evt, fn);
    }, off = function(obj, evt, fn, capture) {
        obj.removeEventListener ? obj.removeEventListener(evt, fn, capture || !1) : obj.detachEvent && obj.detachEvent("on" + evt, fn);
    }, evalCSS = function() {
        var cache = {}, regLength = /^([\d\.]+)(em|vw|px)$/, replace = function() {
            for (var args = arguments, index = 0, string = args[0]; ++index in args; ) string = string.replace(args[index], args[++index]);
            return string;
        }, buidlStr = function(css) {
            return cache[css] || (cache[css] = "return " + replace((css || "").toLowerCase(), /\band\b/g, "&&", /,/g, "||", /min-([a-z-\s]+):/g, "e.$1>=", /max-([a-z-\s]+):/g, "e.$1<=", /calc([^)]+)/g, "($1)", /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)", /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi, "") + ";"), 
            cache[css];
        };
        return function(css, length) {
            var parsedLength;
            if (!(css in cssCache)) if (cssCache[css] = !1, length && (parsedLength = css.match(regLength))) cssCache[css] = parsedLength[1] * units[parsedLength[2]]; else try {
                cssCache[css] = new Function("e", buidlStr(css))(units);
            } catch (e) {}
            return cssCache[css];
        };
    }(), setResolution = function(candidate, sizesattr) {
        return candidate.w ? (candidate.cWidth = ri.calcListLength(sizesattr || "100vw"), 
        candidate.res = candidate.w / candidate.cWidth) : candidate.res = candidate.x, candidate;
    }, respimage = function(opt) {
        var elements, i, plen, options = opt || {};
        if (options.elements && 1 == options.elements.nodeType && ("IMG" == options.elements.nodeName.toUpperCase() ? options.elements = [ options.elements ] : (options.context = options.elements, 
        options.elements = null)), elements = options.elements || ri.qsa(options.context || document, options.reevaluate || options.reparse ? ri.sel : ri.selShort), 
        plen = elements.length) {
            for (ri.setupRun(options), alreadyRun = !0, i = 0; plen > i; i++) ri.fillImg(elements[i], options);
            ri.teardownRun(options);
        }
    }, reevaluateAfterLoad = function() {
        var onload = function() {
            off(this, "load", onload), off(this, "error", onload), ri.fillImgs({
                elements: [ this ]
            });
        };
        return function(img) {
            off(img, "load", onload), off(img, "error", onload), on(img, "error", onload), on(img, "load", onload);
        };
    }();
    curSrcProp in image || (curSrcProp = "src"), types["image/jpeg"] = !0, types["image/gif"] = !0, 
    types["image/png"] = !0, types["image/svg+xml"] = document.implementation.hasFeature("http://wwwindow.w3.org/TR/SVG11/feature#Image", "1.1"), 
    ri.ns = ("ri" + new Date().getTime()).substr(0, 9), ri.supSrcset = "srcset" in image, 
    ri.supSizes = "sizes" in image, ri.selShort = "picture>img,img[srcset]", ri.sel = ri.selShort, 
    ri.cfg = cfg, ri.supSrcset && (ri.sel += ",img[" + srcsetAttr + "]"), ri.DPR = DPR || 1, 
    ri.u = units, ri.types = types, alwaysCheckWDescriptor = ri.supSrcset && !ri.supSizes, 
    ri.setSize = noop, ri.makeUrl = function(src) {
        return anchor.href = src, anchor.href;
    }, ri.qsa = function(context, sel) {
        return context.querySelectorAll(sel);
    }, ri.matchesMedia = function() {
        return ri.matchesMedia = window.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches ? function(media) {
            return !media || matchMedia(media).matches;
        } : ri.mMQ, ri.matchesMedia.apply(this, arguments);
    }, ri.mMQ = function(media) {
        return media ? evalCSS(media) : !0;
    }, ri.calcLength = function(sourceSizeValue) {
        var value = evalCSS(sourceSizeValue, !0) || !1;
        return 0 > value && (value = !1), value;
    }, ri.supportsType = function(type) {
        return type ? types[type] : !0;
    }, ri.parseSize = function(sourceSizeStr) {
        var match;
        return memSize[sourceSizeStr] || (match = (sourceSizeStr || "").match(regSize), 
        memSize[sourceSizeStr] = {
            media: match && match[1],
            length: match && match[2]
        }), memSize[sourceSizeStr];
    }, ri.parseSet = function(set) {
        if (!set.cands) {
            var pos, url, descriptor, last, descpos, can, srcset = set.srcset;
            for (set.cands = []; srcset; ) srcset = srcset.replace(/^\s+/g, ""), pos = srcset.search(/\s/g), 
            descriptor = null, -1 != pos ? (url = srcset.slice(0, pos), last = url.charAt(url.length - 1), 
            "," != last && url || (url = url.replace(/,+$/, ""), descriptor = ""), srcset = srcset.slice(pos + 1), 
            null == descriptor && (descpos = srcset.indexOf(","), -1 != descpos ? (descriptor = srcset.slice(0, descpos), 
            srcset = srcset.slice(descpos + 1)) : (descriptor = srcset, srcset = ""))) : (url = srcset, 
            srcset = ""), url && (descriptor = parseDescriptor(descriptor)) && (can = {
                url: url.replace(/^,+/, ""),
                set: set
            }, can[descriptor[1]] = descriptor[0], set.cands.push(can));
        }
        return set.cands;
    }, ri.getEmValue = function() {
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
        var candidates;
        if (set) {
            candidates = ri.parseSet(set);
            for (var i = 0, len = candidates.length; len > i; i++) setResolution(candidates[i], set.sizes);
        }
        return candidates;
    }, ri.setRes.res = setResolution, ri.applySetCandidate = function(candidates, img) {
        if (candidates.length) {
            var candidate, dpr, i, j, diff, length, bestCandidate, curSrc, curCan, isSameSet, candidateSrc, oldRes, imageData = img[ri.ns], evaled = !0, lazyF = lazyFactor, sub = substractCurRes;
            if (curSrc = imageData.curSrc || img[curSrcProp], curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set), 
            dpr = ri.DPR, oldRes = curCan && curCan.res, curSrc && (!supportAbort || img.complete || !curCan || dpr > oldRes) && (curCan && dpr > oldRes && oldRes > lowTreshHold && (partialLowTreshHold > oldRes && (lazyF *= .87, 
            sub += .04 * dpr), curCan.res += lazyF * Math.pow(oldRes - sub, 2)), isSameSet = !imageData.pic || curCan && curCan.set == candidates[0].set, 
            curCan && isSameSet && curCan.res >= dpr ? bestCandidate = curCan : isWindloaded && supportAbort || img.complete || !getImgAttr.call(img, "src") || img.lazyload || (isSameSet || !supportAbort && !inView(img)) && (bestCandidate = curCan, 
            candidateSrc = curSrc, evaled = "L", reevaluateAfterLoad(img))), !bestCandidate) for (oldRes && (curCan.res = curCan.res - (curCan.res - oldRes) / 2), 
            candidates.sort(ascendingSort), length = candidates.length, bestCandidate = candidates[length - 1], 
            i = 0; length > i; i++) if (candidate = candidates[i], candidate.res >= dpr) {
                j = i - 1, bestCandidate = candidates[j] && (diff = candidate.res - dpr) && curSrc != ri.makeUrl(candidate.url) && chooseLowRes(candidates[j].res, diff, dpr) ? candidates[j] : candidate;
                break;
            }
            return oldRes && (curCan.res = oldRes), bestCandidate && (candidateSrc = ri.makeUrl(bestCandidate.url), 
            imageData.curSrc = candidateSrc, imageData.curCan = bestCandidate, candidateSrc != curSrc && ri.setSrc(img, bestCandidate), 
            ri.setSize(img)), evaled;
        }
    }, ri.setSrc = function(img, bestCandidate) {
        var origWidth;
        img.src = bestCandidate.url, "image/svg+xml" == bestCandidate.set.type && (origWidth = img.style.width, 
        img.style.width = img.offsetWidth + 1 + "px", img.offsetWidth + 1 && (img.style.width = origWidth));
    }, ri.getSet = function(img) {
        var i, set, supportsType, match = !1, sets = img[ri.ns].sets;
        for (i = 0; i < sets.length && !match; i++) if (set = sets[i], set.srcset && ri.matchesMedia(set.media) && (supportsType = ri.supportsType(set.type))) {
            "pending" == supportsType && (set = supportsType), match = set;
            break;
        }
        return match;
    }, ri.parseSets = function(element, parent) {
        var srcsetAttribute, fallbackCandidate, isWDescripor, srcsetParsed, hasPicture = "PICTURE" == parent.nodeName.toUpperCase(), imageData = element[ri.ns];
        imageData.src === undefined && (imageData.src = getImgAttr.call(element, "src"), 
        imageData.src ? setImgAttr.call(element, srcAttr, imageData.src) : removeImgAttr.call(element, srcAttr)), 
        imageData.srcset === undefined && (srcsetAttribute = getImgAttr.call(element, "srcset"), 
        imageData.srcset = srcsetAttribute, srcsetParsed = !0), imageData.sets = [], hasPicture && (imageData.pic = !0, 
        getAllSourceElements(parent, imageData.sets)), imageData.srcset ? (fallbackCandidate = {
            srcset: imageData.srcset,
            sizes: getImgAttr.call(element, "sizes")
        }, imageData.sets.push(fallbackCandidate), isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || ""), 
        isWDescripor || !imageData.src || getCandidateForSrc(imageData.src, fallbackCandidate) || hasOneX(fallbackCandidate) || (fallbackCandidate.srcset += ", " + imageData.src, 
        fallbackCandidate.cands.push({
            url: imageData.src,
            x: 1,
            set: fallbackCandidate
        }))) : imageData.src && imageData.sets.push({
            srcset: imageData.src,
            sizes: null
        }), imageData.curCan = null, imageData.supported = !(hasPicture || fallbackCandidate && !ri.supSrcset || isWDescripor), 
        srcsetParsed && ri.supSrcset && !imageData.supported && (srcsetAttribute ? (setImgAttr.call(element, srcsetAttr, srcsetAttribute), 
        element.srcset = "") : removeImgAttr.call(element, srcsetAttr)), imageData.supported && !imageData.srcset && (!imageData.src && element.src || element.src != ri.makeUrl(imageData.src)) && (null == imageData.src ? element.removeAttribute("src") : element.src = imageData.src), 
        imageData.parsed = !0;
    }, ri.fillImg = function(element, options) {
        var parent, imageData, extreme = options.reparse || options.reevaluate;
        if (element[ri.ns] || (element[ri.ns] = {}), imageData = element[ri.ns], "L" == imageData.evaled && element.complete && (imageData.evaled = !1), 
        extreme || !imageData.evaled) {
            if (!imageData.parsed || options.reparse) {
                if (parent = element.parentNode, !parent) return;
                ri.parseSets(element, parent, options);
            }
            imageData.supported ? imageData.evaled = !0 : applyBestCandidate(element);
        }
    }, ri.setupRun = function(options) {
        (!alreadyRun || options.reevaluate || isVwDirty) && (updateMetrics(), options.elements || options.context || clearTimeout(resizeThrottle));
    }, window.HTMLPictureElement ? (respimage = noop, ri.fillImg = noop) : !function() {
        var complete = /d$|^c/, ready = window.attachEvent ? complete : /d$|^c|^i/, run = function() {
            var readyState = document.readyState || "";
            timerId = setTimeout(run, "loading" == readyState ? 200 : 999), document.body && (isWindloaded = complete.test(readyState), 
            (isWindloaded || ready.test(readyState)) && clearTimeout(timerId), ri.fillImgs());
        }, resizeEval = function() {
            ri.fillImgs({
                reevaluate: !0
            });
        }, onResize = function() {
            clearTimeout(resizeThrottle), isVwDirty = !0, resizeThrottle = setTimeout(resizeEval, 99);
        }, timerId = setTimeout(run, document.body ? 9 : 99);
        on(window, "resize", onResize), on(document, "readystatechange", run);
    }(), ri.respimage = respimage, ri.fillImgs = respimage, ri.teardownRun = noop, respimage._ = ri, 
    window.respimage = respimage, window.respimgCFG = {
        ri: ri,
        push: function(args) {
            var name = args.shift();
            "function" == typeof ri[name] ? ri[name].apply(ri, args) : (cfg[name] = args[0], 
            alreadyRun && ri.fillImgs({
                reevaluate: !0
            }));
        }
    };
    for (;setOptions && setOptions.length; ) window.respimgCFG.push(setOptions.shift());
}(window, document);
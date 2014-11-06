#respimage - perfselection plugin

While the normal smart selection algorithm does a great job in balancing performance vs. image quality the performance selection plugins hooks into the smart selection algorithm to greed for more performance on biased opinions.

##``respimage.config( "constrainDPI", true )`` (deprecated)
The ``"constrainDPI"`` option defaults to true. It is based on the [biased opinion](http://www.quirksmode.org/blog/archives/2012/03/the_ipad_3_and.html), that usually a normal image on a 2x retina device also looks good enough, if it is served with 1.5x quality. The plugin won't greed for more performance, if it assumes that a .gif, .png or .svg is used. Here is a demo: [normal smart selection](http://rawgit.com/aFarkas/respimage/stable/cfg/child.html) and [constrainDPI selection](http://rawgit.com/aFarkas/respimage/stable/cfg/child.html?perfselection). (In case you have only a 1x device, you wont see any differences).

##``respimage.config( "lowbandwidth", true )``
The ``"lowbandwidth"`` option defaults to false. In case a developer knows or assumes that he visitor has a lowbandwidth, he can turn this option on.

```js
respimage.config( "lowbandwidth", true );
```

Note this won't turn on a feature detection. It will simply change the smart selection algorithm to search for lower resolution candidates. It is designed to be used in conjunction with the ``constrainDPI`` option.
Here is a demo: [normal smart selection](http://rawgit.com/aFarkas/respimage/stable/cfg/child.html) and [lowbandwidth selection](http://rawgit.com/aFarkas/respimage/stable/cfg/child.html?lowbandwidth).

##Download and embed
Simply download the ``ri.perfselection.min.js`` and include it after the respimage script:

```html
<script src="respimage.min.js" async=""></script>
<script src="plugins/perfselection/ri.perfselection.min.js" async=""></script>
```

In case you want to include **respimage** only if the browser doesn't support responsive images you can use a script loader or write the following at the end of your head:

```html
<script>
if(!window.HTMLPictureElement){
	//load respimage polyfill + perfselection plugins
	document.write('<script src="respimage.min.js" async=""><\/script>');
	document.write('<script src="plugins\/perfselection\/ri.perfselection.min.js" async=""><\/script>');
}
</script>
```

Of course it is recommended to combine your scripts.

See also [lazysizes script for lazyloading and improved low quality image placeholder](https://github.com/aFarkas/lazysizes).

##perceived performance vs. perceived quality on retina devices

Use one or the combination of the following techniques:

###constraining markup patterns via the ``picture`` element

####Limitting high resolution candidates due to (max-width) fragmenting
```html
<picture>
    <!--[if IE 9]><video style="display: none;"><![endif]-->
    <source
        srcset="http://placehold.it/800x450 800w,
            http://placehold.it/600x300 600w,
            http://placehold.it/400x200 400w"
        media="(max-width: 760px)"
        sizes="calc(100vw - 10px)"
         />
    <source
        srcset="http://placehold.it/1440x720 1440w,
            http://placehold.it/1200x600 1200w,
            http://placehold.it/800x450 800w"
        media="(max-width: 1200px)"
        sizes="calc(100vw - 10px)"
         />
    <!--[if IE 9]></video><![endif]-->
    <img
        srcset="http://placehold.it/1600x900 1600w,
            http://placehold.it/1440x720 1440w,
            http://placehold.it/1200x600 1200w,
            http://placehold.it/800x450 800w,
            http://placehold.it/600x300 600w,
            http://placehold.it/400x200 400w"
        sizes="(max-width: 1200px) calc(100vw - 10px), 1200px"
        alt="picture but without artdirection" />
</picture>
```
####Serve higher compressions to retina devices
```html
<picture>
    <!--[if IE 9]><video style="display: none;"><![endif]-->
    <source
        srcset="http://placehold.it/1600x900?quality=60 1600w,
            http://placehold.it/1440x720?quality=60 1440w,
            http://placehold.it/1200x600?quality=60 1200w,
            http://placehold.it/800x450?quality=60 800w,
            http://placehold.it/600x300?quality=60 600w,
            http://placehold.it/400x200?quality=60 400w"
        media="(-webkit-min-device-pixel-ratio: 1.5), 
            (min-resolution: 144dpi)"
        sizes="(max-width: 1200px) calc(100vw - 10px), 1200px"
         />
    <!--[if IE 9]></video><![endif]-->
    <img
        srcset="http://placehold.it/1600x900?quality=80 1600w,
            http://placehold.it/1440x720?quality=80 1440w,
            http://placehold.it/1200x600?quality=80 1200w,
            http://placehold.it/800x450?quality=80 800w,
            http://placehold.it/600x300?quality=80 600w,
            http://placehold.it/400x200?quality=80 400w"
        sizes="(max-width: 1200px) calc(100vw - 10px), 1200px"
        alt="picture but without artdirection" />
    </picture>
    ```

###Use [lazyloading via lazysizes](https://github.com/aFarkas/lazysizes)

####Use the [``data-maxdpr`` extension for lazysizes](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/maxdpr)

####Use [lazysizes responsive image service extension](https://github.com/aFarkas/lazysizes/tree/gh-pages/plugins/rias) with a third party or self hosted responsive image service

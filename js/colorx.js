/*
http://www.rapidtables.com/convert/color/index.htm
http://www.had2know.com/technology/hsi-rgb-color-converter-equations.html
http://codeitdown.com/hsl-hsb-hsv-color/
http://ariya.blogspot.com.br/2008/07/converting-between-hsl-and-hsv.html
*/


(function(ns, $, undefined){

    ns.rgb2hsv = function(r, g, b){
        var h, s, v,
            rr = r/255.0,
            gg = g/255.0,
            bb = b/255.0,
            cmax = Math.max(rr, gg, bb),
            cmin = Math.min(rr, gg, bb),
            delta = cmax-cmin;

        if(delta == 0){
            return [0, 0, Math.round(cmax*100)];
        }

        switch(cmax){
            case rr:
                h = 60*(((gg-bb)/delta)%6);
                break;
            case gg:
                h = 60*((bb-rr)/delta+2);
                break;
            case bb:
                h = 60*((rr-gg)/delta+4);
                break;
        }

        s = delta/cmax;
        v = cmax;

        return [Math.round(h), Math.round(s*100), Math.round(v*100)];
    }

    ns.rgb2hsl = function(r, g, b){
        var h, s, l,
            rr = r/255.0,
            gg = g/255.0,
            bb = b/255.0,
            cmax = Math.max(rr, gg, bb),
            cmin = Math.min(rr, gg, bb),
            delta = cmax-cmin;

        if(delta == 0){
            return [0, 0, Math.round((cmax+cmin)*50)];
        }

        switch(cmax){
            case rr:
                h = 60*(((gg-bb)/delta)%6);
                break;
            case gg:
                h = 60*((bb-rr)/delta+2);
                break;
            case bb:
                h = 60*((rr-gg)/delta+4);
                break;
        }

        l = (cmax+cmin)/2;
        s = delta/(1-Math.abs(2*l-1));

        return [Math.round(h), Math.round(s*100), Math.round(l*100)];
    }

    ns.rgb2hsi = function(r, g, b){}

    ns.rgb2cmyk = function(r, g, b){
        var c, m, y, k,
            rr = r/255.0,
            gg = g/255.0,
            bb = b/255.0;

        k = 1-Math.max(rr, gg, bb);
        c = (1-rr-k)/(1-k);
        m = (1-gg-k)/(1-k);
        y = (1-bb-k)/(1-k);

        return [+c.toFixed(3), +m.toFixed(3), +y.toFixed(3), +k.toFixed(3)];
    }

    ns.hsv2rgb = function(h, s, v){
        var r, g, b,
            ss = s/100.0,
            vv = v/100.0,
            c = ss*vv,
            x = c*(1-Math.abs((h/60.0)%2-1)),
            m = vv-c;

        if(h < 60){
            r = c; g = x, b = 0;
        }
        else if(h < 120){
            r = x; g = c, b = 0;
        }
        else if(h < 180){
            r = 0; g = c, b = x;
        }
        else if(h < 240){
            r = 0; g = x, b = c;
        }
        else if(h < 300){
            r = x; g = 0, b = c;
        }
        else{
            r = c; g = 0, b = x;
        }

        return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
    }

    ns.hsl2rgb = function(h, s, l){
        var r, g, b,
            ss = s/100.0,
            ll = l/100.0,
            c = (1-Math.abs(2*ll-1))*ss,
            x = c*(1-Math.abs((h/60.0)%2-1)),
            m = ll-c/2.0;

        if(h < 60){
            r = c; g = x, b = 0;
        }
        else if(h < 120){
            r = x; g = c, b = 0;
        }
        else if(h < 180){
            r = 0; g = c, b = x;
        }
        else if(h < 240){
            r = 0; g = x, b = c;
        }
        else if(h < 300){
            r = x; g = 0, b = c;
        }
        else{
            r = c; g = 0, b = x;
        }

        return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
    }

    ns.hsi2rgb = function(h, s, i){}

    ns.cmyk2rgb = function(c, m, y, k){
        var r, g, b;

        r = (1-c)*(1-k);
        g = (1-m)*(1-k);
        b = (1-y)*(1-k);

        return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
    }


}( window.colorx = window.colorx || {}, jQuery ));

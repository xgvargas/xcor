/*
http://www.rapidtables.com/convert/color/index.htm
http://www.had2know.com/technology/hsi-rgb-color-converter-equations.html
http://codeitdown.com/hsl-hsb-hsv-color/
http://ariya.blogspot.com.br/2008/07/converting-between-hsl-and-hsv.html
*/


(function(ns, $, undefined){

    ns.rgb2hsv = function(rgb_color){
        var h, s, v,
            rr = rgb_color[0]/255.0,
            gg = rgb_color[1]/255.0,
            bb = rgb_color[2]/255.0,
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

    ns.rgb2hsl = function(rgb_color){
        var h, s, l,
            rr = rgb_color[0]/255.0,
            gg = rgb_color[1]/255.0,
            bb = rgb_color[2]/255.0,
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

    ns.rgb2hsi = function(rgb_color){}

    ns.rgb2cmyk = function(rgb_color){
        var c, m, y, k,
            rr = rgb_color[0]/255.0,
            gg = rgb_color[1]/255.0,
            bb = rgb_color[2]/255.0;

        k = 1-Math.max(rr, gg, bb);
        c = (1-rr-k)/(1-k);
        m = (1-gg-k)/(1-k);
        y = (1-bb-k)/(1-k);

        return [+c.toFixed(3), +m.toFixed(3), +y.toFixed(3), +k.toFixed(3)];
    }

    ns.hsv2rgb = function(hsv_color){
        var r, g, b,
            ss = hsv_color[1]/100.0,
            vv = hsv_color[2]/100.0,
            c = ss*vv,
            x = c*(1-Math.abs((hsv_color[0]/60.0)%2-1)),
            m = vv-c;

        if(hsv_color[0] < 60){
            r = c; g = x, b = 0;
        }
        else if(hsv_color[0] < 120){
            r = x; g = c, b = 0;
        }
        else if(hsv_color[0] < 180){
            r = 0; g = c, b = x;
        }
        else if(hsv_color[0] < 240){
            r = 0; g = x, b = c;
        }
        else if(hsv_color[0] < 300){
            r = x; g = 0, b = c;
        }
        else{
            r = c; g = 0, b = x;
        }

        return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
    }

    ns.hsl2rgb = function(hsl_color){
        var r, g, b,
            ss = hsl_color[1]/100.0,
            ll = hsl_color[2]/100.0,
            c = (1-Math.abs(2*ll-1))*ss,
            x = c*(1-Math.abs((hsl_color[0]/60.0)%2-1)),
            m = ll-c/2.0;

        if(hsl_color[0] < 60){
            r = c; g = x, b = 0;
        }
        else if(hsl_color[0] < 120){
            r = x; g = c, b = 0;
        }
        else if(hsl_color[0] < 180){
            r = 0; g = c, b = x;
        }
        else if(hsl_color[0] < 240){
            r = 0; g = x, b = c;
        }
        else if(hsl_color[0] < 300){
            r = x; g = 0, b = c;
        }
        else{
            r = c; g = 0, b = x;
        }

        return [Math.round((r+m)*255), Math.round((g+m)*255), Math.round((b+m)*255)];
    }

    ns.hsi2rgb = function(hsi_color){}

    ns.cmyk2rgb = function(cmyk_color){
        var r, g, b;

        r = (1-cmyk_color[0])*(1-cmyk_color[3]);
        g = (1-cmyk_color[1])*(1-cmyk_color[3]);
        b = (1-cmyk_color[2])*(1-cmyk_color[3]);

        return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
    }


}( window.colorx = window.colorx || {}, jQuery ));

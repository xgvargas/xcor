/*
http://www.rapidtables.com/convert/color/index.htm
http://www.had2know.com/technology/hsi-rgb-color-converter-equations.html

*/


(function(ns, $, undefined){

    // function Output(mdiv, nome){
    //   this.mdiv = mdiv;
    //   $('spam', this.mdiv).html(nome);
    // }

    // Output.prototype = {
    //   constructor: Output,

    //   mudar: function(novo){
    //     $('spam', this.mdiv).html(novo);
    //   },
    //   diferente:  function(novo){
    //     $('spam', this.mdiv).html(novo);
    //   }
    // }

    function isInsideTriangle(x1, y1, x2, y2, x3, y3, x, y){

        var ab = (x1-x)*(y2-y)-(x2-x)*(y1-y);
        var bc = (x2-x)*(y3-y)-(x3-x)*(y2-y);
        var ca = (x3-x)*(y1-y)-(x1-x)*(y3-y);

        if(ab >= 0 && bc >= 0 && ca >= 0) return true;
        if(ab <= 0 && bc <= 0 && ca <= 0) return true;

        return false;
    }




    ns.HSVTriangle = function(ops){
        this.ops = $.extend({border:.20}, ops);
        // console.debug(ops);
        this.dc = this.ops.canvas.getContext('2d');
        this.callback = undefined;
        this.center = this.ops.canvas.width/2;  //TODO make sure canvas is square
        this.externalrad = this.center;
        this.internalrad = this.externalrad*(1-this.ops.border);
        this.triCoords = Array();
        this.hue = 0;
        this.sat = 50;
        this.val = 50;
        this.onRing = false;
        this.onTriangle = false;

        this.draw();

        var that = this;

        this.ops.canvas.addEventListener('mousedown',  function(ev){
            // console.log('x:'+ev.offsetX+' y:'+ev.offsetY);
            var dx = ev.offsetX-that.center;
            var dy = ev.offsetY-that.center;
            var d = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
            if(d >= that.internalrad && d <= that.externalrad){
                that.hue = ((Math.atan2(-dy, dx)*180/Math.PI)+720)%360;
                that.onRing = true;
                that.draw();
            }

            if(isInsideTriangle(that.triCoords[0], that.triCoords[1],
                                that.triCoords[2], that.triCoords[3],
                                that.triCoords[4], that.triCoords[5],
                                ev.offsetX, ev.offsetY)){
                console.log('dentro');
                that.onTriangle = true;
                //TODO
                that.draw();
            }

        }, false);

        this.ops.canvas.addEventListener('mousemove', function(ev){
            if(that.onRing){
                var dx = ev.offsetX-that.center;
                var dy = ev.offsetY-that.center;
                var a = ((Math.atan2(-dy, dx)*180/Math.PI)+720)%360;
                that.hue = a;
                that.draw();
            }

            if(that.onTriangle){
                //TODO
                that.draw();
            }

        }, false);

        this.ops.canvas.addEventListener('mouseup', function(ev){
            that.onRing = false;
            that.onTriangle = false;
        }, false);
    }

    ns.HSVTriangle.prototype = {
        contructor: ns.HSVTriangle,
        setRGB: function(r, g, b){

        },
        setHSL: function(h, s, l){

        },
        setHSV: function(h, s, v){

        },
        setHSI: function(h, s, i){

        },
        setCallback: function(cb){
            this.callback = cb;
        },
        getColor: function(){

            var c = {r:0, g:0, b:0};

            return c;
        },
        draw: function(){
            var rad;

            //clean canvas
            this.dc.clearRect(0, 0, this.ops.canvas.width, this.ops.canvas.height);

            //draw hue ring
            for(var i = 0; i < 360; i += .2){
                rad = (i*2*Math.PI)/360;
                this.dc.strokeStyle = "hsl("+i+", 100%, 50%)";
                this.dc.beginPath();
                this.dc.moveTo(this.center+this.internalrad*Math.cos(rad), this.center-this.internalrad*Math.sin(rad));
                this.dc.lineTo(this.center+this.externalrad*Math.cos(rad), this.center-this.externalrad*Math.sin(rad));
                this.dc.stroke();
            }

            //draw hue indicator
            this.dc.strokeStyle = "black";
            this.dc.lineWidth = 2;
            this.dc.beginPath();
            rad = (this.hue*2*Math.PI)/360;
            this.dc.moveTo(this.center+this.internalrad*Math.cos(rad), this.center-this.internalrad*Math.sin(rad));
            this.dc.lineTo(this.center+this.externalrad*Math.cos(rad), this.center-this.externalrad*Math.sin(rad));
            this.dc.stroke();

            //calculate internal triangle coords
            rad = (this.hue*2*Math.PI)/360;
            this.triCoords[0] = this.center+this.internalrad*Math.cos(rad);  //X of hue point
            this.triCoords[1] = this.center-this.internalrad*Math.sin(rad);  //Y
            var rad2 = (((this.hue+120)%360)*2*Math.PI)/360;
            this.triCoords[2] = this.center+this.internalrad*Math.cos(rad2); //X of black edge
            this.triCoords[3] = this.center-this.internalrad*Math.sin(rad2); //Y
            rad2 = (((this.hue+240)%360)*2*Math.PI)/360;
            this.triCoords[4] = this.center+this.internalrad*Math.cos(rad2); //X of white edge
            this.triCoords[5] = this.center-this.internalrad*Math.sin(rad2); //Y

            //draw triangle
            //TODO fill in with gradient color from hue
            this.dc.lineWidth = 1;
            this.dc.moveTo(this.triCoords[0], this.triCoords[1]);
            this.dc.lineTo(this.triCoords[2], this.triCoords[3]);
            this.dc.lineTo(this.triCoords[4], this.triCoords[5]);
            this.dc.lineTo(this.triCoords[0], this.triCoords[1]);
            this.dc.stroke();

            //draw SV indicator

            // this.dc.strokeStyle = 'green';
            // rad = (this.hue*2*Math.PI)/360;
            // this.dc.moveTo(this.center+this.internalrad*Math.cos(rad), this.center-this.internalrad*Math.sin(rad));
            // var rad2 = (((this.hue+120)%360)*2*Math.PI)/360;
            // this.dc.lineTo(this.center+this.internalrad*Math.cos(rad2), this.center-this.internalrad*Math.sin(rad2));
            // var rad2 = (((this.hue+240)%360)*2*Math.PI)/360;
            // this.dc.lineTo(this.center+this.internalrad*Math.cos(rad2), this.center-this.internalrad*Math.sin(rad2));
            // this.dc.lineTo(this.center+this.internalrad*Math.cos(rad), this.center-this.internalrad*Math.sin(rad));
            // this.dc.stroke();


        }
    }

}( window.xcor = window.xcor || {}, jQuery ));






(function(ns, $, undefined){

    function rgb2hsv(r, g, b){
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

    function rgb2hsl(r, g, b){
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

    function rgb2hsi(r, g, b){}

    function rgb2cmyk(r, g, b){
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

    function hsv2rgb(h, s, v){
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

    function hsl2rgb(h, s, l){
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

    function hsi2rgb(h, s, i){}

    function cmyk2rgb(c, m, y, k){
        var r, g, b;

        r = (1-c)*(1-k);
        g = (1-m)*(1-k);
        b = (1-y)*(1-k);

        return [Math.round(r*255), Math.round(g*255), Math.round(b*255)];
    }

    $(function(){
        var tri = new ns.HSVTriangle({canvas:$('#c_triangle').get(0)});
        var bla = new ns.HSVTriangle({canvas:$('#c_triangle2').get(0)});
        var asda = new ns.HSVTriangle({canvas:$('#c_triangle3').get(0), border:.5});


        $("#2hsv").click(function(){
            var r = rgb2hsv(parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val()));
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

        $("#2hsl").click(function(){
            var r = rgb2hsl(parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val()));
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

        $("#2hsi").click(function(){

        });

        $("#2cmyk").click(function(){
            var r = rgb2cmyk(parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val()));
            var o = r[0]+'-'+r[1]+'-'+r[2]+'-'+r[3]
            $("#mout").html(o);
        });

        $("#hsv2").click(function(){
            var r = hsv2rgb(parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val()));
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

        $("#hsl2").click(function(){
            var r = hsl2rgb(parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val()));
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

        $("#hsi2").click(function(){

        });

        $("#cmyk2").click(function(){
            var r = cmyk2rgb(parseFloat($('#ina').val()), parseFloat($('#inb').val()), parseFloat($('#inc').val()), parseFloat($('#ind').val()));
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });




    });

}( window.xcor = window.xcor || {}, jQuery ));

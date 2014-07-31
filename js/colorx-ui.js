(function(ns, $, undefined){

    // ns.bla = function(ops){
    //     this.ops = $.extend({}, ops);
    // }

    // ns.bla.prototype = {
    //     constructor: ns.bla,
    //     set: function(d){},
    //     getPos: function(){}
    // }

    function isInsideTriangle(x1, y1, x2, y2, x3, y3, x, y){

        var ab = (x1-x)*(y2-y)-(x2-x)*(y1-y);
        var bc = (x2-x)*(y3-y)-(x3-x)*(y2-y);
        var ca = (x3-x)*(y1-y)-(x1-x)*(y3-y);

        if(ab >= 0 && bc >= 0 && ca >= 0) return true;
        if(ab <= 0 && bc <= 0 && ca <= 0) return true;

        return false;
    }


    function angleBetween(p1x, p1y, p0x, p0y, p2x, p2y){
        var m01 = Math.pow(p1x-p0x, 2) + Math.pow(p1y-p0y, 2),
            m02 = Math.pow(p2x-p0x, 2) + Math.pow(p2y-p0y, 2),
            m12 = Math.pow(p1x-p2x, 2) + Math.pow(p1y-p2y, 2);
        return Math.acos( (m01+m12-m02) / Math.sqrt(4*m01*m12) );
    }



 //  _    _  _______      _________   _                   _
 // | |  | |/ ____\ \    / /__   __| (_)                 | |
 // | |__| | (___  \ \  / /   | |_ __ _  __ _ _ __   __ _| | ___
 // |  __  |\___ \  \ \/ /    | | '__| |/ _` | '_ \ / _` | |/ _ \
 // | |  | |____) |  \  /     | | |  | | (_| | | | | (_| | |  __/
 // |_|  |_|_____/    \/      |_|_|  |_|\__,_|_| |_|\__, |_|\___|
 //                                                  __/ |
 //                                                 |___/
    ns.HSVTriangle = function(ops){
        this.ops = $.extend({border:.20, margin:0, hue:0, sat:100, val:100}, ops);
        // console.debug(ops);
        this.dc = this.ops.canvas.getContext('2d');
        this.callback = undefined;
        this.center = this.ops.canvas.width/2;  //TODO make sure canvas is square
        this.externalrad = this.center-this.ops.margin;
        this.internalrad = this.externalrad*(1-this.ops.border);
        this.triCoords = Array();
        this.hue = this.ops.hue;
        this.sat = this.ops.sat;
        this.val = this.ops.val;
        this.onRing = false;
        this.onTriangle = false;

        this.draw();

        var that = this;

        function discoverSandV(x, y){
            var a = 3*that.internalrad/1.73205;  //a is triangle side length
            var h = 3*that.internalrad/2;        //h is triangle height

            var d = Math.sqrt(Math.pow(that.triCoords[0]-x, 2)+Math.pow(that.triCoords[1]-y, 2));

            var angle = angleBetween(that.triCoords[0], that.triCoords[1],
                                     x, y,
                                     that.triCoords[4], that.triCoords[5]);

            var hhh = d*Math.sin(angle);
            that.val = Math.min(100, Math.max(0, Math.round((1-hhh/h)*100)));

            angle = angleBetween(that.triCoords[2], that.triCoords[3],
                                 x, y,
                                 that.triCoords[4], that.triCoords[5]);
            var sss = angle/(Math.PI/3);

            that.sat = Math.min(100, Math.max(0, Math.round(sss*100)));
        }

        this.ops.canvas.addEventListener('mousedown',  function(ev){
            // console.log('x:'+ev.offsetX+' y:'+ev.offsetY);
            var dx = ev.offsetX-that.center;
            var dy = ev.offsetY-that.center;
            var d = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
            if(d >= that.internalrad && d <= that.externalrad){
                that.hue = ((Math.atan2(-dy, dx)*180/Math.PI)+720)%360;
                that.onRing = true;
                that.draw();
                if(that.callback){
                    that.callback(that);
                }
            }

            if(isInsideTriangle(that.triCoords[0], that.triCoords[1],
                                that.triCoords[2], that.triCoords[3],
                                that.triCoords[4], that.triCoords[5],
                                ev.offsetX, ev.offsetY)){
                // console.log('dentro');
                that.onTriangle = true;

                discoverSandV(ev.offsetX, ev.offsetY);

                that.draw();
                if(that.callback){
                    that.callback(that);
                }
            }

            ev.preventDefault();

        }, false);

        this.ops.canvas.addEventListener('mousemove', function(ev){
            if(that.onRing){
                var dx = ev.offsetX-that.center;
                var dy = ev.offsetY-that.center;
                var a = ((Math.atan2(-dy, dx)*180/Math.PI)+720)%360;
                that.hue = a;
                that.draw();
                if(that.callback){
                    that.callback(that);
                }
            }

            if(that.onTriangle){
                if(isInsideTriangle(that.triCoords[0], that.triCoords[1],
                                    that.triCoords[2], that.triCoords[3],
                                    that.triCoords[4], that.triCoords[5],
                                    ev.offsetX, ev.offsetY)){
                    discoverSandV(ev.offsetX, ev.offsetY);
                    that.draw();
                    if(that.callback){
                        that.callback(that);
                    }
                }
            }

        }, false);

        this.ops.canvas.addEventListener('mouseup', function(ev){
            that.onRing = false;
            that.onTriangle = false;
        }, false);

        this.ops.canvas.addEventListener('mouseout', function(ev){
            that.onRing = false;
            that.onTriangle = false;
        }, false);
    }

    ns.HSVTriangle.prototype = {
        contructor: ns.HSVTriangle,
        setRGB: function(rgb){
            var tmp = colorx.rgb2hsv(rgb);
            this.hue = tmp[0];
            this.sat = tmp[1];
            this.val = tmp[2];
            this.draw();
            if(this.callback){
                this.callback(this);
            }
        },
        setHSL: function(hsl){
            var tmp = colorx.rgb2hsv(colorx.hsl2rgb(hsl));
            this.hue = tmp[0];
            this.sat = tmp[1];
            this.val = tmp[2];
            this.draw();
            if(this.callback){
                this.callback(this);
            }
        },
        setHSV: function(hsv){
            this.hue = hsv[0];
            this.sat = hsv[1];
            this.val = hsv[2];
            this.draw();
            if(this.callback){
                this.callback(this);
            }
        },
        getRGB: function(){
            return colorx.hsv2rgb([this.hue, this.sat, this.val]);
        },
        getHSL: function(){
            return colorx.rgb2hsl(colorx.hsv2rgb([this.hue, this.sat, this.val]));
        },
        getHSV: function(){
            return [this.hue, this.sat, this.val];
        },
        setCallback: function(cb){
            this.callback = cb;
            if(this.callback){
                this.callback(this);
            }
        },
        draw: function(){
            var rad, cos, sin;

            //clean canvas
            this.dc.clearRect(0, 0, this.ops.canvas.width, this.ops.canvas.height);

            //draw hue ring
            for(var i = 0; i < 360; i += .2){
                rad = (i*Math.PI)/180;
                cos = Math.cos(rad);
                sin = Math.sin(rad);
                this.dc.strokeStyle = "hsl("+i+", 100%, 50%)";
                this.dc.beginPath();
                this.dc.moveTo(this.center+this.internalrad*cos, this.center-this.internalrad*sin);
                this.dc.lineTo(this.center+this.externalrad*cos, this.center-this.externalrad*sin);
                this.dc.stroke();
            }

            //draw hue indicator
            this.dc.strokeStyle = "black";
            this.dc.lineWidth = 2;
            this.dc.beginPath();
            rad = (this.hue*Math.PI)/180;
            cos = Math.cos(rad);
            sin = Math.sin(rad);
            this.dc.moveTo(this.center+this.internalrad*cos, this.center-this.internalrad*sin);
            this.dc.lineTo(this.center+this.externalrad*cos, this.center-this.externalrad*sin);
            this.dc.stroke();

            //calculate internal triangle coords
            rad = (this.hue*Math.PI)/180;
            this.triCoords[0] = this.center+this.internalrad*Math.cos(rad);  //X of hue point
            this.triCoords[1] = this.center-this.internalrad*Math.sin(rad);  //Y
            rad = (((this.hue+120)%360)*Math.PI)/180;
            this.triCoords[2] = this.center+this.internalrad*Math.cos(rad); //X of black edge
            this.triCoords[3] = this.center-this.internalrad*Math.sin(rad); //Y
            rad = (((this.hue+240)%360)*Math.PI)/180;
            this.triCoords[4] = this.center+this.internalrad*Math.cos(rad); //X of white edge
            this.triCoords[5] = this.center-this.internalrad*Math.sin(rad); //Y

            //draw triangle border
            // this.dc.lineWidth = 1;
            // this.dc.beginPath();
            // this.dc.moveTo(this.triCoords[0], this.triCoords[1]);
            // this.dc.lineTo(this.triCoords[2], this.triCoords[3]);
            // this.dc.lineTo(this.triCoords[4], this.triCoords[5]);
            // this.dc.lineTo(this.triCoords[0], this.triCoords[1]);
            // this.dc.stroke();

            //draw triangle filled with gradient color
            var a = 3*this.internalrad/1.73205;  //a is triangle side length

            rad = ((this.hue-90)*Math.PI)/180;
            cos = Math.cos(rad);
            sin = Math.sin(rad);

            rad = ((this.hue-90+60)*Math.PI)/180;
            var cos2 = Math.cos(rad);
            var sin2 = Math.sin(rad);

            var p1x, p1y, p2x, p2y, vv, grd;

            this.dc.lineWidth = 1;
            for(var v = 0; v < a; v += .2){
                p1x = this.triCoords[2]+v*cos;
                p1y = this.triCoords[3]-v*sin;
                p2x = this.triCoords[2]+v*cos2;
                p2y = this.triCoords[3]-v*sin2;

                grd = this.dc.createLinearGradient(p1x, p1y, p2x, p2y);

                vv = v/a;  //vv = hsv value ranging 0 to 1

                //here we have to convert hsv to CSS hsl
                //vv is value ranging 0 to 1
                //hsl should gradient saturation from 0 to 100%
                //using this calulation: http://codeitdown.com/hsl-hsb-hsv-color
                //we can simplify:
                //HSV(h, 0, v) -> HSV(h, 100, v)  ===  HSL(h, 0, v) -> HSL(h, 100, v/2)

                grd.addColorStop(0, "hsl("+this.hue+",0%,"+Math.round(vv*100)+"%)");
                grd.addColorStop(1, "hsl("+this.hue+",100%,"+Math.round(vv*50)+"%)");
                this.dc.strokeStyle = grd;

                this.dc.beginPath();
                this.dc.moveTo(p1x, p1y);
                this.dc.lineTo(p2x, p2y);
                this.dc.stroke();
            }

            //draw SV indicator
            vv = a*this.val/100;
            p1x = this.triCoords[2]+vv*cos;
            p1y = this.triCoords[3]-vv*sin;
            p2x = this.triCoords[2]+vv*cos2;
            p2y = this.triCoords[3]-vv*sin2;

            var d = Math.sqrt((p1x-p2x)*(p1x-p2x)+(p1y-p2y)*(p1y-p2y))*this.sat/100;

            rad = ((this.hue+30)*Math.PI)/180;
            p2x = p1x+d*Math.cos(rad);
            p2y = p1y-d*Math.sin(rad);

            this.dc.strokeStyle = 'black';
            this.dc.beginPath();
            this.dc.arc(p2x, p2y, 4, 0, 2*Math.PI);
            this.dc.stroke();
            this.dc.strokeStyle = 'white';
            this.dc.beginPath();
            this.dc.arc(p2x, p2y, 3, 0, 2*Math.PI);
            this.dc.stroke();
        }
    }


 //   _____ _ _     _
 //  / ____| (_)   | |
 // | (___ | |_  __| | ___ _ __
 //  \___ \| | |/ _` |/ _ \ '__|
 //  ____) | | | (_| |  __/ |
 // |_____/|_|_|\__,_|\___|_|

    ns.Slider = function(ops){
        this.ops = $.extend({max:100, min:0, pos:0}, ops);
        this.max = this.ops.max;
        this.min = this.ops.min;
        this.position = this.ops.pos;
        this.dc = this.ops.canvas.getContext('2d');
        this.moving = false;
        this.draw();

        var that = this;

        this.ops.canvas.addEventListener('mousedown',  function(ev){
            // console.log('x:'+ev.offsetX+' y:'+ev.offsetY);
            that.moving = true;
            //TODO

            that.draw();
            ev.preventDefault();
            if(that.callback){
                that.callback(that);
            }
        }, false);

        this.ops.canvas.addEventListener('mousemove', function(ev){
            if(that.moving){
                //TODO
                that.draw();
                if(that.callback){
                    that.callback(that);
                }
            }
        }, false);

        this.ops.canvas.addEventListener('mouseup', function(ev){
            that.moving = false;
        }, false);

        this.ops.canvas.addEventListener('mouseout', function(ev){
            that.moving = false;
        }, false);

        this.ops.canvas.addEventListener('mousewheel', function(ev){
            // console.log(ev);
            that.position += Math.max(-1, Math.min(1, ev.wheelDeltaY));
            that.position += Math.max(-1, Math.min(1, -ev.wheelDeltaX))*25;
            that.position = Math.max(that.min, Math.min(that.max, that.position));
            ev.preventDefault();
            if(that.callback){
                that.callback(that);
            }
            that.draw();
        }, false);
    }

    ns.Slider.prototype = {
        constructor: ns.Slider,
        set: function(d){
            if(d.max !== undefined) this.max = d.max;
            if(d.min !== undefined) this.min = d.min;
            if(d.pos !== undefined) this.position = d.pos;
            if(this.callback){
                this.callback(this);
            }
            draw();
        },
        getPos: function(){
            return this.position;
        },
        setCallback: function(cb){
            this.callback = cb;
            if(this.callback){
                // this.callback(this);
            }
        },
        getFill: function(){
            return 'white';
        },
        draw: function(){

            //clean canvas
            this.dc.clearRect(0, 0, this.ops.canvas.width, this.ops.canvas.height);

            //draw left button
            //draw right button
            //draw border
            //fill background
            this.dc.fillStyle = this.getFill();
            this.dc.fillRect(0, 0, this.ops.canvas.width, this.ops.canvas.height);

            //draw text
            this.dc.textAlign = "center";
            this.dc.textBaseline = "middle";
            this.dc.fillStyle = 'white';
            this.dc.fillText(''+this.position, this.ops.canvas.width/2, this.ops.canvas.height/2);
            //draw cursor
            var w = this.ops.canvas.width;

            var p = this.max-this.min;
            var pp = w/p;
            var ppp = pp*this.position;
            this.dc.beginPath();
            this.dc.strokeStyle = 'white';
            this.dc.lineWidth = 3;
            this.dc.moveTo(ppp, 0);
            this.dc.lineTo(ppp, this.ops.canvas.height);
            this.dc.stroke();
            this.dc.beginPath();
            this.dc.strokeStyle = 'black';
            this.dc.lineWidth = 1;
            this.dc.moveTo(ppp, 0);
            this.dc.lineTo(ppp, this.ops.canvas.height);
            this.dc.stroke();
        }
    }



 //   _____ _ _     _           _____  ______ _____
 //  / ____| (_)   | |         |  __ \|  ____|  __ \
 // | (___ | |_  __| | ___ _ __| |__) | |__  | |  | |
 //  \___ \| | |/ _` |/ _ \ '__|  _  /|  __| | |  | |
 //  ____) | | | (_| |  __/ |  | | \ \| |____| |__| |
 // |_____/|_|_|\__,_|\___|_|  |_|  \_\______|_____/

    ns.SliderRed = function(ops){
        this.position = ops.r || 255;
        this.G = ops.g || 0;
        this.B = ops.b || 0;
        ns.Slider.call(this, $.extend({max:255, pos:255}, ops));
    }
    ns.SliderRed.prototype = Object.create(ns.Slider.prototype);
    ns.SliderRed.prototype.constructor = ns.SliderRed;

    ns.SliderRed.prototype.getFill = function(){
        var grd = this.dc.createLinearGradient(0, 0, this.ops.canvas.width, 0);
        grd.addColorStop(0, "rgb(0,"+this.G+","+this.B+")");
        grd.addColorStop(1, "rgb(255,"+this.G+","+this.B+")");
        return grd;
    }

    ns.SliderRed.prototype.setRGB = function(rgb){
        this.position = rgb[0];
        this.G = rgb[1];
        this.B = rgb[2];
        this.draw();
    }

    ns.SliderRed.prototype.getRGB = function(){
        return [this.position, this.G, this.B];
    }


 //   _____ _ _     _            _____ _____  ______ ______ _   _
 //  / ____| (_)   | |          / ____|  __ \|  ____|  ____| \ | |
 // | (___ | |_  __| | ___ _ __| |  __| |__) | |__  | |__  |  \| |
 //  \___ \| | |/ _` |/ _ \ '__| | |_ |  _  /|  __| |  __| | . ` |
 //  ____) | | | (_| |  __/ |  | |__| | | \ \| |____| |____| |\  |
 // |_____/|_|_|\__,_|\___|_|   \_____|_|  \_\______|______|_| \_|

    ns.SliderGreen = function(ops){
        this.R = ops.r || 255;
        this.position = ops.g || 0;
        this.B = ops.b || 0;
        ns.Slider.call(this, $.extend({max:255}, ops));
    }
    ns.SliderGreen.prototype = Object.create(ns.Slider.prototype);
    ns.SliderGreen.prototype.constructor = ns.SliderGreen;

    ns.SliderGreen.prototype.getFill = function(){
        var grd = this.dc.createLinearGradient(0, 0, this.ops.canvas.width, 0);
        grd.addColorStop(0, "rgb("+this.R+",0,"+this.B+")");
        grd.addColorStop(1, "rgb("+this.R+",255,"+this.B+")");
        return grd;
    }

    ns.SliderGreen.prototype.setRGB = function(rgb){
        this.R = rgb[0];
        this.position = rgb[1];
        this.B = rgb[2];
        this.draw();
    }

    ns.SliderGreen.prototype.getRGB = function(){
        return [this.R, this.position, this.B];
    }


 //   _____ _ _     _           ____  _     _    _ ______
 //  / ____| (_)   | |         |  _ \| |   | |  | |  ____|
 // | (___ | |_  __| | ___ _ __| |_) | |   | |  | | |__
 //  \___ \| | |/ _` |/ _ \ '__|  _ <| |   | |  | |  __|
 //  ____) | | | (_| |  __/ |  | |_) | |___| |__| | |____
 // |_____/|_|_|\__,_|\___|_|  |____/|______\____/|______|

    ns.SliderBlue = function(ops){
        this.R = ops.r || 255;
        this.G = ops.g || 0;
        this.position = ops.b || 0;
        ns.Slider.call(this, $.extend({max:255}, ops));
    }
    ns.SliderBlue.prototype = Object.create(ns.Slider.prototype);
    ns.SliderBlue.prototype.constructor = ns.SliderBlue;

    ns.SliderBlue.prototype.getFill = function(){
        var grd = this.dc.createLinearGradient(0, 0, this.ops.canvas.width, 0);
        grd.addColorStop(0, "rgb("+this.R+","+this.G+",0)");
        grd.addColorStop(1, "rgb("+this.R+","+this.G+",255)");
        return grd;
    }

    ns.SliderBlue.prototype.setRGB = function(rgb){
        this.R = rgb[0];
        this.G = rgb[1];
        this.position = rgb[2];
        this.draw();
    }

    ns.SliderBlue.prototype.getRGB = function(){
        return [this.R, this.G, this.position];
    }



 //   _____ _ _     _           _    _ _    _ ______
 //  / ____| (_)   | |         | |  | | |  | |  ____|
 // | (___ | |_  __| | ___ _ __| |__| | |  | | |__
 //  \___ \| | |/ _` |/ _ \ '__|  __  | |  | |  __|
 //  ____) | | | (_| |  __/ |  | |  | | |__| | |____
 // |_____/|_|_|\__,_|\___|_|  |_|  |_|\____/|______|

    ns.SliderHSV_H = function(ops){
        this.position = ops.h || 0;
        this.S = ops.s || 100;
        this.V = ops.v || 100;
        ns.Slider.call(this, $.extend({max:360}, ops));
    }
    ns.SliderHSV_H.prototype = Object.create(ns.Slider.prototype);
    ns.SliderHSV_H.prototype.constructor = ns.SliderHSV_H;

    ns.SliderHSV_H.prototype.getFill = function(){
        var grd = this.dc.createLinearGradient(0, 0, this.ops.canvas.width, 0);
        grd.addColorStop(0, "hsl(0, 100%, 50%)");
        grd.addColorStop(1/6, "hsl(60, 100%, 50%)");
        grd.addColorStop(1/3, "hsl(120, 100%, 50%)");
        grd.addColorStop(1/2, "hsl(180, 100%, 50%)");
        grd.addColorStop(2/3, "hsl(240, 100%, 50%)");
        grd.addColorStop(5/6, "hsl(300, 100%, 50%)");
        grd.addColorStop(1, "hsl(360, 100%, 50%)");
        return grd;
    }

    ns.SliderHSV_H.prototype.setRGB = function(rgb){
        var tmp = colorx.rgb2hsv(rgb);
        this.position = tmp[0];
        this.S = tmp[1];
        this.V = tmp[2];
        this.draw();
    }

    ns.SliderHSV_H.prototype.getRGB = function(){
        return colorx.hsv2rgb([this.position, this.S, this.V]);
    }



 //   _____ _ _     _           _    _  _______      __     _____      _______
 //  / ____| (_)   | |         | |  | |/ ____\ \    / /    / ____|  /\|__   __|
 // | (___ | |_  __| | ___ _ __| |__| | (___  \ \  / /____| (___   /  \  | |
 //  \___ \| | |/ _` |/ _ \ '__|  __  |\___ \  \ \/ /______\___ \ / /\ \ | |
 //  ____) | | | (_| |  __/ |  | |  | |____) |  \  /       ____) / ____ \| |
 // |_____/|_|_|\__,_|\___|_|  |_|  |_|_____/    \/       |_____/_/    \_\_|

    ns.SliderHSV_S = function(ops){
        this.H = ops.h || 0;
        this.position = ops.s || 100;
        this.V = ops.v || 100;
        ns.Slider.call(this, $.extend({pos:100}, ops));
    }
    ns.SliderHSV_S.prototype = Object.create(ns.Slider.prototype);
    ns.SliderHSV_S.prototype.constructor = ns.SliderHSV_S;

    ns.SliderHSV_S.prototype.getFill = function(){
        // var grd = this.dc.createLinearGradient(0, 0, this.ops.canvas.width, 0);
        // grd.addColorStop(0, "hsl("+this.H+",0%,"+this.V+"%)");
        // grd.addColorStop(1, "hsl("+this.H+",100%,"+this.V+"%)");
        return 'black';
    }

    ns.SliderHSV_S.prototype.setRGB = function(rgb){
        var tmp = colorx.rgb2hsv(rgb);
        this.H = tmp[0];
        this.position = tmp[1];
        this.V = tmp[2];
        this.draw();
    }

    ns.SliderHSV_S.prototype.getRGB = function(){
        return colorx.hsv2rgb([this.H, this.position, this.V]);
    }



 //   _____ _ _     _           _    _  _______      __  __      __     _
 //  / ____| (_)   | |         | |  | |/ ____\ \    / /  \ \    / /\   | |
 // | (___ | |_  __| | ___ _ __| |__| | (___  \ \  / /____\ \  / /  \  | |
 //  \___ \| | |/ _` |/ _ \ '__|  __  |\___ \  \ \/ /______\ \/ / /\ \ | |
 //  ____) | | | (_| |  __/ |  | |  | |____) |  \  /        \  / ____ \| |____
 // |_____/|_|_|\__,_|\___|_|  |_|  |_|_____/    \/          \/_/    \_\______|

    ns.SliderHSV_V = function(ops){
        this.H = ops.h || 0;
        this.S = ops.s || 100;
        this.position = ops.v || 100;
        ns.Slider.call(this, $.extend({pos:100}, ops));
    }
    ns.SliderHSV_V.prototype = Object.create(ns.Slider.prototype);
    ns.SliderHSV_V.prototype.constructor = ns.SliderHSV_V;

    ns.SliderHSV_V.prototype.getFill = function(){
        // var grd = this.dc.createLinearGradient(0, 0, this.ops.canvas.width, 0);
        // grd.addColorStop(0, "hsl("+this.H+",0%,"+this.V+"%)");
        // grd.addColorStop(1, "hsl("+this.H+",100%,"+this.V+"%)");
        return 'black';
    }

    ns.SliderHSV_V.prototype.setRGB = function(rgb){
        var tmp = colorx.rgb2hsv(rgb);
        this.H = tmp[0];
        this.S = tmp[1];
        this.position = tmp[2];
        this.draw();
    }

    ns.SliderHSV_V.prototype.getRGB = function(){
        return colorx.hsv2rgb([this.H, this.S, this.position]);
    }



 //   _____ _ _     _           _    _  _____ _          _____      _______
 //  / ____| (_)   | |         | |  | |/ ____| |        / ____|  /\|__   __|
 // | (___ | |_  __| | ___ _ __| |__| | (___ | |  _____| (___   /  \  | |
 //  \___ \| | |/ _` |/ _ \ '__|  __  |\___ \| | |______\___ \ / /\ \ | |
 //  ____) | | | (_| |  __/ |  | |  | |____) | |____    ____) / ____ \| |
 // |_____/|_|_|\__,_|\___|_|  |_|  |_|_____/|______|  |_____/_/    \_\_|

    ns.SliderHSL_S = function(ops){
        this.H = ops.h || 0;
        this.position = ops.s || 100;
        this.L = ops.l || 50;
        ns.Slider.call(this, $.extend({pos:100}, ops));
    }
    ns.SliderHSL_S.prototype = Object.create(ns.Slider.prototype);
    ns.SliderHSL_S.prototype.constructor = ns.SliderHSL_S;

    ns.SliderHSL_S.prototype.getFill = function(){
        var grd = this.dc.createLinearGradient(0, 0, this.ops.canvas.width, 0);
        grd.addColorStop(0, "hsl("+this.H+",0%,"+this.L+"%)");
        grd.addColorStop(1, "hsl("+this.H+",100%,"+this.L+"%)");
        return grd;
    }

    ns.SliderHSL_S.prototype.setRGB = function(rgb){
        var tmp = colorx.rgb2hsl(rgb);
        this.H = tmp[0];
        this.position = tmp[1];
        this.L = tmp[2];
        this.draw();
    }

    ns.SliderHSL_S.prototype.getRGB = function(){
        return colorx.hsl2rgb([this.H, this.position, this.L]);
    }


 //   _____ _ _     _           _    _  _____ _          _      _____ _______
 //  / ____| (_)   | |         | |  | |/ ____| |        | |    |_   _|__   __|
 // | (___ | |_  __| | ___ _ __| |__| | (___ | |  ______| |      | |    | |
 //  \___ \| | |/ _` |/ _ \ '__|  __  |\___ \| | |______| |      | |    | |
 //  ____) | | | (_| |  __/ |  | |  | |____) | |____    | |____ _| |_   | |
 // |_____/|_|_|\__,_|\___|_|  |_|  |_|_____/|______|   |______|_____|  |_|

    ns.SliderHSL_L = function(ops){
        this.H = ops.h || 0;
        this.S = ops.s || 100;
        this.position = ops.l || 50;
        ns.Slider.call(this, $.extend({pos:50}, ops));
    }
    ns.SliderHSL_L.prototype = Object.create(ns.Slider.prototype);
    ns.SliderHSL_L.prototype.constructor = ns.SliderHSL_L;

    ns.SliderHSL_L.prototype.getFill = function(){
        var grd = this.dc.createLinearGradient(0, 0, this.ops.canvas.width, 0);
        grd.addColorStop(0, "hsl("+this.H+","+this.S+"%,0%)");
        grd.addColorStop(.5, "hsl("+this.H+","+this.S+"%,50%)");
        grd.addColorStop(1, "hsl("+this.H+","+this.S+"%,100%)");
        return grd;
    }

    ns.SliderHSL_L.prototype.setRGB = function(rgb){
        var tmp = colorx.rgb2hsl(rgb);
        this.H = tmp[0];
        this.S = tmp[1];
        this.position = tmp[2];
        this.draw();
    }

    ns.SliderHSL_L.prototype.getRGB = function(){
        return colorx.hsl2rgb([this.H, this.S, this.position]);
    }



}( window.colorx = window.colorx || {}, jQuery ));

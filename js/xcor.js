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

        var that = this;

        this.triCoords = Array();

        this.hue = 0;
        this.sat = 50;
        this.val = 50;

        this.onRing = false;
        this.onTriangle = false;

        this.ops.canvas.addEventListener('mousedown',  function(ev){
            // console.log('x:'+ev.offsetX+' y:'+ev.offsetY);
            var dx = ev.offsetX-that.center;
            var dy = ev.offsetY-that.center;
            // console.log('x:'+dx+' y:'+dy)
            var d = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2));
            var a = ((Math.atan2(-dy, dx)*180/Math.PI)+720)%360;
            // console.log(d);
            // console.log(a);
            if(d >= that.internalrad && d <= that.externalrad){
                // console.log('dentro');
                that.hue = a;
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

        this.draw();
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

    $(function(){
        var tri = new ns.HSVTriangle({canvas:$('#c_triangle').get(0)});
        var bla = new ns.HSVTriangle({canvas:$('#c_triangle2').get(0)});
        var asda = new ns.HSVTriangle({canvas:$('#c_triangle3').get(0), border:.5});
    });

}( window.xcor = window.xcor || {}, jQuery ));

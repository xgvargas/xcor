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

    ns.Triangle = function(ops){
        this.ops = $.extend({border:.20}, ops);
        // console.debug(ops);
        this.dc = this.ops.canvas.getContext('2d');
        this.callback = undefined;
        this.center = this.ops.canvas.width/2;  //TODO make sure canvas is square
        this.externalrad = this.center;
        this.internalrad = this.externalrad*(1-this.ops.border);

        this.hue = 0;

        this.ops.canvas.addEventListener('mousedown',  function(ev){
            console.log('x:'+ev.offsetX+' y:'+ev.offsetY);
            console.log(Math.pow(ev.offsetX-this.center, 2)+Math.pow(ev.offsetY-this.center, 2));
            var d = Math.sqrt(Math.pow(ev.offsetX-this.center, 2)+Math.pow(ev.offsetY-this.center, 2));
            console.log(d);
        }, false);

        this.ops.canvas.addEventListener('mousemove', function(ev){
        }, false);

        this.ops.canvas.addEventListener('mouseup', function(ev){
        }, false);

        this.draw();
    }

    ns.Triangle.prototype = {
        contructor: ns.Triangle,
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
            for(var i = 0; i < 360; i += .2){
                var rad = (i*2*Math.PI)/360;
                this.dc.strokeStyle = "hsl("+i+", 100%, 50%)";
                this.dc.beginPath();
                this.dc.moveTo(this.center+this.internalrad*Math.cos(rad), this.center-this.internalrad*Math.sin(rad));
                this.dc.lineTo(this.center+this.externalrad*Math.cos(rad), this.center-this.externalrad*Math.sin(rad));
                this.dc.stroke();
            }

            this.dc.strokeStyle = "black";
            this.dc.lineWidth = 2;
            this.dc.beginPath();
            var rad = (this.hue*2*Math.PI)/360;
            this.dc.moveTo(this.center+this.internalrad*Math.cos(rad), this.center-this.internalrad*Math.sin(rad));
            this.dc.lineTo(this.center+this.externalrad*Math.cos(rad), this.center-this.externalrad*Math.sin(rad));
            this.dc.stroke();




        }
    }

}( window.xcor = window.xcor || {}, jQuery ));






(function(ns, $, undefined){

    $(function(){
        var tri = new ns.Triangle({canvas:$('#c_triangle').get(0)});
        var bla = new ns.Triangle({canvas:$('#c_triangle2').get(0)});
        var asda = new ns.Triangle({canvas:$('#c_triangle3').get(0), border:.5});
    });

}( window.xcor = window.xcor || {}, jQuery ));

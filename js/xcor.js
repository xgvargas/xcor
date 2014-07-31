
(function(ns, $, undefined){

    $(function(){
        var tri = new colorx.HSVTriangle({canvas:$('#c_triangle').get(0), margin:10});
        var bla = new colorx.HSVTriangle({canvas:$('#c_triangle2').get(0), hue:133, val:60, sat:75});
        var asda = new colorx.HSVTriangle({canvas:$('#c_triangle3').get(0), border:.5, hue:75});

        var blu = new colorx.Slider({canvas:$('#c_slider').get(0)});
        var rgb_R = new colorx.SliderRed({canvas:$('#c_slider_red').get(0)});
        var rgb_G = new colorx.SliderGreen({canvas:$('#c_slider_green').get(0)});
        var rgb_B = new colorx.SliderBlue({canvas:$('#c_slider_blue').get(0)});

        var hsv_H = new colorx.SliderHSV_H({canvas:$('#c_slider_hsv_h').get(0)});
        var hsv_S = new colorx.SliderHSV_S({canvas:$('#c_slider_hsv_s').get(0)});
        var hsv_V = new colorx.SliderHSV_V({canvas:$('#c_slider_hsv_v').get(0)});

        var hsl_S = new colorx.SliderHSL_S({canvas:$('#c_slider_hsl_s').get(0)});
        var hsl_L = new colorx.SliderHSL_L({canvas:$('#c_slider_hsl_l').get(0)});

        var obs = [tri, bla, asda, rgb_R, rgb_G, rgb_B, hsv_H, hsv_S, hsv_V, hsl_S, hsl_L];

        var alreadyIn = true;

        function callback(sender){
            var rgb = sender.getRGB();

            if(alreadyIn) return;

            alreadyIn = true;

            obs.forEach(function(o){
                if(o != sender){
                    o.setRGB(rgb);
                }
            });

            $('#teste').css({'background-color':'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')'});

            alreadyIn = false;
        }

        obs.forEach(function(o){
            o.setCallback(callback);
        });
        alreadyIn = false;


        $("#2hsv").click(function(){
            var r = colorx.rgb2hsv([parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val())]);
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

        $("#2hsl").click(function(){
            var r = colorx.rgb2hsl([parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val())]);
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

        $("#2hsi").click(function(){

        });

        $("#2cmyk").click(function(){
            var r = colorx.rgb2cmyk([parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val())]);
            var o = r[0]+'-'+r[1]+'-'+r[2]+'-'+r[3]
            $("#mout").html(o);
        });

        $("#hsv2").click(function(){
            var r = colorx.hsv2rgb([parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val())]);
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

        $("#hsl2").click(function(){
            var r = colorx.hsl2rgb([parseInt($('#ina').val()), parseInt($('#inb').val()), parseInt($('#inc').val())]);
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

        $("#hsi2").click(function(){

        });

        $("#cmyk2").click(function(){
            var r = colorx.cmyk2rgb([parseFloat($('#ina').val()), parseFloat($('#inb').val()), parseFloat($('#inc').val()), parseFloat($('#ind').val())]);
            var o = r[0]+'-'+r[1]+'-'+r[2]
            $("#mout").html(o);
        });

    });

}( window.xcor = window.xcor || {}, jQuery ));

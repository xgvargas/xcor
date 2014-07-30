
(function(ns, $, undefined){

    $(function(){
        var tri = new colorx.HSVTriangle({canvas:$('#c_triangle').get(0), margin:10});
        var bla = new colorx.HSVTriangle({canvas:$('#c_triangle2').get(0), hue:133, val:60, sat:75});
        var asda = new colorx.HSVTriangle({canvas:$('#c_triangle3').get(0), border:.5, hue:75});

        var blu = new colorx.Slider({canvas:$('#c_slider').get(0)});
        var rgb_R = new colorx.SliderRed({canvas:$('#c_slider_red').get(0), pos:30});
        var rgb_G = new colorx.SliderGreen({canvas:$('#c_slider_green').get(0), pos:30});
        var rgb_B = new colorx.SliderBlue({canvas:$('#c_slider_blue').get(0), pos:30});


        rgb_R.setCallback(function(o){
            tri.setRGB(o.getRGB());
        });

        tri.setCallback(function(o){
            var rgb = o.getRGB();
            $('#teste').css({'background-color':'rgb('+rgb[0]+','+rgb[1]+','+rgb[2]+')'});

            rgb_R.setRGB([rgb[0], rgb[1], rgb[2]]);
            rgb_G.setRGB([rgb[0], rgb[1], rgb[2]]);
            rgb_B.setRGB([rgb[0], rgb[1], rgb[2]]);
        });




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


(function(ns, $, undefined){

    $(function(){
        var tri = new colorx_ui.HSVTriangle({canvas:$('#c_triangle').get(0), margin:10});
        var bla = new colorx_ui.HSVTriangle({canvas:$('#c_triangle2').get(0)});
        var asda = new colorx_ui.HSVTriangle({canvas:$('#c_triangle3').get(0), border:.5});


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

$(function(){
    var timeOut = undefined;
    var textColor = "#000";
    // 加载下拉选框
    // 字体
    $(".wm-fontfamily-select").html("");
    for (let item in FONT_FAMILY_LIST) {
        $(".wm-fontfamily-select").append('<option value="' + item + '">' + FONT_FAMILY_LIST[item] + '</option>');
    }
    
    // 字号
    $(".wm-fontsize-select").html("");
    for (let item in FONT_SIZE) {
        $(".wm-fontsize-select").append('<option value="' + item + '">' + FONT_SIZE[item][0] + '</option>');
    }
    
    // 粗细
    $(".wm-fontweight-select").html("");
    for (let item in FONT_WEIGHT) {
        $(".wm-fontweight-select").append('<option value="' + item + '">' + FONT_WEIGHT[item] + '</option>');
    }
    
    // 组件声明
    var watermark = new Watermark();
    
    // 滑块组件
    $.fn.RangeSlider = function(cfg){
        this.sliderCfg = {
            min: cfg && !isNaN(parseFloat(cfg.min)) ? Number(cfg.min) : null, 
            max: cfg && !isNaN(parseFloat(cfg.max)) ? Number(cfg.max) : null,
            step: cfg && Number(cfg.step) ? cfg.step : 1,
            callback: cfg && cfg.callback ? cfg.callback : null
        };
    
        var $input = $(this);
        var min = this.sliderCfg.min;
        var max = this.sliderCfg.max;
        var step = this.sliderCfg.step;
        var callback = this.sliderCfg.callback;
    
        $input.attr('min', min)
            .attr('max', max)
            .attr('step', step);
    
        $input.bind("input", function(e){
            $input.attr('value', this.value);
            $input.css( 'background', 'linear-gradient(to right, #059CFA, rgba(0, 0, 0, 0) ' + this.value + '%, rgba(0, 0, 0, 0))' );
            
            if ($.isFunction(callback)) {
                callback(this);
            }
        });
    };
    // color-picker
    $.fn.ColorPicker = function(cfg){
        this.pickerCfg = {
            colors: cfg && cfg.colors && cfg.colors.length > 0 ? cfg.colors : ["#000"],
            callback: cfg && cfg.callback ? cfg.callback : null
        };
    
        var $input = $(this);
        var colors = this.pickerCfg.colors;
        var callback = this.pickerCfg.callback;
    
        var position = {"x": $input.position().left, "y": $input.position().top};
        console.log(position);
        // '<div style="width: 1.5rem;height: 1.5rem;background: #03A9F4;margin: 0.2rem;float: left;"></div>'
        
        $input.on("click", function(e) {
            $input.after('<div style="width: 10rem;height: 5rem;background: rgba(255,255,255,0.5);border: #BBBBBB solid 1px; border-radius: 0.3rem;position: absolute;top: ' + Number(position.y + 20) + 'px;left: ' + Number(position.x + 20) + 'px;"></div>')
            
        });
        
        // $input.attr('value', this.value);
        // $input.css( 'background', 'linear-gradient(to right, #059CFA, rgba(0, 0, 0, 0) ' + this.value + '%, rgba(0, 0, 0, 0))' );
        
        // if ($.isFunction(callback)) {
        //     callback(this);
        // }
    };
    // ColorPicker
    $('.color-picker').ColorPicker({});
    // 选择文件
    $(".top-btn").on("click", function () {
        $(this).next().click();
    });
    $(".select-file").on("change",function (e) {
        var e = e || window.event;
        //获取 文件 个数 取消的时候使用
        var file = e.target.files[0];
        if(file.type.indexOf("image") == 0) {
            $(".org-img").html("");
            watermark.imageToBase64(file, function(imageUrl) {
                watermark.imageAssignEle(".org-img", imageUrl, function(w, h) {
                    watermark.imgWidth = w;
                    watermark.imgHeight = h;
                });
            });
        }
    });
        
    // 点击生成水印按钮
    $(".make-btn").on("click", function() {
        if ($(".org-img img").length == 0) {
            $(this).next().css("display", "block");
            clearTimeout(timeOut);
            timeOut = setTimeout(function() {
                $(".make-btn").next().text("请先选择图片！").css("display", "none");
            }, 2000);
            return;
        }
        if ($(".wm-text-input").val() == "") {
            $(this).next().css("display", "block");
            clearTimeout(timeOut);
            timeOut = setTimeout(function() {
                $(".make-btn").next().text("请输入水印文本！").css("display", "none");
            }, 2000);
            return;
        } else {
            var text = $(".wm-text-input").val();
            var color = textColor;
            var fontFamily = $(".wm-fontfamily-select option:selected").val();
            var fontsize = FONT_SIZE[$(".wm-fontsize-select option:selected").val()][1];
            var fontWeight = FONT_WEIGHT[$(".wm-fontweight-select option:selected").val()];
            var watermarkUrl = watermark.makeWatermark(text, color, fontFamily, fontsize, fontWeight);
            watermark.imageAssignEle(".watermark", watermarkUrl);
        }
    });
    
    // 位置X滑块
    var changeX = function(ele) {
        $(ele).next().text(ele.value);
        watermark.adjustPositionX(".watermark", (watermark.imgWidth - watermark.markWidth) / 100 * ele.value);
    }
    // 位置Y滑块
    var changeY = function(ele) {
        $(ele).next().text(ele.value);
        watermark.adjustPositionY(".watermark", (watermark.imgHeight - watermark.markHeight) / 100 * ele.value);
    }
    // 角度滑块
    var changeAngle = function(ele) {
        $(ele).next().text(ele.value);
        watermark.adjustAngle(".watermark", ele.value);
    }
    $('.wm-x-drag').RangeSlider({min: 0, max: 100, step: 1, callback: changeX});
    $('.wm-y-drag').RangeSlider({min: 0, max: 100, step: 1, callback: changeY});
    $('.wm-angle-drag').RangeSlider({ min: 0, max: 360, step: 1, callback: changeAngle});
    
    // 点击保存图片
    $(".wm-make-btn").on("click", function() {
        if ($(".wm-text-input").val() == "") return;
        watermark.makeNewImage("imgcontainer", watermark.filename, watermark.type);
    });
    
    $(".color-picker")
}); 
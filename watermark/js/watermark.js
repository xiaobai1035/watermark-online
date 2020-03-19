class Watermark {
    // 总体思路: 原始图片+文本生成的图片+h5 => 合成图片
	// 1.获取原始图片
	constructor() {
	    this.reader = new FileReader();
	}
	// 2.获取图片名称
	getOrgName(file) {
        this.filename = file.name;
        var filenameArr = file.name.split(".");
        this.type = filenameArr[filenameArr.length - 1];
        return this;
    }
	// 3.图片转成base64
	imageToBase64(file, callback) {
        this.getOrgName(file);
		this.reader.readAsDataURL(file);
		this.reader.onload = function(e) {
			// 图片base64化
			this.imageUrl = e.target.result;
            callback && callback(this.imageUrl);
		};
	}
	// 4.图片绑定元素
	imageAssignEle(element, imageUrl, callback) {
        $(element).html("").append('<img src="' + imageUrl + '" />');
        var img = new Image();
        img.src = $(element).children().attr("src");
        if(img.complete){
            callback && callback(img.width, img.height);
        } else {
            img.onload = function() {
                callback && callback(img.width, img.height);
            }
        }
    }
	// 5.生成base64水印（文本、颜色、字体、字号、粗细）
	makeWatermark(text, color, fontFamily, fontsize, fontWeight) {
        var canvas = document.createElement('canvas');
        //小于32字加1  小于60字加2  小于80字加4    小于100字加6
        var $buHeight = 0;
        if(fontsize <= 32){ $buHeight = 1; }
        else if(fontsize > 32 && fontsize <= 60 ){ $buHeight = 2;}
        else if(fontsize > 60 && fontsize <= 80 ){ $buHeight = 4;}
        else if(fontsize > 80 && fontsize <= 100 ){ $buHeight = 6;}
        else if(fontsize > 100 ){ $buHeight = 10;}
        //对于g j 等有时会有遮挡，这里增加一些高度
        canvas.height = fontsize + $buHeight ;
        
        var context = canvas.getContext('2d');
        // 把该区域变为透明
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        context.font = fontWeight + " " + fontsize + "px " + fontFamily;
        context.fillStyle = color;
        // 设置水平对齐方式
        context.textBaseline = "middle";
        context.fillText(text, 0, canvas.height * 0.5 + $buHeight);
        
        // 改变大小后，重新设置一次文字
        canvas.width = context.measureText(text).width;
        context.font = fontWeight + " " + fontsize + "px " + fontFamily;
        context.fillStyle = color;
        context.textBaseline = "middle";
        context.fillText(text, 0, canvas.height * 0.5 + $buHeight);
        
        this.markWidth = canvas.width;
        this.markHeight = canvas.height;
        this.watermarkUrl = canvas.toDataURL('image/png');//注意这里背景透明的话，需要使用png
        return this.watermarkUrl;
    }
    // 6.水印绑定元素
    // markAssignEle(element, imageUrl) {
    //     $(element).append('<img src="' + imageUrl + '" />');
    // }
	// 7.调整水印位置 x
	adjustPositionX(element, x = 0) {
        $(element).css("margin-left", x + "px");
    }
    adjustPositionY(element, y = 0) {
        $(element).css("margin-top", y + "px");
    }
	// 8.旋转水印角度
    adjustAngle(element, angle = 0) {
        $(element).css("transform", "rotate(" + angle + "deg)");
    }
    adjustOpacity(element, o = 0) {
        $(element).css("opacity", o + "");
    }
};

export default Watermark;
+ function($) {
  "use strict";

  var defaults;
  
  var show = function(html, className) {

    className = className || "";
    var mask = $("<div class='ui-mask_transparent'></div>").appendTo(document.body);

    var tpl = '<div class="ui-toast ' + className + '">' + html + '</div>';
    var dialog = $(tpl).appendTo(document.body);

    dialog.show();
    dialog.addClass("ui-toast_visible");
  };

  var hide = function(callback) {
    $(".ui-mask_transparent").remove();
    $(".ui-toast_visible").removeClass("ui-toast_visible").transitionEnd(function() {
      var $this = $(this);
      $this.remove();
      callback && callback($this);
    });
  }

  $.toast = function(text, style, callback) {
    if(typeof style === "function") {
      callback = style;
    }
    var className;
    if(style == "cancel") {
      className = "ui-toast_cancel";
    } else if(style == "forbidden") {
      className = "ui-toast_forbidden";
    } else if(style == "text") {
      className = "ui-toast_text";
    }
    show('<i class="ui-icon_toast"></i><p class="ui-toast_content">' + (text || "已经完成") + '</p>', className);

    setTimeout(function() {
      hide(callback);
    }, toastDefaults.duration);
  }

  $.showLoading = function(text) {
    var html = '<div class="ui-loading">';
    for(var i=0;i<12;i++) {
      html += '<div class="ui-loading_leaf ui-loading_leaf_' + i + '"></div>';
    }
    html += '</div>';
    html += '<p class="ui-toast_content">' + (text || "数据加载中") + '</p>';
    show(html, 'ui-loading_toast');
  }

  $.hideLoading = function() {
    hide();
  }

  var toastDefaults = $.toast.prototype.defaults = {
    duration: 2000
  }

}($);

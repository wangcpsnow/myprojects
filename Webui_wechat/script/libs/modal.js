+ function($) {
  "use strict";

  var defaults;
  
  $.modal = function(params) {
    params = $.extend({}, defaults, params);


    var buttons = params.buttons;
    var className = params.className;

    var buttonsHtml = buttons.map(function(d, i) {
      return '<a href="javascript:;" class="ui-btn_dialog ' + (d.className || "") + '">' + d.text + '</a>';
    }).join("");

    var tpl = '<div class="ui-dialog '+className+'">' +
                '<div class="ui-dialog_hd"><strong class="ui-dialog_title">' + params.title + '</strong></div>' +
                ( params.text ? '<div class="ui-dialog_bd">'+params.text+'</div>' : '')+
                '<div class="ui-dialog_ft">' + buttonsHtml + '</div>' +
              '</div>';
    
    var dialog = $.openModal(tpl);

    dialog.find(".ui-btn_dialog").each(function(i, e) {
      var el = $(e);
      el.click(function() {
        //先关闭对话框，再调用回调函数
        if(params.autoClose) $.closeModal();

        if(buttons[i].onClick) {
          buttons[i].onClick();
        }
      });
    });
  };

  $.openModal = function(tpl) {
    var mask = $("<div class='ui-mask'></div>").appendTo(document.body);
    mask.show();

    var dialog = $(tpl).appendTo(document.body);
    
    dialog.show();
    mask.addClass("ui-mask_visible");
    dialog.addClass("ui-dialog_visible");

    return dialog;
  }

  $.closeModal = function() {
    $(".ui-mask_visible").removeClass("ui-mask_visible").transitionEnd(function() {
      $(this).remove();
    });
    $(".ui-dialog_visible").removeClass("ui-dialog_visible").transitionEnd(function() {
      $(this).remove();
    });
  };

  $.alert = function(text, title, callback) {
    if (typeof title === 'function') {
      callback = arguments[1];
      title = undefined;
    }
    return $.modal({
      text: text,
      title: title,
      buttons: [{
        text: defaults.buttonOK,
        className: "primary",
        onClick: callback
      }]
    });
  }

  $.confirm = function(text, title, callbackOK, callbackCancel) {
    if (typeof title === 'function') {
      callbackCancel = arguments[2];
      callbackOK = arguments[1];
      title = undefined;
    }
    return $.modal({
      text: text,
      title: title,
      buttons: [
      {
        text: defaults.buttonCancel,
        className: "default",
        onClick: callbackCancel
      },
      {
        text: defaults.buttonOK,
        className: "primary",
        onClick: callbackOK
      }]
    });
  };

  $.prompt = function(text, title, callbackOK, callbackCancel) {
    if (typeof title === 'function') {
      callbackCancel = arguments[2];
      callbackOK = arguments[1];
      title = undefined;
    }

    return $.modal({
      text: "<p class='weui-prompt-text'>"+(text || "")+"</p><input type='text' class='ui-input weui-prompt-input' id='weui-prompt-input'/>",
      title: title,
      buttons: [
      {
        text: defaults.buttonCancel,
        className: "default",
        onClick: callbackCancel
      },
      {
        text: defaults.buttonOK,
        className: "primary",
        onClick: function() {
          callbackOK && callbackOK($("#weui-prompt-input").val());
        }
      }]
    });
  };

  defaults = $.modal.prototype.defaults = {
    title: "提示",
    text: undefined,
    className: '',
    buttonOK: "确定",
    buttonCancel: "取消",
    buttons: [{
      text: "确定",
      className: "primary"
    }],
    autoClose: true //点击按钮自动关闭对话框，如果你不希望点击按钮就关闭对话框，可以把这个设置为false
  };

}($);

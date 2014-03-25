/**
 * require artDialog 5.0.4.
 *
 * @author Baishui2004
 * @Date March 21, 2014
 */
(function ($) {

    /**
     * Copy all properties of config obj to obj, if defaults is not undefined or null then first copy all properties of defaults obj to obj.
     */
    $.apply = $.dialog.apply = function (o, c, defaults) {
        if (defaults) {
            $.apply(o, defaults);
        }
        if (o && c && typeof c == 'object') {
            for (var p in c) {
                o[p] = c[p];
            }
        }
        return o;
    };

    $.getCfg = $.dialog.getCfg = function (params) {
        var cfg = {
            esc: false, // key Esc to close dialog, default true
            lock: true, // lock screen, default false
            okValue: $.bsgrid_artDialog.okValue,
            cancelValue: $.bsgrid_artDialog.cancelValue
        };
        return $.apply(params, cfg);
    };

    /**
     * alert dialog.
     *
     * @param msg    message
     * @param fn     callback function after trigger ok
     * @param follow HTMLElement, set dialog follow HTMLElement
     * @param title  dilog title
     */
    $.alert = $.dialog.alert = function (msg, fn, follow, title) {
        if (title == undefined) {
            title = $.bsgrid_artDialog.alertDialogTitle;
        }
        var params = {
            id: 'Alert',
            title: title,
            content: msg,
            ok: true,
            beforeunload: fn
        };
        if (follow == undefined) {
            return $.dialog($.getCfg(params));
        } else {
            params = $.getCfg(params);
            return $.dialog($.apply(params, {follow: follow}));
        }
    };

    /**
     * confirm dialog.
     *
     * @param msg    message
     * @param ok     callback function after trigger ok
     * @param cancel callback function after trigger cancel or close
     * @param follow HTMLElement, set dialog follow HTMLElement
     * @param title  dilog title
     */
    $.confirm = $.dialog.confirm = function (msg, ok, cancel, follow, title) {
        if (title == undefined) {
            title = $.bsgrid_artDialog.confirmDialogTitle;
        }
        var params = {
            id: 'Confirm',
            title: title,
            content: msg,
            ok: ok,
            cancel: cancel,
            cancelValue: $.bsgrid_artDialog.cancelValue
        };
        if (follow == undefined) {
            return $.dialog($.getCfg(params));
        } else {
            params = $.getCfg(params);
            return $.dialog($.apply(params, {follow: follow}));
        }
    };

    /**
     *  prompt dialog.
     *
     * @param msg           message
     * @param fn            callback function after trigger ok
     * @param defaultValue  default value
     * @param follow        HTMLElement, set dialog follow HTMLElement
     * @param title         dilog title
     */
    $.prompt = $.dialog.prompt = function (msg, ok, defaultValue, follow, title) {
        if (title == undefined) {
            title = $.bsgrid_artDialog.promptDialogTitle;
        }
        var params = {
            id: 'Prompt',
            title: title,
            content: [
                '<div style="margin-bottom:5px;font-size:12px">',
                msg,
                '</div>',
                '<div>',
                '<input type="text" class="d-input-text" value="',
                defaultValue,
                '" style="width:18em;padding:6px 4px" />',
                '</div>'
            ].join(''),
            initialize: function () {
                input = this.dom.content.find('.d-input-text')[0];
                input.select();
                input.focus();
            },
            ok: function () {
                return ok && ok.call(this, input.value);
            },
            cancel: function () {
            }
        };
        defaultValue = defaultValue || '';
        var input;
        if (follow == undefined) {
            return $.dialog($.getCfg(params));
        } else {
            params = $.getCfg(params);
            return $.dialog($.apply(params, {follow: follow}));
        }
    };

}(this.art || this.jQuery));
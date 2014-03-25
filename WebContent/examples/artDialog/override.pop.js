/**
 * require artDialog 5.0.4, artDialog.plugin.override.js.
 *
 * @author Baishui2004
 * @Date March 21, 2014
 */

function alert(message) {
    return $.dialog.alert(message);
}
function confirm(message, fn_ok, fn_cancel) {
    if (fn_cancel == undefined) {
        fn_cancel = function () {
            this.close();
        };
    }
    return $.dialog.confirm(message, fn_ok, fn_cancel);
}
function prompt(text, defaultText) {
    return $.dialog.prompt(text, function (msg) {
        return msg;
    }, defaultText);
}

function modifyDialogAndMaskZIndex() {
    // Under IE9, may occur dialog covered by it's d-mask lock screen, These code is to solve it below.
    var mask_index = 0;
    $('.d-mask').each(function (i) {
        var tmp_index = $(this).css('z-index');
        if (!isNaN(tmp_index) && parseInt(tmp_index) > mask_index) {
            mask_index = parseInt(tmp_index);
        }
    });
    $('div[role=dialog]').parent('div').each(function (i) {
        $(this).css('z-index', mask_index + i + 1);
    });
}

$(function () {
    if ($.browser.msie && $.browser.version == '9.0') {
        // Under IE9, if not set width or set width 'auto', it will cause dialog not display in center. These three line code is to solve it below.
        alert().hidden().time(1);
        confirm('', false).hidden().time(1);
        prompt('', '').hidden().time(1);

        setInterval(modifyDialogAndMaskZIndex, 500);
    }
});
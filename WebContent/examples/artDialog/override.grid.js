/**
 * require grid.js, artDialog 5.0.4.
 *
 * @author Baishui2004
 * @Date March 21, 2014
 */

// lock and unlock screen
$.fn.bsgrid_grid.defaults.lockScreen = function (options, xhr) {
    $lockScreenDialog.visible();
    $lockScreenDialog.lock();
};
$.fn.bsgrid_grid.defaults.unlockScreen = function (options, xhr, ts) {
    // delay 0.1s, to make lock screen look better
    setTimeout(function () {
        $lockScreenDialog.unlock();
        $lockScreenDialog.hidden();
    }, 100);
};

var $lockScreenDialog;
$(function () {
    $lockScreenDialog = $.dialog({
        id: '$-lock-screen-dialog',
        width: '225px', // Under IE9, if not set width or set width 'auto', it will cause dialog not display in center.
        title: false,
        cancel: false,
        visible: false,
        content: '<div style="font-size: 13px;"><span class="bsgrid_grid loading">&emsp;</span>' + $.bsgrid_gridLanguage.loadingDataMessage + '&emsp;</div>'
    });
});
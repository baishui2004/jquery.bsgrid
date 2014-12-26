/**
 * jQuery.bsgrid v1.30 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * require common.js, grid.js.
 *
 * @author Baishui2004
 * @Date December 26, 2014
 */
(function ($) {

    // config properties's name, values: text, hidden, password, radio, button, checkbox, textarea
    $.fn.bsgrid.defaults.colsProperties.editAttr = 'w_edit';

    // extend init
    $.fn.bsgrid.extendInit = {};

    // init form
    $.fn.bsgrid.extendInit.initForm = function (gridId, options) {
        $.fn.bsgrid.getGridHeaderObject(options).each(function (hi) {
            var edit = $.trim($(this).attr(options.settings.colsProperties.editAttr));
            if (edit == 'checkbox') {
                $('#' + gridId + ' tr:first th:eq(' + hi + ') input[type=checkbox]').change(function () {
                    if ($(this).attr('checked')) {
                        $('#' + gridId + ' tr:not(:first)').each(function () {
                            $(this).find('td:eq(' + hi + ')>input[type=checkbox]').attr('checked', true);
                        });
                    } else {
                        $('#' + gridId + ' tr:not(:first)').each(function () {
                            $(this).find('td:eq(' + hi + ')>input[type=checkbox]').attr('checked', false);
                        });
                    }
                });
            }
        });
    };

    $.fn.bsgrid.defaults.extend.initGridMethods['initForm'] = $.fn.bsgrid.extendInit.initForm;


    // init column move
    $.fn.bsgrid.extendInit.initColumnMove = function (gridId, options) {
        $('#' + options.gridId).css({'table-layout': 'fixed'});
        var headObj = $.fn.bsgrid.getGridHeaderObject(options);
        var headLen = headObj.length;
        headObj.each(function (i) {
            var obj = this;
            $(obj).mousedown(function () {
                bindDownData(obj, i, headLen);
            });
            $(obj).mousemove(function () {
                var left = $(obj).offset().left;
                var nObj = 0, nLeft = 0;
                if (i != headLen - 1) {
                    nObj = $(obj).next();
                    nLeft = nObj.offset().left;
                }
                var mObj = obj;
                if (i != headLen - 1 && event.clientX - nLeft > -10) {
                    mObj = nObj;
                }
                if ((i != 0 && event.clientX - left < 10) || (i != headLen - 1 && event.clientX - nLeft > -10)) {
                    $(obj).css({ 'cursor': 'e-resize' });
                    if ($.trim($(obj).data('ex_mousedown')) != 'mousedown') {
                        return;
                    }

                    var mWidth = $(mObj).width();
                    var newMWidth = mWidth - event.clientX + $(mObj).offset().left;
                    var preMWidth = $(mObj).prev().width();
                    var preNewMWidth = preMWidth + event.clientX - $(mObj).offset().left;
                    if (parseInt(newMWidth) > 19 && parseInt(preNewMWidth) > 19) {
                        $(mObj).width(newMWidth).prev().width(preNewMWidth);
                    }
                } else {
                    $(mObj).css({ 'cursor': 'default' });
                    releaseDownData(obj, i, headLen);
                }
            });
            $(obj).mouseup(function () {
                releaseDownData(obj, i, headLen);
            });
            $(obj).mouseout(function () {
                var objOffect = $(obj).offset();
                if (objOffect.top > event.clientY || objOffect.top + $(obj).height() < event.clientY) {
                    releaseDownData(obj, i, headLen);
                }
            });
            function bindDownData(obj, i, headLen) {
                if (i != 0) {
                    $(obj).prev().data('ex_mousedown', 'mousedown');
                }
                $(obj).data('ex_mousedown', 'mousedown');
                if (i != headLen - 1) {
                    $(obj).next().data('ex_mousedown', 'mousedown');
                }
            }

            function releaseDownData(obj, i, headLen) {
                if (i != 0) {
                    $(obj).prev().data('ex_mousedown', '');
                }
                $(obj).data('ex_mousedown', '');
                if (i != headLen - 1) {
                    $(obj).next().data('ex_mousedown', '');
                }
            }
        });
    };

    $.fn.bsgrid.defaults.extend.initGridMethods['initColumnMove'] = $.fn.bsgrid.extendInit.initColumnMove;


    // extend render
    $.fn.bsgrid.extendRender = {};

    // render form methods: text, hidden, password, radio, button, checkbox, textarea
    $.fn.bsgrid.extendRender.renderForm = function (record, rowIndex, colIndex, tdObj, trObj, options) {
        if (rowIndex < options.curPageRowsNum) {
            var gridObj = $.fn.bsgrid.getGridObj(options.gridId);
            var index = gridObj.getColumnAttr(colIndex, options.settings.colsProperties.indexAttr);
            var edit = gridObj.getColumnAttr(colIndex, options.settings.colsProperties.editAttr);
            var value = gridObj.getColumnValue(rowIndex, index);
            if (edit == 'text' || edit == 'hidden' || edit == 'password' || edit == 'radio' || edit == 'checkbox' || edit == 'button') {
                return '<input type="' + edit + '" value="' + value + '"/>';
            } else if (edit == 'textarea') {
                return '<textarea>' + value + '</textarea>';
            }
        } else {
            return false;
        }
    };

    $.fn.bsgrid.defaults.extend.renderPerColumnMethods['renderForm'] = $.fn.bsgrid.extendRender.renderForm;

})(jQuery);
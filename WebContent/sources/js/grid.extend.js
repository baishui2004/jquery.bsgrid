/**
 * jQuery.bsgrid v1.30 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * require common.js, grid.js.
 *
 * @author Baishui2004
 * @Date November 19, 2014
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


    // extend render
    $.fn.bsgrid.extendRender = {};

    // render form methods: text, hidden, password, radio, button, checkbox, textarea
    $.fn.bsgrid.extendRender.renderForm = function (record, rowIndex, colIndex, options) {
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
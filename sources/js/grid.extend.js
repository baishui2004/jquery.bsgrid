/**
 * jQuery.bsgrid v1.30 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * require common.js, util.js, grid.js.
 *
 * @author Baishui2004
 * @Date January 9, 2015
 */
(function ($) {

    // extend settings
    $.fn.bsgrid.defaults.extend.settings = {
        supportGridEdit: false, // if support extend grid edit
        supportGridEditTriggerEvent: 'rowClick', // values: '', 'rowClick', 'rowDoubleClick', 'cellClick', 'cellDoubleClick'
        supportColumnMove: false, // if support extend column move
        searchConditionsContainerId: '' // simple search conditions's container id
    };


    // config properties's name
    // value: check
    $.fn.bsgrid.defaults.colsProperties.checkAttr = 'w_check';
    // grid edit forms' values: text, hidden, password, radio, button, checkbox, textarea
    $.fn.bsgrid.defaults.colsProperties.editAttr = 'w_edit';


    // extend init grid
    $.fn.bsgrid.extendInitGrid = {};
    // extend before render grid
    $.fn.bsgrid.extendBeforeRenderGrid = {};
    // extend render per row
    $.fn.bsgrid.extendRenderPerRow = {};
    // extend render per column
    $.fn.bsgrid.extendRenderPerColumn = {};
    // extend after render grid
    $.fn.bsgrid.extendAfterRenderGrid = {};


    /*************** extend init grid start ***************/
        // bind extend methods
    $.fn.bsgrid.extendInitGrid.bindExtendMethods = function (gridId, options) {
        var gridObj = $.fn.bsgrid.getGridObj(gridId);
        gridObj.getCheckedRowsIndexs = function () {
            return $.fn.bsgrid.defaults.extend.getCheckedRowsIndexs(options);
        };
        gridObj.getCheckedRowsRecords = function () {
            return $.fn.bsgrid.defaults.extend.getCheckedRowsRecords(options);
        };
        gridObj.getChangedRowsIndexs = function () {
            return $.fn.bsgrid.defaults.extend.getChangedRowsIndexs(options);
        };
        gridObj.getChangedRowsRecords = function () {
            return $.fn.bsgrid.defaults.extend.getChangedRowsRecords(options);
        };
        gridObj.getChangedRowsNewRecords = function () {
            return $.fn.bsgrid.defaults.extend.getChangedRowsNewRecords(options);
        };
    };
    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'bindExtendMethods', $.fn.bsgrid.extendInitGrid.bindExtendMethods);

    // init grid check
    $.fn.bsgrid.extendInitGrid.initGridCheck = function (gridId, options) {
        $.fn.bsgrid.getGridHeaderObject(options).each(function (hi) {
            var check = $.trim($(this).attr(options.settings.colsProperties.checkAttr));
            if (check == 'true') {
                if ($.trim($(this).html()) == '') {
                    $(this).html('<input class="bsgrid_editgrid_check" type="checkbox"/>');
                }
                $(this).find('input[type=checkbox]').change(function () {
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

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'initGridCheck', $.fn.bsgrid.extendInitGrid.initGridCheck);


    // init search conditions
    $.fn.bsgrid.extendInitGrid.initSearchConditions = function (gridId, options) {
        if ($.trim(options.settings.extend.settings.searchConditionsContainerId) == '') {
            return;
        }
        var conditionsHtml = new StringBuilder();
        conditionsHtml.append('<select class="bsgrid_conditions_select">');
        var params = {};
        $.fn.bsgrid.getGridHeaderObject(options).each(function () {
            var index = $.trim($(this).attr(options.settings.colsProperties.indexAttr));
            var text = $.trim($(this).text());
            if (index != '' && text != '') {
                params[index] = text;
            }
        });
        for (var key in params) {
            conditionsHtml.append('<option value="' + key + '">' + params[key] + '</option>');
        }
        conditionsHtml.append('</select>');
        conditionsHtml.append('&nbsp;');
        conditionsHtml.append('<input type="text" class="bsgrid_conditions_input" />');
        $('#' + options.settings.extend.settings.searchConditionsContainerId).html(conditionsHtml.toString());
        $('#' + options.settings.extend.settings.searchConditionsContainerId + ' select.bsgrid_conditions_select:eq(0)').change(function () {
            $(this).next('input.bsgrid_conditions_input').attr('name', $(this).val());
        }).trigger('change');
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'initSearchConditions', $.fn.bsgrid.extendInitGrid.initSearchConditions);


    // init column move
    $.fn.bsgrid.extendInitGrid.initColumnMove = function (gridId, options) {
        if (!options.settings.extend.settings.supportColumnMove) {
            return;
        }
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

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'initColumnMove', $.fn.bsgrid.extendInitGrid.initColumnMove);
    /*************** extend init grid end ***************/


    /*************** extend render per column start ***************/
        // render checkbox to check rows
    $.fn.bsgrid.extendRenderPerColumn.renderCheck = function (record, rowIndex, colIndex, tdObj, trObj, options) {
        if (rowIndex < options.curPageRowsNum) {
            var gridObj = $.fn.bsgrid.getGridObj(options.gridId);
            var check = gridObj.getColumnAttr(colIndex, options.settings.colsProperties.checkAttr);
            var index = gridObj.getColumnAttr(colIndex, options.settings.colsProperties.indexAttr);
            var value = gridObj.getColumnValue(rowIndex, index);
            if (check == 'true') {
                return '<input class="' + 'bsgrid_editgrid_check' + '" type="checkbox" value="' + value + '"/>';
            }
        }
        return false;
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.renderPerColumnMethods, 'renderCheck', $.fn.bsgrid.extendRenderPerColumn.renderCheck);

    // render form methods: text, hidden, password, radio, button, checkbox, textarea
    $.fn.bsgrid.extendRenderPerColumn.renderForm = function (record, rowIndex, colIndex, tdObj, trObj, options) {
        if (options.settings.extend.settings.supportGridEdit && rowIndex < options.curPageRowsNum) {
            var gridObj = $.fn.bsgrid.getGridObj(options.gridId);
            var index = gridObj.getColumnAttr(colIndex, options.settings.colsProperties.indexAttr);
            var edit = gridObj.getColumnAttr(colIndex, options.settings.colsProperties.editAttr);
            var value = gridObj.getColumnValue(rowIndex, index);
            if (edit == 'checkbox') {
                return value + '<input class="' + 'bsgrid_editgrid_hidden bsgrid_editgrid_checkbox' + '" type="' + edit + '" value="' + value + '"/>';
            } else if (edit == 'text' || edit == 'hidden' || edit == 'password' || edit == 'radio' || edit == 'button') {
                return value + '<input class="' + 'bsgrid_editgrid_hidden bsgrid_editgrid_edit' + '" type="' + edit + '" value="' + value + '"/>';
            } else if (edit == 'textarea') {
                return value + '<textarea class="bsgrid_editgrid_hidden bsgrid_editgrid_edit">' + value + '</textarea>';
            }
        }
        return false;
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.renderPerColumnMethods, 'renderForm', $.fn.bsgrid.extendRenderPerColumn.renderForm);
    /*************** extend render per column end ***************/


    /*************** extend after render grid start ***************/
    $.fn.bsgrid.extendAfterRenderGrid.addGridEditEvent = function (parseSuccess, gridData, options) {
        if (!options.settings.extend.settings.supportGridEdit) {
            return;
        }
        $('#' + options.gridId + ' tr:not(:first):lt(' + options.curPageRowsNum + ')').each(function (ri) {
            // edit form change event
            var rowObj = this;
            $(rowObj).find('td').each(function (ci) {
                var gridObj = $.fn.bsgrid.getGridObj(options.gridId);
                var index = gridObj.getColumnAttr(ci, options.settings.colsProperties.indexAttr);
                var edit = gridObj.getColumnAttr(ci, options.settings.colsProperties.editAttr);
                var value = gridObj.getColumnValue(ri, index);
                if (edit != '') {
                    $(this).find('.bsgrid_editgrid_checkbox, .bsgrid_editgrid_edit').change(function () {
                        if ($.trim($(this).val()) != value) {
                            $(this).addClass('bsgrid_editgrid_change');
                        } else {
                            $(this).removeClass('bsgrid_editgrid_change');
                        }
                        // store change cell number
                        $(rowObj).data('change', $(rowObj).find('.bsgrid_editgrid_change').length);
                    });
                }
            });

            if (options.settings.extend.settings.supportGridEditTriggerEvent == '') {
                $(this).find('.bsgrid_editgrid_hidden').each(function () {
                    showCellEdit(this);
                });
            } else if (options.settings.extend.settings.supportGridEditTriggerEvent == 'rowClick') {
                $(this).click(function () {
                    $(this).find('.bsgrid_editgrid_hidden').each(function () {
                        showCellEdit(this);
                    });
                });
            } else if (options.settings.extend.settings.supportGridEditTriggerEvent == 'rowDoubleClick') {
                $(this).dblclick(function () {
                    $(this).find('.bsgrid_editgrid_hidden').each(function () {
                        showCellEdit(this);
                    });
                });
            } else if (options.settings.extend.settings.supportGridEditTriggerEvent == 'cellClick') {
                $(this).find('.bsgrid_editgrid_hidden').each(function () {
                    var formObj = this;
                    $(formObj).parent('td').click(function () {
                        showCellEdit(formObj);
                    });
                });
            } else if (options.settings.extend.settings.supportGridEditTriggerEvent == 'cellDoubleClick') {
                $(this).find('.bsgrid_editgrid_hidden').each(function () {
                    var formObj = this;
                    $(formObj).parent('td').dblclick(function () {
                        showCellEdit(formObj);
                    });
                });
            }
        });

        function showCellEdit(formObj) {
            var cloneObj = $(formObj).removeClass('bsgrid_editgrid_hidden').clone(true);
            $(formObj).parent('td').html(cloneObj);
        }
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.afterRenderGridMethods, 'addGridEditEvent', $.fn.bsgrid.extendAfterRenderGrid.addGridEditEvent);
    /*************** extend after render grid end ***************/


    /*************** extend methods start ***************/
    /**
     * Get Checked Rows Indexs, from 0.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getCheckedRowsIndexs = function (options) {
        var rowIndexs = new Array();
        $('#' + options.gridId + ' tr:not(:first)').each(function (i) {
            if ($(this).find('td>input:checked').length == 1) {
                rowIndexs[rowIndexs.length] = i;
            }
        });
        return rowIndexs;
    };

    /**
     * Get Checked Rows Records.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getCheckedRowsRecords = function (options) {
        var records = new Array();
        $.each($.fn.bsgrid.defaults.extend.getCheckedRowsIndexs(options), function (i, rowIndex) {
            records[records.length] = $.fn.bsgrid.getRecord(rowIndex, options);
        });
        return records;
    };

    /**
     * Get Changed Rows Indexs, from 0.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getChangedRowsIndexs = function (options) {
        var rowIndexs = new Array();
        $('#' + options.gridId + ' tr:not(:first)').each(function (i) {
            var cellChangedNumStr = $.trim($(this).data('change'));
            if (!isNaN(cellChangedNumStr) && parseInt(cellChangedNumStr) > 0) {
                rowIndexs[rowIndexs.length] = i;
            }
        });
        return rowIndexs;
    };

    /**
     * Get Changed Rows Records.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getChangedRowsRecords = function (options) {
        var records = new Array();
        $.each($.fn.bsgrid.defaults.extend.getChangedRowsIndexs(options), function (i, rowIndex) {
            records[records.length] = $.fn.bsgrid.getRecord(rowIndex, options);
        });
        return records;
    };

    /**
     * Get Changed Rows New Records.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getChangedRowsNewRecords = function (options) {
        var records = new Array();
        $.each($.fn.bsgrid.defaults.extend.getChangedRowsIndexs(options), function (i, rowIndex) {
            records[records.length] = $.fn.bsgrid.getRecord(rowIndex, options);
            // TODO
        });
        return records;
    };
    /*************** extend methods end ***************/

})(jQuery);
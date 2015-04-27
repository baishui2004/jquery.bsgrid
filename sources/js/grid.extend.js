/**
 * jQuery.bsgrid v1.35 by @Baishui2004
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
        supportGridEditTriggerEvent: 'rowClick', // values: ''(means no need Trigger), 'rowClick', 'rowDoubleClick', 'cellClick', 'cellDoubleClick'
        supportColumnMove: false, // if support extend column move
        searchConditionsContainerId: '', // simple search conditions's container id
        fixedGridHeader: false, // fixed grid header, auto height scroll
        fixedGridHeight: '320px' // fixed grid height, auto scroll
    };


    // config properties's name
    // line number, value: line, total_line
    $.fn.bsgrid.defaults.colsProperties.lineNumberAttr = 'w_num';
    // value: check
    $.fn.bsgrid.defaults.colsProperties.checkAttr = 'w_check';
    // grid edit forms' values: text, hidden, password, radio, button, checkbox, textarea
    $.fn.bsgrid.defaults.colsProperties.editAttr = 'w_edit';
    // aggregation, values: count, countNotNone, sum, avg, max, min, concat
    $.fn.bsgrid.defaults.colsProperties.aggAttr = 'w_agg';


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

    // extend other methods
    $.fn.bsgrid.extendOtherMethods = {};

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'initGridOptions', function (gridId, options) {
        var columnsModel = options.columnsModel;
        $.fn.bsgrid.getGridHeaderObject(options).each(function (i) {
            columnsModel[i].lineNumber = $.trim($(this).attr(options.settings.colsProperties.lineNumberAttr));
            columnsModel[i].check = $.trim($(this).attr(options.settings.colsProperties.checkAttr));
            columnsModel[i].edit = $.trim($(this).attr(options.settings.colsProperties.editAttr));
        });

        if ($('#' + options.gridId + ' tfoot tr td[' + options.settings.colsProperties.aggAttr + '!=\'\']').length != 0) {
            $('#' + options.gridId + ' tfoot tr td').each(function (i) {
                columnsModel[i].aggName = '';
                columnsModel[i].aggIndex = '';
                var aggInfo = $.trim($(this).attr(options.settings.colsProperties.aggAttr));
                if (aggInfo.length != 0) {
                    var aggInfoArray = aggInfo.split(',');
                    columnsModel[i].aggName = aggInfoArray[0].toLocaleLowerCase();
                    columnsModel[i].aggIndex = aggInfoArray.length > 1 ? aggInfoArray[1] : '';
                }
            });
        }

        if ($('#' + options.gridId + ' thead tr:last th[' + options.settings.colsProperties.checkAttr + '!=\'\']').length == 0) {
            delete options.settings.extend.initGridMethods.initGridCheck;
            delete options.settings.extend.renderPerColumnMethods.renderCheck;
            delete options.settings.extend.afterRenderGridMethods.addCheckChangedEvent;
        }
        if (!options.settings.extend.settings.supportGridEdit) {
            delete options.settings.extend.renderPerColumnMethods.renderForm;
            delete options.settings.extend.afterRenderGridMethods.addGridEditEvent;
        }
        if (!options.settings.extend.settings.supportColumnMove) {
            delete options.settings.extend.initGridMethods.initColumnMove;
        }
        if (!options.settings.extend.settings.fixedGridHeader) {
            delete options.settings.extend.initGridMethods.fixedHeader;
            delete options.settings.extend.afterRenderGridMethods.fixedHeader;
        }
        if ($.trim(options.settings.extend.settings.searchConditionsContainerId) == '') {
            delete options.settings.extend.initGridMethods.initSearchConditions;
        }
        if ($('#' + options.gridId + ' tfoot td[' + options.settings.colsProperties.aggAttr + '!=\'\']').length == 0) {
            delete options.settings.extend.afterRenderGridMethods.aggregation;
        }
    });

    /*************** extend other methods start ***************/
    $.fn.bsgrid.extendOtherMethods.fixedHeader = function (iFirst, options) {
        if ($.trim($('#' + options.gridId + '_fixedDiv').data('fixedGridLock')) == 'lock') {
            return;
        }
        $('#' + options.gridId + '_fixedDiv').data('fixedGridLock', 'lock');
        var headTrNum = $('#' + options.gridId + ' thead tr').length;
        if (!iFirst) {
            headTrNum = headTrNum / 2;
            $('#' + options.gridId + ' thead tr:lt(' + headTrNum + ')').remove();
        }
        var fixedGridHeight = getSize(options.settings.extend.settings.fixedGridHeight);
        if (fixedGridHeight < $('#' + options.gridId).height()) {
            $('#' + options.gridId + '_fixedDiv').height(fixedGridHeight);
            $('#' + options.gridId).width($('#' + options.gridId + '_fixedDiv').width() - 18);
            $('#' + options.gridId + '_fixedDiv').animate({scrollTop: '0px'}, 0);
        } else {
            $('#' + options.gridId + '_fixedDiv').height($('#' + options.gridId).height());
            $('#' + options.gridId).width($('#' + options.gridId + '_fixedDiv').width() - 1);
        }
        $('#' + options.gridId + ' thead tr:lt(' + headTrNum + ')').clone(true).prependTo('#' + options.gridId + ' thead');
        $('#' + options.gridId + ' thead tr:lt(' + headTrNum + ')').css({
            'z-index': 10,
            position: 'fixed'
        }).width($('#' + options.gridId + ' thead tr:last').width());
        $('#' + options.gridId + ' thead tr:lt(' + headTrNum + ')').each(function (i) {
            var position = $('#' + options.gridId + ' thead tr:eq(' + (headTrNum + i) + ')').position();
            $(this).css({top: position.top - getSize($(this).find('th').css('border-top-width')), left: position.left});
        });

        $('#' + options.gridId + ' thead tr:gt(' + (headTrNum - 1) + ')').each(function (ri) {
            $(this).find('th').each(function (i) {
                var thObj = $(this);
                $('#' + options.gridId + ' thead tr:eq(' + ri + ') th:eq(' + i + ')').height(thObj.height() + ((ri == headTrNum - 1) ? 2 : 1) * getSize(thObj.css('border-top-width'))).width(thObj.width() + getSize(thObj.css('border-left-width')));
            });
        });
        $('#' + options.gridId + '_fixedDiv').data('fixedGridLock', '');

        function getSize(sizeStr) {
            sizeStr = $.trim(sizeStr).toLowerCase().replace('px', '');
            var sizeNum = parseFloat(sizeStr);
            return isNaN(sizeNum) ? 0 : sizeNum;
        }
    };
    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'fixedHeader', function (gridId, options) {
        $('#' + gridId).wrap('<div id="' + gridId + '_fixedDiv"></div>');
        $('#' + gridId + '_fixedDiv').data('fixedGridLock', '');
        $('#' + gridId + '_fixedDiv').css({
            padding: 0,
            'border-width': 0,
            width: '98%',
            'overflow-y': 'auto',
            'margin-bottom': '-1px'
        });
        $('#' + gridId).css({width: 'auto'});
        $('#' + gridId + '_pt_outTab').css({'border-top-width': '1px'});
        $.fn.bsgrid.extendOtherMethods.fixedHeader(true, options);
        $(window).resize(function () {
            $.fn.bsgrid.extendOtherMethods.fixedHeader(false, options);
        });
    });

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.afterRenderGridMethods, 'fixedHeader', function (parseSuccess, gridData, options) {
        $.fn.bsgrid.extendOtherMethods.fixedHeader(false, options);
    });

    /*************** extend other methods end ***************/

    /*************** extend init grid start ***************/
        // bind extend methods
    $.fn.bsgrid.extendInitGrid.bindExtendMethods = function (gridId, options) {
        var gridObj = $.fn.bsgrid.getGridObj(gridId);
        if ($('#' + options.gridId + ' thead tr:last th[' + options.settings.colsProperties.checkAttr + '!=\'\']').length != 0) {
            gridObj.getCheckedRowsIndexs = function () {
                return $.fn.bsgrid.defaults.extend.getCheckedRowsIndexs(options);
            };
            gridObj.getCheckedRowsRecords = function () {
                return $.fn.bsgrid.defaults.extend.getCheckedRowsRecords(options);
            };
        }
        if (options.settings.extend.settings.supportGridEdit) {
            gridObj.activeGridEditMode = function () {
                return $.fn.bsgrid.defaults.extend.activeGridEditMode(options);
            };
            gridObj.getChangedRowsIndexs = function () {
                return $.fn.bsgrid.defaults.extend.getChangedRowsIndexs(options);
            };
            gridObj.getChangedRowsOldRecords = function () {
                return $.fn.bsgrid.defaults.extend.getChangedRowsOldRecords(options);
            };
            gridObj.getRowsChangedColumnsValue = function () {
                return $.fn.bsgrid.defaults.extend.getRowsChangedColumnsValue(options);
            };
        }
    };
    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'bindExtendMethods', $.fn.bsgrid.extendInitGrid.bindExtendMethods);

    // init grid check
    $.fn.bsgrid.extendInitGrid.initGridCheck = function (gridId, options) {
        $.fn.bsgrid.getGridHeaderObject(options).each(function (hi) {
            if (options.columnsModel[hi].check == 'true') {
                if ($.trim($(this).html()) == '') {
                    $(this).html('<input class="bsgrid_editgrid_check" type="checkbox"/>');
                }
                $(this).find('input[type=checkbox]').change(function () {
                    var checked = $.bsgrid.adaptAttrOrProp($(this), 'checked') ? true : false;
                    $.bsgrid.adaptAttrOrProp($('#' + gridId + ' tbody tr td:nth-child(' + (hi + 1) + ')>input[type=checkbox]'), 'checked', checked);
                });
            }
        });
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'initGridCheck', $.fn.bsgrid.extendInitGrid.initGridCheck);


    // init search conditions
    $.fn.bsgrid.extendInitGrid.initSearchConditions = function (gridId, options) {
        var conditionsHtml = new StringBuilder();
        conditionsHtml.append('<select class="bsgrid_conditions_select">');
        var params = {};
        $.fn.bsgrid.getGridHeaderObject(options).each(function (i) {
            var index = options.columnsModel[i].index;
            var text = $.trim($(this).text());
            if (index != '' && text != '' && $.trim(params[index]) == '') {
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
        $('#' + options.settings.extend.settings.searchConditionsContainerId + ' select.bsgrid_conditions_select').change(function () {
            $(this).next('input.bsgrid_conditions_input').attr('name', $(this).val());
        }).trigger('change');
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.initGridMethods, 'initSearchConditions', $.fn.bsgrid.extendInitGrid.initSearchConditions);


    // init column move
    $.fn.bsgrid.extendInitGrid.initColumnMove = function (gridId, options) {
        if ($('#' + options.gridId + ' thead tr').length != 1) {
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
                    $(obj).css({'cursor': 'e-resize'});
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
                    $(mObj).css({'cursor': 'default'});
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
            var columnModel = options.columnsModel[colIndex];
            if (columnModel.check == 'true') {
                return '<input class="' + 'bsgrid_editgrid_check' + '" type="checkbox" value="' + $.fn.bsgrid.getRecordIndexValue(record, columnModel.index, options) + '"/>';
            }
        }
        return false;
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.renderPerColumnMethods, 'renderCheck', $.fn.bsgrid.extendRenderPerColumn.renderCheck);

    // render form methods: text, hidden, password, radio, button, checkbox, textarea
    $.fn.bsgrid.extendRenderPerColumn.renderForm = function (record, rowIndex, colIndex, tdObj, trObj, options) {
        if (rowIndex < options.curPageRowsNum) {
            var columnModel = options.columnsModel[colIndex];
            var edit = columnModel.edit;
            var value = $.fn.bsgrid.getRecordIndexValue(record, columnModel.index, options);
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
    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.afterRenderGridMethods, 'renderLineNumber', function (parseSuccess, gridData, options) {
        $.fn.bsgrid.getGridHeaderObject(options).each(function (i) {
            var num = options.columnsModel[i].lineNumber;
            if (num == 'line' || num == 'total_line') {
                $('#' + options.gridId + ' tbody tr:lt(' + options.curPageRowsNum + ') td:nth-child(' + (i + 1) + ')').each(function (li) {
                    $(this).html((num == 'line') ? (li + 1) : (li + options.startRow));
                });
            }
        });
    });

    $.fn.bsgrid.extendAfterRenderGrid.addCheckChangedEvent = function (parseSuccess, gridData, options) {
        $.fn.bsgrid.getGridHeaderObject(options).each(function (hi) {
            if (options.columnsModel[hi].checkAttr == 'true') {
                var checkboxObj = $(this).find('input[type=checkbox]');
                var checkboxObjs = $('#' + options.gridId + ' tbody tr td:nth-child(' + (hi + 1) + ')>input[type=checkbox]');
                checkboxObjs.change(function () {
                    var checked = $.bsgrid.adaptAttrOrProp(checkboxObj, 'checked') ? true : false;
                    if (!checked && checkboxObjs.filter(':checked').length == checkboxObjs.length) {
                        $.bsgrid.adaptAttrOrProp(checkboxObj, 'checked', true);
                    } else if (checked && checkboxObjs.filter(':checked').length != checkboxObjs.length) {
                        $.bsgrid.adaptAttrOrProp(checkboxObj, 'checked', false);
                    }
                });
            }
        });
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.afterRenderGridMethods, 'addCheckChangedEvent', $.fn.bsgrid.extendAfterRenderGrid.addCheckChangedEvent);

    $.fn.bsgrid.extendAfterRenderGrid.addGridEditEvent = function (parseSuccess, gridData, options) {
        $('#' + options.gridId + ' tbody tr:lt(' + options.curPageRowsNum + ')').each(function (ri) {
            // edit form change event
            var rowObj = this;
            var columnsModel = options.columnsModel;
            $(rowObj).find('td').each(function (ci) {
                if (columnsModel[ci].edit != '') {
                    $(this).find('.bsgrid_editgrid_checkbox, .bsgrid_editgrid_edit').change(function () {
                        if ($.trim($(this).val()) != $.fn.bsgrid.getGridObj(options.gridId).getColumnValue(ri, columnsModel[ci].index)) {
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

    // aggregation
    $.fn.bsgrid.extendAfterRenderGrid.aggregation = function (parseSuccess, gridData, options) {
        var gridObj = $.fn.bsgrid.getGridObj(options.gridId);
        var columnsModel = options.columnsModel;
        $('#' + options.gridId + ' tfoot tr td[' + options.settings.colsProperties.aggAttr + '!=\'\']').each(function (i) {
            if (columnsModel[i].aggName != '') {
                var aggName = columnsModel[i].aggName;
                var val = null;
                if (aggName == 'count') {
                    val = options.curPageRowsNum;
                } else if (aggName == 'countnotnone' || aggName == 'sum' || aggName == 'avg' || aggName == 'max' || aggName == 'min' || aggName == 'concat') {
                    if (aggName == 'countnotnone') {
                        val = 0;
                    }
                    var valHtml = new StringBuilder();
                    $('#' + options.gridId + ' tbody tr:lt(' + options.curPageRowsNum + ')').each(function (ri) {
                        var rval = gridObj.getColumnValue(ri, columnsModel[i].aggIndex);
                        if (rval == '') {
                        } else if (aggName == 'countnotnone') {
                            val = (val == null ? 0 : val) + 1;
                        } else if (aggName == 'sum' || aggName == 'avg') {
                            if (!isNaN(rval)) {
                                val = (val == null ? 0 : val) + parseFloat(rval);
                            }
                        } else if (aggName == 'max' || aggName == 'min') {
                            if (!isNaN(rval) && (val == null || (aggName == 'max' && parseFloat(rval) > val) || (aggName == 'min' && parseFloat(rval) < val))) {
                                val = parseFloat(rval);
                            }
                        } else if (aggName == 'concat') {
                            valHtml.append(rval);
                        }
                    });
                    if (aggName == 'avg' && val != null) {
                        val = val / options.curPageRowsNum;
                    } else if (aggName == 'concat') {
                        val = valHtml.toString();
                    }
                }
                val = val == null ? '' : val;
                $(this).html(val);
            }
        });
    };

    $.bsgrid.forcePushPropertyInObject($.fn.bsgrid.defaults.extend.afterRenderGridMethods, 'aggregation', $.fn.bsgrid.extendAfterRenderGrid.aggregation);
    /*************** extend after render grid end ***************/


    /*************** extend edit methods start ***************/
    /**
     * Gget checked rows indexs, from 0.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getCheckedRowsIndexs = function (options) {
        var rowIndexs = [];
        $('#' + options.gridId + ' tbody tr').each(function (i) {
            if ($(this).find('td>input:checked').length == 1) {
                rowIndexs[rowIndexs.length] = i;
            }
        });
        return rowIndexs;
    };

    /**
     * Get checked rows records.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getCheckedRowsRecords = function (options) {
        var records = [];
        $.each($.fn.bsgrid.defaults.extend.getCheckedRowsIndexs(options), function (i, rowIndex) {
            records[records.length] = $.fn.bsgrid.getRecord(rowIndex, options);
        });
        return records;
    };

    /**
     * Active grid edit mode.
     *
     * @param options
     */
    $.fn.bsgrid.defaults.extend.activeGridEditMode = function (options) {
        if (!options.settings.extend.settings.supportGridEdit) {
            return;
        }
        $('#' + options.gridId + ' tbody tr:lt(' + options.curPageRowsNum + ') td .bsgrid_editgrid_hidden').each(function () {
            var cloneObj = $(this).removeClass('bsgrid_editgrid_hidden').clone(true);
            $(this).parent('td').html(cloneObj);
        });
    };

    /**
     * Get changed rows indexs, from 0.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getChangedRowsIndexs = function (options) {
        var rowIndexs = [];
        $('#' + options.gridId + ' tbody tr').each(function (i) {
            var cellChangedNumStr = $.trim($(this).data('change'));
            if (!isNaN(cellChangedNumStr) && parseInt(cellChangedNumStr) > 0) {
                rowIndexs[rowIndexs.length] = i;
            }
        });
        return rowIndexs;
    };

    /**
     * Get changed rows old records.
     *
     * @param options
     * @returns {Array}
     */
    $.fn.bsgrid.defaults.extend.getChangedRowsOldRecords = function (options) {
        var records = [];
        $.each($.fn.bsgrid.defaults.extend.getChangedRowsIndexs(options), function (i, rowIndex) {
            records[records.length] = $.fn.bsgrid.getRecord(rowIndex, options);
        });
        return records;
    };

    /**
     * Get rows changed columns value, return Object's key is 'row_'+rowIndex, value is a object.
     *
     * @param options
     * @returns {Object}
     */
    $.fn.bsgrid.defaults.extend.getRowsChangedColumnsValue = function (options) {
        var values = {};
        $.each($.fn.bsgrid.defaults.extend.getChangedRowsIndexs(options), function (i, rowIndex) {
            values['row_' + rowIndex] = {};
            $('#' + options.gridId + ' tbody tr:eq(' + rowIndex + ') td').each(function (ci) {
                if ($(this).find('.bsgrid_editgrid_change').length > 0) {
                    values['row_' + rowIndex][options.columnsModel[ci].index] = $(this).find('.bsgrid_editgrid_change').val();
                }
            })
        });
        return values;
    };
    /*************** extend edit methods end ***************/

})(jQuery);
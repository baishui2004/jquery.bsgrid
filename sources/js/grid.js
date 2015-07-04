/**
 * jQuery.bsgrid v1.36 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * require common.js.
 *
 * @author Baishui2004
 * @Date August 31, 2014
 */
(function ($) {

    $.fn.bsgrid = {

        version: '1.36',

        // defaults settings
        defaults: {
            dataType: 'json',
            localData: false, // values: false, json data, xml data
            url: '', // page request url
            otherParames: false, // other parameters, values: false, A Object or A jquery serialize Array
            autoLoad: true, // load onReady
            pageAll: false, // display all datas, no paging only count
            pageSize: 20, // page size. if set value little then 1, then pageAll will auto set true
            pageSizeSelect: false, // if display pageSize select option
            pageSizeForGrid: [5, 10, 20, 25, 50, 100, 200, 500], // pageSize select option
            pageIncorrectTurnAlert: true, // if turn incorrect page alert(firstPage, prevPage, nextPage, lastPage)
            multiSort: false, // multi column sort support
            displayBlankRows: true,
            lineWrap: false, // if grid cell content wrap, if false then td use style: white-space: nowrap; overflow: hidden; text-overflow: ellipsis; if true then td use style: word-break: break-all;
            stripeRows: false, // stripe rows
            rowHoverColor: false, // row hover color
            rowSelectedColor: true, // row selected color
            pagingLittleToolbar: false, // if display paging little toolbar
            pagingToolbarAlign: 'right',
            pagingBtnClass: 'pagingBtn', // paging toolbar button css class
            displayPagingToolbarOnlyMultiPages: false,
            isProcessLockScreen: true,
            // longLengthAotoSubAndTip: if column's value length longer than it, auto sub and tip it.
            //    sub: content.substring(0, MaxLength-3) + '...'. if column's render is not false, then this property is not make effective to it.
            longLengthAotoSubAndTip: true,
            colsProperties: {
                // body row every column config
                align: 'center',
                maxLength: 40, // every column's value display max length
                // config properties's name
                indexAttr: 'w_index',
                sortAttr: 'w_sort', // use: w_sort="id" or w_sort="id,desc" or w_sort="id,asc"
                alignAttr: 'w_align',
                lengthAttr: 'w_length', // per column's value display max length, default maxLength
                renderAttr: 'w_render', // use: w_render="funMethod"
                hiddenAttr: 'w_hidden',
                tipAttr: 'w_tip'
            },
            // request params name
            requestParamsName: {
                pageSize: 'pageSize',
                curPage: 'curPage',
                sortName: 'sortName',
                sortOrder: 'sortOrder'
            },
            // before page ajax request send
            beforeSend: function (options, XMLHttpRequest) {
            },
            // after page ajax request complete
            complete: function (options, XMLHttpRequest, textStatus) {
            },
            // process userdata, process before grid render data
            processUserdata: function (userdata, options) {
            },
            // event
            event: {
                selectRowEvent: false, // method params: record, rowIndex, trObj, options
                unselectRowEvent: false, // method params: record, rowIndex, trObj, options
                // custom row events: click, dbclick, focus ......
                customRowEvents: {}, // method params: record, rowIndex, trObj, options
                // custom cell events: click, dbclick, focus ......
                customCellEvents: {} // method params: record, rowIndex, colIndex, tdObj, trObj, options
            },
            // extend
            extend: {
                // extend init grid methods
                initGridMethods: {
                    // methodAlias: methodName // method params: gridId, options
                },
                // extend before render grid methods
                beforeRenderGridMethods: {
                    // methodAlias: methodName // method params: parseSuccess, gridData, options
                },
                // extend render per row methods, no matter blank row or not blank row, before render per column methods
                renderPerRowMethods: {
                    // methodAlias: methodName // method params: record, rowIndex, trObj, options
                },
                // extend render per column methods, no matter blank column or not blank column
                renderPerColumnMethods: {
                    // methodAlias: methodName // method params: record, rowIndex, colIndex, tdObj, trObj, options
                },
                // extend after render grid methods
                afterRenderGridMethods: {
                    // methodAlias: methodName // method params: parseSuccess, gridData, options
                }
            },
            /**
             * additional before render grid.
             *
             * @param parseSuccess if ajax data parse success, true or false
             * @param gridData page ajax return data
             * @param options
             */
            additionalBeforeRenderGrid: function (parseSuccess, gridData, options) {
            },
            /**
             * additional render per row, no matter blank row or not blank row, before additional render per column.
             *
             * @param record row record, may be null
             * @param rowIndex row index, from 0
             * @param trObj row tr obj
             * @param options
             */
            additionalRenderPerRow: function (record, rowIndex, trObj, options) {
            },
            /**
             * additional render per column, no matter blank column or not blank column.
             *
             * @param record row record, may be null
             * @param rowIndex row index, from 0
             * @param colIndex column index, from 0
             * @param tdObj column td obj
             * @param trObj row tr obj
             * @param options
             */
            additionalRenderPerColumn: function (record, rowIndex, colIndex, tdObj, trObj, options) {
            },
            /**
             * additional after render grid.
             *
             * @param parseSuccess if ajax data parse success, true or false
             * @param gridData page ajax return data
             * @param options
             */
            additionalAfterRenderGrid: function (parseSuccess, gridData, options) {
            }
        },

        gridObjs: {},

        init: function (gridId, settings) {
            if (!$('#' + gridId).hasClass('bsgrid')) {
                $('#' + gridId).addClass('bsgrid');
            }

            var options = {
                settings: $.extend(true, {}, $.fn.bsgrid.defaults, settings),
                gridId: gridId,
                noPagingationId: gridId + '_no_pagination',
                pagingOutTabId: gridId + '_pt_outTab',
                pagingId: gridId + '_pt',
                // sort
                sortName: '',
                sortOrder: '',
                otherParames: settings.otherParames,
                totalRows: 0,
                totalPages: 0,
                curPage: 1,
                curPageRowsNum: 0,
                startRow: 0,
                endRow: 0
            };

            if ($('#' + gridId).find('thead').length == 0) {
                $('#' + gridId).prepend('<thead></thead>');
                $('#' + gridId).find('tr:lt(' + ($('#' + gridId + ' tr').length - $('#' + gridId + ' tfoot tr').length) + ')').appendTo($('#' + gridId + ' thead'));
            }
            if ($('#' + gridId).find('tbody').length == 0) {
                $('#' + gridId + ' thead').after('<tbody></tbody>');
            }
            if ($('#' + gridId).find('tfoot').length == 0) {
                $('#' + gridId).append('<tfoot style="display: none;"></tfoot>');
            }

            options.columnsModel = $.fn.bsgrid.initColumnsModel(options);

            if (settings.pageSizeForGrid != undefined) {
                options.settings.pageSizeForGrid = settings.pageSizeForGrid;
            }

            options.settings.dataType = options.settings.dataType.toLowerCase();
            if (options.settings.pageSizeSelect) {
                if ($.inArray(options.settings.pageSize, options.settings.pageSizeForGrid) == -1) {
                    options.settings.pageSizeForGrid.push(options.settings.pageSize);
                }
                options.settings.pageSizeForGrid.sort(function (a, b) {
                    return a - b;
                });
            }

            var gridObj = {
                options: options,
                getPageCondition: function (curPage) {
                    return $.fn.bsgrid.getPageCondition(curPage, options);
                },
                page: function (curPage) {
                    $.fn.bsgrid.page(curPage, options);
                },
                search: function (params) {
                    $.fn.bsgrid.search(params, options);
                },
                loadGridData: function (dataType, gridData) {
                    $.fn.bsgrid.loadGridData(dataType, gridData, options);
                },
                getRows: function () {
                    return $.fn.bsgrid.getRows(options);
                },
                getRow: function (row) {
                    return $.fn.bsgrid.getRow(row, options);
                },
                getRowCells: function (row) {
                    return $.fn.bsgrid.getRowCells(row, options);
                },
                getColCells: function (col) {
                    return $.fn.bsgrid.getColCells(col, options);
                },
                getCell: function (row, col) {
                    return $.fn.bsgrid.getCell(row, col, options);
                },
                getSelectedRow: function () {
                    return $.fn.bsgrid.getSelectedRow(options);
                },
                getSelectedRowIndex: function () {
                    return $.fn.bsgrid.getSelectedRowIndex(options);
                },
                selectRow: function (row) {
                    return $.fn.bsgrid.selectRow(row, options);
                },
                unSelectRow: function () {
                    return $.fn.bsgrid.unSelectRow(options);
                },
                getUserdata: function () {
                    return $.fn.bsgrid.getUserdata(options);
                },
                getRowRecord: function (rowObj) {
                    return $.fn.bsgrid.getRowRecord(rowObj);
                },
                getAllRecords: function () {
                    return $.fn.bsgrid.getAllRecords(options);
                },
                getRecord: function (row) {
                    return $.fn.bsgrid.getRecord(row, options);
                },
                getRecordIndexValue: function (record, index) {
                    return $.fn.bsgrid.getRecordIndexValue(record, index, options);
                },
                getColumnValue: function (row, index) {
                    return $.fn.bsgrid.getColumnValue(row, index, options);
                },
                getCellRecordValue: function (row, col) {
                    return $.fn.bsgrid.getCellRecordValue(row, col, options);
                },
                sort: function (obj) {
                    $.fn.bsgrid.sort(obj, options);
                },
                getGridHeaderObject: function () {
                    return $.fn.bsgrid.getGridHeaderObject(options);
                },
                getColumnModel: function (colIndex) {
                    return $.fn.bsgrid.getColumnModel(colIndex, options);
                },
                appendHeaderSort: function () {
                    $.fn.bsgrid.appendHeaderSort(options);
                },
                setGridBlankBody: function () {
                    $.fn.bsgrid.setGridBlankBody(options);
                },
                createPagingOutTab: function () {
                    $.fn.bsgrid.createPagingOutTab(options);
                },
                clearGridBodyData: function () {
                    $.fn.bsgrid.clearGridBodyData(options);
                },
                getPagingObj: function () {
                    return $.fn.bsgrid.getPagingObj(options);
                },
                getCurPage: function () {
                    return $.fn.bsgrid.getCurPage(options);
                },
                refreshPage: function () {
                    $.fn.bsgrid.refreshPage(options);
                },
                firstPage: function () {
                    $.fn.bsgrid.firstPage(options);
                },
                prevPage: function () {
                    $.fn.bsgrid.prevPage(options);
                },
                nextPage: function () {
                    $.fn.bsgrid.nextPage(options);
                },
                lastPage: function () {
                    $.fn.bsgrid.lastPage(options);
                },
                gotoPage: function (goPage) {
                    $.fn.bsgrid.gotoPage(options, goPage);
                },
                initPaging: function () {
                    return $.fn.bsgrid.initPaging(options);
                },
                setPagingValues: function () {
                    $.fn.bsgrid.setPagingValues(options);
                }
            };

            // store mapping grid id to gridObj
            $.fn.bsgrid.gridObjs[gridId] = gridObj;

            // if no pagination
            if (options.settings.pageAll || options.settings.pageSize < 1) {
                options.settings.pageAll = true;
                options.settings.pageSize = 0;
            }

            gridObj.appendHeaderSort();

            // init paging
            gridObj.createPagingOutTab();

            if (!options.settings.pageAll) {
                gridObj.pagingObj = gridObj.initPaging();
                try {
                    var minWidth = $.trim($('#' + options.pagingId).children().width());
                    minWidth = minWidth == '' ? 0 : parseInt(minWidth);
                    if (minWidth != 0) {
                        $('#' + gridId).css('min-width', minWidth + 16);
                        $('#' + options.pagingOutTabId).css('min-width', minWidth + 16);
                    }
                    $('#' + options.pagingOutTabId).width($('#' + gridId).width());
                    $(window).resize(function () {
                        $('#' + options.pagingOutTabId).width($('#' + gridId).width());
                    });
                } catch (e) {
                }
            }

            if (options.settings.isProcessLockScreen) {
                $.fn.bsgrid.addLockScreen(options);
            }

            try {
                // init grid extend options
                $.fn.bsgrid.extendInitGrid.initGridExtendOptions(gridId, options);
            } catch (e) {
                // do nothing
            }

            for (var key in options.settings.extend.initGridMethods) {
                options.settings.extend.initGridMethods[key](gridId, options);
            }

            // auto load
            if (options.settings.autoLoad) {
                // delay 10 millisecond for return gridObj first, then page
                setTimeout(function () {
                    gridObj.page(1);
                }, 10);
            } else {
                gridObj.setGridBlankBody();
            }

            return gridObj;
        },

        initColumnsModel: function (options) {
            var columnsModel = [];
            $.fn.bsgrid.getGridHeaderObject(options).each(function () {
                var colsProperties = options.settings.colsProperties;
                var columnModel = {};
                // column sort name, order
                columnModel.sortName = '';
                columnModel.sortOrder = '';
                var sortInfo = $.trim($(this).attr(colsProperties.sortAttr));
                if (sortInfo.length != 0) {
                    var sortInfoArray = sortInfo.split(',');
                    columnModel.sortName = $.trim(sortInfoArray[0]);
                    columnModel.sortOrder = $.trim(sortInfoArray.length > 1 ? sortInfoArray[1] : '');
                }
                // column index
                columnModel.index = $.trim($(this).attr(colsProperties.indexAttr));
                // column render
                columnModel.render = $.trim($(this).attr(colsProperties.renderAttr));
                // column tip
                columnModel.tip = $.trim($(this).attr(colsProperties.tipAttr));
                // column text max length
                var maxLen = $.trim($(this).attr(colsProperties.lengthAttr));
                columnModel.maxLen = maxLen.length != 0 ? parseInt(maxLen) : colsProperties.maxLength;
                // column align
                var align = $.trim($(this).attr(colsProperties.alignAttr));
                columnModel.align = align == '' ? colsProperties.align : align;
                // column hidden
                columnModel.hidden = $.trim($(this).attr(colsProperties.hiddenAttr));
                columnsModel.push(columnModel);
            });
            return columnsModel;
        },

        getGridObj: function (gridId) {
            var obj = $.fn.bsgrid.gridObjs[gridId];
            return obj ? obj : null;
        },

        buildData: {
            gridData: function (type, curPage, data) {
                if (type == 'json') {
                    return $.fn.bsgrid.buildJsonData.gridData(curPage, data);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.buildXmlData.gridData(curPage, data);
                }
                return false;
            }
        },

        parseData: {
            success: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.success(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.success(gridData);
                }
                return false;
            },
            totalRows: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.totalRows(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.totalRows(gridData);
                }
                return false;
            },
            curPage: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.curPage(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.curPage(gridData);
                }
                return false;
            },
            data: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.data(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.data(gridData);
                }
                return false;
            },
            userdata: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.userdata(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.userdata(gridData);
                }
                return false;
            },
            getDataLen: function (type, gridData) {
                if (type == 'json' || type == 'xml') {
                    return $.fn.bsgrid.parseData.data(type, gridData).length;
                }
                return 0;
            },
            getRecord: function (type, data, row) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.getRecord(data, row);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.getRecord(data, row);
                }
                return false;
            },
            getColumnValue: function (type, record, index) {
                if (type == 'json') {
                    return $.fn.bsgrid.parseJsonData.getColumnValue(record, index);
                } else if (type == 'xml') {
                    return $.fn.bsgrid.parseXmlData.getColumnValue(record, index);
                }
                return false;
            }
        },

        buildJsonData: {
            gridData: function (curPage, data) {
                return {
                    "success": true,
                    "totalRows": data.length,
                    "curPage": curPage,
                    "data": data
                };
            }
        },

        parseJsonData: {
            success: function (json) {
                return json.success;
            },
            totalRows: function (json) {
                return json.totalRows;
            },
            curPage: function (json) {
                return json.curPage;
            },
            data: function (json) {
                return json.data;
            },
            userdata: function (json) {
                return json.userdata;
            },
            getRecord: function (data, row) {
                return data[row];
            },
            getColumnValue: function (record, index) {
                return $.trim(record[index]);
            }
        },

        buildXmlData: {
            gridData: function (curPage, data) {
                return '<?xml version="1.0" encoding="UTF-8"?>'
                    + '<gridData>'
                    + '<success>true</success>'
                    + '<totalRows>' + $('<xml>' + data + '</xml>').find('row').length + '</totalRows>'
                    + '<curPage>' + curPage + '</curPage>'
                    + '<data>'
                    + data
                    + '</data>'
                    + '</gridData>';
            }
        },

        parseXmlData: {
            success: function (xml) {
                return $.trim($(xml).find('gridData success').text()) == 'true';
            },
            totalRows: function (xml) {
                return parseInt($(xml).find('gridData totalRows').text());
            },
            curPage: function (xml) {
                return parseInt($(xml).find('gridData curPage').text());
            },
            data: function (xml) {
                return $(xml).find('gridData data row');
            },
            userdata: function (xml) {
                return $(xml).find('gridData userdata');
            },
            getRecord: function (data, row) {
                return data.eq(row);
            },
            getColumnValue: function (record, index) {
                return $.trim(record.find(index).text());
            }
        },

        getPageCondition: function (curPage, options) {
            // other parames
            var params = new StringBuilder();
            if (options.otherParames == false) {
                // do nothing
            } else if ((typeof options.otherParames).toLowerCase() == 'string' || options.otherParames instanceof String) {
                params.append('&' + options.otherParames);
            } else if (options.otherParames instanceof Array) {
                $.each(options.otherParames, function (i, objVal) {
                    params.append('&' + objVal.name + '=' + objVal.value);
                });
            } else {
                for (var key in options.otherParames) {
                    params.append('&' + key + '=' + options.otherParames[key]);
                }
            }

            var condition = params.length == 0 ? '' : params.toString().substring(1);
            condition += (condition.length == 0 ? '' : '&')
            + options.settings.requestParamsName.pageSize + '=' + options.settings.pageSize
            + '&' + options.settings.requestParamsName.curPage + '=' + curPage
            + '&' + options.settings.requestParamsName.sortName + '=' + options.sortName
            + '&' + options.settings.requestParamsName.sortOrder + '=' + options.sortOrder;
            return condition;
        },

        search: function (params, options) {
            options.otherParames = params;
            $.fn.bsgrid.page(1, options);
        },

        page: function (curPage, options) {
            if ($.trim(curPage) == '' || isNaN(curPage)) {
                $.fn.bsgrid.alert($.bsgridLanguage.needInteger);
                return;
            }
            var dataType = options.settings.dataType;
            if (options.settings.localData != false) {
                if (dataType == 'json') {
                    $.fn.bsgrid.loadGridData(dataType, $.fn.bsgrid.buildData.gridData(dataType, curPage, options.settings.localData), options);
                } else if (dataType == 'xml') {
                    $.fn.bsgrid.loadGridData(dataType, '<xml>' + $.fn.bsgrid.buildData.gridData(dataType, curPage, options.settings.localData) + '</xml>', options);
                }
                return;
            }
            $.ajax({
                type: 'post',
                url: options.settings.url,
                data: $.fn.bsgrid.getPageCondition(curPage, options),
                dataType: dataType,
                beforeSend: function (XMLHttpRequest) {
                    if (options.settings.isProcessLockScreen) {
                        $.fn.bsgrid.lockScreen(options);
                    }
                    options.settings.beforeSend(options, XMLHttpRequest);
                },
                complete: function (XMLHttpRequest, textStatus) {
                    options.settings.complete(options, XMLHttpRequest, textStatus);
                    if (options.settings.isProcessLockScreen) {
                        $.fn.bsgrid.unlockScreen(options);
                    }
                },
                success: function (gridData, textStatus) {
                    $.fn.bsgrid.loadGridData(dataType, gridData, options);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.fn.bsgrid.alert($.bsgridLanguage.errorForSendOrRequestData);
                }
            });
        },

        loadGridData: function (dataType, gridData, options) {
            var parseSuccess = $.fn.bsgrid.parseData.success(dataType, gridData);
            for (var key in options.settings.extend.beforeRenderGridMethods) {
                options.settings.extend.beforeRenderGridMethods[key](parseSuccess, gridData, options);
            }
            options.settings.additionalBeforeRenderGrid(parseSuccess, gridData, options);
            if (parseSuccess) {
                // userdata
                var userdata = $.fn.bsgrid.parseData.userdata(dataType, gridData);
                $.fn.bsgrid.storeUserdata(userdata, options);
                options.settings.processUserdata(userdata, options);

                var totalRows = parseInt($.fn.bsgrid.parseData.totalRows(dataType, gridData));
                var curPage = parseInt($.fn.bsgrid.parseData.curPage(dataType, gridData));
                curPage = Math.max(curPage, 1);

                if (options.settings.pageAll) {
                    // display all datas, no paging
                    curPage = 1;
                    options.settings.pageSize = totalRows;
                    $('#' + options.noPagingationId).html(totalRows);
                }

                var pageSize = options.settings.pageSize;
                var totalPages = parseInt(totalRows / pageSize);
                totalPages = parseInt((totalRows % pageSize == 0) ? totalPages : totalPages + 1);
                var curPageRowsNum = $.fn.bsgrid.parseData.getDataLen(dataType, gridData);
                curPageRowsNum = curPageRowsNum > pageSize ? pageSize : curPageRowsNum;
                curPageRowsNum = (curPage * pageSize < totalRows) ? curPageRowsNum : (totalRows - (curPage - 1) * pageSize);
                var startRow = (curPage - 1) * pageSize + 1;
                var endRow = startRow + curPageRowsNum - 1;
                startRow = curPageRowsNum <= 0 ? 0 : startRow;
                endRow = curPageRowsNum <= 0 ? 0 : endRow;

                // set options pagination values
                options.totalRows = totalRows;
                options.totalPages = totalPages;
                options.curPage = curPage;
                options.curPageRowsNum = curPageRowsNum;
                options.startRow = startRow;
                options.endRow = endRow;

                if (!options.settings.pageAll) {
                    $.fn.bsgrid.setPagingValues(options);
                }

                if (options.settings.displayPagingToolbarOnlyMultiPages && totalPages <= 1) {
                    $('#' + options.pagingId).hide();
                    $('#' + options.pagingOutTabId).hide();
                } else {
                    $('#' + options.pagingOutTabId).show();
                    $('#' + options.pagingId).show();
                }

                $.fn.bsgrid.setGridBlankBody(options);
                if (curPageRowsNum == 0) {
                    return;
                }

                var data = $.fn.bsgrid.parseData.data(dataType, gridData);
                var dataLen = data.length;
                // add rows click event
                $.fn.bsgrid.addRowsClickEvent(options);
                $.fn.bsgrid.getRows(options).each(
                    function (i) {
                        var trObj = $(this);
                        var record = null;
                        if (i < curPageRowsNum && i < dataLen) {
                            // support parse return all datas or only return current page datas
                            record = $.fn.bsgrid.parseData.getRecord(dataType, data, dataLen != totalRows ? i : startRow + i - 1);
                        }
                        $.fn.bsgrid.storeRowData(i, record, options);

                        for (var key in options.settings.extend.renderPerRowMethods) {
                            options.settings.extend.renderPerRowMethods[key](record, i, trObj, options);
                        }
                        options.settings.additionalRenderPerRow(record, i, trObj, options);
                        for (var key in options.settings.event.customRowEvents) {
                            trObj.bind(key, {
                                record: record,
                                rowIndex: i,
                                trObj: trObj,
                                options: options
                            }, function (event) {
                                options.settings.event.customRowEvents[key](event.data.record, event.data.rowIndex, event.data.trObj, event.data.options)
                            });
                        }

                        var columnsModel = options.columnsModel;
                        $(this).find('td').each(function (j) {
                            var tdObj = $(this);
                            if (i < curPageRowsNum && i < dataLen) {
                                // column index
                                var index = columnsModel[j].index;
                                // column render
                                var render = columnsModel[j].render;
                                if (render != '') {
                                    var render_method = eval(render);
                                    var render_html = render_method(record, i, j, options);
                                    tdObj.html(render_html);
                                } else if (index != '') {
                                    var value = $.fn.bsgrid.parseData.getColumnValue(dataType, record, index);
                                    // column tip
                                    if (columnsModel[j].tip == 'true') {
                                        $.fn.bsgrid.columnTip(this, value, record);
                                    }
                                    if (options.settings.longLengthAotoSubAndTip) {
                                        $.fn.bsgrid.longLengthSubAndTip(this, value, columnsModel[j].maxLen, record);
                                    } else {
                                        tdObj.html(value);
                                    }
                                }
                            } else {
                                tdObj.html('&nbsp;');
                            }
                            for (var key in options.settings.extend.renderPerColumnMethods) {
                                var renderPerColumn_html = options.settings.extend.renderPerColumnMethods[key](record, i, j, tdObj, trObj, options);
                                if (renderPerColumn_html != null && renderPerColumn_html != false) {
                                    tdObj.html(renderPerColumn_html);
                                }
                            }
                            options.settings.additionalRenderPerColumn(record, i, j, tdObj, trObj, options);
                            for (var key in options.settings.event.customCellEvents) {
                                tdObj.bind(key, {
                                    record: record,
                                    rowIndex: i,
                                    colIndex: j,
                                    tdObj: tdObj,
                                    trObj: trObj,
                                    options: options
                                }, function (event) {
                                    options.settings.event.customCellEvents[key](event.data.record, event.data.rowIndex, event.data.colIndex, event.data.tdObj, event.data.trObj, event.data.options);
                                });
                            }
                        });
                    }
                );
            } else {
                $.fn.bsgrid.alert($.bsgridLanguage.errorForRequestData);
            }
            for (var key in options.settings.extend.afterRenderGridMethods) {
                options.settings.extend.afterRenderGridMethods[key](parseSuccess, gridData, options);
            }
            options.settings.additionalAfterRenderGrid(parseSuccess, gridData, options);
        },

        addRowsClickEvent: function (options) {
            $.fn.bsgrid.getRows(options).filter(':lt(' + options.curPageRowsNum + ')').click(function () {
                if ($(this).hasClass('selected')) {
                    $.fn.bsgrid.unSelectRow(options);
                } else {
                    $.fn.bsgrid.selectRow($.fn.bsgrid.getRows(options).index($(this)), options);
                }
            });
        },

        getRows: function (options) {
            return $('#' + options.gridId + ' tbody tr');
        },

        getRow: function (row, options) {
            return $.fn.bsgrid.getRows(options).eq(row);
        },

        getRowCells: function (row, options) {
            return $.fn.bsgrid.getRow(row, options).find('td');
        },

        getColCells: function (col, options) {
            return $.fn.bsgrid.getRows(options).find('td:nth-child(' + (col + 1) + ')');
        },

        getCell: function (row, col, options) {
            return $.fn.bsgrid.getRowCells(row, options).eq(col);
        },

        getSelectedRow: function (options) {
            return $.fn.bsgrid.getRows(options).filter('.selected');
        },

        getSelectedRowIndex: function (options) {
            return $.fn.bsgrid.getRows(options).index($.fn.bsgrid.getSelectedRow(options));
        },

        selectRow: function (row, options) {
            $.fn.bsgrid.unSelectRow(options);
            var trObj = $.fn.bsgrid.getRow(row, options);
            trObj.addClass('selected');
            if (options.settings.rowSelectedColor) {
                trObj.addClass('selected_color');
            }
            if (!!options.settings.event.selectRowEvent) {
                options.settings.event.selectRowEvent($.fn.bsgrid.getRowRecord(trObj), row, trObj, options);
            }
        },

        unSelectRow: function (options) {
            var row = $.fn.bsgrid.getSelectedRowIndex(options);
            if (row != -1) {
                var trObj = $.fn.bsgrid.getRow(row, options);
                trObj.removeClass('selected').removeClass('selected_color');
                if (!!options.settings.event.unselectRowEvent) {
                    options.settings.event.unselectRowEvent($.fn.bsgrid.getRowRecord(trObj), row, trObj, options);
                }
            }
        },

        getUserdata: function (options) {
            $('#' + options.gridId).data('userdata');
        },

        storeUserdata: function (userdata, options) {
            $('#' + options.gridId).data('userdata', userdata);
        },

        getRowRecord: function (rowObj) {
            var record = rowObj.data('record');
            return record == undefined ? null : record;
        },

        storeRowData: function (row, record, options) {
            $.fn.bsgrid.getRow(row, options).data('record', record);
        },

        getAllRecords: function (options) {
            var records = [];
            $.fn.bsgrid.getRows(options).each(function () {
                var record = $.fn.bsgrid.getRowRecord($(this));
                if (record != null) {
                    records[records.length] = record;
                }
            });
            return records;
        },

        getRecord: function (row, options) {
            return $.fn.bsgrid.getRowRecord($.fn.bsgrid.getRow(row, options));
        },

        getRecordIndexValue: function (record, index, options) {
            if (record == null) {
                return '';
            } else {
                return $.fn.bsgrid.parseData.getColumnValue(options.settings.dataType, record, index);
            }
        },

        getColumnValue: function (row, index, options) {
            var record = $.fn.bsgrid.getRecord(row, options);
            return $.fn.bsgrid.getRecordIndexValue(record, index, options);
        },

        getCellRecordValue: function (row, col, options) {
            var index = $.trim($.fn.bsgrid.getColumnModel(col, options).index);
            if (index == '') {
                return '';
            } else {
                return $.fn.bsgrid.getColumnValue(row, index, options);
            }
        },

        sort: function (obj, options) {
            options.sortName = '';
            options.sortOrder = '';
            var aObj = $(obj).find('a');
            var field = $(aObj).attr('sortName');
            var columnsModel = options.columnsModel;
            $.fn.bsgrid.getGridHeaderObject(options).each(function (i) {
                var sortName = columnsModel[i].sortName;
                if (sortName != '') {
                    var sortOrder = $.fn.bsgrid.getSortOrder($(this), options);

                    if (!options.settings.multiSort && sortName != field) {
                        // revert style
                        $(this).find('a').attr('class', 'sort sort-view');
                    } else {
                        if (sortName == field) {
                            if (sortOrder == '') {
                                sortOrder = 'desc';
                            } else if (sortOrder == 'desc') {
                                sortOrder = 'asc';
                            } else if (sortOrder == 'asc') {
                                sortOrder = '';
                            }
                            $(this).find('a').attr('class', 'sort sort-' + (sortOrder == '' ? 'view' : sortOrder));
                        }
                        if (sortOrder != '') {
                            options.sortName = ($.trim(options.sortName) == '') ? sortName : (options.sortName + ',' + sortName);
                            options.sortOrder = ($.trim(options.sortOrder) == '') ? sortOrder : (options.sortOrder + ',' + sortOrder);
                        }
                    }
                }
            });

            $.fn.bsgrid.refreshPage(options);
        },

        getSortOrder: function (obj, options) {
            var sortOrder = $.trim($(obj).find('a').attr('class'));
            if (sortOrder == 'sort sort-view') {
                sortOrder = '';
            } else if (sortOrder == 'sort sort-asc') {
                sortOrder = 'asc';
            } else if (sortOrder == 'sort sort-desc') {
                sortOrder = 'desc';
            } else {
                sortOrder = '';
            }
            return sortOrder;
        },

        /**
         * Note only return thead last tr's th.
         *
         * @param options
         * @returns {*}
         */
        getGridHeaderObject: function (options) {
            return $('#' + options.gridId + ' thead tr:last').find('th');
        },

        getColumnModel: function (colIndex, options) {
            return options.columnsModel[colIndex];
        },

        appendHeaderSort: function (options) {
            var columnsModel = options.columnsModel;
            // grid header
            $.fn.bsgrid.getGridHeaderObject(options).each(function (i) {
                // sort
                if (columnsModel[i].sortName != '') {
                    var sortName = columnsModel[i].sortName;
                    // default sort and direction
                    var sortOrder = columnsModel[i].sortOrder;
                    var sortHtml = '<a href="javascript:void(0);" sortName="' + sortName + '" class="sort ';
                    if (sortOrder != '' && (sortOrder == 'desc' || sortOrder == 'asc')) {
                        options.sortName = ($.trim(options.sortName) == '') ? sortName : (options.sortName + ',' + sortName);
                        options.sortOrder = ($.trim(options.sortOrder) == '') ? sortOrder : (options.sortOrder + ',' + sortOrder);
                        sortHtml += 'sort-' + sortOrder;
                    } else {
                        sortHtml += 'sort-view';
                    }
                    sortHtml += '">&nbsp;&nbsp;&nbsp;</a>'; // use: "&nbsp;&nbsp;&nbsp;", different from: "&emsp;" is: IE8 and IE9 not display "&emsp;"
                    $(this).append(sortHtml).find('.sort').click(function () {
                        $.fn.bsgrid.sort($(this).parent('th'), options);
                    });
                }
            });
        },

        setGridBlankBody: function (options) {
            // remove rows
            $.fn.bsgrid.getRows(options).remove();

            var header = $.fn.bsgrid.getGridHeaderObject(options);
            // add rows
            var rowSb = '';
            if (options.settings.pageSize > 0) {
                var columnsModel = options.columnsModel;

                var trSb = new StringBuilder();
                trSb.append('<tr>');
                for (var hi = 0; hi < header.length; hi++) {
                    trSb.append('<td style="text-align: ' + columnsModel[hi].align + ';');
                    if (columnsModel[hi].hidden == 'true') {
                        header.eq(hi).css('display', 'none');
                        trSb.append(' display: none;');
                    }
                    trSb.append('"');
                    trSb.append('>&nbsp;</td>');
                }
                trSb.append('</tr>');
                rowSb = trSb.toString();
            }
            var rowsSb = new StringBuilder();
            var curPageRowsNum = options.settings.pageSize;
            if (!options.settings.displayBlankRows) {
                curPageRowsNum = options.endRow - options.startRow + 1;
                curPageRowsNum = options.endRow > 0 ? curPageRowsNum : 0;
            }
            if (curPageRowsNum == 0) {
                rowsSb.append('<tr><td colspan="' + header.length + '">' + $.bsgridLanguage.noDataToDisplay + '</td></tr>');
            } else {
                for (var pi = 0; pi < curPageRowsNum; pi++) {
                    rowsSb.append(rowSb);
                }
            }
            $('#' + options.gridId + ' tbody').append(rowsSb.toString());

            if (curPageRowsNum != 0) {
                if (options.settings.stripeRows) {
                    $.fn.bsgrid.getRows(options).filter(':even').addClass('even_index_row');
                }
                if (options.settings.rowHoverColor) {
                    $('#' + options.gridId + ' tbody tr').hover(function () {
                        $(this).addClass('row_hover');
                    }, function () {
                        $(this).removeClass('row_hover');
                    });
                }
            }

            if (!options.settings.lineWrap) {
                $.fn.bsgrid.getRows(options).find('td').addClass('lineNoWrap');
            } else {
                $.fn.bsgrid.getRows(options).find('td').addClass('lineWrap');
            }
        },

        createPagingOutTab: function (options) {
            var pagingOutTabSb = new StringBuilder();
            pagingOutTabSb.append('<table id="' + options.pagingOutTabId + '" class="bsgridPagingOutTab" style="display: none;"><tr><td align="' + options.settings.pagingToolbarAlign + '">');
            // display all datas, no paging
            if (options.settings.pageAll) {
                pagingOutTabSb.append($.bsgridLanguage.noPagingation(options.noPagingationId) + '&nbsp;&nbsp;&nbsp;');
            }
            pagingOutTabSb.append('</td></tr></table>');
            var paging = $('#' + options.gridId+'~#'+options.pagingOutTabId);
            if(null!=paging&&paging.length>0){
            	paging.remove();
            }

            $('#' + options.gridId).after(pagingOutTabSb.toString());
        },

        clearGridBodyData: function (options) {
            $.fn.bsgrid.getRows(options).find('td').html('&nbsp;');
        },

        /**
         * add lock screen.
         *
         * @param options
         */
        addLockScreen: function (options) {
            if ($('.bsgrid.lockscreen').length == 0) {
                var lockScreenHtml = new StringBuilder();
                lockScreenHtml.append('<div class="bsgrid lockscreen" times="0">');
                lockScreenHtml.append('</div>');
                lockScreenHtml.append('<div class="bsgrid loading_div">');
                lockScreenHtml.append('<table><tr><td><center><div class="bsgrid loading"><span>&nbsp;&emsp;</span>&nbsp;' + $.bsgridLanguage.loadingDataMessage + '&emsp;<center></div></td></tr></table>');
                lockScreenHtml.append('</div>');
                $('body').append(lockScreenHtml.toString());
            }
        },

        /**
         * open lock screen.
         *
         * @param options
         */
        lockScreen: function (options) {
            $('.bsgrid.lockscreen').attr('times', parseInt($('.bsgrid.lockscreen').attr('times')) + 1);
            if ($('.bsgrid.lockscreen').css('display') == 'none') {
                $('.bsgrid.lockscreen').show();
                $('.bsgrid.loading_div').show();
            }
        },

        /**
         * close lock screen.
         *
         * @param options
         */
        unlockScreen: function (options) {
            $('.bsgrid.lockscreen').attr('times', parseInt($('.bsgrid.lockscreen').attr('times')) - 1);
            if ($('.bsgrid.lockscreen').attr('times') == '0') {
                // delay 0.05s, to make lock screen look better
                setTimeout(function () {
                    $('.bsgrid.lockscreen').hide();
                    $('.bsgrid.loading_div').hide();
                }, 50);
            }
        },

        /**
         * tip column.
         *
         * @param obj column td obj
         * @param value column's value
         * @param record row record
         */
        columnTip: function (obj, value, record) {
            $(obj).attr('title', value);
        },

        /**
         * alert message.
         *
         * @param msg message
         */
        alert: function (msg) {
            try {
                $.bsgrid.alert(msg);
            } catch (e) {
                alert(msg);
            }
        },

        /**
         * if column's value length longer than it, auto sub and tip it.
         *    sub: txt.substring(0, MaxLength-3) + '...'.
         *
         * @param obj column td obj
         * @param value column's value
         * @param maxLen max length
         * @param record row record
         */
        longLengthSubAndTip: function (obj, value, maxLen, record) {
            var tip = false;
            if (value.length > maxLen) {
                try {
                    if (value.indexOf('<') < 0 || value.indexOf('>') < 2 || $(value).text().length == 0) {
                        tip = true;
                    }
                } catch (e) {
                    tip = true;
                }
            }
            if (tip) {
                $(obj).html(value.substring(0, maxLen - 3) + '...');
                $.fn.bsgrid.columnTip(obj, value, record);
            } else {
                $(obj).html(value);
            }
        },

        getPagingObj: function (options) {
            return $.fn.bsgrid.getGridObj(options.gridId).pagingObj;
        },

        getCurPage: function (options) {
            return $.fn.bsgrid.getPagingObj(options).getCurPage();
        },

        refreshPage: function (options) {
            if (!options.settings.pageAll) {
                $.fn.bsgrid.getPagingObj(options).refreshPage();
            } else {
                $.fn.bsgrid.page(1, options);
            }
        },

        firstPage: function (options) {
            $.fn.bsgrid.getPagingObj(options).firstPage();
        },

        prevPage: function (options) {
            $.fn.bsgrid.getPagingObj(options).prevPage();
        },

        nextPage: function (options) {
            $.fn.bsgrid.getPagingObj(options).nextPage();
        },

        lastPage: function (options) {
            $.fn.bsgrid.getPagingObj(options).lastPage();
        },

        gotoPage: function (options, goPage) {
            $.fn.bsgrid.getPagingObj(options).gotoPage(goPage);
        },

        /**
         * init paging.
         *
         * @param options grid options
         */
        initPaging: function (options) {
            $('#' + options.pagingOutTabId + ' td').attr('id', options.pagingId);
            // config same properties's
            return $.fn.bsgrid_paging.init(options.pagingId, {
                gridId: options.gridId,
                pageSize: options.settings.pageSize,
                pageSizeSelect: options.settings.pageSizeSelect,
                pageSizeForGrid: options.settings.pageSizeForGrid,
                pageIncorrectTurnAlert: options.settings.pageIncorrectTurnAlert,
                pagingLittleToolbar: options.settings.pagingLittleToolbar,
                pagingBtnClass: options.settings.pagingBtnClass
            });
        },

        /**
         * Set paging values.
         *
         * @param options grid options
         */
        setPagingValues: function (options) {
            $.fn.bsgrid.getPagingObj(options).setPagingValues(options.curPage, options.totalRows);
        }

    };

})(jQuery);

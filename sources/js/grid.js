/**
 * jQuery.bsgrid v1.32 by @Baishui2004
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

        // defaults settings
        defaults: {
            dataType: 'json',
            localData: false, // values: false, json data, xml data
            url: '', // page request url
            otherParames: false, // other parameters, values: false, A Object or A jquery serialize Array
            autoLoad: true, // load onReady
            pageAll: false, // display all datas, no paging only count
            pageSize: 20, // page size. if set value little then 1, then pageAll will auto set true
            multiSort: false, // multi column sort support
            pageSizeSelect: false, // if display pageSize select option
            pageLittleToolbar: false, // if display page little toolbar
            pageSizeForGrid: [5, 10, 20, 25, 50, 100, 200, 500], // pageSize select option
            displayBlankRows: true,
            lineWrap: false, // if grid cell content wrap, if false then td use style: white-space: nowrap; overflow: hidden; text-overflow: ellipsis; if true then td use style: word-break: break-all;
            stripeRows: false, // stripe rows
            changeColorIfRowSelected: true, // change color if row selected
            pagingToolbarAlign: 'right',
            pagingBtnClass: 'pagingBtn', // paging toolbar button css class
            displayPagingToolbarOnlyMultiPages: false,
            isProcessLockScreen: true,
            // longLengthAotoSubAndTip: if column's value length longer than it, auto sub and tip it.
            //    sub: txt.substring(0, MaxLength-3) + '...'. if column's render is not false, then this property is not make effective to it.
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

        gridObjs: {
        },

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
                loadGridData: function (dataType, gridData) {
                    $.fn.bsgrid.loadGridData(dataType, gridData, options);
                },
                getSelectedRow: function () {
                    return $.fn.bsgrid.getSelectedRow(options);
                },
                selectRow: function (row) {
                    return $.fn.bsgrid.selectRow(row, options);
                },
                unSelectRow: function () {
                    return $.fn.bsgrid.unSelectRow(options);
                },
                getRowRecord: function (rowObj) {
                    return $.fn.bsgrid.getRowRecord(rowObj);
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
                sort: function (obj) {
                    $.fn.bsgrid.sort(obj, options);
                },
                getGridHeaderObject: function () {
                    return $.fn.bsgrid.getGridHeaderObject(options);
                },
                getColumnAttr: function (colIndex, attrName) {
                    return $.fn.bsgrid.getColumnAttr(colIndex, attrName, options);
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

            gridObj.appendHeaderSort();

            // init paging
            gridObj.createPagingOutTab();

            if (!options.settings.pageAll) {
                gridObj.pagingObj = gridObj.initPaging();
            }

            if (options.settings.isProcessLockScreen) {
                $.fn.bsgrid.addLockScreen(options);
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

            for (var key in options.settings.extend.initGridMethods) {
                options.settings.extend.initGridMethods[key](gridId, options);
            }

            return gridObj;
        },

        getGridObj: function (gridId) {
            var obj = $.fn.bsgrid.gridObjs[gridId];
            return obj ? obj : null;
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
            getRecord: function (data, row) {
                return data[row];
            },
            getColumnValue: function (record, index) {
                return $.trim(record[index]);
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

        page: function (curPage, options) {
            if ($.trim(curPage) == '' || isNaN(curPage)) {
                alert($.bsgridLanguage.needInteger);
                return;
            }
            var dataType = options.settings.dataType;
            if (options.settings.localData != false) {
                if (dataType == 'json') {
                    $.fn.bsgrid.loadGridData(dataType, options.settings.localData, options);
                } else if (dataType == 'xml') {
                    $.fn.bsgrid.loadGridData(dataType, '<xml>' + options.settings.localData + '</xml>', options);
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
                    alert($.bsgridLanguage.errorForSendOrRequestData);
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
                var totalRows = parseInt($.fn.bsgrid.parseData.totalRows(dataType, gridData));
                var curPage = parseInt($.fn.bsgrid.parseData.curPage(dataType, gridData));

                if (options.settings.pageAll) {
                    // display all datas, no paging
                    curPage = 1;
                    options.settings.pageSize = totalRows;
                    $('#' + options.noPagingationId).html(totalRows);
                }

                var pageSize = options.settings.pageSize;
                var curPageRowsNum = $.fn.bsgrid.parseData.getDataLen(dataType, gridData);
                curPageRowsNum = curPageRowsNum > pageSize ? pageSize : curPageRowsNum;
                var totalPages = parseInt(totalRows / pageSize);
                totalPages = parseInt((totalRows % pageSize == 0) ? totalPages : totalPages + 1);
                var startRow = (curPage - 1) * pageSize + 1;
                var endRow = (curPage - 1) * pageSize + curPageRowsNum;
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

                var headerTh = $.fn.bsgrid.getGridHeaderObject(options);
                var data = $.fn.bsgrid.parseData.data(dataType, gridData);
                var dataLen = data.length;
                // add rows click event
                $.fn.bsgrid.addRowsClickEvent(options);
                $('#' + options.gridId + ' tbody tr').each(
                    function (i) {
                        var trObj = $(this);
                        var record = null;
                        if (i < curPageRowsNum) {
                            // support parse return all datas or only return current page datas
                            record = $.fn.bsgrid.parseData.getRecord(dataType, data, dataLen != totalRows ? i : startRow + i - 1);
                        }
                        $.fn.bsgrid.storeRowData(i, record, options);

                        for (var key in options.settings.extend.renderPerRowMethods) {
                            options.settings.extend.renderPerRowMethods[key](record, i, trObj, options);
                        }
                        options.settings.additionalRenderPerRow(record, i, trObj, options);

                        $(this).find('td').each(function (j) {
                            if (i < curPageRowsNum) {
                                // column index
                                var index = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.indexAttr));
                                // column render
                                var render = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.renderAttr));
                                // column tip
                                var tip = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.tipAttr));
                                // column text max length
                                var maxLen = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.lengthAttr));
                                maxLen = maxLen.length != 0 ? parseInt(maxLen) : options.settings.colsProperties.maxLength;
                                if (render != '') {
                                    var render_method = eval(render);
                                    var render_html = render_method(record, i, j, options);
                                    $(this).html(render_html);
                                } else if (index != '') {
                                    {
                                        var value = $.fn.bsgrid.parseData.getColumnValue(dataType, record, index);
                                        if (tip == 'true') {
                                            $.fn.bsgrid.columnTip(this, value, record);
                                        }
                                        if (options.settings.longLengthAotoSubAndTip) {
                                            $.fn.bsgrid.longLengthSubAndTip(this, value, maxLen, record);
                                        } else {
                                            $(this).html(value);
                                        }
                                    }
                                }
                            } else {
                                $(this).html('&nbsp;');
                            }
                            for (var key in options.settings.extend.renderPerColumnMethods) {
                                var renderPerColumn_html = options.settings.extend.renderPerColumnMethods[key](record, i, j, $(this), trObj, options);
                                if (renderPerColumn_html != null && renderPerColumn_html != false) {
                                    $(this).html(renderPerColumn_html);
                                }
                            }
                            options.settings.additionalRenderPerColumn(record, i, j, $(this), trObj, options);
                        });
                    }
                );
            } else {
                alert($.bsgridLanguage.errorForRequestData);
            }
            for (var key in options.settings.extend.afterRenderGridMethods) {
                options.settings.extend.afterRenderGridMethods[key](parseSuccess, gridData, options);
            }
            options.settings.additionalAfterRenderGrid(parseSuccess, gridData, options);
        },

        addRowsClickEvent: function (options) {
            $('#' + options.gridId + ' tbody tr:lt(' + options.curPageRowsNum + ')').click(function () {
                if ($(this).hasClass('selected')) {
                    $(this).removeClass('selected').removeClass('selected_color');
                } else {
                    $.fn.bsgrid.unSelectRow(options);
                    $(this).addClass('selected');
                    if (options.settings.changeColorIfRowSelected) {
                        $(this).addClass('selected_color');
                    }
                }
            });
        },

        getSelectedRow: function (options) {
            return $('#' + options.gridId + ' tbody tr.selected');
        },

        selectRow: function (row, options) {
            $.fn.bsgrid.unSelectRow(options);
            var trObj = $('#' + options.gridId + ' tbody tr:eq(' + row + ')');
            trObj.addClass('selected');
            if (options.settings.changeColorIfRowSelected) {
                trObj.addClass('selected_color');
            }
        },

        unSelectRow: function (options) {
            $.fn.bsgrid.getSelectedRow(options).removeClass('selected').removeClass('selected_color');
        },

        getRowRecord: function (rowObj) {
            return rowObj.data('record');
        },

        storeRowData: function (row, record, options) {
            $('#' + options.gridId + ' tbody tr:eq(' + row + ')').data('record', record);
        },

        getRecord: function (row, options) {
            var record = $('#' + options.gridId + ' tbody tr:eq(' + row + ')').data('record');
            return record == undefined ? null : record;
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

        sort: function (obj, options) {
            options.sortName = '';
            options.sortOrder = '';
            var aObj = $(obj).find('a');
            var field = $(aObj).attr('sortName');

            $.fn.bsgrid.getGridHeaderObject(options).each(function () {
                var sortInfo = $.trim($(this).attr(options.settings.colsProperties.sortAttr));
                if (sortInfo.length != 0) {
                    var sortName = sortInfo.split(',')[0];
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

        getColumnAttr: function (colIndex, attrName, options) {
            return $.trim($.fn.bsgrid.getGridHeaderObject(options).eq(colIndex).attr(attrName));
        },

        appendHeaderSort: function (options) {
            // grid header
            $.fn.bsgrid.getGridHeaderObject(options).each(function () {
                // sort
                var sortAttr = options.settings.colsProperties.sortAttr;
                var sortInfo = $.trim($(this).attr(sortAttr));
                if (sortInfo.length != 0) {
                    var sortInfoArray = sortInfo.split(',');
                    var sortName = sortInfoArray[0];
                    // default sort and direction
                    var sortOrder = sortInfoArray.length > 1 ? sortInfoArray[1] : '';
                    var sortHtml = '<a href="#" sortName="' + sortName + '" class="sort ';
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
            $('#' + options.gridId + ' tbody tr').remove();

            var header = $.fn.bsgrid.getGridHeaderObject(options);
            // add rows
            var rowSb = '';
            if (options.settings.pageSize > 0) {
                var alignAttr = options.settings.colsProperties.alignAttr;
                var hiddenAttr = options.settings.colsProperties.hiddenAttr;

                var trSb = new StringBuilder();
                trSb.append('<tr>');
                for (var hi = 0; hi < header.length; hi++) {
                    trSb.append('<td');
                    var align = $.trim(header.eq(hi).attr(alignAttr));
                    align = align == '' ? options.settings.colsProperties.align : align;
                    trSb.append(' style="text-align: ' + align + ';');
                    var hidden = $.trim(header.eq(hi).attr(hiddenAttr));
                    if (hidden == 'true') {
                        header.eq(hi).css('display', 'none');
                        trSb.append(' display: none;');
                    }
                    trSb.append('"');
                    trSb.append('></td>');
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
                    $('#' + options.gridId + ' tbody tr:even').addClass('even_index_row');
                }
            }

            if (!options.settings.lineWrap) {
                $('#' + options.gridId + ' tbody tr td').addClass('lineNoWrap');
            } else {
                $('#' + options.gridId + ' tbody tr td').addClass('lineWrap');
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
            $('#' + options.gridId).after(pagingOutTabSb.toString());
        },

        clearGridBodyData: function (options) {
            $('#' + options.gridId + ' tbody tr td').html('&nbsp;');
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
                // delay 0.1s, to make lock screen look better
                setTimeout(function () {
                    $('.bsgrid.lockscreen').hide();
                    $('.bsgrid.loading_div').hide();
                }, 100);
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
         * if column's value length longer than it, auto sub and tip it.
         *    sub: txt.substring(0, MaxLength-3) + '...'.
         *
         * @param obj column td obj
         * @param value column's value
         * @param maxLen max length
         * @param record row record
         */
        longLengthSubAndTip: function (obj, value, maxLen, record) {
            if (value.length > maxLen && $(value).text().length == 0) {
                $(obj).html(value.substring(0, maxLen - 3) + '...');
                $.fn.bsgrid.columnTip(obj, value, record);
            } else {
                $(obj).html(value);
            }
        },

        getCurPage: function (options) {
            return $.fn.bsgrid.getGridObj(options.gridId).pagingObj.getCurPage();
        },

        refreshPage: function (options) {
            if (!options.settings.pageAll) {
                $.fn.bsgrid.getGridObj(options.gridId).pagingObj.refreshPage();
            } else {
                $.fn.bsgrid.page(1, options);
            }
        },

        firstPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.firstPage();
        },

        prevPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.prevPage();
        },

        nextPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.nextPage();
        },

        lastPage: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.lastPage();
        },

        gotoPage: function (options, goPage) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.gotoPage(goPage);
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
                pageLittleToolbar: options.settings.pageLittleToolbar,
                pageSizeForGrid: options.settings.pageSizeForGrid,
                pagingBtnClass: options.settings.pagingBtnClass
            });
        },

        /**
         * Set paging values.
         *
         * @param options grid options
         */
        setPagingValues: function (options) {
            $.fn.bsgrid.getGridObj(options.gridId).pagingObj.setPagingValues(options.curPage, options.totalRows);
        }

    };

})(jQuery);
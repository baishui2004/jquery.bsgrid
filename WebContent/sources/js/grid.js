/**
 * JQuery.bsgrid v1.11 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * require common.js.
 *
 * @author Baishui2004
 * @Date July 2, 2014
 */
(function ($) {

    $.fn.bsgrid = {

        // defaults settings
        defaults: {
            url: '', // page request url
            dataType: 'json',
            autoLoad: true, // load onReady
            pageAll: false, // display all datas, no paging only count
            pageSize: 20, // page size. if set value little then 1, then pageAll will auto set true
            pageSizeSelect: false, // if display pageSize select option
            pageSizeForGrid: [5, 10, 20, 25, 50, 100, 200, 500], // pageSize select option
            displayBlankRows: true,
            stripeRows: false, // stripe rows
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
             * additional render per row, no matter blank row or not blank row.
             *
             * @param record row record, may be null
             * @param rowIndex row index, from 0
             * @param options
             */
            additionalRenderPerRow: function (record, rowIndex, options) {
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
            var options = {
                settings: $.extend(true, {}, $.fn.bsgrid.defaults, settings),

                gridId: gridId,
                // paging toolbar
                totalRowsId: gridId + '_pt_totalRows',
                totalPagesId: gridId + '_pt_totalPages',
                currPageId: gridId + '_pt_currPage',
                gotoPageInputId: gridId + '_pt_gotoPageInput',
                gotoPageId: gridId + '_pt_gotoPage',
                pageSizeId: gridId + '_pt_pageSize',
                firstPageId: gridId + '_pt_firstPage',
                prevPageId: gridId + '_pt_prevPage',
                nextPageId: gridId + '_pt_nextPage',
                lastPageId: gridId + '_pt_lastPage',
                startRowId: gridId + '_pt_startRow',
                endRowId: gridId + '_pt_endRow',

                // sort
                sortName: '',
                sortOrder: '',

                // other parameters, values: false, A Object or A jquery serialize Array
                otherParames: false,

                // paging toolbar id
                pagingToolbarId: gridId + '_pt',

                totalRows: 0,
                totalPages: 0,
                currPage: 1,
                startRow: 0,
                endRow: 0
            };

            options.settings.dataType = options.settings.dataType.toLowerCase();

            if (options.settings.pageAll || options.settings.pageSize < 1) {
                options.settings.pageAll = true;
                options.settings.pageSize = 0;
            }

            var gridObj = {
                options: options,
                getPageCondition: function (curPage) {
                    return $.fn.bsgrid.getPageCondition(curPage, options);
                },
                page: function (curPage) {
                    $.fn.bsgrid.page(curPage, options);
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
                gotoPage: function () {
                    $.fn.bsgrid.gotoPage(options);
                },
                sort: function (obj) {
                    $.fn.bsgrid.sort(obj, options);
                },
                getGridHeaderObject: function () {
                    return $.fn.bsgrid.getGridHeaderObject(options);
                },
                appendHeaderSort: function () {
                    $.fn.bsgrid.appendHeaderSort(options);
                },
                setGridBlankBody: function () {
                    $.fn.bsgrid.setGridBlankBody(options);
                },
                clearGridBodyData: function () {
                    $.fn.bsgrid.clearGridBodyData(options);
                },
                addPagingToolbar: function () {
                    $.fn.bsgrid.addPagingToolbar(options);
                },
                setPagingToolbarEvents: function () {
                    $.fn.bsgrid.setPagingToolbarEvents(options);
                },
                dynamicChangePagingButtonStyle: function () {
                    $.fn.bsgrid.dynamicChangePagingButtonStyle(options);
                },
                resetPerPageValues: function () {
                    $.fn.bsgrid.resetPerPageValues(options);
                }
            };

            // store mapping grid id to gridObj
            $.fn.bsgrid.gridObjs[gridId] = gridObj;

            gridObj.appendHeaderSort();
            gridObj.addPagingToolbar();
            gridObj.setPagingToolbarEvents();

            if (options.settings.isProcessLockScreen) {
                $.fn.bsgrid.addLockScreen(options);
            }

            // auto load
            if (options.settings.autoLoad) {
                // delay 10 millisecond for return gridObj first, then page
                setTimeout(function () {
                    gridObj.page(1);
                }, 10);
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
            if (isNaN(curPage)) {
                alert($.bsgridLanguage.needInteger);
                return;
            }
            var dataType = options.settings.dataType;
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
                    var parseSuccess = $.fn.bsgrid.parseData.success(dataType, gridData);
                    options.settings.additionalBeforeRenderGrid(parseSuccess, gridData, options);
                    if (parseSuccess) {
                        options.totalRows = $.fn.bsgrid.parseData.totalRows(dataType, gridData);
                        if (!options.settings.pageAll) {
                            options.curPage = $.fn.bsgrid.parseData.curPage(dataType, gridData);
                            var totalPages = parseInt(options.totalRows / options.settings.pageSize);
                            options.totalPages = parseInt((options.totalRows % options.settings.pageSize == 0) ? totalPages : totalPages + 1);
                        } else { // display all datas, no paging
                            options.curPage = 1;
                            options.totalPages = 1;
                            options.settings.pageSize = options.totalRows;
                        }

                        var pageSize = options.settings.pageSize;
                        $('#' + options.totalRowsId).html(options.totalRows);
                        $('#' + options.totalPagesId).html(options.totalPages);
                        $('#' + options.currPageId).html(options.curPage);
                        $.fn.bsgrid.dynamicChangePagingButtonStyle(options);

                        var data = $.fn.bsgrid.parseData.data(dataType, gridData);
                        var rowSize = data.length;
                        rowSize = pageSize > rowSize ? rowSize : pageSize;
                        var startRow = (parseInt(options.curPage) - 1) * parseInt(pageSize) + 1;
                        var endRow = (parseInt(options.curPage) - 1) * parseInt(pageSize) + rowSize;
                        startRow = startRow > endRow ? endRow : startRow;
                        options.startRow = startRow;
                        options.endRow = endRow;
                        $('#' + options.startRowId).html(options.startRow);
                        $('#' + options.endRowId).html(options.endRow);

                        $.fn.bsgrid.setGridBlankBody(options);
                        if (rowSize == 0) {
                            return;
                        }

                        var headerTh = $.fn.bsgrid.getGridHeaderObject(options);
                        $('#' + options.gridId + ' tr:not(:first)').each(
                            function (i) {
                                var record = null;
                                if (i < rowSize) {
                                    record = $.fn.bsgrid.parseData.getRecord(dataType, data, i);
                                }
                                $.fn.bsgrid.storeRowData(i, record, options);
                                $(this).find('td').each(function (j) {
                                    // column index
                                    var index = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.indexAttr));
                                    // column render
                                    var render = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.renderAttr));
                                    // column tip
                                    var tip = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.tipAttr));
                                    // column text max length
                                    var maxLen = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.lengthAttr));
                                    maxLen = maxLen.length != 0 ? parseInt(maxLen) : options.settings.colsProperties.maxLength;
                                    if (i < rowSize) {
                                        if (render != '') {
                                            var render_method = eval(render);
                                            var render_html = render_method(record, i, j, options);
                                            $(this).html(render_html);
                                        } else if (index != '') {
                                            {
                                                var value = $.fn.bsgrid.parseData.getColumnValue(dataType, record, index);
                                                if (tip == 'true') {
                                                    $.fn.bsgrid.columnTip(this, value);
                                                }
                                                if (options.settings.longLengthAotoSubAndTip) {
                                                    $.fn.bsgrid.longLengthSubAndTip(this, value, maxLen);
                                                } else {
                                                    $(this).html(value);
                                                }
                                            }
                                        }
                                    } else {
                                        $(this).html('&nbsp;');
                                    }
                                });
                                options.settings.additionalRenderPerRow(record, i, options);
                            }
                        );
                    } else {
                        alert($.bsgridLanguage.errorForRequestData);
                    }
                    options.settings.additionalAfterRenderGrid(parseSuccess, gridData, options);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert($.bsgridLanguage.errorForSendOrRequestData);
                }
            });
        },

        storeRowData: function (row, record, options) {
            $('#' + options.gridId + ' tr:eq(' + (row + 1) + ')').data('record', record);
        },

        getRecord: function (row, options) {
            var record = $('#' + options.gridId + ' tr:eq(' + (row + 1) + ')').data('record');
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

        getCurPage: function (options) {
            var curPage = $('#' + options.currPageId).html();
            return curPage == '' ? 1 : curPage;
        },

        refreshPage: function (options) {
            $.fn.bsgrid.page($.fn.bsgrid.getCurPage(options), options);
        },

        firstPage: function (options) {
            var curPage = $.fn.bsgrid.getCurPage(options);
            if (curPage <= 1) {
                alert($.bsgridLanguage.isFirstPage);
                return;
            }
            $.fn.bsgrid.page(1, options);
        },

        prevPage: function (options) {
            var curPage = $.fn.bsgrid.getCurPage(options);
            if (curPage <= 1) {
                alert($.bsgridLanguage.isFirstPage);
                return;
            }
            $.fn.bsgrid.page(parseInt(curPage) - 1, options);
        },

        nextPage: function (options) {
            var curPage = $.fn.bsgrid.getCurPage(options);
            if (curPage >= options.totalPages) {
                alert($.bsgridLanguage.isLastPage);
                return;
            }
            $.fn.bsgrid.page(parseInt(curPage) + 1, options);
        },

        lastPage: function (options) {
            var curPage = $.fn.bsgrid.getCurPage(options);
            if (curPage >= options.totalPages) {
                alert($.bsgridLanguage.isLastPage);
                return;
            }
            $.fn.bsgrid.page(options.totalPages, options);
        },

        gotoPage: function (options) {
            var goPage = $('#' + options.gotoPageInputId).val();
            if (isNaN(goPage)) {
                alert($.bsgridLanguage.needInteger);
            } else if (parseInt(goPage) < 1 || parseInt(goPage) > options.totalPages) {
                alert($.bsgridLanguage.needRange(1, options.totalPages));
            } else {
                $.fn.bsgrid.page(parseInt(goPage), options);
            }
        },

        sort: function (obj, options) {
            var field = $(obj).attr('sortName');
            // revert style
            $.fn.bsgrid.getGridHeaderObject(options).each(function () {
                if ($.trim($(this).attr(options.settings.colsProperties.sortAttr)).length != 0) {
                    $(this).find('a').attr('class', 'sort sort-view');
                }
            });
            if (options.sortName == field) {
                if (options.sortOrder == 'asc') {
                    options.sortOrder = 'desc';
                    $(obj).attr('class', 'sort sort-desc');
                } else {
                    options.sortOrder = 'asc';
                    $(obj).attr('class', 'sort sort-asc');
                }
            } else {
                options.sortName = field;
                options.sortOrder = 'desc';
                $(obj).attr('class', 'sort sort-desc');
            }
            $.fn.bsgrid.refreshPage(options);
        },

        getGridHeaderObject: function (options) {
            return $('#' + options.gridId + ' tr').first().find('th');
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
                        options.sortName = sortName;
                        options.sortOrder = sortOrder;
                        sortHtml += 'sort-' + sortOrder;
                    } else {
                        sortHtml += 'sort-view';
                    }
                    sortHtml += '">&nbsp;&nbsp;&nbsp;</a>'; // use: "&nbsp;&nbsp;&nbsp;", different from: "&emsp;" is: IE8 and IE9 not display "&emsp;"
                    $(this).append(sortHtml);
                }
            });

            $('#' + options.gridId + ' th .sort').each(function () {
                $(this).click(function () {
                    $.fn.bsgrid.sort(this, options);
                });
            });
        },

        setGridBlankBody: function (options) {
            // remove rows
            $('#' + options.gridId + ' tr:not(:first)').remove();

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
            var rowSize = options.settings.pageSize;
            if (!options.settings.displayBlankRows) {
                rowSize = options.endRow - options.startRow + 1;
                rowSize = options.endRow > 0 ? rowSize : 0;
            }
            if (rowSize == 0) {
                rowsSb.append('<tr><td colspan="' + header.length + '">' + $.bsgridLanguage.noDataToDisplay + '</td></tr>');
            } else {
                for (var pi = 0; pi < rowSize; pi++) {
                    rowsSb.append(rowSb);
                }
            }
            $('#' + options.gridId).append(rowsSb.toString());

            if (rowSize != 0) {
                if (options.settings.stripeRows) {
                    $('#' + options.gridId + ' tr:even').addClass('even_index_row');
                }
            }
        },

        clearGridBodyData: function (options) {
            $('#' + options.gridId + ' tr:not(:first)').each(
                function () {
                    $(this).find('td').each(function () {
                        $(this).html('&nbsp;');
                    });
                }
            );
        },

        /**
         * add paging toolbar.
         *
         * @param options
         */
        addPagingToolbar: function (options) {
            var pagingTableSb = new StringBuilder();
            pagingTableSb.append('<table id="' + options.pagingToolbarId + '" class="bsgridPaging" style="display: none;"><tr><td align="' + options.settings.pagingToolbarAlign + '">');
            if (options.settings.pageAll) {
                pagingTableSb.append($.bsgridLanguage.pagingToolbar.totalRows(options.totalRowsId) + '&nbsp;&nbsp;&nbsp;');
            } else {
                pagingTableSb.append('<table class="' + (options.settings.pageSizeSelect ? '' : 'noPageSizeSelect') + '">');
                pagingTableSb.append('<tr>');
                if (options.settings.pageSizeSelect) {
                    if ($.inArray(options.settings.pageSize, options.settings.pageSizeForGrid) == -1) {
                        options.settings.pageSizeForGrid.push(options.settings.pageSize);
                    }
                    pagingTableSb.append('<td>' + $.bsgridLanguage.pagingToolbar.pageSizeDisplay(options.pageSizeId) + '</td>');
                }
                pagingTableSb.append('<td>' + $.bsgridLanguage.pagingToolbar.currentDisplayRows(options.startRowId, options.endRowId) + '</td>');
                pagingTableSb.append('<td>' + $.bsgridLanguage.pagingToolbar.totalRows(options.totalRowsId) + '</td>');
                var btnClass = options.settings.pagingBtnClass;
                pagingTableSb.append('<td>');
                pagingTableSb.append('<input class="' + btnClass + ' firstPage" type="button" id="' + options.firstPageId + '" value="' + $.bsgridLanguage.pagingToolbar.firstPage + '" />');
                pagingTableSb.append('&nbsp;&nbsp;');
                pagingTableSb.append('<input class="' + btnClass + ' prevPage" type="button" id="' + options.prevPageId + '" value="' + $.bsgridLanguage.pagingToolbar.prevPage + '" />');
                pagingTableSb.append('</td>');
                pagingTableSb.append('<td>' + $.bsgridLanguage.pagingToolbar.currentDisplayPageAndTotalPages(options.currPageId, options.totalPagesId) + '</td>');
                pagingTableSb.append('<td>');
                pagingTableSb.append('<input class="' + btnClass + ' nextPage" type="button" id="' + options.nextPageId + '" value="' + $.bsgridLanguage.pagingToolbar.nextPage + '" />');
                pagingTableSb.append('&nbsp;&nbsp;');
                pagingTableSb.append('<input class="' + btnClass + ' lastPage" type="button" id="' + options.lastPageId + '" value="' + $.bsgridLanguage.pagingToolbar.lastPage + '" />');
                pagingTableSb.append('</td>');
                pagingTableSb.append('<td>');
                pagingTableSb.append('<input type="text" id="' + options.gotoPageInputId + '" style="width: 40px" />');
                pagingTableSb.append('&nbsp;');
                pagingTableSb.append('<input class="' + btnClass + ' gotoPage" type="button" id="' + options.gotoPageId + '" value="' + $.bsgridLanguage.pagingToolbar.gotoPage + '" />');
                pagingTableSb.append('</td>');
                pagingTableSb.append('</tr>');
                pagingTableSb.append('</table>');
            }
            pagingTableSb.append('</td></tr></table>');

            $('#' + options.gridId).after(pagingTableSb.toString());
        },

        /**
         * set paging toolbar events.
         *
         * @param options
         */
        setPagingToolbarEvents: function (options) {
            if (!options.settings.pageAll) {
                if (options.settings.pageSizeSelect) {
                    $.fn.bsgrid.resetPerPageValues(options);
                    $('#' + options.pageSizeId).change(function () {
                        options.settings.pageSize = parseInt($(this).val());
                        $(this).trigger('blur');
                        // if change pageSize, then page first
                        $.fn.bsgrid.page(1, options);
                    });
                }

                $('#' + options.firstPageId).click(function () {
                    $.fn.bsgrid.firstPage(options);
                });
                $('#' + options.prevPageId).click(function () {
                    $.fn.bsgrid.prevPage(options);
                });
                $('#' + options.nextPageId).click(function () {
                    $.fn.bsgrid.nextPage(options);
                });
                $('#' + options.lastPageId).click(function () {
                    $.fn.bsgrid.lastPage(options);
                });
                $('#' + options.gotoPageInputId).keyup(function (e) {
                    if (e.which == 13) {
                        $.fn.bsgrid.gotoPage(options);
                    }
                });
                $('#' + options.gotoPageId).click(function () {
                    $.fn.bsgrid.gotoPage(options);
                });
            }
        },

        /**
         * dynamic change paging button style.
         *
         * @param options
         */
        dynamicChangePagingButtonStyle: function (options) {
            var disabledCls = 'disabledCls';
            if (options.curPage <= 1) {
                $('#' + options.firstPageId).addClass(disabledCls);
                $('#' + options.prevPageId).addClass(disabledCls);
            } else {
                $('#' + options.firstPageId).removeClass(disabledCls);
                $('#' + options.prevPageId).removeClass(disabledCls);
            }
            if (options.curPage >= options.totalPages) {
                $('#' + options.nextPageId).addClass(disabledCls);
                $('#' + options.lastPageId).addClass(disabledCls);
            } else {
                $('#' + options.nextPageId).removeClass(disabledCls);
                $('#' + options.lastPageId).removeClass(disabledCls);
            }

            if (options.settings.displayPagingToolbarOnlyMultiPages && options.totalPages <= 1) {
                $('#' + options.pagingToolbarId).hide();
            } else {
                $('#' + options.pagingToolbarId).show();
            }
        },

        /**
         * This method is copy from: jquery.tablePagination.0.5.js. http://neoalchemy.org/tablePagination.html MIT licenses
         * Little modify.
         *
         * @param options
         */
        resetPerPageValues: function (options) {
            var isRowsPerPageMatched = false;
            var optsPerPage = options.settings.pageSizeForGrid;
            optsPerPage.sort(function (a, b) {
                return a - b;
            });
            var perPageDropdown = $('#' + options.pageSizeId)[0];
            for (var i = 0; i < optsPerPage.length; i++) {
                if (optsPerPage[i] == options.settings.pageSize) {
                    perPageDropdown.options[i] = new Option(optsPerPage[i], optsPerPage[i], true, true);
                    isRowsPerPageMatched = true;
                }
                else {
                    perPageDropdown.options[i] = new Option(optsPerPage[i], optsPerPage[i]);
                }
            }
            if (!isRowsPerPageMatched) {
                options.settings.pageSizeForGrid = optsPerPage[0];
            }
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
                lockScreenHtml.append('<table><tr><td><center><div class="bsgrid loading"><span>&emsp;</span>&nbsp;' + $.bsgridLanguage.loadingDataMessage + '&emsp;<center></div></td></tr></table>');
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
         */
        columnTip: function (obj, value) {
            $(obj).attr('title', value);
        },

        /**
         * if column's value length longer than it, auto sub and tip it.
         *    sub: txt.substring(0, MaxLength-3) + '...'.
         *
         * @param obj column td obj
         * @param value column's value
         * @param maxLen max length
         */
        longLengthSubAndTip: function (obj, value, maxLen) {
            if (value.length > maxLen) {
                $(obj).html(value.substring(0, maxLen - 3) + '...');
                $.fn.bsgrid.columnTip(obj, value);
            } else {
                $(obj).html(value);
            }
        }

    };

})(jQuery);
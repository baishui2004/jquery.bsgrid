/**
 * JQuery.bsgrid v1.0beta by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * require common.js.
 *
 * @author Baishui2004
 * @Date March 20, 2014
 */
(function ($) {

    $.fn.bsgrid_grid = {

        // defaults
        defaults: {
            // request params name
            requestParamsName: {
                pageSize: 'pageSize',
                curPage: 'curPage',
                sortName: 'sortName',
                sortOrder: 'sortOrder'
            },
            // defaults settings
            settings: {
                url: '', // page request url
                dataType: 'json',
                autoLoad: true, // load onReady
                pageAll: false, // display all datas, no paging only count
                pageSize: 20, // page size. if set value little then 1, then pageAll will auto set true
                pageSizeSelect: false, // if display pageSize select option
                pageSizeForGrid: [5, 10, 20, 25, 50, 100, 200, 500], // pageSize select option
                // if column's value length longer than it, auto sub and title it.
                //    sub: txt.substring(0, MaxLength-3) + '...'
                //    if column's render is not false, then this property is not make effective to it.
                longLengthAotoSubAndTitle: true,
                colsProperties: {
                    // body row column config
                    align: 'center',
                    maxLength: 40,
                    // config properties's name
                    indexAttr: 'w_index',
                    sortAttr: 'w_sort', // use: w_sort="id" or w_sort="id,desc" or w_sort="id,asc"
                    alignAttr: 'w_align',
                    lengthAttr: 'w_length',
                    renderAttr: 'w_render', // use: w_render="funMethod();"
                    titleAttr: 'w_title'
                }
            },
            isProcessLockScreen: true,
            // open lock screen
            lockScreen: function (options, xhr) {
            },
            // close lock screen
            unlockScreen: function (options, xhr, ts) {
            },
            beforeSend: function (options, xhr) {
                if (this.isProcessLockScreen) {
                    this.lockScreen(options, xhr);
                }
            },
            complete: function (options, xhr, ts) {
                if (this.isProcessLockScreen) {
                    this.unlockScreen(options, xhr, ts);
                }
            },
            stripeRows: false, // stripe rows
            pagingToolbarAlign: 'right',
            pagingBtnClass: 'pagingBtn' // paging toolbar button css class
        },


        init: function (gridId, settings) {
            var options = {
                settings: $.extend(true, {}, $.fn.bsgrid_grid.defaults.settings, settings),

                gridId: gridId,
                // page toolbar
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

                // paging toolbar
                pagingToolbarId: gridId + '_pagingToolbar',

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

            // grid header
            $.fn.bsgrid_grid.grtGridHeaderObject(options).each(function () {
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

            $('#' + gridId + ' th .sort').each(function () {
                $(this).click(function () {
                    $.fn.bsgrid_grid.sort(options, this);
                });
            });

            $.fn.bsgrid_grid.setGridBlankBody(options);
            if ($.fn.bsgrid_grid.defaults.stripeRows) {
                $('#' + gridId + ' tr:even').addClass('even_index_row');
            }
            $.fn.bsgrid_grid.addPagingToolbar(options);
            $.fn.bsgrid_grid.setPagingToolbarEvents(options);

            // auto load
            if (options.settings.autoLoad) {
                $.fn.bsgrid_grid.page(1, options);
            }

            var gridObj = $.fn.bsgrid_grid;
            gridObj.options = options;
            return gridObj;
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
                + $.fn.bsgrid_grid.defaults.requestParamsName.pageSize + '=' + options.settings.pageSize
                + '&' + $.fn.bsgrid_grid.defaults.requestParamsName.curPage + '=' + curPage
                + '&' + $.fn.bsgrid_grid.defaults.requestParamsName.sortName + '=' + options.sortName
                + '&' + $.fn.bsgrid_grid.defaults.requestParamsName.sortOrder + '=' + options.sortOrder;
            return condition;
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
            getColumnValue: function (json, row, index) {
                return $.trim(json.data[row][index]);
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
            getColumnValue: function (xml, row, index) {
                return $.trim($(xml).find('gridData data row').eq(row).find(index).text());
            }
        },

        parseData: {
            success: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid_grid.parseJsonData.success(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid_grid.parseXmlData.success(gridData);
                }
                return false;
            },
            totalRows: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid_grid.parseJsonData.totalRows(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid_grid.parseXmlData.totalRows(gridData);
                }
                return false;
            },
            curPage: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid_grid.parseJsonData.curPage(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid_grid.parseXmlData.curPage(gridData);
                }
                return false;
            },
            data: function (type, gridData) {
                if (type == 'json') {
                    return $.fn.bsgrid_grid.parseJsonData.data(gridData);
                } else if (type == 'xml') {
                    return $.fn.bsgrid_grid.parseXmlData.data(gridData);
                }
                return false;
            },
            getColumnValue: function (type, gridData, row, index) {
                if (type == 'json') {
                    return $.fn.bsgrid_grid.parseJsonData.getColumnValue(gridData, row, index);
                } else if (type == 'xml') {
                    return $.fn.bsgrid_grid.parseXmlData.getColumnValue(gridData, row, index);
                }
                return false;
            }
        },

        page: function page(curPage, options) {
            if (isNaN(curPage)) {
                alert($.bsgrid_gridLanguage.needInteger);
                return;
            }
            var dataType = options.settings.dataType;
            $.ajax({
                type: 'post',
                url: options.settings.url,
                data: $.fn.bsgrid_grid.getPageCondition(curPage, options),
                dataType: dataType,
                beforeSend: function (xhr) {
                    $.fn.bsgrid_grid.defaults.beforeSend(options, xhr);
                },
                complete: function (xhr, ts) {
                    $.fn.bsgrid_grid.defaults.complete(options, xhr, ts);
                },
                success: function (gridData) {
                    if ($.fn.bsgrid_grid.parseData.success(dataType, gridData)) {
                        // display all datas, no paging
                        if (!options.settings.pageAll) {
                            options.totalRows = $.fn.bsgrid_grid.parseData.totalRows(dataType, gridData);
                            options.curPage = $.fn.bsgrid_grid.parseData.curPage(dataType, gridData);
                            var totalPages = parseInt(options.totalRows / options.settings.pageSize);
                            options.totalPages = parseInt((options.totalRows % options.settings.pageSize == 0) ? totalPages : totalPages + 1);
                        } else {
                            options.totalRows = $.fn.bsgrid_grid.parseData.totalRows(dataType, gridData);
                            options.curPage = 1;
                            options.totalPages = 1;

                            options.settings.pageSize = options.totalRows;
                            $.fn.bsgrid_grid.setGridBlankBody(options);
                        }

                        var pageSize = options.settings.pageSize;
                        $('#' + options.totalRowsId).html(options.totalRows);
                        $('#' + options.totalPagesId).html(options.totalPages);
                        $('#' + options.currPageId).html(options.curPage);
                        $.fn.bsgrid_grid.dynamicChangePagingButtonStype(options);

                        var rowSize = $.fn.bsgrid_grid.parseData.data(dataType, gridData).length;
                        rowSize = pageSize > rowSize ? rowSize : pageSize;
                        var startRow = (parseInt(options.curPage) - 1) * parseInt(pageSize) + 1;
                        var endRow = (parseInt(options.curPage) - 1) * parseInt(pageSize) + rowSize;
                        options.startRow = startRow;
                        options.endRow = endRow;
                        $('#' + options.startRowId).html(options.startRow);
                        $('#' + options.endRowId).html(options.endRow);

                        var headerTh = $.fn.bsgrid_grid.grtGridHeaderObject(options);
                        $('#' + options.gridId + ' tr:not(:first)').each(
                            function (i) {
                                $(this).find('td').each(function (j) {
                                    // column index
                                    var index = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.indexAttr));
                                    // column render
                                    var render = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.renderAttr));
                                    // column tip
                                    var title = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.titleAttr));
                                    // column text max length
                                    var length = $.trim(headerTh.eq(j).attr(options.settings.colsProperties.lengthAttr));
                                    if (i < rowSize) {
                                        if (render != '') {
                                            var render_html = eval(render).toString();

                                            var pattern = new RegExp('\\$\\{[^\\}]+\\}', "g");
                                            var render_index = '';
                                            do
                                            {
                                                render_index = pattern.exec(render_html);
                                                if (render_index != null) {
                                                    render_index = render_index.toString();
                                                    render_index = render_index.substring(2, render_index.length - 1);
                                                    render_html = render_html.replaceAll('\\$\\{' + render_index + '\\}', $.fn.bsgrid_grid.parseData.getColumnValue(dataType, gridData, i, render_index));
                                                }
                                            }
                                            while (render_index != null);

                                            $(this).html(render_html);
                                        } else if (index != '') {
                                            {
                                                var value = $.fn.bsgrid_grid.parseData.getColumnValue(dataType, gridData, i, index);
                                                if (title == 'true') {
                                                    $(this).attr('title', value);
                                                }
                                                if (options.settings.longLengthAotoSubAndTitle) {
                                                    length = length.length != 0 ? parseInt(length) : options.settings.colsProperties.maxLength;
                                                    if (value.length > length) {
                                                        $(this).html(value.substring(0, length - 3) + '...');
                                                        $(this).attr('title', value);
                                                    } else {
                                                        $(this).html(value);
                                                    }
                                                } else {
                                                    $(this).html(value);
                                                }
                                            }
                                        }
                                    } else {
                                        $(this).html('&nbsp;');
                                    }
                                });
                            }
                        );
                    } else {
                        alert($.bsgrid_gridLanguage.errorForRequestData);
                    }
                },
                error: function () {
                    alert($.bsgrid_gridLanguage.errorForSendOrRequestData);
                }
            });
        },

        grtGridHeaderObject: function (options) {
            return $('#' + options.gridId + ' tr').first().find('th');
        },

        setGridBlankBody: function (options) {
            // remove rows
            $('#' + options.gridId + ' tr:not(:first)').remove();

            // add rows
            var rowSb = '';
            if (options.settings.pageSize > 0) {
                var alignAttr = options.settings.colsProperties.alignAttr;
                var header = $.fn.bsgrid_grid.grtGridHeaderObject(options);

                var trSb = new StringBuilder();
                trSb.append('<tr>');
                for (var hi = 0; hi < header.length; hi++) {
                    trSb.append('<td');
                    var align = $.trim(header.eq(hi).attr(alignAttr));
                    align = align == '' ? options.settings.colsProperties.align : align;
                    trSb.append(' style="text-align: ' + align + ';"');
                    trSb.append('></td>');
                }
                rowSb = trSb.toString();
            }
            var rowsSb = new StringBuilder();
            for (var pi = 0; pi < options.settings.pageSize; pi++) {
                rowsSb.append(rowSb);
            }
            $('#' + options.gridId).append(rowsSb.toString());
        },

        addPagingToolbar: function (options) {
            var pagingTableSb = new StringBuilder();
            pagingTableSb.append('<table class="bsgrid_gridPaging"><tr><td align="' + $.fn.bsgrid_grid.defaults.pagingToolbarAlign + '">');
            if (options.settings.pageAll) {
                pagingTableSb.append($.bsgrid_gridLanguage.pagingToolbar.totalRows(options.totalRowsId) + '&nbsp;&nbsp;&nbsp;');
            } else {
                pagingTableSb.append('<table id="' + options.pagingToolbarId + '" class="' + (options.settings.pageSizeSelect ? '' : 'noPageSizeSelect') + '">');
                pagingTableSb.append('<tr>');
                if (options.settings.pageSizeSelect) {
                    if ($.inArray(options.settings.pageSize, options.settings.pageSizeForGrid) == -1) {
                        options.settings.pageSizeForGrid.push(options.settings.pageSize);
                    }
                    pagingTableSb.append('<td>' + $.bsgrid_gridLanguage.pagingToolbar.pageSizeDisplay(options.pageSizeId) + '</td>')
                }
                pagingTableSb.append('<td>' + $.bsgrid_gridLanguage.pagingToolbar.currentDisplayRows(options.startRowId, options.endRowId) + '</td>');
                pagingTableSb.append('<td>' + $.bsgrid_gridLanguage.pagingToolbar.totalRows(options.totalRowsId) + '</td>');
                var btnClass = $.fn.bsgrid_grid.defaults.pagingBtnClass;
                pagingTableSb.append('<td>');
                pagingTableSb.append('<input class="' + btnClass + ' firstPage" type="button" id="' + options.firstPageId + '" value="' + $.bsgrid_gridLanguage.pagingToolbar.firstPage + '" />');
                pagingTableSb.append('&nbsp;&nbsp;');
                pagingTableSb.append('<input class="' + btnClass + ' prevPage" type="button" id="' + options.prevPageId + '" value="' + $.bsgrid_gridLanguage.pagingToolbar.prevPage + '" />');
                pagingTableSb.append('</td>');
                pagingTableSb.append('<td>' + $.bsgrid_gridLanguage.pagingToolbar.currentDisplayPageAndTotalPages(options.currPageId, options.totalPagesId) + '</td>');
                pagingTableSb.append('<td>');
                pagingTableSb.append('<input class="' + btnClass + ' nextPage" type="button" id="' + options.nextPageId + '" value="' + $.bsgrid_gridLanguage.pagingToolbar.nextPage + '" />');
                pagingTableSb.append('&nbsp;&nbsp;');
                pagingTableSb.append('<input class="' + btnClass + ' lastPage" type="button" id="' + options.lastPageId + '" value="' + $.bsgrid_gridLanguage.pagingToolbar.lastPage + '" />');
                pagingTableSb.append('</td>');
                pagingTableSb.append('<td>');
                pagingTableSb.append('<input type="text" id="' + options.gotoPageInputId + '" style="width: 40px" />');
                pagingTableSb.append('&nbsp;');
                pagingTableSb.append('<input class="' + btnClass + ' gotoPage" type="button" id="' + options.gotoPageId + '" value="' + $.bsgrid_gridLanguage.pagingToolbar.gotoPage + '" />');
                pagingTableSb.append('</td>');
                pagingTableSb.append('</tr>');
                pagingTableSb.append('</table>');
            }
            pagingTableSb.append('</td></tr></table>');

            $('#' + options.gridId).after(pagingTableSb.toString());
        },

        setPagingToolbarEvents: function (options) {
            if (!options.settings.pageAll) {
                if (options.settings.pageSizeSelect) {
                    $.fn.bsgrid_grid.resetPerPageValues(options);
                    $('#' + options.pageSizeId).change(function () {
                        options.settings.pageSize = parseInt($(this).val());
                        $.fn.bsgrid_grid.setGridBlankBody(options);
                        // if change pageSize, then page first
                        $.fn.bsgrid_grid.page(1, options);
                    });
                }

                $('#' + options.firstPageId).click(function () {
                    $.fn.bsgrid_grid.firstPage(options);
                });
                $('#' + options.prevPageId).click(function () {
                    $.fn.bsgrid_grid.prevPage(options);
                });
                $('#' + options.nextPageId).click(function () {
                    $.fn.bsgrid_grid.nextPage(options);
                });
                $('#' + options.lastPageId).click(function () {
                    $.fn.bsgrid_grid.lastPage(options);
                });
                $('#' + options.gotoPageInputId).keyup(function (e) {
                    if (e.which == 13) {
                        $.fn.bsgrid_grid.gotoPage(options);
                    }
                });
                $('#' + options.gotoPageId).click(function () {
                    $.fn.bsgrid_grid.gotoPage(options);
                });
            }
        },

        dynamicChangePagingButtonStype: function (options) {
            var disabledCls = 'disabledCls';
            if (options.curPage == 1) {
                $('#' + options.firstPageId).addClass(disabledCls);
                $('#' + options.prevPageId).addClass(disabledCls);
            } else {
                $('#' + options.firstPageId).removeClass(disabledCls);
                $('#' + options.prevPageId).removeClass(disabledCls);
            }
            if (options.curPage == options.totalPages) {
                $('#' + options.nextPageId).addClass(disabledCls);
                $('#' + options.lastPageId).addClass(disabledCls);
            } else {
                $('#' + options.nextPageId).removeClass(disabledCls);
                $('#' + options.lastPageId).removeClass(disabledCls);
            }
        },

        /**
         * This method is copy from: jquery.tablePagination.0.5.js. http://neoalchemy.org/tablePagination.html MIT licenses
         * Little modify.
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

        getCurPage: function (options) {
            var curPage = $('#' + options.currPageId).html();
            return curPage == '' ? 1 : curPage;
        },

        refreshPage: function refreshPage(options) {
            $.fn.bsgrid_grid.page($.fn.bsgrid_grid.getCurPage(options), options);
        },

        firstPage: function (options) {
            var curPage = $.fn.bsgrid_grid.getCurPage(options);
            if (curPage <= 1) {
                alert($.bsgrid_gridLanguage.isFirstPage);
                return;
            }
            $.fn.bsgrid_grid.page(1, options);
        },

        prevPage: function (options) {
            var curPage = $.fn.bsgrid_grid.getCurPage(options);
            if (curPage <= 1) {
                alert($.bsgrid_gridLanguage.isFirstPage);
                return;
            }
            $.fn.bsgrid_grid.page(parseInt(curPage) - 1, options);
        },

        nextPage: function (options) {
            var curPage = $.fn.bsgrid_grid.getCurPage(options);
            if (curPage >= options.totalPages) {
                alert($.bsgrid_gridLanguage.isLastPage);
                return;
            }
            $.fn.bsgrid_grid.page(parseInt(curPage) + 1, options);
        },

        lastPage: function (options) {
            var curPage = $.fn.bsgrid_grid.getCurPage(options);
            if (curPage >= options.totalPages) {
                alert($.bsgrid_gridLanguage.isLastPage);
                return;
            }
            $.fn.bsgrid_grid.page(options.totalPages, options);
        },

        gotoPage: function (options) {
            var goPage = $('#' + options.gotoPageInputId).val();
            if (isNaN(goPage)) {
                alert($.bsgrid_gridLanguage.needInteger);
            } else if (parseInt(goPage) < 1 || parseInt(goPage) > options.totalPages) {
                alert($.bsgrid_gridLanguage.needRange(1, options.totalPages));
            } else {
                $.fn.bsgrid_grid.page(parseInt(goPage), options);
            }
        },

        sort: function (options, obj) {
            var field = $(obj).attr('sortName');
            // revert style
            $.fn.bsgrid_grid.grtGridHeaderObject(options).each(function () {
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
            $.fn.bsgrid_grid.refreshPage(options);
        },

        clearGridBodyData: function (options) {
            $('#' + options.gridId + ' tr:not(:first)').each(
                function () {
                    $(this).find('td').each(function () {
                        $(this).html('&nbsp;');
                    });
                }
            );
        }

    }

})(jQuery);
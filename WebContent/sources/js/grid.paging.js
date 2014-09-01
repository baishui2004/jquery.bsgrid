/**
 * jQuery.bsgrid v1.20 by @Baishui2004
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

    $.fn.bsgrid_paging = {

        // defaults settings
        defaults: {
            pageSize: 20, // page size.
            pageSizeSelect: false, // if display pageSize select option
            pageSizeForGrid: [5, 10, 20, 25, 50, 100, 200, 500], // pageSize select option
            pagingBtnClass: 'pagingBtn' // paging toolbar button css class
        },

        pagingObjs: {
        },

        /**
         * init paging.
         */
        init: function (pagingId, settings) {
            var options = {
                settings: $.extend(true, {}, $.fn.bsgrid_paging.defaults, settings),

                pagingId: pagingId,
                totalRowsId: pagingId + '_totalRows',
                totalPagesId: pagingId + '_totalPages',
                curPageId: pagingId + '_curPage',
                gotoPageInputId: pagingId + '_gotoPageInput',
                gotoPageId: pagingId + '_gotoPage',
                pageSizeId: pagingId + '_pageSize',
                firstPageId: pagingId + '_firstPage',
                prevPageId: pagingId + '_prevPage',
                nextPageId: pagingId + '_nextPage',
                lastPageId: pagingId + '_lastPage',
                startRowId: pagingId + '_startRow',
                endRowId: pagingId + '_endRow',

                totalRows: 0,
                totalPages: 0,
                curPage: 1,
                curPageRowsNum: 0,
                startRow: 0,
                endRow: 0
            };

            var pagingObj = {
                options: options,
                page: function (curPage) {
                    $.fn.bsgrid_paging.page(curPage, options);
                },
                getCurPage: function () {
                    return $.fn.bsgrid_paging.getCurPage(options);
                },
                refreshPage: function () {
                    $.fn.bsgrid_paging.refreshPage(options);
                },
                firstPage: function () {
                    $.fn.bsgrid_paging.firstPage(options);
                },
                prevPage: function () {
                    $.fn.bsgrid_paging.prevPage(options);
                },
                nextPage: function () {
                    $.fn.bsgrid_paging.nextPage(options);
                },
                lastPage: function () {
                    $.fn.bsgrid_paging.lastPage(options);
                },
                gotoPage: function (goPage) {
                    $.fn.bsgrid_paging.gotoPage(options, goPage);
                },
                createPagingToolbar: function () {
                    return $.fn.bsgrid_paging.createPagingToolbar(options);
                },
                setPagingToolbarEvents: function () {
                    $.fn.bsgrid_paging.setPagingToolbarEvents(options);
                },
                dynamicChangePagingButtonStyle: function () {
                    $.fn.bsgrid_paging.dynamicChangePagingButtonStyle(options);
                },
                resetPerPageValues: function () {
                    $.fn.bsgrid_paging.resetPerPageValues(options);
                },
                setPagingValues: function (curPage, totalRows) {
                    $.fn.bsgrid_paging.setPagingValues(curPage, totalRows, options);
                }
            };

            // store mapping paging id to pagingObj
            $.fn.bsgrid_paging.pagingObjs[pagingId] = pagingObj;

            $('#' + pagingId).append(pagingObj.createPagingToolbar());
            pagingObj.setPagingToolbarEvents();

            return pagingObj;
        },

        getPagingObj: function (pagingId) {
            var obj = $.fn.bsgrid_paging.pagingObjs[pagingId];
            return obj ? obj : null;
        },

        page: function (curPage, options) {
            var gridObj = $.fn.bsgrid.getGridObj(options.settings.gridId);
            gridObj.options.settings.pageSize = options.settings.pageSize;
            gridObj.options.curPage = options.curPage;
            $.fn.bsgrid.page(curPage, gridObj.options);
        },

        getCurPage: function (options) {
            var curPage = $('#' + options.curPageId).html();
            return curPage == '' ? 1 : curPage;
        },

        refreshPage: function (options) {
            $.fn.bsgrid_paging.page($.fn.bsgrid_paging.getCurPage(options), options);
        },

        firstPage: function (options) {
            var curPage = $.fn.bsgrid_paging.getCurPage(options);
            if (curPage <= 1) {
                alert($.bsgridLanguage.isFirstPage);
                return;
            }
            $.fn.bsgrid_paging.page(1, options);
        },

        prevPage: function (options) {
            var curPage = $.fn.bsgrid_paging.getCurPage(options);
            if (curPage <= 1) {
                alert($.bsgridLanguage.isFirstPage);
                return;
            }
            $.fn.bsgrid_paging.page(parseInt(curPage) - 1, options);
        },

        nextPage: function (options) {
            var curPage = $.fn.bsgrid_paging.getCurPage(options);
            if (curPage >= options.totalPages) {
                alert($.bsgridLanguage.isLastPage);
                return;
            }
            $.fn.bsgrid_paging.page(parseInt(curPage) + 1, options);
        },

        lastPage: function (options) {
            var curPage = $.fn.bsgrid_paging.getCurPage(options);
            if (curPage >= options.totalPages) {
                alert($.bsgridLanguage.isLastPage);
                return;
            }
            $.fn.bsgrid_paging.page(options.totalPages, options);
        },

        gotoPage: function (options, goPage) {
            if (goPage == undefined) {
                goPage = $('#' + options.gotoPageInputId).val();
            }
            if (isNaN(goPage)) {
                alert($.bsgridLanguage.needInteger);
            } else if (parseInt(goPage) < 1 || parseInt(goPage) > options.totalPages) {
                alert($.bsgridLanguage.needRange(1, options.totalPages));
            } else {
                $('#' + options.gotoPageInputId).val(goPage);
                $.fn.bsgrid_paging.page(parseInt(goPage), options);
            }
        },

        /**
         * create paging toolbar.
         *
         * @param options
         */
        createPagingToolbar: function (options) {
            var pagingSb = new StringBuilder();

            pagingSb.append('<table class="' + (options.settings.pageSizeSelect ? '' : 'noPageSizeSelect') + '">');
            pagingSb.append('<tr>');
            if (options.settings.pageSizeSelect) {
                if ($.inArray(options.settings.pageSize, options.settings.pageSizeForGrid) == -1) {
                    options.settings.pageSizeForGrid.push(options.settings.pageSize);
                }
                pagingSb.append('<td>' + $.bsgridLanguage.pagingToolbar.pageSizeDisplay(options.pageSizeId) + '</td>');
            }
            pagingSb.append('<td>' + $.bsgridLanguage.pagingToolbar.currentDisplayRows(options.startRowId, options.endRowId) + '</td>');
            pagingSb.append('<td>' + $.bsgridLanguage.pagingToolbar.totalRows(options.totalRowsId) + '</td>');
            var btnClass = options.settings.pagingBtnClass;
            pagingSb.append('<td>');
            pagingSb.append('<input class="' + btnClass + ' firstPage" type="button" id="' + options.firstPageId + '" value="' + $.bsgridLanguage.pagingToolbar.firstPage + '" />');
            pagingSb.append('&nbsp;&nbsp;');
            pagingSb.append('<input class="' + btnClass + ' prevPage" type="button" id="' + options.prevPageId + '" value="' + $.bsgridLanguage.pagingToolbar.prevPage + '" />');
            pagingSb.append('</td>');
            pagingSb.append('<td>' + $.bsgridLanguage.pagingToolbar.currentDisplayPageAndTotalPages(options.curPageId, options.totalPagesId) + '</td>');
            pagingSb.append('<td>');
            pagingSb.append('<input class="' + btnClass + ' nextPage" type="button" id="' + options.nextPageId + '" value="' + $.bsgridLanguage.pagingToolbar.nextPage + '" />');
            pagingSb.append('&nbsp;&nbsp;');
            pagingSb.append('<input class="' + btnClass + ' lastPage" type="button" id="' + options.lastPageId + '" value="' + $.bsgridLanguage.pagingToolbar.lastPage + '" />');
            pagingSb.append('</td>');
            pagingSb.append('<td>');
            pagingSb.append('<input type="text" id="' + options.gotoPageInputId + '" style="width: 40px" />');
            pagingSb.append('&nbsp;');
            pagingSb.append('<input class="' + btnClass + ' gotoPage" type="button" id="' + options.gotoPageId + '" value="' + $.bsgridLanguage.pagingToolbar.gotoPage + '" />');
            pagingSb.append('</td>');
            pagingSb.append('</tr>');
            pagingSb.append('</table>');

            return pagingSb.toString();
        },

        /**
         * set paging toolbar events.
         *
         * @param options
         */
        setPagingToolbarEvents: function (options) {
            if (options.settings.pageSizeSelect) {
                $.fn.bsgrid_paging.resetPerPageValues(options);
                $('#' + options.pageSizeId).change(function () {
                    options.settings.pageSize = parseInt($(this).val());
                    $(this).trigger('blur');
                    // if change pageSize, then page first
                    $.fn.bsgrid_paging.page(1, options);
                });
            }

            $('#' + options.firstPageId).click(function () {
                $.fn.bsgrid_paging.firstPage(options);
            });
            $('#' + options.prevPageId).click(function () {
                $.fn.bsgrid_paging.prevPage(options);
            });
            $('#' + options.nextPageId).click(function () {
                $.fn.bsgrid_paging.nextPage(options);
            });
            $('#' + options.lastPageId).click(function () {
                $.fn.bsgrid_paging.lastPage(options);
            });
            $('#' + options.gotoPageInputId).keyup(function (e) {
                if (e.which == 13) {
                    $.fn.bsgrid_paging.gotoPage(options);
                }
            });
            $('#' + options.gotoPageId).click(function () {
                $.fn.bsgrid_paging.gotoPage(options);
            });
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
         * Set paging values.
         *
         * @param curPage current page number
         * @param totalRows total rows number
         * @param options paging options
         */
        setPagingValues: function (curPage, totalRows, options) {
            var pageSize = options.settings.pageSize;
            var totalPages = parseInt(totalRows / pageSize);
            totalPages = parseInt((totalRows % pageSize == 0) ? totalPages : totalPages + 1);
            var curPageRowsNum = (curPage * pageSize < totalRows) ? pageSize : (totalRows - (curPage - 1) * pageSize);
            var startRow = (curPage - 1) * pageSize + 1;
            var endRow = (curPage - 1) * pageSize + curPageRowsNum;
            startRow = curPageRowsNum <= 0 ? 0 : startRow;
            endRow = curPageRowsNum <= 0 ? 0 : endRow;

            options.totalRows = totalRows;
            options.totalPages = totalPages;
            options.curPage = curPage;
            options.curPageRowsNum = curPageRowsNum;
            options.startRow = startRow;
            options.endRow = endRow;

            $('#' + options.totalRowsId).html(options.totalRows);
            $('#' + options.totalPagesId).html(options.totalPages);
            $('#' + options.curPageId).html(options.curPage);
            $('#' + options.startRowId).html(options.startRow);
            $('#' + options.endRowId).html(options.endRow);

            $.fn.bsgrid_paging.dynamicChangePagingButtonStyle(options);
        }
    };

})(jQuery);
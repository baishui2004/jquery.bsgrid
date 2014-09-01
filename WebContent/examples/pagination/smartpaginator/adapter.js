/**
 * smartpaginator adapter for bsgrid.
 *
 * jQuery.bsgrid v1.20 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * require common.js, grid.js.
 *
 * @author Baishui2004
 * @Date September 1, 2014
 */
$.fn.bsgrid.getCurPage = function (options) {
    return options.curPage;
};

$.fn.bsgrid.refreshPage = function (options) {
    $.fn.bsgrid.getGridObj(options.gridId).page($.fn.bsgrid.getCurPage(options));
};

$.fn.bsgrid.firstPage = function (options) {
    $.fn.bsgrid.getGridObj(options.gridId).page(1);
};

$.fn.bsgrid.prevPage = function (options) {
    var curPage = $.fn.bsgrid.getCurPage(options);
    if (curPage <= 1) {
        alert($.bsgridLanguage.isFirstPage);
        return;
    }
    $.fn.bsgrid.getGridObj(options.gridId).page(curPage - 1);
};

$.fn.bsgrid.nextPage = function (options) {
    var curPage = $.fn.bsgrid.getCurPage(options);
    if (curPage >= options.totalPages) {
        alert($.bsgridLanguage.isLastPage);
        return;
    }
    $.fn.bsgrid.getGridObj(options.gridId).page(curPage + 1);
};

$.fn.bsgrid.lastPage = function (options) {
    $.fn.bsgrid.getGridObj(options.gridId).page(options.totalPages);
};

$.fn.bsgrid.gotoPage = function (options, goPage) {
    if (goPage == undefined) {
        return;
    }
    if (isNaN(goPage)) {
        alert($.bsgridLanguage.needInteger);
    } else if (parseInt(goPage) < 1 || parseInt(goPage) > options.totalPages) {
        alert($.bsgridLanguage.needRange(1, options.totalPages));
    } else {
        $.fn.bsgrid.getGridObj(options.gridId).page(goPage);
    }
};

$.fn.bsgrid.initPaging = function (options) {
    $('#' + options.pagingOutTabId + ' td').append('<div id="' + options.pagingId + '"></div>');
};

$.fn.bsgrid.setPagingValues = function (options) {
    $('#' + options.pagingId).smartpaginator({
        totalrecords: options.totalRows,
        recordsperpage: options.settings.pageSize,
        initval: options.curPage,
        // length: 10, // display page number length
        theme: 'green', // 'red', 'green', 'black'
        controlsalways: true,
        // display: 'double', // 'double', display page input and goto page button; 'single', hide page input and goto page button
        first: $.bsgridLanguage.pagingToolbar.firstPage, // 'First'
        prev: $.bsgridLanguage.pagingToolbar.prevPage, // 'Prev'
        next: $.bsgridLanguage.pagingToolbar.nextPage, // 'Next'
        last: $.bsgridLanguage.pagingToolbar.lastPage, // 'Last'
        go: $.bsgridLanguage.pagingToolbar.gotoPage, //'Go'
        onchange: function (newPage) {
            $.fn.bsgrid.getGridObj(options.gridId).page(newPage);
        }
    });
};
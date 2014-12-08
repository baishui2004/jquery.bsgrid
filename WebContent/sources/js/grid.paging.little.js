/**
 * jQuery.bsgrid v1.30 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * @author Baishui2004
 * @Date March 24, 2014
 */
$.bsgridLanguage.pagingToolbar.pageSizeDisplay = function (pageSizeId) {
    return '&nbsp;<select id="' + pageSizeId + '"></select>';
};
$.bsgridLanguage.pagingToolbar.currentDisplayRows = function (startRowId, endRowId) {
    return '&nbsp;<span id="' + startRowId + '"></span>&nbsp;-&nbsp;<span id="' + endRowId + '"></span>';
};
$.bsgridLanguage.pagingToolbar.totalRows = function (totalRowsId) {
    return 'total&nbsp;&nbsp;<span id="' + totalRowsId + '"></span>';
};
$.bsgridLanguage.pagingToolbar.firstPage = '&nbsp;';
$.bsgridLanguage.pagingToolbar.prevPage = '&nbsp;';
$.bsgridLanguage.pagingToolbar.nextPage = '&nbsp;';
$.bsgridLanguage.pagingToolbar.lastPage = '&nbsp;';
$.bsgridLanguage.pagingToolbar.gotoPage = '&nbsp;';
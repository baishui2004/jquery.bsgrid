/**
 * JQuery.bsgrid v1.0beta by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * @author Baishui2004
 * @Date March 24, 2014
 */
$.bsgrid_gridLanguage.pagingToolbar.pageSizeDisplay = function (pageSizeId) {
    return '&nbsp;<select id="' + pageSizeId + '"></select>';
};
$.bsgrid_gridLanguage.pagingToolbar.currentDisplayRows = function (startRowId, endRowId) {
    return '&nbsp;<span id="' + startRowId + '"></span>&nbsp;-&nbsp;<span id="' + endRowId + '"></span>';
};
$.bsgrid_gridLanguage.pagingToolbar.totalRows = function (totalRowsId) {
    return 'total&nbsp;&nbsp;<span id="' + totalRowsId + '"></span>'
};
$.bsgrid_gridLanguage.pagingToolbar.firstPage = '&nbsp;';
$.bsgrid_gridLanguage.pagingToolbar.prevPage = '&nbsp;';
$.bsgrid_gridLanguage.pagingToolbar.nextPage = '&nbsp;';
$.bsgrid_gridLanguage.pagingToolbar.lastPage = '&nbsp;';
$.bsgrid_gridLanguage.pagingToolbar.gotoPage = '&nbsp;';
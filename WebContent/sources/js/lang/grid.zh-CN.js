/**
 * JQuery.bsgrid v1.0 by @Baishui2004
 * Copyright 2014 Apache v2 License
 * https://github.com/baishui2004/jquery.bsgrid
 */
/**
 * @author Baishui2004
 * @Date March 18, 2014
 */
(function ($) {

    $.bsgridLanguage = {
        isFirstPage: '已经是第一页！',
        isLastPage: '已经是最后一页！',
        needInteger: '请输入数字！',
        needRange: function (start, end) {
            return '请输入一个在' + start + '到' + end + '之间的数字！';
        },
        errorForRequestData: '请求数据失败！',
        errorForSendOrRequestData: '发送或请求数据失败！',
        pagingToolbar: {
            pageSizeDisplay: function (pageSizeId) {
                return '每页显示:&nbsp;<select id="' + pageSizeId + '"></select>';
            },
            currentDisplayRows: function (startRowId, endRowId) {
                return '当前显示:&nbsp;<span id="' + startRowId + '"></span>&nbsp;-&nbsp;<span id="' + endRowId + '"></span>';
            },
            totalRows: function (totalRowsId) {
                return '共:&nbsp;<span id="' + totalRowsId + '"></span>';
            },
            currentDisplayPageAndTotalPages: function (currPageId, totalPagesId) {
                return '<div><span id="' + currPageId + '"></span>&nbsp;/&nbsp;<span id="' + totalPagesId + '"></span></div>';
            },
            firstPage: '首&nbsp;页',
            prevPage: '上一页',
            nextPage: '下一页',
            lastPage: '末&nbsp;页',
            gotoPage: '跳&nbsp;转'
        },
        loadingDataMessage: '正在加载数据，请稍候......'
    };

})(jQuery);
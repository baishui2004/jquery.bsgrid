jQuery.bsgrid 简单易用的jQuery Grid插件
=======================================

<a href="https://github.com/baishui2004/jquery.bsgrid" target="_blank">jquery bsgrid</a>，A simple jQuery Grid plugin, support json and xml data, has many themes and simple to extend, support pagation or no pagation, easy to expand and export. 一个简单易用的jQuery Grid插件，支持json、xml数据格式，自带多套皮肤且易于扩展，支持分页或不分页，对扩展性友好，导出友好。

QQ群交流：254754154
<br />
捐助：<a href="http://bsgrid.coding.io/donate.html" target="_blank" style="text-decoration: none;">支持长远发展，感谢您的认可！</a>

源码：[Github](https://github.com/baishui2004/jquery.bsgrid/)
&emsp;
示例：<a href="http://bsgrid.coding.io/examples/en.html" target="_blank">导航一</a>
		&emsp;<a href="http://bsgrid.coding.io/examples/en-table.html" target="_blank">导航二</a>
<br />
版本：1.33
&emsp;&emsp;&nbsp;协议：Apache Licence 2
&emsp;更新日期：2015-02-04
<br />
文档：<a href="http://bsgrid.coding.io/documention/README.md.html" target="_blank">HTML</a>
        &emsp;&nbsp;&nbsp;<a href="http://bsgrid.coding.io/documention/README.md.pdf" target="_blank">PDF</a>
        &emsp;<a href="http://bsgrid.coding.io/examples/grid/standard.html" target="_blank">方法及属性使用与说明</a>
<br />
依赖：jQuery 1.4.4 ~~ jQuery 1.11.2
<br />
支持：IE6+、Chrome、Firefox等

#####首先给出典型效果图示#####
1，内置多套皮肤（点击下面对应皮肤图片可查看示例页面），并可非常容易的自定义皮肤（参考<a href="http://bsgrid.coding.io/examples/grid/themes/custom.html" target="_blank">Custom Blue Style</a>）
<div>
<div style="display:none;">
<style type="text/css">
<!--
	.tabImg {
		width: 100%;
		border-collapse: collapse;
	}
	.tabImg td {
        color: green;
		border: solid 1px green;
        background-color: white;
		padding: 0;
		margin: 0;
        text-align: center;
        vertical-align: top;
	}
	.tabImg td img{
		width: 100%;
		border: solid 0 white;
	}
-->
</style>
</div>
</div>
<div>
<table class="tabImg">
	<tr>
		<td>Default Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/simple.html" target="_blank">
            <img title="Default Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins01-Default Style.png" /></a>
        </td>
		<td>ExtJS Gray Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/gray.html" target="_blank">
            <img title="ExtJS Gray Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins02-ExtJS Gray Style.png" /></a>
        </td>
		<td>ExtJS Blue Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/blue.html" target="_blank">
            <img title="ExtJS Gray Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins03-ExtJS Blue Style.png" /></a>
        </td>
    </tr>
	<tr>
		<td>ExtJS Access Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/access.html" target="_blank">
            <img title="ExtJS Access Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins04-ExtJS Access Style.png" /></a>
        </td>
		<td>FlexiGrid Gray Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/flexigrid.html" target="_blank">
            <img title="FlexiGrid Gray Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins05-FlexiGrid Gray Style.png" /></a>
        </td>
		<td>Dhtmlx Sky Blue Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/sky_blue.html" target="_blank">
            <img title="Dhtmlx Sky Blue Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins06-Dhtmlx Sky Blue Style.png" /></a>
        </td>
    </tr>
    <tr>
		<td>Pure Gray Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/pure_gray.html" target="_blank">
            <img title="Pure Gray Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins07-Pure Gray Style.png" /></a>
        </td>
		<td>jqGrid Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/jqgrid.html" target="_blank">
            <img title="jqGrid Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins08-jqGrid Style.png" /></a>
        </td>
		<td>EasyUI Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/easyui.html" target="_blank">
            <img title="EasyUI Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins09-EasyUI Style.png" /></a>
        </td>
    </tr>
	<tr>
		<td>Bootstrap Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/bootstrap.html" target="_blank">
            <img title="Bootstrap Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins10-Bootstrap Style.png" /></a>
        </td>
		<td>Custom Blue Style
            <br />
            <a href="http://bsgrid.coding.io/examples/grid/themes/custom.html" target="_blank">
            <img title="Custom Blue Style - 点击图片查看示例页" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/themes/skins11-Custom Blue Style.png" /></a>
        </td>
		<td>
            &nbsp;
        </td>
    </tr>
</table>
</div>
2，可以非常方便的集成第三方分页工具条使用（点击下面对应皮肤图片可查看示例页面）
<div>
<table class="tabImg">
	<tr>
		<td>With jqPagination
            <br />
            <a href="http://bsgrid.coding.io/examples/pagination/jqPagination/sample-adapter.html" target="_blank">
            <img title="With jqPagination" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-pagination01-With jqPagination.png"></a>
        </td>
		<td>With jquery_pagination
            <br />
            <a href="http://bsgrid.coding.io/examples/pagination/jquery_pagination/sample-adapter.html" target="_blank">
            <img title="With jquery_pagination" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-pagination02-With jquery_pagination.png"></a>
        </td>
    </tr>
    <tr>
		<td>With jPaginate
            <br />
            <a href="http://bsgrid.coding.io/examples/pagination/jPaginate/sample-adapter.html" target="_blank">
            <img title="With jPaginate" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-pagination03-With jPaginate.png"></a>
        </td>
		<td>With jPages
            <br />
            <a href="http://bsgrid.coding.io/examples/pagination/jPages/sample-adapter.html" target="_blank">
            <img title="With jPages" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-pagination04-With jPages.png"></a>
        </td>
    </tr>
    <tr>
		<td>With smartpaginator
            <br />
            <a href="http://bsgrid.coding.io/examples/pagination/smartpaginator/sample-adapter.html" target="_blank">
            <img title="With smartpaginator" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-pagination05-With smartpaginator.png"></a>
        </td>
		<td>With jPaginator
            <br />
            <a href="http://bsgrid.coding.io/examples/pagination/jPaginator/sample-adapter.html" target="_blank">
            <img title="With jPaginator" src="https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-pagination06-With jPaginator.png"></a>
        </td>
    </tr>
</table>
</div>


###bsgrid的由来###
&emsp;&emsp;首先，澄清插件名称为何叫bsgrid，是因为敝人常用bs开头的字符做英文账号的缘故。bsgrid诞生的原因是主流插件或框架的grid使用或扩展比较复杂。
<br />
以下仅简单说下各插件或框架的grid：
<br />&emsp;&emsp;1，目前主流Grid基本比较适用于内部系统，对于外部系统适用而言，想要改变皮肤样式，字体大小等都非常困难；
<br />&emsp;&emsp;2，主流Grid封装的太好，这反而造成了其扩展性能不是很好，并且其methods、properties很多，上手不容易；
<br />&emsp;&emsp;3，主流grid大多数不提供无分页情况下后台数据的全部展现。

###bsgrid的特点###
&emsp;&emsp;1，轻量级，基于jQuery及HTML Table，除了对加载数据、分页、渲染数据的简单封装外，不额外增加特别的功能；模块化JS代码，可按需加载；CSS样式精致简洁，对于扩展修改非常容易；
<br />&emsp;&emsp;2，使用友好，对于一个简单的表格展现，仅仅数十行代码即可完成，并且支持json、xml两种数据格式；且支持友好的导出参数构建；
<br />&emsp;&emsp;3，内置多套经典样式风格，效果参看examples\grid\themes\\*.html；可非常容易的修改表格使用字体大小，参看示例examples\grid\themes\custom.html，仅需修改该示例样式中的两处font-size即可；
<br />&emsp;&emsp;4，自带load加载数据遮罩，并很容易进行扩展或重写；
<br />&emsp;&emsp;5，扩展性好，插件有特别好的扩展性，易于对插件本身进行局部甚至较大的修改，易于改变展现样式、渲染数据；插件放开了属性及方法的全局修改权限，所有方法都可在外部进行全局重写，而无需修改插件本身的代码。

###对于主流Grid的简单理解###
大概说下目前的一些主流grid插件或框架的grid
<br />&emsp;&emsp;1，ExtJS，功能丰富，封装好，但属重量级产品，需要加载大体积文件，且响应速度较慢，需商业授权，一般用于内部系统；
<br />&emsp;&emsp;2，DHtmlx，同样功能丰富，封装好，不过其可以根据所需要的模块进行加载，速度方面快于ExtJS，需商业授权，由于其样式不易修改，同样一般用于内部系统；
<br />&emsp;&emsp;3，EasyUI，基于jQuery，语法使用jQuery，却部分地方像ExtJS的写法，在不需其源码的情况下无需商业授权，因无源码而不方便按需模块化加载，也很难改变皮肤样式；
<br />&emsp;&emsp;4，jQGrid，基于jQuery，开源免费且功能特别强大，但同样其样式不易修改；
<br />&emsp;&emsp;5，Flexigrid，基于jQuery，功能逊色，但轻量级，methods、properties较少，不失为想用ExtJS Grid或EasyUI Grid却难以上手这两者的另外一个选择。

###bsgrid示例目录###
<pre>
以下列出Grid及Grid With ArtDialog的示例并作以说明；Util、Button、Form、Paging、Grid With Other Pagination部分的示例简述如下：

Util：  演示util.min.js，提供form表单序列化为字符串的方法(区别于jquery的param方法)，以及form表单序列化name为字符串的方法
Button：演示icon.min.css，提供两种图标样式
Form：  演示form.min.js、form.min.css，对于表单的敏捷处理，包括获取表单值、给表单赋值、表单的查看新增编辑模式、表单各种模式下的tip提示
Paging：演示grid.paging.min.js分页工具条，不依赖grid.min.js
Grid With Other Pagination：演示Grid集成第三方分页工具条使用
Merged Files: 目录builds/merged，合并经常一起使用的css、js，合并文件描述文件builds/readme
              grid.simple.min.css     合并grid、paging分页css样式
              grid.simple.min.js      合并grid、paging分页js脚本
              grid.all.min.css        合并grid、paging分页、grid扩展、icon图标css样式
              grid.all.min.js         合并grid、paging分页、grid扩展、grid导出构建js脚本
              form.all.min.css        合并form表单、icon图标css样式
              form.all.min.js         合并form表单及其依赖js脚本
              bsgrid.all.min.css      合并grid、paging分页、grid扩展、icon图标、form表单css样式
              bsgrid.all.min.js       合并grid、paging分页、grid扩展、grid导出构建、form表单js脚本

1，<a href="#Example Index">Example Index</a>
2，<a href="#Simple Grid">Simple Grid</a>
3，<a href="#Simple en Grid">Simple en Grid</a>
   <a href="#Simple Grid With Images">Simple Grid With Images</a>
4，<a href="#Simple XML Data Grid">Simple XML Data Grid</a>
   <a href="#Local Json Data">Local Json Data</a>
   <a href="#Local Xml Data">Local Xml Data</a>
5，<a href="#No Pagation">No Pagation</a>
6，<a href="#No Diaplay Blank Rows">No Diaplay Blank Rows</a>
7，<a href="#No Data">No Data</a>
8，<a href="#Grid With Checkbox">Grid With Checkbox</a>
   <a href="#With Custom Checkbox">With Custom Checkbox</a>
   <a href="#Edit Grid">Edit Grid</a>
   <a href="#Move Column">Move Column</a>
   <a href="#Custom Move Column">Custom Move Column</a>
   <a href="#Extend Conditions">Extend Conditions</a>
   <a href="#Extend Grid">Extend Grid</a>
   <a href="#Multi Header Grid">Multi Header Grid</a>
   <a href="#Grid With Footer">Grid With Footer</a>
   <a href="#Multi Sort Grid">Multi Sort Grid</a>
   <a href="#Fixed Grid">Fixed Grid</a>
   <a href="#Fixed Grid Custom">Fixed Grid Custom</a>
9，<a href="#Grid With Little Paging">Grid With Little Paging</a>
10，<a href="#Standard Grid">Standard Grid</a>
11，<a href="#Multi Grid">Multi Grid</a>
    <a href="#Multi Extend Grid">Multi Extend Grid</a>
12，<a href="#Export Grid">Export Grid</a>
13，<a href="#Grid with ArtDialog">Grid with ArtDialog</a>
14，<a href="#Grid And Form with ArtDialog">Grid And Form with ArtDialog</a>
</pre>
<!-- more -->

#####1，<a id="Example Index">Example Index</a>#####
![Example Index](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-01_examples_index-01.png)
<br/>
![Example Index](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-01_examples_index-02.png)

#####2，<a id="Simple Grid">Simple Grid</a>#####
![Simple Grid](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-02_simple_grid.png)
<pre>
引用文件：
    &lt;link rel="stylesheet" href="../../builds/merged/bsgrid.all.min.css"/&gt;
    &lt;script type="text/javascript" src="../../plugins/jquery-1.4.4.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="../../builds/js/lang/grid.zh-CN.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="../../builds/merged/bsgrid.all.min.js"&gt;&lt;/script&gt;
实现代码：
    &lt;table id="searchTable"&gt;
        &lt;tr&gt;
            &lt;th w_index="XH" width="5%;"&gt;XH&lt;/th&gt;
            &lt;th w_index="ID" width="5%;"&gt;ID&lt;/th&gt;
            &lt;th w_index="CHAR" w_align="left" width="15%;"&gt;CHAR&lt;/th&gt;
            &lt;th w_index="TEXT" w_align="left" width="30%;"&gt;TEXT&lt;/th&gt;
            &lt;th w_index="DATE" width="15%;"&gt;DATE&lt;/th&gt;
            &lt;th w_index="TIME" width="15%;"&gt;TIME&lt;/th&gt;
            &lt;th w_index="NUM" width="5%;"&gt;NUM&lt;/th&gt;
            &lt;th w_render="operate" width="10%;"&gt;Operate&lt;/th&gt;
        &lt;/tr&gt;
    &lt;/table&gt;
    &lt;script type="text/javascript"&gt;
        var gridObj;
        $(function () {
            gridObj = $.fn.bsgrid.init('searchTable', {
                url: 'data/json.jsp',
                // autoLoad: false,
                pageSizeSelect: true,
                pageSize: 10
            });
        });
        function operate(record, rowIndex, colIndex, options) {
            return '&lt;a href="#" onclick="alert(\'ID=' + gridObj.getRecordIndexValue(record, 'ID') + '\');"&gt;Operate&lt;/a&gt;';
        }
    &lt;/script&gt;
</pre>

#####3，<a id="Simple en Grid">Simple en Grid</a>#####
![Simple en Grid](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-03_simple_en_grid.png)
<pre>
1，插件语言本地化文件：grid.en.min.js、grid.zh-CN.min.js、grid.zh-TW.min.js

2，行间隔色配置：stripeRows: true

3，行hover样式：添加如下样式
   /* row hover */
   .bsgrid tr:hover {
        background-color: #ffe48d;
   }
</pre>

#####&emsp;&nbsp;<a id="Simple Grid With Images">Simple Grid With Images</a>#####
![Simple Grid With Images](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-03_simple_grid_with_images.png)
<pre>
数据支持扩展渲染，th使用w_render属性，值是js方法名：
    &lt;th w_render="renderImg" width="5%;"&gt;IMAGES&lt;/th&gt;
renderImg方法：
    function renderImg(record, rowIndex, colIndex, options) {
        var idInt = parseInt($.trim(gridObj.getRecordIndexValue(record, 'ID')));
        return '&lt;img src="../images/' + ((idInt % 3) == 0 ? 3 : (idInt % 3)) + '.jpg" width="32px" /&gt;';
    }
</pre>

#####4，<a id="Simple XML Data Grid">Simple XML Data Grid</a>#####
![Simple XML Data Grid](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-04_simple_XML_data_grid.png)
<pre>
默认的是json格式，换加载XML格式数据：
方式1，全局修改加载数据格式：
　　$.fn.bsgrid.defaults.dataType = 'xml';
方式2，单grid修改加载数据格式：
　　$.fn.bsgrid.init('searchTable', {
            url: 'data/simple.xml',
            dataType: 'xml',
            pageSizeSelect: true,
            pageSize: 10
　　});
</pre>

#####&emsp;&nbsp;<a id="Local Json Data">Local Json Data</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/local/json.html">Local Json Data</a>
</pre>

#####&emsp;&nbsp;<a id="Local Xml Data">Local Xml Data</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/local/xml.html">Local Xml Data</a>
</pre>

#####5，<a id="No Pagation">No Pagation</a>#####
支持展示后台的全部数据，分页工具条变为如下只显示总数的样式：
<br />
![No Pagation](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-05_no_pagation.png)
<pre>
实现代码：将pageAll设置为true即可，后台数据格式与分页后台数据格式一致
   $.fn.bsgrid.init('searchTable', {
       url: 'data/simple.json',
       pageAll: true
   });
补充说明：不分页则无需加载grid.paging.min.css、grid.paging.min.js
</pre>

#####6，<a id="No Diaplay Blank Rows">No Diaplay Blank Rows</a>#####
设置是否显示无数据的行，下图示例展示的是分页行大小是25，但只显示了20条数据，无数据行没有显示：
<br />
![No Diaplay Blank Rows](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-06_no_diaplay_blank_rows.png)
<pre>
实现代码：修改全局参数displayBlankRows，默认值为true
　　$.fn.bsgrid.defaults.displayBlankRows = false;
</pre>

#####7，<a id="No Data">No Data</a>#####
无数据时的提示：
<br />
![No Data](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-07_no_data.png)
<pre>
注意此提示仅当$.fn.bsgrid.defaults.displayBlankRows = false;时才会显示，为true时显示的是空行。
说明：属性displayPagingToolbarOnlyMultiPages与displayBlankRows互不影响。
</pre>

#####8，<a id="Grid With Checkbox">Grid With Checkbox</a>#####
<br />
![Grid With Checkbox](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-08_grid_with_checkbox.png)

#####&emsp;&nbsp;<a id="With Custom Checkbox">With Custom Checkbox</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/checkbox-custom.html">With Custom Checkbox</a>
</pre>

#####&emsp;&nbsp;<a id="Edit Grid">Edit Grid</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/edit.html">Edit Grid</a>
</pre>

#####&emsp;&nbsp;<a id="Move Column">Move Column</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/move-column-extend.html">Move Column</a>
</pre>

#####&emsp;&nbsp;<a id="Custom Move Column">Custom Move Column</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/move-column-custom.html">Custom Move Column</a>
</pre>

#####&emsp;&nbsp;<a id="Extend Conditions">Extend Conditions</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/simple-conditions.html">Extend Conditions</a>
</pre>

#####&emsp;&nbsp;<a id="Extend Grid">Extend Grid</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/extend.html">Extend Grid</a>
</pre>

#####&emsp;&nbsp;<a id="Multi Header Grid">Multi Header Grid</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/multi-header.html">Multi Header Grid</a>
</pre>

#####&emsp;&nbsp;<a id="Grid With Footer">Grid With Footer</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/foot.html">Grid With Footer</a>
</pre>

#####&emsp;&nbsp;<a id="Multi Sort Grid">Multi Sort Grid</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/multi-sort.html">Multi Sort Grid</a>
</pre>

#####&emsp;&nbsp;<a id="Fixed Grid">Fixed Grid</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/fixed-header/fixed-header-extend.html">Fixed Grid</a>
</pre>

#####&emsp;&nbsp;<a id="Fixed Grid Custom">Fixed Grid Custom</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/fixed-header/fixed-header-custom.html">Fixed Grid Custom</a>
</pre>

#####9，<a id="Grid With Little Paging">Grid With Little Paging</a>#####
似ExtJS、EasyUI类分页工具条：
<br />
![Grid With Little Paging](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-09_grid_with_little_paging.png)
<pre>
参看示例源码，仅需要设置参数pagingLittleToolbar值为true即可，默认值为false。
</pre>

#####10，<a id="Standard Grid">Standard Grid</a>#####
演示bsgrid的大部分对外调用方法，并描述主要配置属性及其作用。
<br />
此处为了演示分页，后台使用jsp页面模拟分页数据，可以完整的展示排序，分页。
<br />
![Standard Grid](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-10_standard_grid.png)

#####11，<a id="Multi Grid">Multi Grid</a>#####
支持一个页面显示多个grid：
<br />
![Multi Grid](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-11_multi_grid.png)

#####&emsp;&nbsp;<a id="Multi Extend Grid">Multi Extend Grid</a>#####
<pre>
示例页面：<a href="http://bsgrid.coding.io/examples/grid/multi-extend.html">Multi Extend Grid</a>
</pre>

#####12，<a id="Export Grid">Export Grid</a>#####
bsgrid并不是提供导出Grid的页面数据功能，而是进行导出参数的组织：
<br />
![Export Grid](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-12_export_grid.png)
<pre>
简单的grid导出参数URL类似如下：
http://bsgrid.coding.io/examples/grid/export.html?exportFileName=Export%2520Example&dataNames=XH%252CID%252CCHAR%252CTEXT%252CDATE%252CTIME%252CNUM&dataIndexs=XH,ID,CHAR,TEXT,DATE,TIME,NUM&dataLengths=50,50,150,300,150,150,50&dataAligns=center,center,left,left,center,center,center&param1=param1&param2=param2

需要额外引用用于导出的JS：
    &lt;script type="text/javascript" src="../../builds/js/export.min.js"&gt;&lt;/script&gt;

代码实现，如下，静态页面部分仅再需要增加一个导出按钮即可：
    var gridObj;
    $(function () {
        gridObj = $.fn.bsgrid.init('searchTable', {
            url: 'data/json.jsp',
            pageSizeSelect: true,
            pageSize: 10
        });
    });
    function doExport() {
        alert('Only test request params, To see it in browser address url.');
        gridObj.options.otherParames = $('#searchForm').serializeArray();
        $.bsgrid_export.doExport($('#searchTable thead tr th[w_hidden!="true"]'), gridObj.options.otherParames, {
            url: 'export.html' + '?sortName=' + gridObj.options.sortName + '&sortOrder=' + gridObj.options.sortOrder, // only test request params
            exportFileName: 'Export Example',
            colsProperties: {
                width: 120
            },
            colWidthPercentmultiplier: 10 // if set column width N%, then column width will reset N*10, default 14
        });
    }
</pre>

#####13，<a id="Grid with ArtDialog">Grid with ArtDialog</a>#####
结合artDialog，演示使用artDialog的锁屏遮罩样式，以及演示使用artDialog覆盖JS原生alert、confirm、prompt方法的使用。
<br />
<b>特别注意：</b>
<br />&emsp;&emsp;JS原生的alert、confirm、prompt方法是阻塞的，而使用artDialog覆盖的alert、confirm、prompt方法是非阻塞的，artDialog覆盖的方法是用回调方式实现阻塞的等待执行代码效果，详细可参看示例：[Pop with ArtDialog](http://bsgrid.coding.io/examples/artDialog/pop.html)
<br />
![Grid with ArtDialog](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-13_grid_with_artDialog.png)
<pre>
需要额外引用的文件：
    &lt;link rel="stylesheet" href="../../plugins/artDialog/skins/blue.css"/&gt;
    &lt;link rel="stylesheet" href="override/artDialog.skins.override.css"/&gt;
    &lt;script type="text/javascript" src="../../plugins/artDialog/jquery.artDialog.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="../../plugins/artDialog/artDialog.plugins.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="override.grid.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="override/artDialog.plugin.override.en.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="override/artDialog.plugin.override.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="override.pop.js"&gt;&lt;/script&gt;

artDialog需要引用的文件：artDialog/skins/blue.css、artDialog/jquery.artDialog.min.js、artDialog/artDialog.plugins.min.js
覆盖bsgrid的锁屏遮罩样式的文件：override.grid.js
覆盖JS原生的alert、confirm、prompt方法的文件：artDialog.skins.override.css、artDialog.plugin.override.en.js、artDialog.plugin.override.js、override.pop.js
</pre>

#####14，<a id="Grid And Form with ArtDialog">Grid And Form with ArtDialog</a>#####
结合ArtDialog使用，可以完成一个很好看的CRUD功能，详细可查看示例及示例源码：
<br />
![Grid with ArtDialog](https://github.com/baishui2004/jquery.bsgrid/raw/v1.33/documention/images/jquery.bsgrid-14_grid_and_form_with_artDialog.png)
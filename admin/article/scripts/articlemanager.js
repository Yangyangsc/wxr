var articlelist, treeForm;
///初始化列表控件
function InitArticleGrid() {
    articlelist = new listForm('dg', {
        //title: '应用系统列表',
        iconCls: 'icon-edit',
        url: '/article',
        method:"get",
        doubleClickEdit:true,
        idField: 'id',
        toolbar: '#tools_1',
        searchOption: {
            searchButton: '#btnSearch', resetButton: '#btnReset', beforeFunc: function (result) {
                if (treeForm.selectedNode()!=null)  result.deptUid = treeForm.selectedKeyValue();
                return true;
            }},
        createOption: {
            button: '#btnNewArticle', url:'/article/articledetail.html', icon: 'icon-article', title: '文章管理', width: 900, height: 650, beforeFunc: function (option) {
                var keyValue = $.isNullOrEmpty(treeForm.selectedKeyValue()) ? '' : treeForm.selectedKeyValue();
                option.url = option.url + '&catelogid=' + keyValue + '&catelogname=' + escape(treeForm.selectedNode()==null?'':treeForm.selectedNode().text)
                return true;
            }
        },
        deleteOption: { button: '#btnDeleteArticle', url:'/article/' },
        editOption: { url:  '/article/articledetail.html',dataUrl:'/article/', icon: 'icon-article', title: '文章管理', width: 900, height: 650 },
        columns: [[
            { field: 'ck', checkbox: true, width: 40 },
            { field: 'image', title: '封面',halign:'center', width: 90,
                     formatter: function (value, row, index) {
                         var coverContainer='';
                        if (!$.isNullOrEmpty(value))
                            coverContainer= "<img src='" +urlConfig.base.imageBase+value+ "' onclick='formHelper.directViewImage(this,400,300)' style='width:90px;cursor:pointer'>";
                        else
                            coverContainer="<img src='../images/article/default.jpg'   style='width:90px;'/>";
                        return coverContainer;

                }         
            },
            {
                field: 'name', title: '标题', width: 250,halign:'center', sortable: true,
                formatter: function (value, row, index) {
                    return "<a href='#' onclick=\"articlelist.editRecord('" + row.id + "')\"> <h6>" + value +
                            (row.original==1?"<i class='badge color-important'>原创</i>":"")+ "</h6></a>"
                           +($.isNullOrEmpty(row.brief)?"":("<div style='height:45px;width:240px;font-size:9px;color:#999;text-overflow:ellipsis'>"+row.brief+"</div>"));
                }
            },
            { field: 'ck1', title: '链接', width: 250 ,halign:'center',formatter: function (value, row, index) {
                    var fullUrl = urlConfig.base.articlePage+row.id;
                    return fullUrl+
                        '<br/><a class="easyui-linkbutton l-btn l-btn-small l-btn-plain" href="#" onclick=\'$.copytext("'+fullUrl+'")\'><span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">复制</span><span class="l-btn-icon icon-copy">&nbsp;</span></span></a>';
                } },
            { field: 'catelogname', title: '所属栏目',halign:'center', width: 90 },
            { field: 'author', title: '作者',halign:'center', width:80, sortable: true },
            { field: 'source', title: '转载来源', halign:'center', width: 120 ,
                formatter: function (value, row, index) {
                    if (row.original==0 && !$.isNullOrEmpty(row.sourceurl))
                        return "<a href='"+row.sourceurl+"' target='_blank'><font color='red'>" + value + "</font></a>";
                    return value;
                }
            },
            { field: 'publishstatus', title: '发布状态', width: 90 ,halign:'center',align:'center',
                    formatter: function (value, row, index) {
                    if (value==0) return '<span style="margin-left:5px;" class="ident-tag status-failed">草稿</span>';
                    if (value==3) return '<span style="margin-left:5px;" class="ident-tag status-idented">发布</span>';;
                    return lmh_const.ARTICLE_PUBLISH_STATUS[value];
                } 
            },
             { field: 'publishdate', title: '发布时间', width: 110 ,halign:'center',align:'center'},
            {field: 'opinion', title: '审核意见', width: 110, halign: 'center'}
        ]]
    });
}
///页面加载完毕后初始化目录树和列表
///
$(document).ready(function () {
    var randomkey = Math.random();
    treeForm = new treeForm('ulCatelogTree', {
        createOption: {
            button: '#btnNewCatelog,#mmbtnNewCatelog', url:'/article/Catelogmanager.html', icon: 'icon-category', title: '栏目管理', width: 600, height: 300,
             beforeFunc: function (option) {
                var keyValue = treeForm.selectedNode() != null ? treeForm.selectedNode().id : '';
                option.url = option.url + '&pid=' + keyValue;
                return true;
            },
            closeFunc: function (result) { updateCatelog(result); }
        },
        deleteOption: {
            button: '#btnDeleteCatelog,#mmbtnDeleteCatelog', url:  '/articlecatelog', beforeFunc: function () {
                if ($.isNullOrEmpty(treeForm.selectedKeyValue())) {
                    $.messager.alert('提示', '你不能删除根栏目!', 'info');
                    return false;
                }
                return true;
            }
        },
        editOption: { button: '#btnEditCatelog,#mmbtnEditCatelog', url:  '/article/Catelogmanager.html',
                     icon: 'icon-category', title: '栏目管理', width: 600, height: 300},
        url: '/articlecatelog',
        method:'GET',
        dnd: true,
        onDragEnter: function (target, source) {
            var targetNode = treeForm.getNode(target);
            var sourceParent =treeForm.getParent(source.target);
            return sourceParent.id != targetNode.id && targetNode != null;
        },
        onDrop: function (target, source, point) {
            var targetNode = treeForm.getNode(target);
            ApiCaller.Put({url:'/articlecatelog/'+source.id+'/changeparent',data:{parentid:targetNode.id}});
            //$.post('CatelogManager.aspx?action=ResetParentID', { sourceId: source.id, targetId: targetNode.id });
        },
        onBeforeDrag: function (node) {
            return node.id != '';
        },
        onCollapse:
            function (node) {
                treeForm.updateNode(node,{
                    target: node.target,
                    iconCls: 'icon-folderClose'
                })
            },
        onExpand: function (node) {
            treeForm.updateNode(node, {
                target: node.target,
                iconCls: 'icon-folder'
            })
        },
        onSelectChanged: function (node) {
            articlelist.loadData({catelogid: node.id });
        },
        onContextMenu: function (e, node) {
            e.preventDefault();
            $(this).tree('select', node.target);
            $('#mm').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        }
    });
    InitArticleGrid();
});


function reloadArticle() {
    articlelist.reload();
}



///新增目录或更新目录后需要刷新
function updateCatelog(result) {
        var node = treeForm.selectedNode();
        if (!node) node=treeForm.getRoot(true);
        treeForm.appendNode(          
                [{
                id: result.id,
                text: result.text,
                iconCls: 'icon-folderClose'
            }],node);
        treeForm.updateNode({ target: node.target, iconCls: 'icon-folder' }, node);
        reloadArticle();
}

function appendTreeNode(treeNode) {
    if (treeNode != null) {
        var node = $('#ulCatelogTree').tree('getSelected');
        $('#ulCatelogTree').tree('append', {
            parent: (node ? node.target : null),
            data: treeNode
        });
    }

}


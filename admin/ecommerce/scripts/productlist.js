var listForm;
///初始化列表控件
function InitProductGrid() {
    listForm = new listForm('dg',{
        iconCls: 'icon-edit',
        url: '/product',
        idField: 'id',
        doubleClickEdit: true,
        toolbar: '#tools_Product',
        searchOption: { searchButton: '#btnSearch', resetButton: '#btnReset' },
        createOption: { button: '#btnNewProduct', url: '/ecommerce/productdetail.html', icon: 'icon-role', title: '商品管理', width: 850, height: 650,
                        beforeFunc: function (option) {
                            var keyValue = $.isNullOrEmpty(treeForm.selectedKeyValue()) ? '' : treeForm.selectedKeyValue();
                            option.url = option.url + '&catalogid=' + keyValue + '&catalogname=' + escape(treeForm.selectedNode()==null?'':treeForm.selectedNode().text)
                            return true;
                        },
                        callbackFunc: { reload: function () { listForm.reload(); }} },
        deleteOption: { button: '#btnDeleteProduct', url: '/product/' },
        editOption: { url: '/ecommerce/productdetail.html', icon: 'icon-role', title: '商品管理', width: 850, height: 650 },
        columns: [[
            {
                 field: 'image', title: '图片', align:'center',width: 80, 
                 formatter: function (value, row, index) {
                     if (!$.isNullOrEmpty(value))
                            return "<img src='" +urlConfig.base.imageBase+value+ "' onclick='formHelper.directViewImage(this,650,600)' style='width:70px;cursor:pointer;border:1px solid #CCC'>";
                     return "<img src='../images/default_product.png' style='width:40px;'>";
                 }
             },
             {
                 field: 'name', title: '商品名称', halign:'center',width: 270, sortable: true, formatter: function (value, row, index) {
                     var link="<a href='#' onclick=\"listForm.editRecord('" + row.id + "')\">" +value+ "</a>";
                     var offlineFlag = '';
                     if (row.status==0) offlineFlag='&nbsp;&nbsp;<i class="badge color-important">&nbsp;已下架&nbsp;</i>'
                    return '<div style="white-space:normal;word-wrap:break-word;line-height:22px">'+link+offlineFlag+'</div>' ;
                 }
             },
             {field: 'catalogname', title: '类型', align:'center',width: 60, sortable: true},
             {field: 'type', title: '属性',align:'center', halign:'center',width: 70, sortable: true, 
                    formatter: function (value, row, index) {
                     if (value==0) return '<span style="margin-left:5px;" class="ident-tag status-green">虚拟商品</span>';
                     return '<span style="margin-left:5px;" class="ident-tag status-orange">实物商品</span>';
                 }},
            // {field: 'status', title: '可售状态',align:'center', halign:'center',width: 80, sortable: true, 
            //         formatter: function (value, row, index) {
            //          if (value==0) return '下架';
            //          if (value==1) return '销售中';
            // }},
            {field: 'price', title: '价格',halign:'center',sortable: true, width: 80, align: 'right',
                formatter: function (value, row, index) {
                     return $.formatMoney(value);
            }},
            {field: 'discountprice', title: '折扣价',halign:'center',sortable: true, width: 80, align: 'right',
                formatter: function (value, row, index) {
                            return $.formatMoney(value);
                    }},
            {field: 'memberprice', title: '会员价',halign:'center',sortable: true, width: 80, align: 'right',
                    formatter: function (value, row, index) {
                            return $.formatMoney(value);
                    }},
            {field: 'limittype', title: '库存',halign:'center',sortable: true, width: 70, align: 'center',
                formatter: function (value, row, index) {
                     if (value==0) return '-无限量-';
                     return row.quantity;
                 }
            },
        ]]
    });
}
$(document).ready(function () {
    var randomkey = Math.random();
    treeForm = new treeForm('ulCatalogTree', {
        createOption: {
            button: '#btnNewCatalog,#mmbtnNewCatalog', url:'/ecommerce/Catalog.html', icon: 'icon-category', title: '商品分类', width: 600, height: 300,
             beforeFunc: function (option) {
                var keyValue = treeForm.selectedNode() != null ? treeForm.selectedNode().id : '';
                option.url = option.url + '&pid=' + keyValue;
                return true;
            },
            closeFunc: function (result) { updateCatalog(result); }
        },
        deleteOption: {
            button: '#btnDeleteCatalog,#mmbtnDeleteCatalog', url:  '/productcatalog', beforeFunc: function () {
                if ($.isNullOrEmpty(treeForm.selectedKeyValue())) {
                    $.messager.alert('提示', '你不能删除该节点!', 'info');
                    return false;
                }
                return true;
            }
        },
        editOption: { button: '#btnEditCatalog,#mmbtnEditCatalog', url:  '/ecommerce/Catalog.html',
                     icon: 'icon-category', title: '商品分类', width: 600, height: 300},
        url: '/productcatalog',
        method:'GET',
        dnd: true,
        onDragEnter: function (target, source) {
            var targetNode = treeForm.getNode(target);
            var sourceParent =treeForm.getParent(source.target);
            return sourceParent.id != targetNode.id && targetNode != null;
        },
        onDrop: function (target, source, point) {
            var targetNode = treeForm.getNode(target);
            ApiCaller.Put({url:'/productcatalog/'+source.id+'/changeparent',data:{parentid:targetNode.id}});
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
            listForm.loadData({catalog_id: node.id });
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
    InitProductGrid();
});



///新增目录或更新目录后需要刷新
function updateCatalog(result) {
        if (!result) return;
        var node = treeForm.selectedNode();
        if (!node) node=treeForm.getRoot(true);
        treeForm.appendNode(          
                [{
                id: result.id,
                text: result.text,
                iconCls: 'icon-folderClose'
            }],node);
        treeForm.updateNode({ target: node.target, iconCls: 'icon-folder' }, node);
        listForm.reload();
}

function appendTreeNode(treeNode) {
    if (treeNode != null) {
        var node = $('#ulCatalogTree').tree('getSelected');
        $('#ulCatalogTree').tree('append', {
            parent: (node ? node.target : null),
            data: treeNode,
            iconCls: 'icon-file'
        });
    }

}

////停用或启用账号
function setProductSalesStatus(status) {
    var productid = listForm.selectedKeyValue();
    if ($.isNullOrEmpty(productid)) {
        return $.messager.alert('提示', '请选择一个商品操作.', '');
    }
    var message = '确认要' + (status==1? '恢复销售':'停止销售') + '选中的商品吗?'
    dataForm.doAction({
        method:'put',
        confirm: true,
        confirmMessage: message,
        url:'/product/'+productid+'/status' , data: { status:status}, successFunc: function (result) {
            listForm.reload();
        }
    });
}
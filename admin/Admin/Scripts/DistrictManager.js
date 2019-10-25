var tradelist, treeForm;
///页面加载完毕后初始化目录树和列表
///
$(function () {
    $("#tools_1").smartFloat({
        topox: 0,
        shadowcss: "one"
    });
    InitFolderTree();
});
function exportJson() {
    dataForm.doAction({
        method: 'post', url: 'DistrictManager.aspx', action: 'ExportRegionJson', value: null, prompt: false,
        successFunc: function (result) { $.messager.alert('成功', '数据生成完毕!', 'info'); }
    });
}


function InitFolderTree() {
    $('#ulDirTree').tree({
        url: rootVirtual + '/Admin/DistrictManager.aspx?action=GetDistrictInfo&random=' + Math.random(),
        checkbox: false,
        cascadeCheck: false,
        onCollapse:
            function (node) {
                $('#ulDirTree').tree('update', {
                    target: node.target,
                    iconCls: 'icon-folderClose'
                })
            },
        onExpand: function (node) {
            $('#ulDirTree').tree('update', {
                target: node.target,
                iconCls: 'icon-folder'
            });
        },
        onLoadSuccess: function (node, data) {
            if (node == null) {
                $('#ulDirTree').tree('collapseAll');
                var rootItems = $('#ulDirTree').tree('getRoots');
                for (var rootIndex = 0; rootIndex < rootItems.length; rootIndex++) {
                    $('#ulDirTree').tree('expand', rootItems[rootIndex].target);
                }
            }
        }
    });
}


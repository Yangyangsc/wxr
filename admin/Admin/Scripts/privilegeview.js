function InitDirectoryTree() {
    var randomkey = Math.random();
    var dataUrl = '../DocManager/DirectoryManager.aspx?action=ListDirectory&loadAll=True&userUid=' + objectUid + '&loadPrivate=false&random=' + randomkey;
    if (objectType == 1) {
        dataUrl = '../DocManager/DirectoryManager.aspx?action=ListDirectoryForRole&loadAll=True&roleUid=' + objectUid + '&random=' + randomkey;
    }
    $('#directoryTree').treegrid({
        url: dataUrl,
        idField: 'id',
        treeField: 'text',
        loadMsg: '数据加载中...',
        onContextMenu: function (e, node) {
            if (node.id == '') return;
            e.preventDefault();
            $(this).treegrid('select', node.id);
            $('#mm').menu('show', {
                left: e.pageX,
                top: e.pageY
            });
        },
        onLoadSuccess: function (row, data) {
            $('#directoryTree').treegrid('collapseAll');
            var rootItems = $('#directoryTree').treegrid('getRoots');
            for (var rootIndex = 0; rootIndex < rootItems.length; rootIndex++) {
                $('#directoryTree').treegrid('expand', rootItems[rootIndex].id);
            }
        },
       // fit:true,
        columns: [[
            { title: '目录名称', field: 'text', width:290 },
            {
                field: 'ck1', title: '控制', width: 35, align: 'center', formatter: function (value, row, index) {
                    if (row.id == '') return '';
                    var status = getDirectoryPrivilege(row.privilege, actionControl.Manage);
                    if (status == 2) return '-';
                    return '<img src="../images/status'+status+'.png" />';
                }
            },
             {
                 field: 'ck2', title: '读', width: 35, align: 'center', formatter: function (value, row, index) {
                     if (row.id == '') return '';
                     var status = getDirectoryPrivilege(row.privilege, actionControl.Read);
                     if (status == 2) return '-';
                     return '<img src="../images/status' + status + '.png" />';
                 }
             },
              {
                  field: 'ck3', title: '写', width: 35, align: 'center', formatter: function (value, row, index) {
                      if (row.id == '') return '';
                      var status = getDirectoryPrivilege(row.privilege, actionControl.Write);
                      if (status == 2) return '-';
                      return '<img src="../images/status' + status + '.png" />';
                  }
              },
               {
                   field: 'ck4', title: '删除', width: 35, align: 'center', formatter: function (value, row, index) {
                       if (row.id == '') return '';
                       var status = getDirectoryPrivilege(row.privilege, actionControl.Delete);
                       if (status == 2) return '-';
                       return '<img src="../images/status' + status + '.png" />';
                   }
               },
               {
                   field: 'ck5', title: '下载', width: 35, align: 'center', formatter: function (value, row, index) {
                       if (row.id == '') return '';
                       var status = getDirectoryPrivilege(row.privilege, actionControl.Download);
                       if (status == 2) return '-';
                       return '<img src="../images/status' + status + '.png" />';
                   }
               },

               {
                   field: 'ck9', title: '外借', width: 35, align: 'center', formatter: function (value, row, index) {
                       if (row.id == '') return '';
                       var status = getDirectoryPrivilege(row.privilege, actionControl.Lend);
                       if (status == 2) return '-';
                       return '<img src="../images/status' + status + '.png" />';
                   }
               },
               {
                   field: 'ck6', title: '邮件', width: 35, align: 'center', formatter: function (value, row, index) {
                       if (row.id == '') return '';
                       var status = getDirectoryPrivilege(row.privilege, actionControl.Mail);
                       if (status == 2) return '-';
                       return '<img src="../images/status' + status + '.png" />';
                   }
               },
               {
                   field: 'ck7', title: '链接', width: 35, align: 'center', formatter: function (value, row, index) {
                       if (row.id == '') return '';
                       var status = getDirectoryPrivilege(row.privilege, actionControl.Link);
                       if (status == 2) return '-';
                       return '<img src="../images/status' + status + '.png" />';
                   }
               },
               {
                   field: 'ck8', title: '审批', width: 35, align: 'center', formatter: function (value, row, index) {
                       if (row.id == '') return '';
                       var status = getDirectoryPrivilege(row.privilege, actionControl.Aduit);
                       if (status == 2) return '-';
                       return '<img src="../images/status' + status + '.png" />';
                   }
               }
        ]]
    });
};

$(function () {
    ///初始化表格
    InitDirectoryTree();
    //InitMap();
});

function openProperty() {
    var node = $('#directoryTree').treegrid('getSelected');
    if (node == null || node.id == '') {
        $.messager.alert("提示", "请选择一个目录节点!", "info");
        return;
    }

    dialogHelper.showModal('目录属性', '../DocManager/DirectoryProperty.aspx?tabIndex=3&key=' + node.id + '&random=' + Math.random(), 800, 540, null, 'icon-property');
}
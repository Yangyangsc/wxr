if (typeof actionControl == "undefined") {
    var actionControl = {};
    actionControl.Read = 0;
    actionControl.Write = 1;
    actionControl.Delete = 2;
    actionControl.Download = 3;
    actionControl.Mail = 4;
    actionControl.Link = 5;
    actionControl.Aduit = 6;
    actionControl.Picture = 7;
    actionControl.Publish = 8;
    actionControl.Manage = 9;
    actionControl.Lend = 10;
}
///检查目录的各种权限
function CheckDirectoryPrivilege(dirPrivilege, action) {
    var forbid_base = 0x0001 << action;
    var allow_base = 0x10000 << action;
    var manage_Privilege = 0x10000 << actionControl.Manage;
    var forbiden = (dirPrivilege & forbid_base);
    var allow = (dirPrivilege & allow_base)
    var manage = (dirPrivilege & manage_Privilege)
    ///如果明确拒绝，则不允许
    if (forbiden > 0) return false;
    if (allow > 0) return true;
    ///如果有管理权限，则允许
    if (manage > 0) return true;
    return false;
}

///获取目录的权限状态
///拒绝 0：
///允许 1：
///不拒绝不允许 : 2
function getDirectoryPrivilege(dirPrivilege, action) {
    var forbid_base = 0x0001 << action;
    var allow_base = 0x10000 << action;
    var manage_Privilege = 0x10000 << actionControl.Manage;
    var forbiden = (dirPrivilege & forbid_base);
    var allow = (dirPrivilege & allow_base)
    var manage = (dirPrivilege & manage_Privilege)
    ///如果明确拒绝，则不允许
    if (forbiden > 0) return 0;
    if (allow > 0) return 1;
    ///如果有管理权限，则允许
    if (manage > 0) return 1;
    return 2;
}
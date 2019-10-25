$(function() {
	var addrid = common.query().addrid || "";
	var userid = cache.getUserId();
	if(!userid) userid = common.query().userid;
	if(!userid) return alert('页面缺失重要参数，非法加载!');
	if(addrid) initData();

	var cityid, cityname, districtid, districtname, addrname, recipient, mobile, isdefault;

	$("#a_sure").click(function(e) {
		recipient = $("#recipient").val();
		if(!recipient) return message.toast("请填写收件人", 'error');
		mobile = $("#mobile").val();
		if(!mobile || !common.isMobileNo(mobile)) return message.toast("请正确填写联系电话", 'error');
		var districtids = $("#districtid").val().split(",");
		var districtnames = $("#districtname").val().split(",")

		cityid = districtids[districtids.length - 2];
		cityname = districtnames[districtnames.length - 2];
		districtid = districtids[districtids.length - 1];
		districtname = districtnames[districtnames.length - 1];
		if(!cityid || !cityname || !districtid || !districtname)
			return message.toast("请选择地区", 'error');
		addrname = $("#address_name").val();
		if(!addrname) return message.toast("请填写详细地址", 'error');
		isdefault = $("#address_default").is(":checked") ? 1 : 0;
		var options = {
			addrid: addrid,
			userid: userid,
			cityid: cityid,
			cityname: cityname,
			districtid: districtid,
			districtname: districtname,
			addrname: addrname,
			recipient: recipient,
			mobile: mobile,
			isdefault: isdefault
		}
		user.editAddress(options, function(result) {
			alert("保存成功!");
			history.go(-1);
		}, function(err) {
			message.toast("保存失败请稍后重试", 'error');
		});
	});

	$("#selectdistrict").click(function(e) {
		bas.getDistricts('', function(result) {
			$("#addr_name").text("");
			$("#districtid").val("");
			$("#districtname").val("");
			var arrText = doT.template($("#addr_tmpl").text());
			$("#div_district").html(arrText(result.data));
			$("#div_content").hide();
			$("#div_district").show();
		}, function(err) {

		});
	});

	function initData() {
		user.getAddrDetail(userid, addrid, function(result) {

		}, function(err) {

		});
	};
});

function showDistrict(districtid, districtname) {
	$("#districtid").val($("#districtid").val() + "," + districtid);
	$("#districtname").val($("#districtname").val() + "," + districtname);
	$("#addr_name").text($("#addr_name").text() + districtname + " ");
	bas.getDistricts(districtid, function(result) {
		if(result.data.length > 0) {
			var arrText = doT.template($("#addr_tmpl").text());
			$("#div_district").html(arrText(result.data));
		} else {
			$("#div_content").show();
			$("#div_district").hide();
		}
	}, function(err) {

	});
};
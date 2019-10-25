$(function() {    
	startAnalysis();
	bindTopLabelSelection();
});

function bindTopLabelSelection(){
	ApiCaller.Get({
		url: "/label/catalog",
		successFunc: function(result) {
			
			formHelper.bindCombo({textField:'name',combobox:'labelParent',data:result.rows});
			if (result.rows.length>0) {
				$('#labelParent').combobox('select',result.rows[0].id+'');
			}
			$('#labelParent').combobox({onChange:changeLableSerial})
		}
	});
}
///绘制某类标签下的分析
function changeLableSerial(value){
	ApiCaller.Get({
		url: "/Analysis/label/"+value,
		successFunc: function(result) {
			///标签分类分析
			result.labelAnalysis.chartContainer = 'labelAnalysis';
			charts.renderPieChart(result.labelAnalysis);
		}
	});
}

function startAnalysis() {
	ApiCaller.Get({
		url: "/analysis/user",
		successFunc: function(result) {
			var data;
			$("#TotalUser").text(result.userCount);
			$("#TotalMember").text(result.memberCount);
			///每日用户增长
			result.dailyUserIncrease.chartContainer='dailyUser';
			charts.renderLineChart(result.dailyUserIncrease);
			///各类会员的分布数
			result.memberType.chartContainer = 'pieMember';
			charts.renderPieChart(result.memberType)
			///每日会员增长
			result.dailyMemberIncrease.chartContainer = 'dailyMember';
			charts.renderLineChart(result.dailyMemberIncrease);
			///用户所在地分析
			result.userCity.chartContainer = 'regionUser';
			charts.renderPieChart(result.userCity);
			///用户性别分析
			result.userSex.chartContainer = 'sexUser';
			charts.renderPieChart(result.userSex);
			///最热的标签
			result.toplabel.chartContainer = 'topLabel';
			charts.renderBarChart(result.toplabel);
			///标签分类分析
			result.labelAnalysis.chartContainer = 'labelAnalysis';
			result.labelAnalysis.height=260;
			charts.renderPieChart(result.labelAnalysis);
			///用户消费榜单
			result.consumeTop.chartContainer = 'consumeUser';
			charts.renderBarChart(result.consumeTop);
			
		}
	});
};

$(function() {    
	startAnalysis();
});
function startAnalysis() {
	var actid = $.getUrlParam('activityid')
	if ($.isNullOrEmpty(actid)) return;
	ApiCaller.Get({
		url: "/analysis/activity/"+actid,
		successFunc: function(result) {
			var data;
			$("#TotalTickets").text(result.totaltickets);
			$("#TotalIncome").text(result.totalincome);
			///票券数量分析
			result.ticketsCountInfo.chartContainer='ticketsCount';
			charts.renderPieChart(result.ticketsCountInfo);
			///票券销售分析
			result.ticketsSaleInfo.chartContainer = 'ticketsSales';
			charts.renderCombinationForBarWithLine(result.ticketsSaleInfo)
			///渠道销售
			result.channelSaleInfo.chartContainer = 'Channelsales';
			charts.renderCombinationForBarWithLine(result.channelSaleInfo);
		}
	});
};

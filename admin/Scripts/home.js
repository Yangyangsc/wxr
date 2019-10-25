$(function() {    
	startAnalysis();
});


function startAnalysis() {
	ApiCaller.Get({
		url: "/analysis/home",
		successFunc: function(result) {
			var data;
			$("#totalUser").text(result.userSummary.totalUser);
			$("#todayUser").text(result.userSummary.todayUserIncrease);
			if (result.userSummary.memberIncome>0)
				$("#memberIncome").text($.formatMoney(result.userSummary.memberIncome));
			
			charts.renderJustGage({id:'ggMember',
								   max:result.userSummary.totalUser,
								   value:result.userSummary.totalMember});
			charts.renderJustGage({id:'ggTodayMember',
								   max:result.userSummary.totalMember,
								   value:result.userSummary.todayMemberIncrease});
				
			///活动汇总统计
			$("#totalActivity").text(result.activitySummary.activityCount);
			$("#totalEnroll").text(result.activitySummary.ticketCount);
			if (result.activitySummary.income>0)
			$("#totalIncome").text($.formatMoney(result.activitySummary.income));

			charts.renderJustGage({id:'todayEnroll',
								   max:result.activitySummary.ticketCount,
								   value:result.activitySummary.todayticketCount});
			charts.renderJustGage({id:'todayIncome',
								   max:result.activitySummary.income,
								   value:result.activitySummary.todayincome});
			///百人会统计
			if (result.brhSummary){
				$("#totalBrh").text(result.brhSummary.totalCount);
				if (result.brhSummary.appService>0)
					$("#totalApp").text(result.brhSummary.appService);
				else
					$("#totalApp").text(' -- ');
			}
		}
	});
};

/*
* 数据库对像访问实体类
* 该类由代码自动生成
* 对数据库实体访问需要有更多的业务处理，建议新建一个类继承此类实现，以防止自动生成代码覆盖
*/
var util = require('util'); 
var daoBase = require('../../core/database/daoBase');
var utility = require('../../core/utilities/utilities');

class AnalysisModel extends daoBase {
    ///首页上的数据分析
    get getHomeAnalysis() {return "call proc_Analysis_Summary() ";}
    get getUserAnalysis() {return "call proc_Analysis_User(null,null);";}
    get getActivityAnalysis() {return "call proc_Analysis_Activity();";}
    get getAnalysisForSingle() {return "call proc_Analysis_Chart4Activity(?);";}
    get getLabel4UserAnalysis() {return "call proc_Analysis_Label4User(?);";}

    labelSerialAnalysis(label){
        return this.database.executeSql(this.getLabel4UserAnalysis,label)
               .then(result=>{
                 var retData = {successed:true}
                    /**标签分类统计(饼图）) */
                  var sublabelData=[];
                  result.rows[0].forEach(function(item,index){
                       sublabelData.push({name:item.label_name,
                                                    y:item.usercount })
                  });
                  retData.labelAnalysis = {yAxis:{title:'贴标人次'},series:{data:sublabelData}};
                  return retData;
               })
    }
    ///活动分析
    activityAnalysis(){
       return this.database.executeSql(this.getActivityAnalysis)
              .then(result=>{
                  var retData = {successed:true}
                  ///发布的活动数、和售票中的活动统计
                  retData.activityCount= result.rows[0][0].totalcount;
                  retData.activeCount= result.rows[0][1].totalcount;
                  /* 人气最旺的活动排行榜单 */
                  var saleData={name:'销售票',data:[]};
                  var giftData={name:'赠票',data:[]};
                  var activities = [];
                  result.rows[1].forEach(function(item,index){
                      activities.push(item.activity_topic);
                      saleData.data.push(item.salecount);
                      giftData.data.push(item.giftcount);
                     
                  });
                  retData.hotActivity = {title:'活动人气排行榜',yAxis:{title:'报名人数'},categories:activities, series:[saleData,giftData]};
                  /* 收益最好活动排行榜单 */
                  var incomeData=[];

                  result.rows[2].forEach(function(item,index){
                      incomeData.push([item.activity_topic,item.incometotal]);
                     
                  });
                  retData.bestIncome = {title:'活动收入排行榜',yAxis:{title:'销售金额'},series:{data:incomeData}};
                  //return retData;
                   /* 最佳推广渠道榜单 */
                  var channelsaleData={name:'销售票',data:[]};
                  var channelgiftData={name:'赠票',data:[]};
                  var channelactivities = [];

                  result.rows[3].forEach(function(item,index){
                      channelactivities.push(item.channel_name);
                      channelsaleData.data.push(item.salecount);
                      channelgiftData.data.push(item.giftcount);
                  });
                  retData.bestChannel = {title:'最佳推广渠道榜',yAxis:{title:'引流人数'},categories:channelactivities
                                        , series:[channelsaleData,channelgiftData]};
                 /* 最佳销售渠道排行榜单 */
                  var channelincomeData=[];
                  result.rows[4].forEach(function(item,index){
                      channelincomeData.push([item.channel_name,item.incometotal]);
                     
                  });
                  retData.bestChannelIncome = {title:'最佳销售渠道榜',yAxis:{title:'销售金额'},series:{data:channelincomeData}};
                  return retData;
              });  
    }
    ///单次活动分析
    Analysis4SingleActivity(activityid){
       return this.database.executeSql(this.getAnalysisForSingle,activityid)
              .then(result=>{
                  var retData = {successed:true}
                  ///发布的活动数、和售票中的活动统计
                  retData.totalincome= result.rows[0][0].totalincome;
                  retData.totaltickets= result.rows[0][0].tcount;
                  /*票务数量情况 （饼图）*/
                  var ticketCount = [];
                  result.rows[1].forEach(function(item,index){
                      ticketCount.push({name:item.ticket_title,y:item.tcount })
                  });
                  retData.ticketsCountInfo = {title:'票券数量',series:{data:ticketCount}};
                  /* 销售票销售量 */
                  retData.ticketsSaleInfo = {title:'票券销售分析图',yAxis:[{title:'销售量'},{title:'销售额'}]};
                  var incomeData={name:'销售金额',type: 'spline',yAxis:1,data:[]};
                  var salesData={name:'销售数量',type: 'column',data:[]};
                  var activity_catalog = [];
                  result.rows[2].forEach(function(item,index){
                      activity_catalog.push(item.ticket_title);
                      salesData.data.push(item.tcount)
                      incomeData.data.push(item.totalincome);
                  });
                  
                  retData.ticketsSaleInfo.categories =activity_catalog;
                  retData.ticketsSaleInfo.series = [salesData,incomeData];
                   /* 渠道推广渠道榜单 */
                  retData.channelSaleInfo = {title:'渠道推广分析图',yAxis:[{title:'引流量'},{title:'销售额'}]};
                  var channelincomeData={name:'销售金额',type: 'spline',yAxis:1,data:[]};
                  var channelsalesData={name:'销售量',type: 'column',data:[]};
                  var channelgiftData={name:'赠送量',type: 'column',data:[]};
                  var channel_catalog = [];
                  result.rows[3].forEach(function(item,index){
                      channel_catalog.push(item.channel_name);
                      channelsalesData.data.push(item.salecount)
                      channelgiftData.data.push(item.giftcount);
                      channelincomeData.data.push(item.totalincome);
                  });
                  retData.channelSaleInfo.categories =channel_catalog;
                  retData.channelSaleInfo.series = [channelsalesData,channelgiftData,channelincomeData];
                return retData;
              });  
    }
    ///用户分析图
    userAnalysis() {
       return this.database.executeSql(this.getUserAnalysis)
              .then(result=>{
                  var retData = {successed:true}
                  ///用户统计
                  retData.userCount= result.rows[0][0].user_count;
                  retData.memberCount= result.rows[0][1].user_count;
                  
                  ///会员类型分布(饼图)
                  var memberTypeCount = [];
                  result.rows[1].forEach(function(item,index){
                      memberTypeCount.push({name:item.member_name,
                                                    y:item.membercount })
                  });
                  retData.memberType= {title:'会员分布',
                                      series:{data:memberTypeCount}};

                  ///用户日增长（7日）走势(线图)
                  var userDailyIncrease = [];//{name:'用户',data:[]};
                  var dailyNameSerial = [];
                  result.rows[2].forEach(function(item,index){
                      dailyNameSerial.push(item.date);
                      userDailyIncrease.push(item.daily_user);
                  });
                  retData.dailyUserIncrease = {title:'用户增长走势', 
                                               xAxis:{categories:dailyNameSerial},
                                               yAxis:{title:'增长数量'},
                                               series:[{name:'用户',data:userDailyIncrease}]
                                               };
                  
                  ///会员日增长（7日）走势(线图)
                  var memberDailyIncrease =null;//{name:'用户',data:[]};
                  var dailyNameSerial = [];
                  var dailyIncrease = [];
                  var serialItem = [];
                  var currentMemberName='';
                  result.rows[3].forEach(function(item,index){
                      ///添加日期序列
                      if (dailyNameSerial.indexOf(item.date)<0)  dailyNameSerial.push(item.date);
                      if (currentMemberName!=item.member_name){
                          if (memberDailyIncrease){
                              memberDailyIncrease.data = dailyIncrease;
                               serialItem.push(memberDailyIncrease);
                          }
                          memberDailyIncrease =new Object();
                          currentMemberName = item.member_name;
                          memberDailyIncrease.name = item.member_name;
                          dailyIncrease = [];
                      }
                      dailyIncrease.push(item.daily_member);
                     
                  });
                  if (memberDailyIncrease){
                            memberDailyIncrease.data = dailyIncrease;
                            serialItem.push(memberDailyIncrease);
                    }
                  retData.dailyMemberIncrease = {title:'会员增长走势', 
                                               xAxis:{categories:dailyNameSerial},
                                               yAxis:{title:'增长数量'},
                                               series:serialItem
                                               };
                  /****用户所在城市 （饼图） */
                  var userCityCount = [];
                  result.rows[4].forEach(function(item,index){
                      userCityCount.push({name:item.city,
                                                    y:item.usercount })
                  });
                  retData.userCity= {title:'用户所在地',
                                      series:{data:userCityCount}};
                 /****用户性别（饼图） */
                  var userSexCount = [];
                  result.rows[5].forEach(function(item,index){
                      userSexCount.push({name:item.sex==0?'女':'男',
                                                    y:item.usercount })
                  });
                  retData.userSex= {title:'用户性别',
                                      series:{data:userSexCount}};
                  /* 最热门的10个标签应用（柱状图） */
                  var labelData=[];
                  result.rows[6].forEach(function(item,index){
                      labelData.push([item.label_name,item.labelcount]);
                     
                  });
                  retData.toplabel = {title:'最热标签榜',yAxis:{title:'贴标人次'},series:{data:labelData}};

                  /**标签分类统计(饼图）) */
                  var sublabelData=[];
                  result.rows[7].forEach(function(item,index){
                       sublabelData.push({name:item.label_name,
                                                    y:item.usercount })
                     
                  });
                  retData.labelAnalysis = {yAxis:{title:'贴标人次'},series:{data:sublabelData}};
                  
                  /* 最优质的的10用户,排名前十的消费者（柱状图） */
                  var consumeData=[];
                  result.rows[8].forEach(function(item,index){
                      consumeData.push([item.user_name,item.paytotal]);
                     
                  });
                  retData.consumeTop = {title:'社群用户消费榜单',yAxis:{title:'消费金额'},series:{data:consumeData}};


                  return retData;
              });
    }

    ///首页分析图
    homeAnalysis() {
       return this.database.executeSql(this.getHomeAnalysis)
              .then(result=>{
                  var retData = {successed:true}
                  ///用户统计
                  let userResult = result.rows[0][0];
                  retData.userSummary = {totalUser:userResult.user_count,
                                        todayUserIncrease:userResult.today_user,
                                        totalMember:userResult.member_count,
                                        todayMemberIncrease:userResult.today_member,
                                        memberIncome:userResult.memberincome};
                  ///活动总数
                  ///活动票务与收入汇总
                  let activityResult = result.rows[2];
                  retData.activitySummary = {activityCount:result.rows[1][0].activity_count,
                                             ticketCount : activityResult[0].ticketcount,
                                             income : activityResult[0].incometotal,
                                             todayticketCount : activityResult[1].ticketcount,
                                             todayincome : activityResult[1].incometotal};
                  /// 百人会的信息数据统计
                  if (result.rows.length>=4){
                    let brh = result.rows[3];
                    retData.brhSummary = {totalCount:brh[0].rec_count,
                                            appService:brh[1].rec_count}
                  }
                  ////分别统计各活动的数据
                  return retData;
              });
    }
}
exports = module.exports = AnalysisModel;
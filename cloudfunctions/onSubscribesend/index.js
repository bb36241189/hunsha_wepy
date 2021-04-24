require('dateFormat.js');
const cloud = require('wx-server-sdk');
const qqCloud = require('qq-server-sdk');
const templateMessage = require('templateMessage.js');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

qqCloud.init({
  env: qqCloud.DYNAMIC_CURRENT_ENV
})

function judgeIsWeixin() {
  const wxContext = cloud.getWXContext();
  return !!wxContext.OPENID
}

function getYesterday() {
  let today = new Date();
  today.setDate(today.getDate() - 1);
  return today.Format('yyyy-MM-dd');;
}

exports.main = async (event, context) => {

  const db = judgeIsWeixin() ? cloud.database() : qqCloud.database();
  const yesterday = getYesterday();
  try {
    const AllUserNeed = await db.collection('user_need_subscribe').where({
      done: false,
      date: yesterday
    }).limit(30).get();

    console.log('AllUserNeed', AllUserNeed.data.length);

    const tousersPromise = AllUserNeed.data.map(async user => {
      try {
        let sendTemplateData = {
          'keyword1': {
            value: "塔罗日签"
          },
          'keyword2': {
            value: new Date().Format('yyyy-MM-dd'),
          },
          'keyword3': {
            value: '查看今日的塔罗日签运势喔~',
          }
        }
        let getToken = await db.collection("accessToken").doc("ACCESS_TOKEN").get();
        let token = getToken.data.token;
        let curData = {
          'touser': user.touser,
          'page': "pages/App",
          'data': sendTemplateData,
          "form_id":user.form_id,
          'templateId': "66cc3e19ce81375537a3655987d5c8e7",
        }
        console.log('------------token-----------', token)
        console.log('----------curData-----------', curData)
        let sendRet = await templateMessage.sendTemplateMsg(token, curData);
        console.log('----------sendRet-----------', sendRet)
        if (!sendRet.errcode) {
          await db
            .collection('user_need_subscribe')
            .doc(user._id)
            .remove();
        }
        return user.touser;
      } catch (e) {
        return e;
      }
    });

    return Promise.all(tousersPromise);
  } catch (err) {
    console.log(err);
    return err;
  }
};
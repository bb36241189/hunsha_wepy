
//timerGetAccessToken
const cloud = require('wx-server-sdk')
const qqCloud = require('qq-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

qqCloud.init({
  env: qqCloud.DYNAMIC_CURRENT_ENV
})

function judgeIsWeixin(){
  const wxContext = cloud.getWXContext();
  return !!wxContext.OPENID
}

const db = judgeIsWeixin()?cloud.database():qqCloud.database();
const coll_token = db.collection('accessToken');
const rq = require('request-promise')


exports.main = async (event, context) => {
  let wxAppId = '';
  let qqAppId = '1111464096';
  let qqSecret = '70HEcmw4glv5k3am';
  let wxSecret = '';
  let wxUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=';
  let qqUrl = 'https://api.q.qq.com/api/getToken?grant_type=client_credential&appid=';
  let isWeixin = judgeIsWeixin();
  try {
    let res = await rq({
      method: 'GET',
      uri: (isWeixin?wxUrl:qqUrl) + (isWeixin?wxAppId:qqAppId) + "&secret=" + (isWeixin?wxSecret:qqSecret),
    });
    res = JSON.parse(res)
    let resUpdate = await coll_token.doc('ACCESS_TOKEN').update({
      data: {
        token: res.access_token
      },
      success: function(res) {
        console.log(res)
      }
    })
  } catch (e) {
    console.error(e)
  }
}
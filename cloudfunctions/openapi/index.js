// 云函数入口文件
const cloud = require('wx-server-sdk');
const qqCloud = require('qq-server-sdk');
const rq = require('request-promise');

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

exports.main = async (event, context) => {
  console.log(event)
  if(event.subMchId == 1529401561 && event.outTradeNo){
    return notifyOrder(event);
  }
  switch (event.action) {
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'getOpenData': {
      return getOpenData(event)
    }
    case 'getIsPrepare': {
      return getIsPrepare(event);
    }
    case 'getRunData': {
      return getRunData(event)
    }
    case 'saveSubscribeMessage': {
      return saveSubscribeMessage(event)
    }
    case 'saveDaySignIndex': {
      return saveDaySignIndex(event);
    }
    case 'getDaySign': {
      return getDaySign(event);
    }
    case 'registerUserInfo': {
      return registerUserInfo(event);
    }
    case 'getUserInfo': {
      return getUserInfo(event);
    }
    case 'getSubscribeMessage': {
      return getSubscribeMessage(event);
    }
    case 'saveDaySignShared': {
      return saveDaySignShared(event);
    }
    case 'gotoOrder': {
      return gotoOrder(event);
    }
    case 'getHasAnswerBookChance': {
      return getHasAnswerBookChance(event);
    }
    case 'changeAnswerBookChance' : {
      return changeAnswerBookChance(event);
    }
    case 'getContext': {
      return getContext(event)
    }
    case 'deleteSubscribeMessage': {
      return deleteSubscribeMessage(event);
    }

    case 'loginWithOpenid': {
      return loginWithOpenid(event);
    }

    case 'test': {
      return test(event);
    }

    default: {
      return
    }
  }
}
async function getWXACode(event) {
  const wxacodeResult = await cloud.openapi.wxacode.get({
    path: 'pages/index/index',
    width: 430,
    is_hyaline:true
  })
  let obj = {
    wxacodebase64 : wxacodeResult.buffer.toString('base64').replace(/[\r\n]/g, ""),
    wxacodeResult:wxacodeResult
  }
  return obj
  // const wxacodeResult = await cloud.openapi.wxacode.get({
  //   path: 'pages/openapi/openapi',
  // })
  // const fileExtensionMatches = wxacodeResult.contentType.match(/\/([^\/]+)/)
  // const fileExtension = (fileExtensionMatches && fileExtensionMatches[1]) || 'jpg'
  // const uploadResult = await cloud.uploadFile({
  //   cloudPath: `wxacode_default_openapi_page.${fileExtension}`,
  //   fileContent: wxacodeResult.buffer,
  // })
  // if (!uploadResult.fileID) {
  //   throw new Error(`upload failed with empty fileID and storage server status code ${uploadResult.statusCode}`)
  // }
  // return uploadResult.fileID
}

async function getOpenData(event) {
  return cloud.getOpenData({
    list: event.openData.list,
  })
}

async function getRunData(event) {
  delete event.userInfo
  return event
}

async function deleteSubscribeMessage(event) {
  const  {OPENID}  = getContext();
  const result = await db
    .collection('user_need_subscribe')
    .where({
      touser: OPENID
    })
    .remove();
  return result;
}

function getContext(event) {
  const wxContext = cloud.getWXContext();
  const qqContext = qqCloud.getQQContext();
  return {
    OPENID: wxContext.OPENID || qqContext.OPENID,
    APPID: wxContext.APPID || qqContext.APPID,
    UNIONID: wxContext.UNIONID || qqContext.UNIONID,
    ENV: wxContext.ENV || qqContext.ENV,
  }
}

function getCloudDb(){
  if(judgeIsWeixin()){
    return cloud.database();
  }else{
    return qqCloud.database();
  }
}

async function saveSubscribeMessage(event) {
  const db = getCloudDb();
  const  {OPENID}  = getContext();

  // 在云开发数据库中存储用户订阅的信息
  const result = await db.collection('user_need_subscribe').add({
    data: {
      ...event,
      touser: OPENID
    },
  });
  return result;
}

async function saveDaySignIndex(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
   // 在云开发数据库中存储用户订阅的信息
   const result = await db.collection('day_sign_index').add({
    data: {
      ...event,
      shared: false,
      touser: OPENID
    },
  });
  return result;
}

async function getDaySign(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  const result = await db
      .collection('day_sign_index')
      .where({
        date: event.date,
        touser: OPENID
      })
      .get();
  return result;
}

async function getSubscribeMessage(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  const result = await db
      .collection('user_need_subscribe')
      .where({
        date: event.date,
        touser: OPENID
      })
      .get();
  return result;
}

async function saveDaySignShared(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  const result =  db
  .collection('day_sign_index')
  .doc(event._id)
  .update({
    data: {
      shared: true,
    },
  });
  return result;
}

async function notifyOrder(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  const result =  db
  .collection('unifiedOrder')
  .doc(event.outTradeNo)
  .update({
    data: {
      isPayed: true,
    },
  });
  return result;
}

async function gotoOrder(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  // 在云开发数据库中存储用户订阅的信息
  const result = await db.collection('unifiedOrder').add({
    data: {
      ...event,
      touser: OPENID
    },
  });
  const res = await cloud.cloudPay.unifiedOrder({
    "body" : "喵巫占卜"+event.price+"元档",
    "outTradeNo" : result._id,
    "spbillCreateIp" : "127.0.0.1",
    "subMchId" : "1529401561",
    "totalFee" : event.price * 100,
    "envId": 'subscribe-msg-cloud-1ffnt',
    "functionName": "openapi"
  })
  return res
}

async function getHasAnswerBookChance(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  const result = db.collection('AnswerBookChance').where({
    date: event.date,
    touser: OPENID
  }).get();
  return result;
}

async function registerUserInfo(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  const result = await db.collection('user_info').add({
    data: {
      ...event,
      touser: OPENID
    },
  });
  return result;
}

async function test(){
  return 1;
}

async function getUserInfo(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  const result = await db.collection('user_info').where({
    touser: OPENID
  }).get();
  return result;
}

async function loginWithOpenid(event) {
  const  {OPENID}  = getContext();
  try {
    let res = await rq({
      method: 'POST',
      uri: "https://nqobaxsg.cn/qq/starLogin",
      body: Object.assign(event.body,{
        openid: OPENID
      }),
      json: true
    });
    return res;
  } catch (e) {
    console.error(e)
  }
}

async function changeAnswerBookChance(event){
  const db = getCloudDb();
  const  {OPENID}  = getContext();
  const result =  await db
  .collection('AnswerBookChance')
  .doc(event._id)
  .update({
    data: {
      hasChance: event.hasChance,
    },
  });
  if(!result.data.length){
    // 在云开发数据库中存储用户订阅的信息
    result = await db.collection('AnswerBookChance').add({
      data: {
        ...event,
        touser: OPENID
      },
    });
  }
  return result;
}

async function getIsPrepare(event){
  const db = getCloudDb();
  const result = db.collection('IsPrepare').get();
  return result;
}
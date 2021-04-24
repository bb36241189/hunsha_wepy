const rp = require('request-promise');
const sendTemplateMsg = async (token, param,isWeixin) => {
  return await rp({
    json: true,
    method: 'POST',
    uri: 'https://api.q.qq.com/api/json/template/send?access_token=' + token,
    body: {
      touser: param.touser,
      form_id: param.form_id,
      template_id: param.templateId,
      appid: '1111464096',
      page: param.page,
      data: param.data
    }
  }).then(res => {
    return res;
  }).catch(err => {
    console.error(err);
    return Promise.reject(err);
  })
}
module.exports = {
  sendTemplateMsg: sendTemplateMsg
}
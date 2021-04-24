/**
 * Created by Administrator on 2018/1/30 0030.
 */
import ajaxService from './class/ajax';
const logurl = 'http://nqobaxsg.cn:3002/';
const host = 'https://nqobaxsg.cn/qq/';
function ApiService() {
    this.token = wx.getStorageSync('token');
}
ApiService.prototype = {
    constructor: ApiService,
    serviceLog(route, data) {
        return ajaxService.post({
            url: logurl + route,
            data: data
        });
    },
    judgeIsInWeixin(){
        let isInWeixin = /micromessenger/i.test(
            navigator.userAgent.toLowerCase()
        );
        return isInWeixin;
    },
    guid() {
            function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
    },
    getStarInfo:function(star){
        var self = this;
        return ajaxService.get({
            url : host + 'starInfo',
            data: {
                star
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    tokenLogin:function(){
        var self = this;
        return ajaxService.post({
            url : host + 'tokenLogin',
            data: {
                token: this.token
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    starLogin:function(phone,code,starName){
        var self = this;
        return ajaxService.post({
            url : host + 'starLogin',
            data: {
                phone,
                code,
                starName
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    starLoginWxMiniPro(starName){
        return new Promise((r,j) => {
            wx.cloud.callFunction({
                name: 'openapi',
                data: {
                    action: 'loginWithOpenid',
                    body: {
                        starName
                    }
                },
                success: res => {
                    r(res.result);
                    // console.log(`[subDailyWeatherCloudFn] => OK => ${res}`)
                },
                fail: err => {
                    j(err);
                    // console.error(`[subDailyWeatherCloudFn] => Fail => ${err}`)
                }
            })
        }).catch(e => {
            return Promise.reject(this.wrapperError(e, {}))
        })
    },
    sendValideCode: function(phone){
        var self = this;
        return ajaxService.post({
            url : host + 'sendValideCode',
            data: {
                phone
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getTarotBigCardOrders(){
        var self = this;
        return ajaxService.get({
            url : host + 'getTarotBigCardOrders',
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    orderLock(order_id,card_nums){
        var self = this;
        return ajaxService.post({
            url : host + '/orderLock',
            data: {
                order_id,
                card_nums
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getTarotsInfo(cards,withDetail,title){
        var self = this,v = '1.0.3',h = v === '1.0.4'?host_test:host;
        return ajaxService.post({
            url : h + '/getTarotsInfo',
            data: {
                token: this.token,
                version: v,
                cards,
                title,
                withDetail
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getAuguryOrderByOrderId(order_id,isNoUse){
        var self = this;
        return ajaxService.post({
            url : host + 'getAuguryOrder',
            data: {
                order_id,
                note_id: isNoUse?'':'null',
                token: this.token
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getAuguryOrder(note_id,include_nouse){
        var self = this;
        return ajaxService.post({
            url : host + 'getAuguryOrder',
            data: {
                token: this.token,
                note_id,
                include_nouse
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    updateUserInfo(sex,nickname,birth_day,avatar = '') {
        var self = this;
        return ajaxService.post({
            url : host + 'updateUserInfo',
            data: {
                sex,
                nickname,
                avatar,
                birth_day,
                token:this.token
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    orderingAugury(tab,type,tag,text){
        var self = this;
        return ajaxService.post({
            url : host + 'orderingAugury',
            data: {
                token:this.token,
                tab,
                type: type?type:'',
                tag: tag?tag:'',
                text:text?text:''
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    updateNote(note_id,text,tag,notice,time){
        var self = this;
        return ajaxService.post({
            url : host + 'updateNote',
            data: {
                token:this.token,
                note_id,
                tag: tag,
                text,
                notice,
                time
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    saveNote(tab,type,tag,text,notice,time){
        var self = this;
        return ajaxService.post({
            url : host + 'saveNote',
            data: {
                token:this.token,
                tab,
                type,
                tag : tag,
                text,
                notice,
                time
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    deleteNote(note_id,tab){
        var self = this;
        return ajaxService.post({
            url : host + 'deleteNote',
            data: {
                token: this.token,
                note_id,
                tab
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getStarTopInfo(){
        var self = this;
        return ajaxService.get({
            url : host + 'getStarTopInfo'
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getDaySign(){
        var self = this;
        return ajaxService.post({
            url : host + 'getDaySign',
            data: {
                token: this.token
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getNotes(offset = 0){
        var self = this;
        return ajaxService.post({
            url : host + 'notes',
            data: {
                token: this.token,
                offset
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    gotoSkipNote(){
        var self = this;
        return ajaxService.post({
            url : host + 'gotoSkipNote',
            data: {
                token :this.token
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    orderUse(order_id,card_nums){
        var self = this;
        return ajaxService.post({
            url : host + 'orderUse',
            data: {
                order_id,
                card_nums
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getSimpleTarotCardInfo(cards){
        var self = this;
        return ajaxService.get({
            url : host + 'getSimpleTarotCardInfo',
            data: {
                cards
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getHotAugury(){
        var self = this;
        return ajaxService.get({
            url : host + 'hot_augury',
            data : {
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getProducts(isInWeixin){
        var self = this;
        return ajaxService.get({
            url : host + 'products',
            data: {
                isInWeixin
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    sharedWeixinWeb(force = ''){
        var self = this;
        return ajaxService.post({
            url : host + 'sharedWeixinWeb',
            data: {
                token :this.token,
                force
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getSdkSign(){
        var self = this;
        return ajaxService.get({
            url : host + 'getSdkSign',
            data: {
                url: encodeURIComponent(location.href.split('#')[0])
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    put2Desktop(){
        var self = this;
        return ajaxService.post({
            url : host + 'put2Desktop',
            data: {
                token :this.token
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    put2Desktop(){
        var self = this;
        return ajaxService.post({
            url : host + 'put2Desktop',
            data: {
                token :this.token
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    getArticleByName(name,key){
        var self = this;
        return ajaxService.get({
            url : host + 'getArticleByName',
            data: {
                name,
                key
            }
        }).then(function (ret) {
            return ret;
        }).catch(function (e) {
            return Promise.reject(self.wrapperError(e, {}))
        })
    },
    wrapperError: function (e, errorDefind) {
        if (Object.prototype.toString.call(e) === '[object Undefined]') {
            e = {};
        } else if (Object.prototype.toString.call(e) === '[object String]') {
            e = { message: e };
        }
        if (e.errorNo === 'SA003' || e.errorNo === 'SA002' || e.errorNo === 'A0002' || e.errorNo === 'UC011') {
            e.errorDefind = '登录超时';
        } else if (e.errorNo === 'ATS007') {
            e.errorDefind = '你已经登录其他账号';
        } else if (e.errorNo === 'ATC001') {
            e.errorDefind = '你还没有登录';
        } else if (e.message) {
            e.errorDefind = e.message;
        } else if (e.msg) {
            e.errorDefind = e.msg;
        }
        if (e.errorNo && errorDefind && errorDefind[e.errorNo]) {
            e.errorDefind = errorDefind[e.errorNo]
        }
        if (!e.errorDefind) {
            e.errorDefind = '网络异常';
        }
        console.warn(e);
        return e;
    }
};
export default new ApiService();

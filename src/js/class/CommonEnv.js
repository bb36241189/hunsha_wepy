export default {
    alert(params, callback) {
        this.fakeAlert(params.title, (ret) => {
            if (ret) {
                callback && callback({ btnIndex: 0 })
            } else {
                callback && callback({ btnIndex: 1 })
            }
        }, params.otherBtns[0], params.cancelBtn);
    },
    getSetting(){
        return new Promise((r,j) => {
            wx.getSetting({
                success(res) {
                    r(res);
                },
                fail(err){
                    j(err);
                }
            })
        })
    },
    authorize(scope){
        console.log('authorize',scope);
        this.getSetting().then(res => {
            if(res.authSetting[scope]){
                return res;
            }else{
                return new Promise((r,j) => {
                    wx.authorize({
                        scope: scope,
                        success(e) {
                            // 用户已经同意小程序使用录音功能，后续调用 qq.startRecord 接口不会弹窗询问
                            r(e);
                        },
                        fail(err){
                            j(err);
                        }
                    })
                })
            }
        }).catch(e => {
            console.log(e);
        })
    },
    saveImageToPhotosAlbum(filePath){
        return new Promise((r,j) => {
            wx.saveImageToPhotosAlbum({
                filePath,
                success(res) {
                    r(res);
                },
                fail(err){
                    j(err);
                }
            })
        })
    },
    downloadFile(url,filePath){
        return new Promise((r,j) => {
            wx.downloadFile({
                url: url, // 仅为示例，并非真实的资源
                filePath,
                success(res) {
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                        r(res.tempFilePath);
                    }else{
                        j(res);
                    }
                },
                fail(err){
                    j(err);
                },
                complete(e){
                    console.log(e);
                }
            })
        })
    },
    put2Desktop(){
        var self = this;
        return new Promise((r,j) => {
            wx.saveAppToDesktop({
                success(e){
                    r(e);
                },
                fail(e){
                    self.put2Desktop.isCancelPut2Desktop = true;
                    j(e);
                }
            })
        }).then(() => {
            return this.awaitime(3000);
        })
    },
    comfirm(title,content){
        return new Promise((r,j) => {
            wx.showModal({
              title: title,
              content: content,
              showCancel: true,
              success(e){
                if(e.confirm){
                  r(e)
                }else{
                  j(e);
                }
              },
              fail(){
                j(e);
              }
            })
        })
    },
    judgeIsInDouYin(){
        return navigator.userAgent.toLowerCase().includes("toutiaomicroapp");
    },
    judgeIsInQQ(){
        return this.getUrlParam('appName') == 'QQ';
    },
    judgeisInToutiao(){
        return this.getUrlParam('appName') == 'Toutiao';
    },
    judgeIsInMiniProgram(){
        return /miniProgram/i.test(navigator.userAgent.toLowerCase());
    },
    isQQMiniApp(){
        let runtime = typeof qq === "undefined" ? "wechat" : "qq";
        return runtime == 'qq';
    },
    isWXMiniApp(){
        let runtime = typeof qq === "undefined" ? "wechat" : "qq";
        return runtime == 'wechat';
    },
    awaitime(time) {
        return new Promise((r, j) => {
            setTimeout(() => {
                r();
            }, time);
        });
    },
    gotoWeixinPay(orderData,callback) {
        console.log('debug:gotoWeixinPay');
        let func = ()=> {
            this.onBridgeReady(orderData,callback);
        };
        if (typeof WeixinJSBridge == "undefined") {
            if (document.addEventListener) {
                document.addEventListener('WeixinJSBridgeReady', func, false);
            } else if (document.attachEvent) {
                document.attachEvent('WeixinJSBridgeReady', func);
                document.attachEvent('onWeixinJSBridgeReady', func);
            }
        } else {
            func();
        }
        return this.awaitime(1).then(() => {
            return orderData;
        })
    },
    judgeIsInWeixin(){
        let isInWeixin = /micromessenger/i.test(
            navigator.userAgent.toLowerCase()
        );
        return isInWeixin;
    },
    onBridgeReady(payData,callback) {
        let taht = this;
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId": payData.appId, //公众号名称，由商户传入
            "timeStamp": payData.timeStamp, //时间戳，自1970年以来的秒数
            "nonceStr": payData.nonceStr, //随机串
            "package": payData.package,
            "signType": payData.signType, //微信签名方式：
            "paySign": payData.paySign //微信签名
          },
          function(res) {
            callback && callback(res);
            if (res.err_msg == "get_brand_wcpay_request:ok") {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            //   alert('支付完成了');
            } else {
              console.log(res)
            }
          });
    },
    wxWapPay(redirect,params){

    },
    toast(msg,time){
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: time || 2000
        });
        return;
        // var div = document.createElement("div");
        // div.innerHTML = msg;
        // div.style.position = 'absolute';
        // div.style.textAlign = 'center';
        // div.style.zIndex = '100000';
        // div.style.padding = '0.3rem 1rem';
        // div.style.left = '50%';
        // div.style.top = '50%';
        // div.style.borderRadius = '0.3rem';
        // div.style.background = 'rgba(0,0,0,0.7)';
        // div.style.color = 'white';
        // div.style.fontSize = '1rem';
        // div.style.transform = 'translateX(-50%)';
        // document.body.appendChild(div);
        // setTimeout(() => {
        //     div.style.display = 'none';
        // },time || 2000)
    },
    fakeAlert(msg, callback, sureText, cancelText) {
        var div = document.createElement("div");
        div.innerHTML = "<style type=\"text/css\">"
            + ".nbaMask { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; background: rgba(0, 0, 0, 0.5); }                                                                                                                                                                       "
            + ".nbaMaskTransparent { position: fixed; z-index: 1000; top: 0; right: 0; left: 0; bottom: 0; }                                                                                                                                                                                            "
            + ".nbaDialog { position: fixed; z-index: 5000; width: 80%; max-width: 300px; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); transform: translate(-50%, -50%); background-color: #fff; text-align: center; border-radius: 8px; overflow: hidden; opacity: 1; color: white; }"
            + ".nbaDialog .nbaDialogHd { padding: .2rem .27rem .08rem .27rem; }                                                                                                                                                                                                                         "
            + ".nbaDialog .nbaDialogHd .nbaDialogTitle { font-size: 17px; font-weight: 400; }                                                                                                                                                                                                           "
            + ".nbaDialog .nbaDialogBd { padding: 0 .27rem; font-size: 15px; line-height: 1.3; word-wrap: break-word; word-break: break-all; color: #000000; }                                                                                                                                          "
            + ".nbaDialog .nbaDialogFt { position: relative; line-height: 48px; font-size: 17px; display: -webkit-box; display: -webkit-flex; display: flex; }                                                                                                                                          "
            + ".nbaDialog .nbaDialogFt:after { content: \" \"; position: absolute; left: 0; top: 0; right: 0; height: 1px; border-top: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleY(0.5); transform: scaleY(0.5); }               "
            + ".nbaDialog .nbaDialogBtn { display: block; -webkit-box-flex: 1; -webkit-flex: 1; flex: 1; color: #09BB07; text-decoration: none; -webkit-tap-highlight-color: transparent; position: relative; margin-bottom: 0; }                                                                       "
            + ".nbaDialog .nbaDialogBtn:after { content: \" \"; position: absolute; left: 0; top: 0; width: 1px; bottom: 0; border-left: 1px solid #e6e6e6; color: #e6e6e6; -webkit-transform-origin: 0 0; transform-origin: 0 0; -webkit-transform: scaleX(0.5); transform: scaleX(0.5); }             "
            + ".nbaDialog a { text-decoration: none; -webkit-tap-highlight-color: transparent; }"
            + "</style>"
            + "<div id=\"dialogs2\" style=\"display: none\">"
            + "<div class=\"nbaMask\"></div>"
            + "<div class=\"nbaDialog\">"
            + "	<div class=\"nbaDialogHd\">"
            + "		<strong class=\"nbaDialogTitle\">&nbsp;&nbsp;</strong>"
            + "	</div>"
            + "	<div class=\"nbaDialogBd\" id=\"dialog_msg2\">弹窗内容，告知当前状态、信息和解决方法，描述文字尽量控制在三行内</div>"
            + "	<div class=\"nbaDialogHd\">"
            + "		<strong class=\"nbaDialogTitle\">&nbsp;&nbsp;</strong>"
            + "	</div>"
            + "	<div class=\"nbaDialogFt\">"
            + "		<a href=\"javascript:;\" class=\"nbaDialogBtn nbaDialogBtn\" style=\"color:gray\" id=\"dialog_cancel\">取消</a>"
            + "		<a href=\"javascript:;\" class=\"nbaDialogBtn nbaDialogBtnPrimary\" id=\"dialog_ok2\">确定</a>"
            + "	</div></div></div>";
        document.body.appendChild(div);
        div.ontouchmove = function (e) {
            e.stopPropagation();
            e.preventDefault();
        }

        var dialogs2 = document.getElementById("dialogs2");
        dialogs2.style.display = 'block';

        var dialog_msg2 = document.getElementById("dialog_msg2");
        dialog_msg2.innerHTML = msg;

        // var dialog_cancel = document.getElementById("dialog_cancel");
        // dialog_cancel.onclick = function() {
        // dialogs2.style.display = 'none';
        // };
        var dialog_ok2 = document.getElementById("dialog_ok2");
        dialog_ok2.innerHTML = sureText;
        dialog_ok2.onclick = function () {
            dialogs2.style.display = 'none';
            callback(true);
        };
        var dialog_cancel = document.getElementById("dialog_cancel");
        dialog_cancel.innerHTML = cancelText;
        dialog_cancel.onclick = function () {
            dialogs2.style.display = 'none';
            callback(false);
        }
    },
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    }
}
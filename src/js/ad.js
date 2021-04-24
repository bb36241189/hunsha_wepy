import CommonEnv from './class/CommonEnv';
class RewardedVideoAd{
    constructor(){
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: '047e29ef8f29ccc4b29c922cb7b3ae67'
        });
        this.isLoaded = false;
        this.isCloseOk = false;
    }
    bindEvent(load,error,close){
        this.videoAd.onError(error);
        this.videoAd.onLoad(load);
        this.videoAd.onClose((close));
    }
    awaitime(time) {
        return new Promise((r, j) => {
            setTimeout(() => {
                r();
            }, time);
        });
    }
    load(){
        return this.videoAd.load().then(e => {
            this.isLoaded = true;
            return e;
        }).catch(err => {
            console.log('激励视频加载失败');
            return Promise.reject(err);
        });
    }
    show(){
        this.isClose = false;
        return this.videoAd.show().then((e) => {
            console.log('激励视频 广告显示成功')
            return e;
        }).catch(err => {
            console.log('激励视频 广告显示失败')
            return Promise.reject(err);
        })
    }
    onSuccessClose(){
        return new Promise((r,j) => {
            this.videoAd.onClose((e) => {
                console.log('close 事件回调')
                if(e.isEnded){
                    r();
                }else{
                    j('观看不成功');
                }
            })
        }).then((e) => {
            console.log('激励视频 广告观看成功')
            return e;
        }).catch(err => {
            console.log('激励视频 广告观看失败')
            return Promise.reject(err);
        })
    }
}
class AppBoxAd{
    constructor(){
        if(CommonEnv.isQQMiniApp()){
            this.appbox = wx.createAppBox({
                adUnitId: '89c5e2998fabee15b7c84bfff1609b04'
            });
        }
    }
    showAppBox(){
        this.appbox.load().then(()=>{
            this.appbox.show()
        })
    }
}
class InterstitialAd{
    constructor(){
        this.ad = wx.createInterstitialAd({
            adUnitId: '5fdc0fa3de8f358c9919ec382d180b92'
        });
    }
    load(){
        return this.ad.load().catch((err) => {
            console.error('load',err)
            return Promise.reject(err);
        })        
    }
    bindEvent(load = new Function,error = new Function,close = new Function){
        this.ad.onError(error);
        this.ad.onLoad(load);
        this.ad.onClose((close));
    }
    show(){
        return this.ad.show().catch((err) => {
            console.error('show',err)
        })
    }
}
export default {
    videoAd: new RewardedVideoAd(),
    boxAd: new AppBoxAd(),
    iAd: new InterstitialAd()
}
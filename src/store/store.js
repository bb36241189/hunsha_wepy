/**
 * Created by Administrator on 2018/9/13 0013.
 */
import apiService from '../js/apiService';
import eventHub from '../common/eventHub';
export default {
    state : {
        starInfo : null,
        cStar: null,//本地存储的星座选择信息的恢复
        userInfo: null,//用户信息
        nowTab: 'day',//星座运势的哪一个tab页
        wxConfig: null//微信配置数据对象
    },
    mutations : {
        changeStarInfo(state,v){
            state.starInfo = v;
        },
        changeWxConfig(state,v){
            state.wxConfig = v;
        },
        changeCStar(state,v){
            state.cStar = v;
        },
        changeUserInfo(state,v){
            state.userInfo = v;
        },
        changeNowTab(state,v){
            state.nowTab = v;
        }
    },
    done(scope){
        eventHub.$on('$store:change',scope['$store:change:eventHandler'] = (v) => {
            Object.assign(scope.$store.state,v);
            Object.assign(this.state,v);
            // console.log('eventBus:$store:change',scope.$is)
        });
    },
    disDone(scope){
        eventHub.$off('$store:change',scope['$store:change:eventHandler']);
        delete scope['$store:change:eventHandler'];
    },
    commit(k,v){
        if(this.mutations[k]){
            this.mutations[k](this.state,v);
            eventHub.$emit('$store:change',this.state);
        }
    },
    dispatch(k,v){
        if(this.actions[k]){
            this.actions[k]({commit: this.commit.bind(this),state:this.state,dispatch: this.dispatch.bind(this)},v);
        }
    },
    getters : {
        doubleCount : state => {
            return state.count * 2;
        }
    },
    actions: {
        loadStarInfo({commit},starKey){
            wx.showLoading({
                title: '加载中',
            })
            return apiService.getStarInfo(starKey).then(ret => {
                commit('changeStarInfo',ret);
                wx.hideLoading()
            }).catch(e => {
                console.error(e);
                wx.hideLoading()
            })
        },
        getSdkSign({commit}){
            return apiService.getSdkSign().then(ret => {
                commit('changeWxConfig',ret);
            }).catch(e => {
                console.error(e);
            })
        },
        starLoginWxMiniPro({commit,state}){
            apiService.starLoginWxMiniPro(state.cStar.key).then((ret) => {
                if (ret) {
                    // CommonEnv.toast('登录成功!');
                    commit("changeUserInfo", ret);
                    apiService.token = ret.token;
                    wx.setStorageSync('token',apiService.token);
                } else {
                    return Promise.reject({msg: 'login lost'});
                }
            })
            .catch((e) => {
                console.error(e);
            });
        },
        login({commit,dispatch}){
            return apiService.tokenLogin().then(ret => {
                if(!ret.code){
                    commit('changeUserInfo',ret);
                }else{
                    return Promise.reject(ret);
                }
            }).catch(e => {
                if(e.code && e.code == 103){
                    wx.removeStorageSync('token')
                    delete apiService.token;
                    dispatch('starLoginWxMiniPro')//token失效就重新登录
                }else{
                    console.error(e);
                }
            })
        }
    }
};
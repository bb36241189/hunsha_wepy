export default {
    uploadFile(filePath,cloudPath,config){
        return wx.cloud.uploadFile({
            cloudPath,
            config,
            filePath// 文件路径
        })
        .then(res => {
            return res;
        })
        .catch(error => {
            return Promise.reject(error);
        });
    }
}
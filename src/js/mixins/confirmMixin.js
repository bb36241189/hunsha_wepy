/**
 * Created by Administrator on 2019/4/12 0012.
 */
export default {
    data() {
        return {
            confirmInfo: {
                show:false,
                title:null,
                subtitle:null,
                sureBtn:null
            }
        }
    },
    methods: {
        confirm(title,subtitle,sureBtn) {
            this.confirmInfo.show = true;
            this.confirmInfo.title = title;
            this.confirmInfo.subtitle = subtitle;
            this.confirmInfo.sureBtn = sureBtn;
            return new Promise((r,j) => {
                this.$once('confirmSure',(e) => {
                    this.confirmInfo.show = false;
                    r('ok');
                });
                this.$once('confirmCancel',(e)=> {
                    this.confirmInfo.show = false;
                    j('cancel');
                })
            })
        },
        confirmSure(){
            this.$emit('confirmSure');
        },
        confirmCancel(){
            this.$emit('confirmCancel');
        },
    }
}
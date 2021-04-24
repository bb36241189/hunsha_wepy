import eventHub from '../common/eventHub';
export default {
    router: [],
    route:{
        path: '',
        params: {},
        query: {},
        index: 0
    },
    done(scope){
        eventHub.$on('router:change',scope['router:change:eventHandler'] = (v) => {
            v.router.length > 10 && v.router.shift();//不要超过10个
            // console.log('router:change:geted',scope.$is,scope.$router.router.length);
            scope.$router.router.splice(0,scope.$router.router.length,...v.router);//scope.$router是当前逐渐里的对象
            this.router.splice(0,this.router.length,...v.router);//这里this是原始对象
            Object.assign(scope.$route,v.route);
            Object.assign(this.route,v.route);
            // console.log('route:changed',scope.$route,scope);
        });
        // eventHub.$on('router:offsetChange',scope['router:offsetChange:eventHandler'] = (v) => {
        //     Object.assign(scope.$route,this.router[this.router.length - 1 + v]);
        //     Object.assign(this.route,this.router[this.router.length - 1 + v]);
        //     scope.$router.router.splice(scope.$router.router.length + v);
        //     // this.router.splice(this.router.length + v);
        // });
    },
    disDone(scope){
        // console.log('router:disDone:geted',scope.$is,eventHub._events['$store:change'].length);
        eventHub.$off('router:change',scope['router:change:eventHandler']);
        delete scope['router:change:eventHandler'];
        // eventHub.$off('router:offsetChange',scope['router:offsetChange:eventHandler']);
        // delete scope['router:offsetChange:eventHandler'];
    },
    go(offset){
        this.router.splice(this.router.length + offset);
        Object.assign(this.route,this.router[this.router.length - 1]);
        // eventHub.$emit('router:offsetChange',offset);
        eventHub.$emit('router:change',this);
    },
    getCurrentPath(){
        return this.router[this.router.length - 1]
    },
    push(route){//这里修改的是当前组建的router对象
        if(Object.prototype.toString.call(route) == "[object String]"){
            this.route.path = route;
            this.router.push({
                path : route
            })
        }else if(Object.prototype.toString.call(route) == "[object Object]"){
            this.route.path = route.path;
            this.router.push(route);
        }
        // console.log('router:push:emit');
        eventHub.$emit('router:change',this);
    }
}
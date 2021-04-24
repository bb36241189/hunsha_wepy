/**
 * Created by Administrator on 2018/12/13 0013.
 */
const fs = require('fs-extra');
const pathTo = require('path');
const pluginName = 'webpack.toRem';
const hasPluginInstalled = fs.existsSync('./web/plugin.js');
/**
 * webpack插件开发采用'动态原型模式'
 * 插件开发，最重要的两个对象：compiler、compilation
 * @param options
 * @constructor
 */
function Multipage(options) { // 根据 options 配置你的插件

}
Multipage.prototype.replaceFileContent = function (filePath, math, tostr) {
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files.replace(math, tostr);
            fs.outputFileSync(filePath, result);
            if (err) {
                j(err);
            } else {
                // console.warn('replaceFileContent:' + filePath + ' toStr' + tostr);
                r();
            }

        })
    })
};
Multipage.prototype.copyFile = function (sourceFile, destPath) {
    fs.createReadStream(sourceFile);
    const readStream = fs.createReadStream(sourceFile);
    const writeStream = fs.createWriteStream(destPath);
    readStream.pipe(writeStream);
    return new Promise((r, j) => {
        writeStream.on('finish', function (e) {
            console.warn('copyFile:' + sourceFile + ' to:' + destPath + ' ok');
            r(e);
        });
        writeStream.on('error', function (err) {
            j(err);
        });
    })
};
Multipage.prototype.rem2px = function (numRem) {
    // return numPx*320/375/12/2;
    return Math.round(numRem*2*12*375/320)
}

Multipage.prototype.contentPx2Rem = function (content) {
    let result = content,whileRet,self = this;
    while(whileRet = result.match(/(\d+)(px)/)){
        // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
        result = result.replace(new RegExp('('+whileRet[1]+')(px)'), self.px2rem(whileRet[1]) + 'rem');
    }
    return result;
}

Multipage.prototype.handlePx2Rpx= function (filePath) {
    // console.log('handlePx2Rpx:'+filePath);
    var self = this;
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files,whileRet;
            while(whileRet = result.match(/(\d+)(px)/)){
                // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                result = result.replace(new RegExp('('+whileRet[1]+')(px)'), whileRet[1] + 'rpx');
            }
            fs.outputFileSync(filePath, result);
            if (err) {
                j(err);
            } else {
                // console.warn('handlePx2Rem:' + filePath + ' toStr');
                r();
            }

        })
    })
}

Multipage.prototype.joinRegExpRet = function(ret,indexList){
    var i,result = '';
    for(i = 1;i<ret.length;i++){
        if(!indexList || indexList.indexOf(i) > -1){
            if(ret[i] !== undefined){
                result += ret[i];
            }   
        }
    }
    return result;
};

Multipage.prototype.handleReplaceCss = function ( filePath) {
    // console.log('handleReplaceCss:'+filePath);
    var self = this;
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files,whileRet;
            // h4 2  [ele-attr="h4"] h1,h2 h3 h4;h5,h6,i,p,section
            while(whileRet = result.match(/\s((h|i|p|section|span|div|footer|img|ul|li)\d*)(\s*)(\{|:)/)){
                whileRet[1] = '.'+whileRet[1]+'';
                result = result.replace(whileRet[0],self.joinRegExpRet(whileRet,[1,3,4]));
            }
            fs.outputFileSync(filePath, result);
            if (err) {
                j(err);
            } else {
                // console.warn('handlePx2Rem:' + filePath + ' toStr');
                r();
            }

        })
    })
}

Multipage.prototype.toCamelbak = function(input){
    var s1 = input;
    s1 = s1.replace(/-(\w)/g,function(all, letter){
        return letter.toUpperCase();
    });
    return s1;
}

Multipage.prototype.fromCamelbak = function(input){
    var s = input;
    s = s.replace(/([A-Z])/g,"-$1").toLowerCase();
    return s;
}

Multipage.prototype.walk = function (dir,callback) {
    dir = dir || '.';
    const directory = pathTo.join(__dirname, './', dir);
    // console.log('walk:directory',directory);
    let promises = [];
    fs.readdirSync(directory)
        .forEach((file) => {
            const fullpath = pathTo.join(directory, file);
            const stat = fs.statSync(fullpath);
            const extname = pathTo.extname(fullpath);
            if (stat.isFile() && extname === '.js' || extname === '.json' || extname === '.wxml') {
                callback && callback(fullpath);
            } else if (stat.isDirectory() && file !== 'build' && file !== 'include' && file !== 'node_modules' && file !== 'webpack_config') {
                const subdir = pathTo.join(dir, file);
                promises.push(this.walk(subdir,callback));
            }
        });
    return Promise.all(promises);
};

Multipage.prototype.handleReplace = function (filePath) {
    var self = this;
    if(filePath.indexOf('project.config.json') < 0 
    && filePath.indexOf('weapp\\app.json') < 0 
    && filePath.indexOf('weapp\\js\\ad.js') < 0 
    && filePath.indexOf('weapp\\views\\mine.wxml') < 0){
        // if(filePath == 'E:\\study\\star_tarot_wepy\\weapp\\views\\mine.wxml'){
        //     console.log('handleReplace:'+filePath);
        // }
        return Promise.resolve();
    }else{
        console.warn('doHandleReplace:'+filePath);
        return new Promise((r, j) => {
            fs.readFile(filePath, 'utf8', function (err, files) {
                let result = files,whileRet;
                //list 2 scroll-view
                if(filePath.indexOf('weapp\\views\\mine.wxml') > -1){
                    if(whileRet = result.match(/(<ad)(\s+)(unit-id=")(\w+)(")/)){
                        // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                        result = result.replace(whileRet[4], '2f29a9deb6a2fb4474bbc1cf456b4818');
                    }
                }else if(filePath.indexOf('weapp\\js\\ad.js') > -1){
                    if(whileRet = result.match(/(adUnitId)(\s*)(:)(\s*')(\w+)(')/)){
                        console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                        result = result.replace(whileRet[5], '4cf3fd06be72e723b285935cbb925915');
                    }
                }else if(filePath.indexOf('project.config.json') > -1){
                    if(whileRet = result.match(/("qqappid")(\s*:\s*")(\w+)(")/)){
                        // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                        result = result.replace(whileRet[3], '1111466897');
                    }
                }else if(filePath.indexOf('weapp\\app.json') > -1){
                    if(whileRet = result.match(/("pages\/)(App)(")/)){
                        // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                        result = result.replace(whileRet[2], 'AppTarot');
                    }
                }
    
                fs.outputFileSync(filePath, result);
                if (err) {
                    j(err);
                } else {
                    console.warn('handleReplace:' + filePath + ' toStr');
                    r();
                }
    
            })
        })
    }
}

Multipage.prototype.handlePx2Rem = function (filePath) {
    // console.log('handlePx2Rem:'+filePath);
    var self = this;
    return new Promise((r, j) => {
        fs.readFile(filePath, 'utf8', function (err, files) {
            let result = files,whileRet;
            while(whileRet = result.match(/(\d+)(px)/)){
                // console.log(whileRet[0] + ':' + whileRet[1] + ':' + whileRet[2]);
                result = result.replace(new RegExp('('+whileRet[1]+')(px)'), self.px2rem(whileRet[1]) + 'rem');
            }
            fs.outputFileSync(filePath, result);
            if (err) {
                j(err);
            } else {
                // console.warn('handlePx2Rem:' + filePath + ' toStr');
                r();
            }

        })
    })
}
const vueWebTemp = 'temp';
var isWin = /^win/.test(process.platform);

/**
 * ## webpack 生命周期
 * 编译过程包含以下几个过程:
 * - beforeRun
 * - run
 * - beforeCompile
 * - compile
 * - make
 * - seal
 *
 * # hooks
 * ## hook 类型:
 * - SyncHook(同步钩子) - SyncHook
 * - Bail Hooks(保释钩子) - SyncBailHook
 * - Waterfall Hooks(瀑布钩子) - SyncWaterfallHook
 *
 * 异步钩子如下：
 * - Async Series Hook(异步串行钩子) - AsyncSeriesHook
 * - Async waterfall(异步瀑布钩子) - AsyncWaterfallHook
 * - Async Series Bail - AsyncSeriesBailHook
 * - Async Parallel - AsyncParallelHook
 * - Async Series Bail - AsyncSeriesBailHook
 *
 *
 */
Multipage.prototype.apply = (compiler) => {
    var self = this;
    // synchook 完成插件初始化, 准备编译环境时触发. Called while preparing the compiler environment, right after initializing the plugins in the configuration file.
    compiler.hooks.environment.tap('SomeStringWhichIsPlugin', () => {
        console.log('[environment]:')
    })

    // synchook environment hook 触发后触发该hook
    compiler.hooks.afterEnvironment.tap('SomeStringWhichIsPlugin', () => {
        console.log('[afterEnvironment]:')
    })

    // synchook 初始化内部plugins后触发
    compiler.hooks.afterPlugins.tap(
        'SomeStringWhichIsPlugin',
        (compilation) => {
            console.log('[afterPlugins]:')
        }
    )
    // synchook 完成resolver过程后
    compiler.hooks.afterResolvers.tap(
        'SomeStringWhichIsPlugin',
        (compilation) => {
            console.log('[afterResolvers]:')
        }
    )

    // synchook 读取 config 后触发
    compiler.hooks.entryOption.tap(
        'SomeStringWhichIsPlugin',
        (context, entry) => {
            // context 当前执行目录. entry 入口文件
            console.log('[entryOption]:', context, entry,self)
            new Multipage().walk('../',(file) => {
                new Multipage().handleReplace(file).then();
            })
        }
    )

    /**
     * AsyncSeriesHook
     * Executes a plugin after compilation parameters are created.
     * 编译参数创建后. 执行的插件
     * 可以用来修改编译参数
     */
    compiler.hooks.beforeCompile.tap(
        'SomeStringWhichIsPlugin',
        (compilationParams, callback) => {
            console.log('[beforeCompile]:', callback)
            callback()
        }
    )

    // SyncHook Called right after beforeCompile, before a new compilation is created.
    compiler.hooks.compile.tap(
        'SomeStringWhichIsPlugin',
        (compilationParams) => {
            console.log('[compile]:')
        }
    )

    // AsyncSeriesHook running the compiler之前触发该hook
    compiler.hooks.beforeRun.tapAsync(
        'SomeStringWhichIsPlugin',
        (ctx, entry) => {
            console.log('[beforeRun]:')
            // console.log('[beforeRun]:', ctx, entry)
        }
    )

    // AsyncSeriesHook Hook into the compiler before it begins reading records.
    compiler.hooks.run.tapAsync('SomeStringWhichIsPlugin', (ctx, entry) => {
        console.log('run:', ctx, entry)
    })

    //  AsyncSeriesHook Executes a plugin during watch mode after a new compilation is triggered but before the compilation is actually started.
    compiler.hooks.watchRun.tapAsync(
        'SomeStringWhichIsPlugin',
        (compiler, callback) => {
            console.log('[watchRun]:')
            callback()
        }
    )

    // SyncHook Called after a NormalModuleFactory is created.
    compiler.hooks.normalModuleFactory.tap(
        'SomeStringWhichIsPlugin',
        (normalModuleFactory) => {
            console.log('[normalModuleFactory]:')
        }
    )

    // SyncHook Runs a plugin after a ContextModuleFactory is created.
    compiler.hooks.contextModuleFactory.tap(
        'SomeStringWhichIsPlugin',
        (contextModuleFactory) => {
            console.log('[contextModuleFactory]:')
        }
    )

    // 4.x 无 SyncHook Called when a compiler object is initialized. 4.x 中 compiler.hooks.initialize 为 undefined
    // compiler.hooks.initialize.tap(
    //     'SomeStringWhichIsPlugin',
    //     (ctx, entry) => {
    //         console.log('initialize:', ctx, entry)
    //     }
    // )

    // SyncHook Executed while initializing the compilation, right before emitting the compilation event.
    compiler.hooks.thisCompilation.tap(
        'SomeStringWhichIsPlugin',
        (compilation, compilationParams) => {
            console.log('[thisCompilation]:')
        }
    )

    // SyncHook Runs a plugin after a compilation has been created.
    compiler.hooks.compilation.tap(
        'SomeStringWhichIsPlugin',
        (compilation, compilationParams) => {
            console.log('[compilation]:')
        }
    )

    // AsyncSeriesHook Called after finishing and sealing the compilation.
    compiler.hooks.afterCompile.tapAsync(
        'SomeStringWhichIsPlugin',
        (compilation, callback) => {
            console.log('[afterCompile]:')
            callback()
        }
    )

    // SyncBailHook Executed while initializing the compilation, right before emitting the compilation event.
    compiler.hooks.shouldEmit.tap(
        'SomeStringWhichIsPlugin',
        (compilation) => {
            // return true to emit the output, otherwise false
            console.log('[shouldEmit]:')
            return true
        }
    )
    //  AsyncSeriesHook Executed right before emitting assets to output dir.
    compiler.hooks.emit.tapAsync(
        'SomeStringWhichIsPlugin',
        (compilation, callback) => {
            console.log('[emit]:')
            // callback()
        }
    )

    // debug 中 AsyncSeriesHook Called after emitting assets to output directory.
    compiler.hooks.afterEmit.tapAsync(
        'SomeStringWhichIsPlugin',
        (compilation, callback) => {
            console.log('[afterEmit]:')
            callback()
        }
    )

    // 4.x 中无该方法 Executed when an asset has been emitted. Provides access to information about the emitted asset, such as its output path and byte content.
    // compiler.hooks.assetEmitted.tapAsync(
    //     'SomeStringWhichIsPlugin',
    //     (
    //         file,
    //         { content, source, outputPath, compilation, targetPath }
    //     ) => {
    //         console.log('assetEmitted:', compilation)
    //     }
    // )

    // AsyncSeriesHook Executed when the compilation has completed.
    compiler.hooks.done.tapPromise('SomeStringWhichIsPlugin', (stats) => {
        console.log('[done]:')
        return Promise.resolve()
    })

    // SyncHook Called if the compilation fails.
    compiler.hooks.failed.tap('SomeStringWhichIsPlugin', (compilation) => {
        console.log('[failed]:')
    })

    // SyncHook Executed when a watching compilation has been invalidated.
    compiler.hooks.invalid.tap('SomeStringWhichIsPlugin', (compilation) => {
        console.log('[invalid]:')
    })

    compiler.hooks.make.tapAsync(
        'MyTestPlugin',
        (compilation, callback) => {
            console.log('[make]:')
            let _time = {}
            compilation.hooks.buildModule.tap('MyTestPlugin', (module) => {
                // console.log('module.resource', module.resource)
                // console.log('module.loaders', module.loaders)
                if (module.resource) {
                    console.time(module.resource)
                }
            })

            compilation.hooks.succeedModule.tap(
                'MyTestPlugin',
                (module) => {
                    if (module.resource) {
                        // console.log('[succeedModule]:', module.resource)
                        // 打印模块build耗时
                        // console.timeEnd(module.resource)
                    }
                }
            )

            callback()
        }
    )
}

module.exports = Multipage;
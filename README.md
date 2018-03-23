chunk-asset-webpack-plugin [![Build Status](https://travis-ci.org/ali322/chunk-asset-webpack-plugin.svg?branch=master)](https://travis-ci.org/ali322/chunk-asset-webpack-plugin) [![npm version](https://badge.fury.io/js/chunk-asset-webpack-plugin.svg)](https://badge.fury.io/js/chunk-asset-webpack-plugin)
===
[![NPM](https://nodei.co/npm/chunk-asset-webpack-plugin.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/chunk-asset-webpack-plugin/)

useful plugin that change chunk files when webpack emit

Install
===

```javascript
npm install chunk-asset-webpack-plugin --save--dev
```

Usage
===

add plugin in your webpack.config.js

```javascript
var ChunkAssetPlugin = require('chunk-asset-webpack-plugin')

module.exports = {
    entry:{
        index:"./index.js",
    },
    module:{
        loaders:[
            ...
        ]
    },
    output:{
        path:'./dist',
        filename:'[name].js'
    },
    plugins:[
        new ChunkAssetPlugin({
            chunks: {
              index: files => files.map(file => 'foo/bar/' + file)
            }
        })
    ]
}
```

Plugin Options
===

- **chunks**: chunk files mapper, accept array or function take chunk files as first argument

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
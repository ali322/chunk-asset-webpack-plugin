let mapKeys = require('lodash/mapKeys')
let forEach = require('lodash/forEach')
let includes = require('lodash/includes')
let pickBy = require('lodash/pickBy')
let isFunction = require('lodash/isFunction')
let isArray = require('lodash/isArray')

function ChunkAssetPlugin(options) {
  options.chunks = options.chunks || {}
  this.runing = false
  this.options = options
}

ChunkAssetPlugin.prototype.apply = function(compiler) {
  let that = this
  let options = this.options
  let selected = options.chunks
  let emit = function(compilation, callback = () => {}) {
    if (that.runing) {
      callback()
      return
    }
    let chunks = compilation.chunks
    let assets = compilation.assets
    let namedChunks = compilation.namedChunks
    let assetMap = {}
    if (that.isHotUpdateCompilation(assets)) {
      callback()
      return
    }
    
    compilation.chunks = chunks.map(function(chunk) {
      let chunkName = chunk.name
      let chunkFiles = chunk.files
      if (includes(Object.keys(selected), chunkName)) {
        let files = isFunction(selected[chunkName])
        ? selected[chunkName](chunkFiles)
        : selected[chunkName]
        if (isArray(files)) {
          forEach(files, function(file, k) {
            assetMap[chunkFiles[k]] = file
          })
        } else {
          assetMap[chunkFiles] = files
        }
        chunk.files = files
        namedChunks = namedChunks.set(chunkName, chunk)
      }
      return chunk
    })
    compilation.namedChunks = namedChunks
    assets = pickBy(assets,function (content,fileName) {
      return includes(Object.keys(assetMap), fileName)
    })
    assets = mapKeys(assets, (content, assetName) => {
      if (assetMap[assetName]) {
        return assetMap[assetName]
      }
      return assetName
    })
    compilation.chunks = chunks
    compilation.assets = assets
    that.runing = true
    callback()
  }
  if(compiler.hooks) {
    compiler.hooks.emit.tap('ChunkAssetPlugin', emit)
  } else {
    compiler.plugin('emit', emit)
  }
}

ChunkAssetPlugin.prototype.isHotUpdateCompilation = function(assets) {
  return (
    assets.length &&
    assets.some(function(name) {
      return /\.hot-update\.js$/.test(name)
    })
  )
}

module.exports = ChunkAssetPlugin
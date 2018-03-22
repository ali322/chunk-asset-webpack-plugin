let webpack = require('webpack')
let path = require('path')
let fs = require('fs')
let rm = require('rimraf')
let expect = require('chai').expect
let ChunkAssetPlugin = require('../')
let glob = require('glob')

describe('ChunkAssetPlugin', () => {
    beforeEach(done => {
      rm('test/dist/**/*.*', done)
    })
    it('should work correctly', () => {
        webpack({
            entry: {
              test: path.resolve(__dirname, 'fixture', 'entry.js'),
            },
            output: {
                path: path.resolve(__dirname, 'dist'),
                filename: '[name].js'
            },
            plugins: [
                new ChunkAssetPlugin({
                    chunks: {
                      test: files => files.map(file => 'foobar-'+ file)
                    }
                })
            ]
        },(err,stats)=>{
            expect(err).to.eq(null)
            const output = fs.readFileSync(path.resolve(__dirname, 'dist', 'foobar-test.js'))
            expect(output.length).to.above(0)
            done()
        })
    })
})
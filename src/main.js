import Watermark from './watermark';

console.log(Watermark)
const watermark = new Watermark({
  watermark_width: 200, // 水印宽度
  watermark_height: 100, // 水印长度
  watermark_parent_node: 'app'
})

console.log(watermark)
watermark.init()

setTimeout(() => {
  watermark.remove()
}, 3000)


const $app = document.getElementById('app');
console.log($app)
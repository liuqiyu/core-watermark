import { defaultSettings, hasObserver, forceRemove, option } from './constant'

class Watermark {
  constructor(settings) {
    this.settings = settings
    this.watermarkDom = hasObserver ? new MutationObserver(this._domChangeCallback) : null
  }

  load () {

  }

  init () {
    this._loadMark()
  }

  remove () {

  }

  _domChangeCallback (records) {
    if (forceRemove) {
      forceRemove = false
      return
    }
    if ((this.settings && records.length === 1) || records.length === 1 && records[0].removedNodes.length >= 1) {
      console.log(this._loadMark)
      this._loadMark()
    }
  }

  _loadMark () {
    const newSettings = Object.assign({}, defaultSettings, this.settings)

    /* 如果元素存在则移除 */
    const watermark_element = document.getElementById(newSettings.watermark_id)
    watermark_element && watermark_element.parentNode && watermark_element.parentNode.removeChild(watermark_element)

    /* 如果设置水印挂载的父元素的id */
    const watermark_parent_element = document.getElementById(newSettings.watermark_parent_node)
    const watermark_hook_element = watermark_parent_element ? watermark_parent_element : document.body

    /* 获取页面宽度 */
    const page_width = Math.max(watermark_hook_element.scrollWidth, watermark_hook_element.clientWidth)
    /* 获取页面最大长度 */
    const page_height = Math.max(watermark_hook_element.scrollHeight, watermark_hook_element.clientHeight)

    const parentEle = watermark_hook_element

    let page_offsetTop = 0
    let page_offsetLeft = 0

    if (newSettings.watermark_parent_width || newSettings.watermark_parent_height) {
      /* 指定父元素同时指定了宽或高 */
      if (parentEle) {
        page_offsetTop = parentEle.offsetTop || 0
        page_offsetLeft = parentEle.offsetLeft || 0
        newSettings.watermark_x = newSettings.watermark_x + page_offsetLeft
        newSettings.watermark_y = newSettings.watermark_y + page_offsetTop
      }
    } else {
      if (parentEle) {
        page_offsetTop = parentEle.offsetTop || 0
        page_offsetLeft = parentEle.offsetLeft || 0
      }
    }

    /* 创建水印外壳div */
    let otdiv = document.getElementById(newSettings.watermark_id)
    let shadowRoot = null

    if (!otdiv) {
      otdiv = document.createElement('div')
      /* 创建shadow dom */
      otdiv.id = newSettings.watermark_id
      otdiv.setAttribute('style', 'pointer-events: none !important; display: block !important')
      /* 判断浏览器是否支持attachShadow方法 */
      if (typeof otdiv.attachShadow === 'function') {
        /* createShadowRoot Deprecated. Not for use in new websites. Use attachShadow */
        shadowRoot = otdiv.attachShadow({ mode: 'open' })
      } else {
        shadowRoot = otdiv
      }
      /* 将shadow dom随机插入body内的任意位置 */
      const nodeList = watermark_hook_element.children
      const index = Math.floor(Math.random() * (nodeList.length - 1))
      if (nodeList[index]) {
        watermark_hook_element.insertBefore(otdiv, nodeList[index])
      } else {
        watermark_hook_element.appendChild(otdiv)
      }
    } else if (otdiv.shadowRoot) {
      shadowRoot = otdiv.shadowRoot
    }

    /* 三种情况下会重新计算水印列数和x方向水印间隔：1、水印列数设置为0，2、水印宽度大于页面宽度，3、水印宽度小于于页面宽度 */
    newSettings.watermark_cols = parseInt((page_width - newSettings.watermark_x) / (newSettings.watermark_width + newSettings.watermark_x_space))
    const temp_watermark_x_space = parseInt((page_width - newSettings.watermark_x - newSettings.watermark_width * newSettings.watermark_cols) / (newSettings.watermark_cols))
    newSettings.watermark_x_space = temp_watermark_x_space ? newSettings.watermark_x_space : temp_watermark_x_space
    let allWatermarkWidth

    /* 三种情况下会重新计算水印行数和y方向水印间隔：1、水印行数设置为0，2、水印长度大于页面长度，3、水印长度小于于页面长度 */
    newSettings.watermark_rows = parseInt((page_height - newSettings.watermark_y) / (newSettings.watermark_height + newSettings.watermark_y_space))
    const temp_watermark_y_space = parseInt((page_height - newSettings.watermark_y - newSettings.watermark_height * newSettings.watermark_rows) / (newSettings.watermark_rows))
    newSettings.watermark_y_space = temp_watermark_y_space ? newSettings.watermark_y_space : temp_watermark_y_space
    let allWatermarkHeight

    if (watermark_parent_element) {
      allWatermarkWidth = newSettings.watermark_x + newSettings.watermark_width * newSettings.watermark_cols + newSettings.watermark_x_space * (newSettings.watermark_cols - 1)
      allWatermarkHeight = newSettings.watermark_y + newSettings.watermark_height * newSettings.watermark_rows + newSettings.watermark_y_space * (newSettings.watermark_rows - 1)
    } else {
      allWatermarkWidth = page_offsetLeft + newSettings.watermark_x + newSettings.watermark_width * newSettings.watermark_cols + newSettings.watermark_x_space * (newSettings.watermark_cols - 1)
      allWatermarkHeight = page_offsetTop + newSettings.watermark_y + newSettings.watermark_height * newSettings.watermark_rows + newSettings.watermark_y_space * (newSettings.watermark_rows - 1)
    }

    let x
    let y
    for (let i = 0; i < newSettings.watermark_rows; i++) {
      if (watermark_parent_element) {
        y = page_offsetTop + newSettings.watermark_y + (page_height - allWatermarkHeight) / 2 + (newSettings.watermark_y_space + newSettings.watermark_height) * i;
      } else {
        y = newSettings.watermark_y + (page_height - allWatermarkHeight) / 2 + (newSettings.watermark_y_space + newSettings.watermark_height) * i;
      }
      for (let j = 0; j < newSettings.watermark_cols; j++) {
        if (watermark_parent_element) {
          x = page_offsetLeft + newSettings.watermark_x + (page_width - allWatermarkWidth) / 2 + (newSettings.watermark_width + newSettings.watermark_x_space) * j;
        } else {
          x = newSettings.watermark_x + (page_width - allWatermarkWidth) / 2 + (newSettings.watermark_width + newSettings.watermark_x_space) * j;
        }
        const mask_div = document.createElement('div');
        const oText = document.createTextNode(newSettings.watermark_txt);
        mask_div.appendChild(oText);
        /* 设置水印相关属性start */
        mask_div.id = newSettings.watermark_prefix + i + j;
        /* 设置水印div倾斜显示 */
        mask_div.style.webkitTransform = "rotate(-" + newSettings.watermark_angle + "deg)";
        mask_div.style.MozTransform = "rotate(-" + newSettings.watermark_angle + "deg)";
        mask_div.style.msTransform = "rotate(-" + newSettings.watermark_angle + "deg)";
        mask_div.style.OTransform = "rotate(-" + newSettings.watermark_angle + "deg)";
        mask_div.style.transform = "rotate(-" + newSettings.watermark_angle + "deg)";
        mask_div.style.visibility = "";
        mask_div.style.position = "absolute";
        /* 选不中 */
        mask_div.style.left = x + 'px';
        mask_div.style.top = y + 'px';
        mask_div.style.overflow = "hidden";
        mask_div.style.zIndex = "9999999";
        mask_div.style.opacity = newSettings.watermark_alpha;
        mask_div.style.fontSize = newSettings.watermark_fontsize;
        mask_div.style.fontFamily = newSettings.watermark_font;
        mask_div.style.color = newSettings.watermark_color;
        mask_div.style.textAlign = "center";
        mask_div.style.width = newSettings.watermark_width + 'px';
        mask_div.style.height = newSettings.watermark_height + 'px';
        mask_div.style.display = "block";
        mask_div.style['-ms-user-select'] = "none";
        /* 设置水印相关属性end */
        shadowRoot.appendChild(mask_div);
      }
    }

    // monitor 是否监控， true: 不可删除水印; false: 可删水印。
    const minotor = newSettings.monitor;
    if (minotor && hasObserver) {
      this.watermarkDom.observe(watermark_hook_element, option);
      this.watermarkDom.observe(document.getElementById(newSettings.watermark_id).shadowRoot, option);
    }
  }
}

export default Watermark;
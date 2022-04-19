import { defaultSettings as defaultSetting } from './constant'

export function loadMark (settings) {

  let defaultSettings = Object.assign({}, defaultSetting, settings)

  /*如果元素存在则移除*/
  var watermark_element = document.getElementById(defaultSettings.watermark_id);
  watermark_element && watermark_element.parentNode && watermark_element.parentNode.removeChild(watermark_element);

  /*如果设置水印挂载的父元素的id*/
  var watermark_parent_element = document.getElementById(defaultSettings.watermark_parent_node);
  var watermark_hook_element = watermark_parent_element ? watermark_parent_element : document.body;

  /*获取页面宽度*/
  // var page_width = Math.max(watermark_hook_element.scrollWidth,watermark_hook_element.clientWidth) - defaultSettings.watermark_width/2;
  var page_width = Math.max(watermark_hook_element.scrollWidth, watermark_hook_element.clientWidth);
  /*获取页面最大长度*/
  // var page_height = Math.max(watermark_hook_element.scrollHeight,watermark_hook_element.clientHeight,document.documentElement.clientHeight)-defaultSettings.watermark_height/2;
  var page_height = Math.max(watermark_hook_element.scrollHeight, watermark_hook_element.clientHeight);

  var setting = arguments[0] || {};
  var parentEle = watermark_hook_element;

  var page_offsetTop = 0;
  var page_offsetLeft = 0;
  if (setting.watermark_parent_width || setting.watermark_parent_height) {
    /*指定父元素同时指定了宽或高*/
    if (parentEle) {
      page_offsetTop = parentEle.offsetTop || 0;
      page_offsetLeft = parentEle.offsetLeft || 0;
      defaultSettings.watermark_x = defaultSettings.watermark_x + page_offsetLeft;
      defaultSettings.watermark_y = defaultSettings.watermark_y + page_offsetTop;
    }
  } else {
    if (parentEle) {
      page_offsetTop = parentEle.offsetTop || 0;
      page_offsetLeft = parentEle.offsetLeft || 0;
    }
  }

  /*创建水印外壳div*/
  var otdiv = document.getElementById(defaultSettings.watermark_id);
  var shadowRoot = null;

  if (!otdiv) {
    otdiv = document.createElement('div');
    /*创建shadow dom*/
    otdiv.id = defaultSettings.watermark_id;
    otdiv.setAttribute('style', 'pointer-events: none !important; display: block !important');
    /*判断浏览器是否支持attachShadow方法*/
    if (typeof otdiv.attachShadow === 'function') {
      /* createShadowRoot Deprecated. Not for use in new websites. Use attachShadow*/
      shadowRoot = otdiv.attachShadow({ mode: 'open' });
    } else {
      shadowRoot = otdiv;
    }
    /*将shadow dom随机插入body内的任意位置*/
    var nodeList = watermark_hook_element.children;
    var index = Math.floor(Math.random() * (nodeList.length - 1));
    if (nodeList[index]) {
      watermark_hook_element.insertBefore(otdiv, nodeList[index]);
    } else {
      watermark_hook_element.appendChild(otdiv);
    }
  } else if (otdiv.shadowRoot) {
    shadowRoot = otdiv.shadowRoot;
  }
  /*三种情况下会重新计算水印列数和x方向水印间隔：1、水印列数设置为0，2、水印宽度大于页面宽度，3、水印宽度小于于页面宽度*/
  defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
  var temp_watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols));
  defaultSettings.watermark_x_space = temp_watermark_x_space ? defaultSettings.watermark_x_space : temp_watermark_x_space;
  var allWatermarkWidth;

  /*三种情况下会重新计算水印行数和y方向水印间隔：1、水印行数设置为0，2、水印长度大于页面长度，3、水印长度小于于页面长度*/
  defaultSettings.watermark_rows = parseInt((page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
  var temp_watermark_y_space = parseInt((page_height - defaultSettings.watermark_y - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows));
  defaultSettings.watermark_y_space = temp_watermark_y_space ? defaultSettings.watermark_y_space : temp_watermark_y_space;
  var allWatermarkHeight;

  if (watermark_parent_element) {
    allWatermarkWidth = defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1);
    allWatermarkHeight = defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1);
  } else {
    allWatermarkWidth = page_offsetLeft + defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1);
    allWatermarkHeight = page_offsetTop + defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1);
  }

  var x;
  var y;
  for (var i = 0; i < defaultSettings.watermark_rows; i++) {
    if (watermark_parent_element) {
      y = page_offsetTop + defaultSettings.watermark_y + (page_height - allWatermarkHeight) / 2 + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
    } else {
      y = defaultSettings.watermark_y + (page_height - allWatermarkHeight) / 2 + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
    }
    for (var j = 0; j < defaultSettings.watermark_cols; j++) {
      if (watermark_parent_element) {
        x = page_offsetLeft + defaultSettings.watermark_x + (page_width - allWatermarkWidth) / 2 + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
      } else {
        x = defaultSettings.watermark_x + (page_width - allWatermarkWidth) / 2 + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;
      }
      var mask_div = document.createElement('div');
      var oText = document.createTextNode(defaultSettings.watermark_txt);
      mask_div.appendChild(oText);
      /*设置水印相关属性start*/
      mask_div.id = defaultSettings.watermark_prefix + i + j;
      /*设置水印div倾斜显示*/
      mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
      mask_div.style.visibility = "";
      mask_div.style.position = "absolute";
      /*选不中*/
      mask_div.style.left = x + 'px';
      mask_div.style.top = y + 'px';
      mask_div.style.overflow = "hidden";
      mask_div.style.zIndex = "9999999";
      mask_div.style.opacity = defaultSettings.watermark_alpha;
      mask_div.style.fontSize = defaultSettings.watermark_fontsize;
      mask_div.style.fontFamily = defaultSettings.watermark_font;
      mask_div.style.color = defaultSettings.watermark_color;
      mask_div.style.textAlign = "center";
      mask_div.style.width = defaultSettings.watermark_width + 'px';
      mask_div.style.height = defaultSettings.watermark_height + 'px';
      mask_div.style.display = "block";
      mask_div.style['-ms-user-select'] = "none";
      /*设置水印相关属性end*/
      shadowRoot.appendChild(mask_div);
    }
  }

  // monitor 是否监控， true: 不可删除水印; false: 可删水印。
  var minotor = settings.monitor === undefined ? defaultSettings.monitor : settings.monitor;
  if (minotor && hasObserver) {
    watermarkDom.observe(watermark_hook_element, option);
    watermarkDom.observe(document.getElementById(defaultSettings.watermark_id).shadowRoot, option);
  }
}
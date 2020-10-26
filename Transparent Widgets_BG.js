// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-brown; icon-glyph: magic;

// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: image;

// This widget was created by Max Zeryck @mzeryck

// Widgets are unique based on the name of the script.
const filename = Script.name() + ".jpg";
const files = FileManager.local();
const path = files.joinPath(files.documentsDirectory(), filename);

if (config.runsInWidget) {
  let widget = new ListWidget();
  widget.backgroundImage = files.readImage(path);

  // You can your own code here to add additional items to the "invisible" background of the widget.

  Script.setWidget(widget);
  Script.complete();

  /*
   * The code below this comment is used to set up the invisible widget.
   * ===================================================================
   */
} else {
  // Determine if user has taken the screenshot.
  var message;
  message =
  "以下是【透明背景】生成步骤，如果你没有屏幕截图请退出，并返回主屏幕长按进入编辑模式。滑动到最右边的空白页截图。然后重新运行！";
  let exitOptions = ["继续(已有截图)", "退出(没有截图)"];
  let shouldExit = await generateAlert(message, exitOptions);
  if (shouldExit) return;

  // Get screenshot and determine phone size.
  let img = await Photos.fromLibrary();
  let height = img.size.height;
  let phone = phoneSizes()[height];
  if (!phone) {
    message = "您似乎选择了非iPhone屏幕截图的图像，或者不支持您的iPhone。请使用其他图像再试一次!";
    await generateAlert(message, ["好的！我现在去截图"]);
    return;
  }

  // Prompt for widget size and position.
  message = "您想要创建什么尺寸的小部件？";
  let sizes = ["小号", "中号", "大号"];
  let size = await generateAlert(message, sizes);
  let widgetSize = sizes[size];

  message = "您想它在什么位置？";
  message += height == 1136 ? " (请注意，您的设备仅支持两行小部件，因此中间和底部选项相同。)" : "";

  // Determine image crop based on phone size.
  let crop = { w: "", h: "", x: "", y: "" };
  if (widgetSize == "小号") {
    crop.w = phone.小号;
    crop.h = phone.小号;
    let positions = ["顶部 左边", "顶部 右边", "中间 左边", "中间 右边", "底部 左边", "底部 右边"];
    let position = await generateAlert(message, positions);

    // Convert the two words into two keys for the phone size dictionary.
    let keys = positions[position].toLowerCase().split(" ");
    crop.y = phone[keys[0]];
    crop.x = phone[keys[1]];
  } else if (widgetSize == "中号") {
    crop.w = phone.中号;
    crop.h = phone.小号;

    // Medium and large widgets have a fixed x-value.
    crop.x = phone.左边;
    let positions = ["顶部", "中间", "底部"];
    let position = await generateAlert(message, positions);
    let key = positions[position].toLowerCase();
    crop.y = phone[key];
  } else if (widgetSize == "大号") {
    crop.w = phone.中号;
    crop.h = phone.大号;
    crop.x = phone.左边;
    let positions = ["顶部", "底部"];
    let position = await generateAlert(message, positions);

    // Large widgets at the bottom have the "middle" y-value.
    crop.y = position ? phone.中间 : phone.顶部;
  }

  // Crop image and finalize the widget.
  let imgCrop = cropImage(img, new Rect(crop.x, crop.y, crop.w, crop.h));

  message = "您的小部件背景已准备就绪。您想在Scriptable的小部件中使用它还是导出图像？";
  const exportPhotoOptions = ["在小部件中使用", "导出到相册"];
  const exportPhoto = await generateAlert(message, exportPhotoOptions);

  if (exportPhoto) {
    Photos.save(imgCrop);
  } else {
    files.writeImage(path, imgCrop);
  }

  Script.complete();
}

// Generate an alert with the provided array of options.
async function generateAlert(message, options) {
  let alert = new Alert();
  alert.message = message;

  for (const option of options) {
    alert.addAction(option);
  }

  let response = await alert.presentAlert();
  return response;
}

// Crop an image into the specified rect.
function cropImage(img, rect) {
  let draw = new DrawContext();
  draw.size = new Size(rect.width, rect.height);

  draw.drawImageAtPoint(img, new Point(-rect.x, -rect.y));
  return draw.getImage();
}

// Pixel sizes and positions for widgets on all supported phones.
function phoneSizes() {
  let phones = {
    // 11 Pro Max,Xs Max
    2688: {
      小号: 507,
      中号: 1080,
      大号: 1137,
      左边: 81,
      右边: 654,
      顶部: 228,
      中间: 858,
      底部: 1488,
    },
    // 11,XR
    1792: {
      小号: 338,
      中号: 720,
      大号: 758,
      左边: 54,
      右边: 436,
      顶部: 160,
      中间: 580,
      底部: 1000,
    },
    // 11 Pro,Xs,X
    2436: {
      小号: 465,
      中号: 987,
      大号: 1035,
      左边: 69,
      右边: 591,
      顶部: 213,
      中间: 783,
      底部: 1353,
    },
    // Plus Phones
    2208: {
      小号: 471,
      中号: 1044,
      大号: 1071,
      左边: 99,
      右边: 672,
      顶部: 114,
      中间: 696,
      底部: 1278,
    },
    //SE2 and 6/6s/7/8
    1334: {
      小号: 296,
      中号: 642,
      大号: 648,
      左边: 54,
      右边: 400,
      顶部: 60,
      中间: 412,
      底部: 764,
    },
    //SE1
    1136: {
      小号: 282,
      中号: 584,
      大号: 622,
      左边: 30,
      右边: 332,
      顶部: 59,
      中间: 399,
      底部: 399,
    },
    // 12 and 12 Pro
    2532: {
      小号: 474,
      中号: 1014,
      大号: 1062,
      左边: 78,
      右边: 618,
      顶部: 231,
      中间: 819,
      底部: 1407,
    },
    // 12 Mini
    2340: {
      小号: 436,
      中号: 936,
      大号: 980,
      左边: 72,
      右边: 570,
      顶部: 212,
      中间: 756,
      底部: 1300,
    },
    // 12 Pro max
    2778: {
      小号: 518,
      中号: 1114,
      大号: 1162,
      左边: 86,
      右边: 678,
      顶部: 252,
      中间: 898,
      底部: 1544,
    },
    // 11 and XR in Display Zoom mode
    1624: {
      小号: 310,
      中号: 658,
      大号: 690,
      左边: 46,
      右边: 394,
      顶部: 142,
      中间: 522,
      底部: 902,
    },
    //Plus in Display Zoom mode
    2001: {
      小号: 444,
      中号: 963,
      大号: 972,
      左边: 81,
      右边: 600,
      顶部: 90,
      中间: 618,
      底部: 1146,
    },
    // iPad Air 4
    2360: {
      小号: 310,
      中号: 658,
      大号: 658,
      左边: 132,
      右边: 480,
      顶部: 160,
      中间: 508,
      底部: 856,
    },



  };
  return phones;
}

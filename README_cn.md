# Weather Cal

这是一个Scriptable的小部件，可让您显示和设置多个格式的元素，包括【日期】【问候语】【日程事件】，【当前天气】【未来天气】【日出/落时间】和【电池电量】。您甚至可以通过编写一个具有单个WidgetStack作为参数的函数（representing a column）来创建自己要显示的元素。

## 如何设置

在开始之前，您可能需要对`weather-cal.js`文件进行一些编辑。您可以在计算机上进行编辑并转移到iOS，也可以仅在Scriptable中进行编辑。

1. 到[free OpenWeather API key](http://openweathermap.org/api)注册一个账号，获得API key，然后粘贴到 `apiKey = ""`的引号内，请注意，这个API可能需要一段时间才生效！
2. 基础设置：编辑`weather-cal.js`的【小部件设置】部分来进行一些基础设置（注意看注释）
3. 运行脚本。它会提示您输入您的位置和背景图片（如果启用）。最后，它会在Scriptable中显示预览。
4. 在桌面上添加Scriptable的Widget，长按选择`weather-cal`即可。

如果你需要在这个小部件脚本上使用透明背景，请先使用这个 [Transparent Widgets.js](https://github.com/xkerwin/Weather-Cal/blob/main/Transparent%20Widgets%20Export.js)来制作，在最后，选择导出到相册，然后再次运行`weather-cal`选择刚刚制作好的背景图即可

关于其他调整与设置，参见：FAQ

## 布局调整

要进行布局，请找到` LAYOUT`部分的标题。您将看到两个带有项目列表的区域：一个用于左列，一个用于右列。您可以在每个列表中添加和删除项目。不要更改此区域中其他部分的代码（列宽除外）。并且，请确保每个项目都以逗号(英文符号)结尾，如下所示：

```
left,
greeting,
date,

right,
space,
events,
```

添加对齐方式（如` left`，` right`或` center`）会将对齐方式应用于这个列下的所有内容。添加`space`将添加一个空间，该空间会自动扩展以填充小部件中的可用空间。此空间上方的所有内容都将与顶部对齐，此空间下方的所有内容都将与底部对齐。

## 细节说明

`LAYOUT`部分包含一个对象数组，每个对象代表窗口小部件中的一列。默认情况下，“列”数组中有两列-但是可以根据需要添加或删除列。用户可以通过在每列的“项目”数组中添加和删除项目来决定每列中将显示的内容。

运行时，脚本会创建一个WidgetStack，并为每列提供宽度。然后，它会寻找各列的“ items”数组。每个项目都是一个函数，因此脚本调用该函数并传递代表当前列的WidgetStack作为参数。由于大多数窗口小部件项目都需要执行异步工作，因此脚本在调用函数时会使用“ await”表达式

### 如何创建一个小部件项目

如果要创建自己的窗口小部件项目，请参考以下必需/可选元素：

* __必需条件__：具有小部件项目名称的函数，例如：`function date（column）`。函数的名称是用户在“ LAYOUT”部分中输入的名称。该函数需要有一个“ column”参数，代表该函数将向其添加元素的WidgetStack。最好将此功能设为`async`功能，因为大多数小部件项目都需要执行异步工作。
* __遵从条件:__ 如果小部件项目需要显示文本，则应使用`formatText`函数以及`textFormat`对象中的值。如果你愿意，可以使用现有值，也可以增加其他值
* __遵从条件:__ 如果小部件项目需要显示诸如标签之类的预定义字符串，则必须在`localizedText`对象中定义它们。这可以让用户轻松地将文本翻译成他们喜欢的语言

* __可选条件:__ 允许用户选择窗口小部件项目的显示方式来设置对象。使用标题注释和解释每个设置或设置组的注释来匹配` ITEM SETTINGS`部分中的现有格式。经过深思熟虑且功能强大的设置当然是最好的。
* __可选条件:__ A variable for storing structured data that your item needs. The name should be one word followed by “Data”. For example: `weatherData`. Declare it alongside the other data variables (`eventData`, `locationData`, etc). Make sure there isn’t an existing data variable that has the information needed for your item.
* 用于存储项目所需的结构化数据的变量。名称应为一个单词，后接`Data`。例如：`weatherData`。与其他数据变量（`eventData`，`locationData`等）一起声明。确保没有重复于现有的数据变量包含项所需的信息。
* __遵从条件:__ If a widget item uses a data variable, a setup function is required. The name should be “setup” followed by one word. For example: `setupWeather`. If you’re using a setup function, the item function should check to see if the data is null, and run the setup function if it is. For example: `if (!weatherData) { await setupWeather() }`. This allows other widget items to use the provided data if needed. For example, the `current` and `future` weather items both use `weatherData`, so they both check this variable and run the setup if needed.
* 如果小部件项目使用数据变量，则需要设置功能。名称应为` setup`，后接一个单词。例如：`setupWeather`。如果您使用的是设置功能，则项目函数应检查数据是否为空，如果是，则运行设置功能。例如：`if (!weatherData) { await setupWeather() }`。如果需要，这是允许其他窗口小部件项目使用提供的数据。例如，`current`和`future`天气项目都使用` weatherData`，因此它们都检查此变量并在需要时运行该设置。
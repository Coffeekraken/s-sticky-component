# SStickyComponent

Extends **SWebComponent**

Stick any items with ease inside his container or depending on a totaly different element with full control over the display


### Example
```html
	<div style="height:200vw; background:rgba(255,0,0,.2); margin:40px 0;">
<s-sticky id="red" style="padding:10px; background:white; margin:10px">
	Hello red sticky element
</s-sticky>
<div style="position:absolute; top:30%; left:50%; right:0; height:400px; background:rgba(0,0,255,.2)">
	<s-sticky>
		Hello violet sticky element
	</s-sticky>
</div>
</div>
<div style="height:200vw; background:rgba(0,255,0,.2); margin:40px 0;">
<s-sticky>
	Hello green sticky element
</s-sticky>
</div>
```
Author : Olivier Bossel <olivier.bossel@gmail.com> *




## Attributes

Here's the list of available attribute to set on the element.

### topElm

Specify the top element to use as boundary

Type : **{ Element }**

Default : **null**


### bottomElm

Specify the bottom element to use as boundary

Type : **{ Element }**

Default : **null**


### offsetTop

An offset top that will be applied when sticked

Type : **{ number }**

Default : **0**


### offsetBottom

An offset bottom that will be applied when sticked

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **0**


### disabled

A boolean or a function that return if the sitcky effect is disabled

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) , [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **false**


### offsetTopDetection

A number that specify the offset top before triggering the sticky

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **null**


### placeholder

Specify if a ghost placeholder has to replace the sticked element into the DOM

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**


### updateEvery

Specify the number of scroll event to wait before update the references and sizes

Type : **{ Integer }**

Default : **5**


### resizeTimeout

How long to wait after a window resize before updating sizes etc...

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**



## Properties


### this._updateCounter

Update counter to update the sizes, offsets, etc not at each scroll event

Type : **{ Integer }**


### this._resetTimeout

Store the reset timeout to be able to clear it when needed

Type : **{ Timeout }**


### this._elmHeight

Store the sticked element height

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**


### this._elmWidth

Store the element width to apply it when position is fixed, etc...

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**


### this._topElm

Store the reference to the element used as top boundary

Type : **{ Element }**


### this._bottomElm

Store the reference to the element used as bottom boundary

Type : **{ Element }**


## Methods


### defaultProps

Default props

**Static**


### defaultCss

Default css

**Static**


### componentWillMount

Component will mount


### componentMount

Mount component


### reset

Reset


### isSticked

Check if is sticked
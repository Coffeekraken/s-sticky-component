'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require('coffeekraken-sugar/js/core/SWebComponent');

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

var _scrollTop = require('coffeekraken-sugar/js/dom/scrollTop');

var _scrollTop2 = _interopRequireDefault(_scrollTop);

var _offset = require('coffeekraken-sugar/js/dom/offset');

var _offset2 = _interopRequireDefault(_offset);

var _getAnimationProperties = require('coffeekraken-sugar/js/dom/getAnimationProperties');

var _getAnimationProperties2 = _interopRequireDefault(_getAnimationProperties);

var _getStyleProperty = require('coffeekraken-sugar/js/dom/getStyleProperty');

var _getStyleProperty2 = _interopRequireDefault(_getStyleProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @name  		SStickyComponent
 * @extends 	SWebComponent
 * Stick any items with ease inside his container or depending on a totaly different element with full control over the display
 *
 * @example 	html
 * <div style="height:200vw; background:rgba(255,0,0,.2); margin:40px 0;">
 *	<s-sticky id="red" style="padding:10px; background:white; margin:10px">
 *		Hello red sticky element
 *	</s-sticky>
 *	<div style="position:absolute; top:30%; left:50%; right:0; height:400px; background:rgba(0,0,255,.2)">
 *		<s-sticky>
 *			Hello violet sticky element
 *		</s-sticky>
 *	</div>
 * </div>
 * <div style="height:200vw; background:rgba(0,255,0,.2); margin:40px 0;">
 *	<s-sticky>
 *		Hello green sticky element
 *	</s-sticky>
 * </div>
 *
 * @author 		Olivier Bossel <olivier.bossel@gmail.com> *
 */
var SStickyComponent = function (_SWebComponent) {
	_inherits(SStickyComponent, _SWebComponent);

	function SStickyComponent() {
		_classCallCheck(this, SStickyComponent);

		return _possibleConstructorReturn(this, (SStickyComponent.__proto__ || Object.getPrototypeOf(SStickyComponent)).apply(this, arguments));
	}

	_createClass(SStickyComponent, [{
		key: 'componentWillMount',


		/**
   * Component will mount
   * @definition 		SWebComponent.componentWillMount
   */
		value: function componentWillMount() {
			_get(SStickyComponent.prototype.__proto__ || Object.getPrototypeOf(SStickyComponent.prototype), 'componentWillMount', this).call(this);

			/**
    * Update counter to update the sizes, offsets, etc not at each scroll event
    * @type 	{Integer}
    */
			this._updateCounter = 0;

			/**
    * Store the reset timeout to be able to clear it when needed
    * @type 	{Timeout}
    */
			this._resetTimeout = null;

			/**
    * Store the sticked element height
    * @type 	{Number}
    */
			this._elmHeight = 0;

			/**
    * Store the element width to apply it when position is fixed, etc...
    * @type 	{Number}
    */
			this._elmWidth = 0;

			/**
    * Store the reference to the element used as top boundary
    * @type 	{Element}
    */
			this._topElm = null;

			/**
    * Store the reference to the element used as bottom boundary
    * @type 	{Element}
    */
			this._bottomElm = null;
		}

		/**
   * Mount component
   * @definition 		SWebComponent.componentMount
   */

	}, {
		key: 'componentMount',
		value: function componentMount() {
			_get(SStickyComponent.prototype.__proto__ || Object.getPrototypeOf(SStickyComponent.prototype), 'componentMount', this).call(this);

			// save initial element setup
			this._basePosition = this.style.position;
			this._baseWidth = parseInt(this.offsetWidth);
			this._baseTop = parseInt(this.style.top) || 0;
			this._baseHeight = parseInt(this.offsetHeight);

			// get top element
			this._topElm = this.parentNode;
			if (typeof this.props.topElm === 'string') {
				this._topElm = document.querySelector(this.props.topElm);
			} else if (this.props.topElm instanceof HTMLElement) {
				this._topElm = this.props.topElm;
			}
			this._bottomElm = this.parentNode;
			if (typeof this.props.bottomElm === 'string') {
				this._bottomElm = document.querySelector(this.props.bottomElm);
			} else if (this.props.bottomElm instanceof HTMLElement) {
				this._bottomElm = this.props.bottomElm;
			}

			// get margins
			this._margins = {
				top: parseFloat((0, _getStyleProperty2.default)(this, 'margin-top')) || 0,
				right: parseFloat((0, _getStyleProperty2.default)(this, 'margin-right')) || 0,
				bottom: parseFloat((0, _getStyleProperty2.default)(this, 'margin-bottom')) || 0,
				left: parseFloat((0, _getStyleProperty2.default)(this, 'margin-left')) || 0
			};

			// make sure the parent element has a position defined, otherwise, set the position as relative
			var topElmPosition = (0, _getStyleProperty2.default)(this._topElm, 'position');
			if (topElmPosition !== 'absolute' && topElmPosition !== 'relative') {
				this._topElm.style.position = 'relative';
			}
			if (this._topElm !== this._bottomElm) {
				var bottomElmPosition = (0, _getStyleProperty2.default)(this._bottomElm, 'position');
				if (bottomElmPosition !== 'absolute' && bottomElmPosition !== 'relative') {
					this._bottomElm.style.position = 'relative';
				}
			}

			// listen for scroll
			window.addEventListener('scroll', this._onScroll.bind(this));

			// listen for resize
			window.addEventListener('resize', this._onResize.bind(this));

			// first call of onScroll
			this._onScroll(null);
		}

		/**
   * On scroll
   */

	}, {
		key: '_onScroll',
		value: function _onScroll(e) {
			// handle disabled
			if (this.props.disabled === true) {
				if (this.isSticked()) this.reset();
				return;
			};
			if (typeof this.props.disabled === 'function' && this.props.disabled(this)) {
				if (this.isSticked()) this.reset();
				return;
			}

			// calculate the detect offset
			var offsetTopDetection = this.props.offsetTopDetection || this.props.offsetTop;
			if (typeof this.props.offsetTopDetection === 'function') {
				offsetTopDetection = this.props.offsetTopDetection(this);
			}
			offsetTopDetection = parseInt(offsetTopDetection);

			// manage recalc
			this._updateCounter -= 1;
			if (this._updateCounter <= 0) {
				this._update();
			}

			// scrollTop
			var scrollTop = (0, _scrollTop2.default)() + offsetTopDetection;
			if (scrollTop - offsetTopDetection > this.boundary.bottom - this._elmHeight - (this.props.offsetTop + this.props.offsetBottom + this._margins.top + this._margins.bottom)) {
				// update needReset status
				this.needReset = true;
				// clear the _resetTimeout
				clearTimeout(this._resetTimeout);
				// the element need to be sticked on top of the window
				if (this._basePosition === 'fixed') {
					this.style.top = this.boundary.bottom - scrollTop - this._elmHeight - this.props.offsetBottom + this._baseTop;
				} else {
					var bottom = this.props.offsetBottom;
					if (this.parentNode) {
						bottom += parseFloat((0, _getStyleProperty2.default)(this.parentNode, 'padding-bottom'));
					}

					this.style.position = 'absolute';
					this.style.bottom = bottom + 'px';
					this.style.top = 'auto';
					this.addComponentClass(this, null, null, 'sticked');
				}
				// handle placeholder if needed
				if (this.props.placeholder) {
					this._addPlaceholder();
				}
				// if is an id, add this to the body for styling
				if (this.id) {
					var bodyClass = this.componentNameDash + '-' + this.id;
					if (this.ownerDocument.body.classList.contains(bodyClass)) {
						this.ownerDocument.body.classList.remove(bodyClass);
					}
				}
				// add dirty class
				this.addComponentClass(this, null, null, 'dirty');
			} else if (scrollTop + this._margins.top > this.boundary.top) {
				// update needReset status
				this.needReset = true;
				// clear the _resetTimeout
				clearTimeout(this._resetTimeout);
				// the element need to be sticked on bottom of the
				// relative element
				this.style.position = 'fixed';
				this.style.top = this.props.offsetTop + 'px';
				this.style.bottom = 'auto';
				this.style.width = this._elmWidth + 'px';
				this.addComponentClass(this, null, null, 'sticked');
				// handle placeholder if needed
				if (this.props.placeholder) {
					this._addPlaceholder();
				}
				// if is an id, add this to the body for styling
				if (this.id) {
					var _bodyClass = this.componentNameDash + '-' + this.id;
					if (!this.ownerDocument.body.classList.contains(_bodyClass)) {
						this.ownerDocument.body.classList.add(_bodyClass);
					}
				}
				// add dirty class
				this.addComponentClass(this, null, null, 'dirty');
			} else {
				// no more sticked
				this.reset();
			}
		}

		/**
   * On resize
   */

	}, {
		key: '_onResize',
		value: function _onResize(e) {
			var _this2 = this;

			clearTimeout(this.resizeTimeout);
			this.resizeTimeout = setTimeout(function () {
				// update
				_this2._update();
			}, this.props.resizeTimeout);
		}

		/**
   * Add placeholder
   */

	}, {
		key: '_addPlaceholder',
		value: function _addPlaceholder() {
			var _this3 = this;

			// create if needed
			if (!this.placeholderElm) {
				this.placeholderElm = document.createElement('div');
				this.addComponentClass(this.placeholderElm, 'placeholder');
			}
			this.placeholderElm.style.width = this._elmWidth + 'px';
			this.placeholderElm.style.height = this._baseHeight + 'px';
			this.placeholderElm.style.marginTop = this._margins.top;
			this.placeholderElm.style.marginRight = this._margins.right;
			this.placeholderElm.style.marginBottom = this._margins.bottom;
			this.placeholderElm.style.marginLeft = this._margins.left;

			// add the placeholder into the dom
			if (!this.placeholderElm.parentNode) {
				this.mutate(function () {
					_this3.parentNode.insertBefore(_this3.placeholderElm, _this3);
				});
			}
		}

		/**
   * Update sizes, etc...
   */

	}, {
		key: '_update',
		value: function _update() {

			// bottom
			var bottom = this.props.bottom;
			if (typeof this.props.bottom !== 'number') {
				bottom = (0, _offset2.default)(this._bottomElm).top + this._bottomElm.offsetHeight;
				if (this.parentNode) {
					bottom -= parseFloat((0, _getStyleProperty2.default)(this.parentNode, 'padding-bottom'));
				}
			}

			// top
			var top = this.props.top;
			if (typeof this.props.top !== 'number') {
				top = (0, _offset2.default)(this._topElm).top;
				if (this.parentNode) {
					top += parseFloat((0, _getStyleProperty2.default)(this.parentNode, 'padding-top'));
				}
			}

			// calculate boundaries
			this.boundary = {
				top: top,
				bottom: bottom
			};

			// element height
			if (!this.props.height) {
				this._elmHeight = this.offsetHeight;
			} else if (typeof this.props.height === 'string') {
				this._elmHeight = document.querySelector(this.props.height).offsetHeight;
			} else if (typeof this.props.height === 'number') {
				this._elmHeight = this.props.height;
			}

			// element width
			if (!this.props.width) {
				if (this.isSticked()) {
					if (this.placeholderElm) {
						this._elmWidth = this.placeholderElm.offsetWidth;
					} else {
						this._elmWidth = this._baseWidth;
					}
				} else {
					this._elmWidth = this.offsetWidth;
				}
			} else if (typeof this.props.width === 'string') {
				this._elmWidth = document.querySelector(this.props.width).offsetWidth;
			} else if (typeof this.props.width === 'number') {
				this._elmWidth = this.props.width;
			}

			if (!this.isSticked()) {
				this.style.width = null;
			} else {
				// set element width
				this.style.width = this._elmWidth + 'px';
			}

			// reset update counter
			this._updateCounter = this.props.updateEvery;
		}

		/**
   * Reset
   */

	}, {
		key: 'reset',
		value: function reset() {
			var _this4 = this;

			if (!this.needReset) return;
			this.needReset = false;

			// if is an id, add this to the body for styling
			if (this.id) {
				var bodyClass = this.componentNameDash + '-' + this.id;
				if (this.ownerDocument.body.classList.contains(bodyClass)) {
					this.ownerDocument.body.classList.remove(bodyClass);
				}
			}

			// add the out class
			this.addComponentClass(this, null, null, 'out');

			// get animation properties to wait if needed
			setTimeout(function () {
				var animationProperties = (0, _getAnimationProperties2.default)(_this4);

				clearTimeout(_this4._resetTimeout);
				_this4._resetTimeout = setTimeout(function () {

					// reset the element style
					_this4.style.position = '';
					_this4.style.top = '';
					_this4.style.bottom = '';
					_this4.style.width = '';

					// remove the placeholder if exist
					if (_this4.placeholderElm && _this4.placeholderElm.parentNode) {
						_this4.placeholderElm.parentNode.removeChild(_this4.placeholderElm);
					}

					// remove the out class
					_this4.removeComponentClass(_this4, null, null, 'out');
					// remove the sticked class
					_this4.removeComponentClass(_this4, null, null, 'sticked');
				}, animationProperties.totalDuration);
			});
		}

		/**
   * Check if is sticked
   */

	}, {
		key: 'isSticked',
		value: function isSticked() {
			return this.hasComponentClass(this, null, null, 'sticked');
		}
	}], [{
		key: 'defaultCss',


		/**
   * Default css
   * @definition 		SWebComponent.defaultCss
   */
		value: function defaultCss(componentName, componentNameDash) {
			return '\n\t\t\t' + componentNameDash + ' {\n\t\t\t\tdisplay: block;\n\t\t\t}\n\t\t';
		}
	}, {
		key: 'defaultProps',


		/**
   * Default props
   * @definition 		SWebComponent.defaultProps
   */
		get: function get() {
			return {
				/**
     * Specify the top element to use as boundary
     * @prop
     * @type 	{Element}
     */
				topElm: null,

				/**
     * Specify the bottom element to use as boundary
     * @prop
     * @type 	{Element}
     */
				bottomElm: null,

				/**
     * An offset top that will be applied when sticked
     * @prop
     * @type 	{number}
     */
				offsetTop: 0,

				/**
     * An offset bottom that will be applied when sticked
     * @prop
     * @type 	{Number}
     */
				offsetBottom: 0,

				/**
     * A boolean or a function that return if the sitcky effect is disabled
     * @prop
     * @type 	{Boolean|Function}
     */
				disabled: false,

				/**
     * A number that specify the offset top before triggering the sticky
     * @prop
     * @type 	{Number}
     */
				offsetTopDetection: null,

				/**
     * Specify if a ghost placeholder has to replace the sticked element into the DOM
     * @prop
     * in order to keep the same scroll height
     * @type 	{Boolean}
     */
				placeholder: true,

				/**
     * Specify the number of scroll event to wait before update the references and sizes
     * @prop
     * @type 	{Integer}
     */
				updateEvery: 5,

				/**
     * How long to wait after a window resize before updating sizes etc...
     * @prop
     * @type 	{Number}
     */
				resizeTimeout: 50
			};
		}
	}]);

	return SStickyComponent;
}(_SWebComponent3.default);

exports.default = SStickyComponent;
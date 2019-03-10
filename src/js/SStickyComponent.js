import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import __scrollTop from 'coffeekraken-sugar/js/dom/scrollTop'
import __offset from 'coffeekraken-sugar/js/dom/offset'
import __getAnimationProperties from 'coffeekraken-sugar/js/dom/getAnimationProperties'
import __getStyleProperty from 'coffeekraken-sugar/js/dom/getStyleProperty'
import __wrap from 'coffeekraken-sugar/js/dom/wrap'

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
export default class SStickyComponent extends SWebComponent {

	/**
	 * Default props
	 * @definition 		SWebComponent.defaultProps
	 */
	static get defaultProps() {
		return {
			/**
			 * Specify the top element to use as boundary
			 * @prop
			 * @type 	{Element}
			 */
			topElm : null,

			/**
			 * Specify the bottom element to use as boundary
			 * @prop
			 * @type 	{Element}
			 */
			bottomElm : null,

			/**
			 * An offset top that will be applied when sticked
			 * @prop
			 * @type 	{number}
			 */
			offsetTop : 0,

			/**
			 * An offset bottom that will be applied when sticked
			 * @prop
			 * @type 	{Number}
			 */
			offsetBottom : 0,

			/**
			 * A boolean or a function that return if the sitcky effect is disabled
			 * @prop
			 * @type 	{Boolean|Function}
			 */
			disabled : false,

			/**
			 * A number that specify the offset top before triggering the sticky
			 * @prop
			 * @type 	{Number}
			 */
			offsetTopDetection : null,

			/**
			 * Specify the number of scroll event to wait before update the references and sizes
			 * @prop
			 * @type 	{Integer}
			 */
			updateEvery : 5,

			/**
			 * How long to wait after a window resize before updating sizes etc...
			 * @prop
			 * @type 	{Number}
			 */
			resizeTimeout : 50
		}
	}

	/**
	 * Default css
	 * @definition 		SWebComponent.defaultCss
	 */
	static defaultCss(componentName, componentNameDash) {
		return `
			${componentNameDash} {
				display: block;
			}
		`;
	}

	/**
	 * Component will mount
	 * @definition 		SWebComponent.componentWillMount
	 */
	componentWillMount() {
		super.componentWillMount();

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
	componentMount() {
		super.componentMount();

		// save initial element setup
		this._basePosition = this.style.position;
		this._baseTop = parseInt(this.style.top) || 0;

		// get top element
		this._topElm = this.parentNode;
		if (typeof(this.props.topElm) === 'string') {
			this._topElm = document.querySelector(this.props.topElm);
		} else if (this.props.topElm instanceof HTMLElement) {
			this._topElm = this.props.topElm;
		}
		this._bottomElm = this.parentNode;
		if (typeof(this.props.bottomElm) === 'string') {
			this._bottomElm = document.querySelector(this.props.bottomElm);
		} else if (this.props.bottomElm instanceof HTMLElement) {
			this._bottomElm = this.props.bottomElm;
		}

		// get margins
		this._margins = {
			top : parseFloat(__getStyleProperty(this, 'margin-top')) || 0,
			right : parseFloat(__getStyleProperty(this, 'margin-right')) || 0,
			bottom : parseFloat(__getStyleProperty(this, 'margin-bottom')) || 0,
			left : parseFloat(__getStyleProperty(this, 'margin-left')) || 0
		};

		// make sure the parent element has a position defined, otherwise, set the position as relative
		const topElmPosition = __getStyleProperty(this._topElm, 'position');
		if (topElmPosition !== 'absolute' && topElmPosition !== 'relative') {
			this._topElm.style.position = 'relative';
		}
		if (this._topElm !== this._bottomElm) {
			const bottomElmPosition = __getStyleProperty(this._bottomElm, 'position');
			if (bottomElmPosition !== 'absolute' && bottomElmPosition !== 'relative') {
				this._bottomElm.style.position = 'relative';
			}
		}

		// wrap the sticky element inside a placeholder div
		// that will take the sticky place when it is sticky
		const $placeholder = document.createElement('div')
		$placeholder.classList.add(`${this.componentNameDash}__placeholder`)
		__wrap(this, $placeholder)
		this._$placeholder = $placeholder

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
	_onScroll(e) {
		// handle disabled
		if (this.props.disabled === true) {
			if (this.isSticked()) this.reset();
			return
		};
		if (typeof(this.props.disabled) === 'function'
			&& this.props.disabled(this)) {
			if (this.isSticked()) this.reset();
			return;
		}

		// calculate the detect offset
		let offsetTopDetection = this.props.offsetTopDetection || this.props.offsetTop;
		if (typeof(this.props.offsetTopDetection) === 'function') {
			offsetTopDetection = this.props.offsetTopDetection(this);
		}
		offsetTopDetection = parseInt(offsetTopDetection);

		// manage recalc
		this._updateCounter -= 1;
		if (this._updateCounter <= 0) {
			this._update();
		}

		// scrollTop
		let scrollTop = __scrollTop() + offsetTopDetection;
		if (scrollTop - offsetTopDetection > this.boundary.bottom - this._elmHeight - (this.props.offsetTop + this.props.offsetBottom + this._margins.top + this._margins.bottom)) {
			// update needReset status
			this.needReset = true;
			// clear the _resetTimeout
			clearTimeout(this._resetTimeout);
			// the element need to be sticked on top of the window
			if (this._basePosition === 'fixed') {
				this.style.top = this.boundary.bottom - scrollTop - this._elmHeight - this.props.offsetBottom + this._baseTop
			} else {
				let bottom = this.props.offsetBottom;
				if (this.parentNode) {
					bottom += parseFloat(__getStyleProperty(this.parentNode, 'padding-bottom'));
				}
				this.style.position = 'absolute';
				this.style.bottom = bottom + 'px';
				this.style.top = 'auto';
				this.style.width = this._elmWidth + 'px';
				this.addComponentClass(this, null, null, 'sticked');
			}
			// add dirty class
			this.addComponentClass(this, null, null, 'dirty');
		} else if (scrollTop + this._margins.top > this.boundary.top) {
			// update needReset status
			this.needReset = true;
			// clear the _resetTimeout
			clearTimeout(this._resetTimeout);
			// set the height of the placeholder to avoid "jumps" in scroll
			if ( ! this._$placeholder.style.height) {
				this._$placeholder.style.height = this.offsetHeight + 'px'
				this._$placeholder.style.marginTop = this._margins.top + 'px'
				this._$placeholder.style.marginBottom = this._margins.bottom + 'px'
			}
			// the element need to be sticked on bottom of the
			// relative element
			this.style.position = 'fixed';
			this.style.top = this.props.offsetTop + 'px';
			this.style.bottom = 'auto';
			this.style.width = this._elmWidth + 'px';
			// this.style.width = this._elmWidth + 'px';
			this.addComponentClass(this, null, null, 'sticked');
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
	_onResize(e) {
		clearTimeout(this.resizeTimeout);
		this.resizeTimeout = setTimeout(() => {
			// update
			this._update();
			// set the width
			if ( ! this.isSticked()) {
				this.style.width = ''
			} else {
				this.style.width = this._elmWidth + 'px'
			}
		}, this.props.resizeTimeout);
	}

	/**
	 * Update sizes, etc...
	 */
	_update() {

		// bottom
		let bottom = this.props.bottom;
		if (typeof(this.props.bottom) !== 'number') {
			bottom = __offset(this._bottomElm).top + this._bottomElm.offsetHeight;
			if (this.parentNode) {
				bottom -= parseFloat(__getStyleProperty(this.parentNode, 'padding-bottom'));
			}
		}

		// top
		let top = this.props.top;
		if (typeof(this.props.top) !== 'number') {
			top = __offset(this._topElm).top;
			if (this.parentNode) {
				top += parseFloat(__getStyleProperty(this.parentNode, 'padding-top'));
			}
		}

		// calculate boundaries
		this.boundary = {
			top,
			bottom
		};

		// element height
		if ( ! this.props.height) {
			this._elmHeight = this.offsetHeight;
		} else if (typeof(this.props.height) === 'string') {
			this._elmHeight = document.querySelector(this.props.height).offsetHeight;
		} else if (typeof(this.props.height) === 'number') {
			this._elmHeight = this.props.height;
		}

		// element width
		if ( ! this.props.width) {
			if ( ! this.isSticked()) {
				this._elmWidth = this.offsetWidth;
			} else {
				this._elmWidth = this._$placeholder.offsetWidth - this._margins.left - this._margins.right;
			}
		} else if (typeof(this.props.width) === 'string') {
			this._elmWidth = document.querySelector(this.props.width).offsetWidth;
		} else if (typeof(this.props.width) === 'number') {
			this._elmWidth = this.props.width;
		}

		// reset update counter
		this._updateCounter = this.props.updateEvery;
	}

	/**
	 * Reset
	 */
	reset() {
		if ( ! this.needReset) return;
		this.needReset = false;

		// add the out class
		this.addComponentClass(this, null, null, 'out');

		// get animation properties to wait if needed
		this.mutate(() => {
			let animationProperties = __getAnimationProperties(this);

			clearTimeout(this._resetTimeout);
			this._resetTimeout = setTimeout(() => {

				// reset the element style
				this.style.position = '';
				this.style.top = '';
				this.style.bottom = '';
				this.style.width = '';

				// reset the placeholder style
				// wait a little to avoid jump in scroll
				this.mutate(() => {
					this._$placeholder.style.height = ''
					this._$placeholder.style.marginTop = ''
					this._$placeholder.style.marginBottom = ''
				})

				// remove the out class
				this.removeComponentClass(this, null, null, 'out');
				// remove the sticked class
				this.removeComponentClass(this, null, null, 'sticked');
			}, animationProperties.totalDuration);
		});
	}

	/**
	 * Check if is sticked
	 */
	isSticked() {
		return this.hasComponentClass(this, null, null, 'sticked');
	}
}

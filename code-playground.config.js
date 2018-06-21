module.exports = {
	// server port
	port : 3000,

	// title
	title : 's-sticky-component',

	// layout
	layout : 'right',

	// compile server
	compileServer : {

		// compile server port
		port : 4000

	},

	// editors
	editors : {
		html : {
			language : 'html',
			data : `
				<h1 class="h3 m-b-small">
					Coffeekraken s-sticky-component
				</h1>
				<p class="p m-b-bigger">
					Stick any items with ease inside his container or depending on a totaly different element with full control over the display.
				</p>
				<div style="height:200vw; background:rgba(255,0,0,.2); margin:40px 0;">
					<s-sticky id="red" style="padding:10px; background:white; margin:10px">
						Hello red sticky element
					</s-sticky>
					<div style="position:absolute; top:30%; left:50%; right:0; height:400px; background:rgba(0,0,255,.2)">
						<s-sticky>
							Hello violet sticky element
						</s-sticky>
					</div>
				</div><div style="height:200vw; background:rgba(0,255,0,.2); margin:40px 0;">
					<s-sticky>
						Hello green sticky element
					</s-sticky>
				</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@import 'node_modules/coffeekraken-s-typography-component/index';
				@include s-init();
				@include s-classes();
				@include s-typography-classes();
				body {
					padding: s-space(big);
				}
			`
		},
		js : {
			language : 'js',
			data : `
				import 'webcomponents.js/webcomponents-lite'
				import SStickyComponent from './dist/index'
			`
		}
	}
}

var $ = function(s) {
	return document.querySelector(s);
};

var Wireframer = function() {
	var canvas, ctx;
	var dotsSize,
		dotsSpacing,
		dotsColor,
		lineWidth,
		lineColor;

	var pi2 = Math.PI * 2;

	var entities = [];

	var isMouseDown = false;

	var Entity = function() {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
	};

	this.clear = function() {
		entities = [];
		render();
	};
	this.undo = function() {
		entities.pop();
		render();
	};

	this.init = function(el_canvas) {
		canvas = el_canvas;
		ctx = canvas.getContext('2d');

		// set canvas size
		canvas.width = parseInt($('#num_width').value);
		canvas.height = parseInt($('#num_height').value);

		// set other values
		dotsSize = parseInt($('#num_dotSize').value);
		dotsSpacing = parseInt($('#num_dotSpacing').value);
		lineWidth = parseInt($('#num_lineWidth').value);
		dotsColor = $('#col_dotColor').value;


		// hack to make canvas eventlistener-able
		canvas.tabIndex = 0;
		canvas.focus();

		// add event listeners
		canvas.addEventListener('mousedown', function(e) {
			// Ignore non left-clicks
			if (e.button !== 0) return;
			entities.push(new Entity());
			entities.slice(-1)[0].x = (Math.round((e.offsetX || e.layerX) / dotsSpacing) * dotsSpacing) / dotsSpacing;
			entities.slice(-1)[0].y = (Math.round((e.offsetY || e.layerY) / dotsSpacing) * dotsSpacing) / dotsSpacing;
			isMouseDown = true;

			render();
		}.bind(this));
		canvas.addEventListener('mousemove', function(e) {
			if (isMouseDown) {
				entities.slice(-1)[0].width = (Math.round((e.offsetX || e.layerX) / dotsSpacing) - entities.slice(-1)[0].x);
				entities.slice(-1)[0].height = (Math.round((e.offsetY || e.layerY) / dotsSpacing) - entities.slice(-1)[0].y);

				render();
			}
		}.bind(this));
		canvas.addEventListener('mouseup', function(e) {
			isMouseDown = false;

			// don't count errant clicks as entities
			if (entities.slice(-1)[0].width < 1 && entities.slice(-1)[0].height < 1) {
				entities.pop();
			}

			render();
		}.bind(this));

		// add button event listeners
		$('#btn_clear').addEventListener('click', this.clear);
		$('#btn_undo').addEventListener('click', this.undo);
		$('#num_width').addEventListener('change', function() {
			canvas.width = parseInt(this.value);
			render();
		});
		$('#num_height').addEventListener('change', function() {
			canvas.height = parseInt(this.value);
			render();
		});
		$('#num_dotSpacing').addEventListener('change', function() {
			dotsSpacing = parseInt(this.value);
			render();
		});
		$('#num_dotSize').addEventListener('change', function() {
			dotsSize = parseInt(this.value);
			render();
		});
		$('#num_lineWidth').addEventListener('change', function() {
			lineWidth = parseInt(this.value);
			render();
		});
		$('#col_dotColor').addEventListener('change', function() {
			dotsColor = this.value;
			render();
		});
		$('#col_lineColor').addEventListener('change', function() {
			lineColor = this.value;
			render();
		});

		render();
	};
	var render = function() {
		// clear
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// draw dots
		for (var x = dotsSpacing; x < canvas.width; x += dotsSpacing) {
			for (var y = dotsSpacing; y < canvas.height; y += dotsSpacing) {
				ctx.beginPath();
				ctx.arc(x, y, dotsSize, 0, pi2, false);
				ctx.fillStyle = dotsColor;
				ctx.fill();
				ctx.closePath();
			}
		}

		// draw entities
		ctx.strokeStyle = lineColor;
		ctx.lineWidth = lineWidth;
		entities.forEach(function(e) {
			ctx.strokeRect(e.x * dotsSpacing, e.y * dotsSpacing, e.width * dotsSpacing, e.height * dotsSpacing);
		});
	};
};

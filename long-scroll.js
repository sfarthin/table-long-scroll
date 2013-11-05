var LongScroll = function LongScroll(opts) {
	
    if (!(this instanceof LongScroll)) {
		return new LongScroll(opts);
    }
	
	
	/**
	*
	* Local Variables
	*
	**/
	var 
		self = this,
		el = opts.el,
		
		// This element
		viewport,
		
		// reference to the data
		data = opts.data,
		
		// Methods for handling the scrolling
		onScrollDebounceTimeout = null,
		scrollEventListener = function(ev) {
			// Lets shorten the timeout period if the user has scrolled pass the visible records
			var timeoutLength = ( viewport.scrollTop < self.scrollLimits[0] || viewport.scrollTop > self.scrollLimits[1] ? 70 : 300 );

			clearTimeout(onScrollDebounceTimeout);
			onScrollDebounceTimeout = setTimeout(self.render, timeoutLength);
		};
	
	/**
	*
	* Initialize
	*
	**/
	self.init = function() {
	
		// Lets build our table for the header
		var html = [], j = 0;
		html[j++] = "<div class='thead'>";
		for(var i in opts.columns) html[j++] = "<div class='"+i+"'>"+opts.columns[i]+"</div>"
		html[j++] = "</div>";
		html[j++] = "<div class='viewport'></div>";
		el.innerHTML = html.join("");

		viewport = el.children[1];
		viewport.addEventListener('scroll', scrollEventListener, false);
	
		self.render();	
	};
	
	/**
	*
	* Render the correct portion of the table. This is dependent on the scroll position (viewport.scrollTop) and the data.
	*
	**/
	self.render = function() {
		
		var scrollTop = viewport.scrollTop;
		
		if(!viewport.innerHTML) viewport.innerHTML = "<div class='tbody'><div class='row'>-</div></div>";
	
		var html = [],  j = 0,
			excessPages = 10,
			rowHeight = (opts.rowHeight || viewport.children[0].children[0].offsetHeight),
			visibleRows = Math.ceil(viewport.offsetHeight/rowHeight),
			tableHeight = visibleRows * rowHeight,
			visibleStartIndex = Math.floor(scrollTop/rowHeight),
			rowsStartIndex = (visibleStartIndex - (visibleRows * excessPages/2) > 0 ? visibleStartIndex - (visibleRows * excessPages/2) : 0),
			paddingTop = rowsStartIndex * rowHeight + (Math.floor(scrollTop/rowHeight) - (scrollTop/rowHeight)),
			paddingBottom = (rowsStartIndex + (visibleRows * excessPages) < opts.data.length ? (opts.data.length - (rowsStartIndex + (visibleRows * excessPages)))*rowHeight : 0 );
	
		//console.log(rowsStartIndex, visibleStartIndex);
	
		opts.data.slice(rowsStartIndex,rowsStartIndex+(visibleRows*excessPages)).forEach(function(item) {
			
			html[j++] = "<div class='row'>";
			for(var i in opts.columns) {
				html[j++] = "<div class='"+i+"'>"+item[i]+"</div>";
			}
			html[j++] = "</div>";
		
		});
		
		viewport.children[0].innerHTML = html.join("");
		
		viewport.children[0].style.paddingTop = paddingTop+"px";
		viewport.children[0].style.paddingBottom = paddingBottom+"px";

		self.scrollLimits = [rowsStartIndex*rowHeight, (rowsStartIndex+(visibleRows*excessPages))*rowHeight];
	
	};
		
		
	/**
	*
	* Removes the DOM element and the event listeners
	*
	**/
	self.remove = function() {
		viewport.addEventListener('scroll', scrollEventListener, false);
		if(el.parentNode) el.parentNode.removeChild(el);
	};
	
	/**
	*
	* Update the Table
	* @param new data array to replace the old one
	*
	**/
	self.update = function(new_data) {
		data = new_data;
		self.render();
	};

	self.init();
	
	return self;
}

window.LongScroll = LongScroll;

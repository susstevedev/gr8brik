document.addEventListener('DOMContentLoaded', function () {
	let picker = document.getElementById('color-picker');
	let colorList = document.getElementById('color-picker-list');

	let colorPalette = [
    	"#C91A09", // Bright Red
       	"#F8CC00", // Bright Yellow
        "#0020A0", // Bright Blue
        "#005700", // Dark Green
        "#FE8A18", // Bright Orange
        "#D941BB", // Bright Violet
        "#000000", // Black
        "#FFFFFF", // White
        "#747371", // Dark Stone Grey (Dark Bluish Grey)
        "#A3A2A4", // Medium Stone Grey (Light Bluish Grey)
        "#958A73", // Dark Tan (Brick Yellow)
        "#6C5C4D", // Brown
        "#812A00", // Dark Brown
        "#5883C1", // Medium Blue
        "#4B974B", // Sand Green
        "#A52A2A", // Dark Red
        "#B36D2C", // Dark Orange
        "#FCB7BC", // Bright Pink
        "#60C0E0", // Bright Light Blue
        "#FBE696", // Earth Yellow (Light Yellow)
        "#84B68D", // Bright Green
        "#92B28B", // Lime Green
        "#002A5A", // Dark Blue
        "#DDDD22", // Vibrant Yellow
	];

	//picker.setAttribute('color', '#C91A09FF');
	picker.setAttribute('color', partColor);
	let color = picker.getAttribute('color');
	picker.value = color;
	picker.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>';
	picker.style.backgroundColor = color;
	picker.style.color = '#d3d3d3';
	picker.style.paddingLeft = "5px";
	picker.style.paddingRight = "5px";
	picker.style.marginLeft = "5px";
	picker.style.width = "fit-content";
	picker.style.cursor = 'pointer';
	picker.style.border = '#d3d3d3 1px solid'

	colorList.style.display = "none";
	colorList.style.border = "1px solid #d3d3d3"
	colorList.style.borderRadius = "2px";
	colorList.style.gridTemplateColumns = "auto auto auto auto auto auto";

	picker.addEventListener("mouseover", function() {
		picker.style.opacity = '0.8';
	});

	picker.addEventListener("mouseout", function() {
		picker.style.opacity = '';
	});

	picker.addEventListener('click', function() {
		if (colorList.style.display === "grid") {
        	colorList.style.display = "none";
    	} else {
        	colorList.style.display = "grid";
    	}
	});

	colorList.addEventListener('click', function(e) {
		const span = e.target.closest("span");

	    if (!span) {
	        return;
	    }

	    const selected = span.getAttribute("value");

	    if (!selected) {
	        return;
	    }

	    partColor = selected;
	    if (selected && selectedObject) {
            changeBlockColor(selected);
        }
	});

	function displayColorListItems() {
	    colorList.innerHTML = '';
	    let i = 0;

	    colorPalette.forEach(color => {
	        const span = document.createElement("span");
	        span.id = color;
	        span.title = color;
	        span.setAttribute("value", color);
	        span.style.backgroundColor = color;
	        span.style.color = '#d3d3d3';
	        span.style.paddingLeft = "5px";
	        span.style.paddingRight = "5px";
	        span.style.margin = "0.25em";
	        span.style.width = "25px";
	        span.style.height = "25px";
	        span.style.display = "inline-block";
	        span.style.cursor = 'pointer';
	        span.style.border = '#d3d3d3 1px solid'
			span.style.boxShadow = "rgba(2, 2, 2, 0.06) 2px 2px 2px 2px";

	        i += 1;
	        colorList.appendChild(span);
	    });
	}
	displayColorListItems();
});
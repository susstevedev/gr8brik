document.addEventListener('DOMContentLoaded', function () {
	let picker = document.getElementById('color-picker');
	let colorList = document.getElementById('color-picker-list');
	let partColor = '#C91A09FF';

	/*let colorPalette = [
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
	];*/

	window.ldrawColors = [
		{ code: 0, name: "Black", hex: "#05131D", type: "solid" },
		{ code: 1, name: "Blue", hex: "#0055BF", type: "solid" },
		{ code: 2, name: "Green", hex: "#237841", type: "solid" },
		{ code: 3, name: "Dark Turquoise", hex: "#008F9B", type: "solid" },
		{ code: 4, name: "Red", hex: "#C91A09", type: "solid" },
		{ code: 5, name: "Dark Pink", hex: "#C870A0", type: "solid" },
		{ code: 6, name: "Brown", hex: "#583927", type: "solid" },
		{ code: 7, name: "Light Gray", hex: "#9C9C9C", type: "solid" },
		{ code: 8, name: "Dark Gray", hex: "#636363", type: "solid" },
		{ code: 9, name: "Light Blue", hex: "#A5CBEB", type: "solid" },
		{ code: 10, name: "Bright Green", hex: "#4B9F38", type: "solid" },
		{ code: 11, name: "Light Turquoise", hex: "#55C6D4", type: "solid" },
		{ code: 12, name: "Salmon", hex: "#F27072", type: "solid" },
		{ code: 13, name: "Pink", hex: "#FC97AC", type: "solid" },
		{ code: 14, name: "Yellow", hex: "#F2CD37", type: "solid" },
		{ code: 15, name: "White", hex: "#FFFFFF", type: "solid" },
		{ code: 16, name: "Main Colour", hex: "#808080", type: "special" },
		{ code: 19, name: "Tan", hex: "#E4CD9E", type: "solid" },
		{ code: 20, name: "Light Violet", hex: "#C9D6E8", type: "solid" },
		{ code: 21, name: "Violet", hex: "#875A9C", type: "solid" },
		{ code: 22, name: "Purple", hex: "#671F81", type: "solid" },
		{ code: 23, name: "Dark Blue Violet", hex: "#0E3E9A", type: "solid" },
		{ code: 24, name: "Edge Colour", hex: "#333333", type: "special" },
		{ code: 25, name: "Orange", hex: "#D67923", type: "solid" },
		{ code: 26, name: "Magenta", hex: "#901F76", type: "solid" },
		{ code: 27, name: "Lime", hex: "#A5CA18", type: "solid" },
		{ code: 28, name: "Dark Tan", hex: "#958A73", type: "solid" },
		{ code: 29, name: "Bricks Yellow", hex: "#E4C387", type: "solid" },
		{ code: 30, name: "Brick Orange", hex: "#B05329", type: "solid" },
		{ code: 31, name: "Bright Light Orange", hex: "#F88B14", type: "solid" },
		{ code: 32, name: "Black Ink", hex: "#1A1A1A", type: "solid" },
		{ code: 33, name: "Dark Orange", hex: "#A95812", type: "solid" },
		{ code: 34, name: "Medium Reddish Violet", hex: "#9B6396", type: "solid" },
		{ code: 35, name: "Sand Blue", hex: "#6074A5", type: "solid" },
		{ code: 36, name: "Sand Green", hex: "#5F8969", type: "solid" },
		{ code: 37, name: "Sand Red", hex: "#88605E" , type: "solid" },
		{ code: 38, name: "Dark Gray Glow", hex: "#757575", type: "solid" },
		{ code: 39, name: "Spec Black", hex: "#1B2A34", type: "solid" },
		{ code: 40, name: "Trans Black", hex: "#635F52", type: "transparent" },
		{ code: 41, name: "Trans Dark Blue", hex: "#002060", type: "transparent" },
		{ code: 42, name: "Trans Light Blue", hex: "#A6CAF0", type: "transparent" },
		{ code: 43, name: "Trans Green", hex: "#006237", type: "transparent" },
		{ code: 44, name: "Trans Bright Green", hex: "#78FC78", type: "transparent" },
		{ code: 45, name: "Trans Red", hex: "#900000", type: "transparent" },
		{ code: 46, name: "Trans Yellow", hex: "#F5CD2F", type: "transparent" },
		{ code: 47, name: "Trans Clear", hex: "#FCFCFC", type: "transparent" },
		{ code: 50, name: "Trans Purple", hex: "#52296E", type: "transparent" },
		{ code: 52, name: "Trans Neon Cyan", hex: "#00FFFF", type: "transparent" },
		{ code: 54, name: "Trans Light Purple", hex: "#9B5094", type: "transparent" },
		{ code: 57, name: "Trans Neon Green", hex: "#D0F800", type: "transparent" },
		{ code: 60, name: "Chrome Antique Bronze", hex: "#6B5D3D", type: "chrome" },
		{ code: 61, name: "Chrome Blue", hex: "#6C9ACA", type: "chrome" },
		{ code: 62, name: "Chrome Green", hex: "#60A956", type: "chrome" },
		{ code: 63, name: "Chrome Pink", hex: "#AA4D8E", type: "chrome" },
		{ code: 64, name: "Chrome Black", hex: "#2C2C2C", type: "chrome" },
		{ code: 68, name: "Very Light Orange", hex: "#F3C396", type: "solid" },
		{ code: 69, name: "Light Reddish Violet", hex: "#D9A3D6", type: "solid" },
		{ code: 70, name: "Medium Reddish Violet", hex: "#9E3D8A", type: "solid" },
		{ code: 71, name: "Light Bluish Gray", hex: "#A0A5A9", type: "solid" },
		{ code: 72, name: "Dark Bluish Gray", hex: "#6C6E68", type: "solid" },
		{ code: 73, name: "Medium Blue", hex: "#5A82C2", type: "solid" },
		{ code: 74, name: "Medium Green", hex: "#55A359", type: "solid" },
		{ code: 77, name: "Light Bluish Violet", hex: "#8C9BC2", type: "solid" },
		{ code: 78, name: "Metallic Silver", hex: "#899499", type: "metallic" },
		{ code: 79, name: "Metallic Green", hex: "#5D7363", type: "metallic" },
		{ code: 80, name: "Metallic Gold", hex: "#CBA347", type: "metallic" },
		{ code: 81, name: "Milky White", hex: "#FFFFFF", type: "solid" },
		{ code: 82, name: "Metallic Dark Gray", hex: "#57585A", type: "metallic" },
		{ code: 84, name: "Speckle Black Copper", hex: "#1A1A1A", type: "speckle" },
		{ code: 85, name: "Speckle Dark Gray Silver", hex: "#4D4D4D", type: "speckle" },
		{ code: 86, name: "Speckle Light Gray Silver", hex: "#8C8C8C", type: "speckle" },
		{ code: 87, name: "Coral", hex: "#FF6D77", type: "solid" },
		{ code: 88, name: "Salmon Red", hex: "#F25E5E", type: "solid" },
		{ code: 89, name: "Medium Dark Pink", hex: "#F785B1", type: "solid" },
		{ code: 98, name: "Very Light Bluish Gray", hex: "#E5E5E5", type: "solid" },
		{ code: 112, name: "Blue Violet", hex: "#3C508C", type: "solid" },
		{ code: 115, name: "Light Orange Brown", hex: "#B67B54", type: "solid" },
		{ code: 116, name: "Medium Orange Brown", hex: "#A25F38", type: "solid" },
		{ code: 117, name: "Dark Orange Brown", hex: "#7E3C1D", type: "solid" },
		{ code: 118, name: "Light Yellowish Green", hex: "#D6E882", type: "solid" },
		{ code: 119, name: "Bricks Brown", hex: "#8A5A36", type: "solid" },
		{ code: 120, name: "Dark Green", hex: "#0E291C", type: "solid" },
		{ code: 125, name: "Flourescent Red Orange", hex: "#FF4A3B", type: "solid" },
		{ code: 128, name: "Dark Purple", hex: "#3F1558", type: "solid" },
		{ code: 133, name: "Sand Violet", hex: "#82799A", type: "solid" },
		{ code: 151, name: "Medium Red", hex: "#E03C31", type: "solid" },
		{ code: 154, name: "Light Brown", hex: "#86614E", type: "solid" },
		{ code: 158, name: "Flourescent Azure", hex: "#00A2F7", type: "solid" },
		{ code: 191, name: "Flourescent Rose", hex: "#FF66C4", type: "solid" },
		{ code: 212, name: "Rust Orange", hex: "#9B3B11", type: "solid" },
		{ code: 232, name: "Light Aqua", hex: "#ADDFD8", type: "solid" },
		{ code: 297, name: "Warm Yellow", hex: "#FFB329", type: "solid" },
		{ code: 320, name: "Dark Royal Blue", hex: "#202050", type: "solid" },
		{ code: 322, name: "Medium Lilac", hex: "#3A2E5C", type: "solid" },
		{ code: 511, name: "Flourescent Green", hex: "#00FF00", type: "solid" },
		{ code: 512, name: "Flourescent Yellow", hex: "#FFFF00", type: "solid" }
	];

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
	    if (selected) {
            window.changeBlockColor(selected);
        }
	});

	function displayColorListItems() {
	    colorList.innerHTML = '';
	    let i = 0;

	    ldrawColors.forEach(color => {
			if(color.type === 'special') {
				return;
			}

	        let span = document.createElement("span");
			let title = document.createElement("span");

			title.classList.add('ui-tooltip-text');
	        title.textContent = color.name;
			span.appendChild(title);

			span.id = color.code;
			span.title = color.name;
	        span.setAttribute("value", color.hex);
			span.classList.add('ui-tooltip');
	        span.style.backgroundColor = color.hex;
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
	
	window.updatecolorelement = function() {
		picker.setAttribute('color', partColor);
		picker.value = partColor;
		picker.style.backgroundColor = partColor;
	}
});
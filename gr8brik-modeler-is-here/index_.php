<?php
	session_start();
	$user = uniqid();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>GR8BRIK test version (2024-10-30)</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
    <style>
        body {
            font-family: Monospace;
            background-color: #000;
            color: #fff;
            margin: 0px;
            overflow: hidden;
        }
        #info {
            color: #000;
            position: absolute;
            top: 10px;
            width: 100%;
            text-align: center;
            z-index: 100;
            display:block;
        }
        #info a, .button { color: #f00; font-weight: bold; text-decoration: underline; cursor: pointer }
		#left-container {
			display: block;
			pointer-events: auto;
			position: fixed;
			left: 0;
			top: 0;
			width: 200px;
			height: 100vh;
			background-color: #D3D3D3;
			font-size: 20px;
			padding: 5px;
			border: 1px;
			overflow-y: scroll;
			overflow-x: hidden;
		}
		.btn {
			transition: all 0.5s ease-in-out;
			background-image: linear-gradient(#87CEEB, #add8e6);
			padding: 6px 16px;
			text-align: center;
		}
		.btn:hover {
			box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.10);
			background-image: linear-gradient(#add8e6, #87CEEB);
			transform: translateY(5px);
			cursor: pointer;
		}
    </style>
</head>

<body>
    <div id="info">
        <a href="https://www.gr8brik.rf.gd/" target="_blank" rel="noopener">GR8BRIK test version</a><b style="color:blue;"> - 2024-09-04</b><br />
    </div>
    <script src="../build/three.js"></script>
    <script src="js/loaders/LDrawLoader.js"></script>
    <script src="js/controls/OrbitControls.js"></script>
    <script src='js/libs/dat.gui.min.js'></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.83.0/examples/js/controls/TransformControls.js"></script>
	
	<div id="left-container">
		<p>Hello <b><?php echo $user ?></b></p>
		<select class="dropdown-list">
			<option value="3001">4x4</option>
			<option value="3003">2x4</option>
			<option value="973">Torso</option>
		</select><br />
		<label for="clr">Color</label><br />
		<input type="text" id="clr" name="clr" value="#D3D3D3" />
		<button class="btn" id="add-block-button">Add Block</button>
		<ul id="block-list"></ul>
	</div>

    <script>
		const isReleased = 0;
		const isReadyForGr8brikRfGd = 0;
		const version = "Some version of Gr8brik modeler indev beta.";
		
		let addBlockButton = document.getElementById('add-block-button');
		let blockList = document.getElementById('block-list');
		let partList = document.querySelector('.dropdown-list');
		let partOption = partList.options[partList.selectedIndex];
		let colList = document.getElementById("clr");
		let part = 'parts/' + partOption.value + '.dat';
		let partColor = document.getElementById("clr").value;
		let login = '<?php echo $user ?>';
		
		addBlockButton.addEventListener('click', addBlock);

		partList.addEventListener('change', function() {
			 partOption = partList.options[partList.selectedIndex];
			 part = 'parts/' + partOption.value + '.dat';
			
		});
				
		var container, camera, scene, renderer, pointLight, controls, gui, guiData, lDrawLoader, raycaster, mouse;
		
		// global vars
		var selectedObject = null;
		var previousSelectedObject = null;

		init();
		animate();
				
				function createCustomGrid(gridSize, studSize, divisions) {
					  var material = new THREE.LineBasicMaterial({ color: 0x000000 });
					  var geometry = new THREE.Geometry();

					  var spacing = gridSize / (divisions - 1);

					  // grid moment
					  for (var x = 0; x <= divisions; x++) {
						geometry.vertices.push(new THREE.Vector3(x * spacing, 0, 0));
						geometry.vertices.push(new THREE.Vector3(x * spacing, 0, gridSize));
					  }

					  for (var z = 0; z <= divisions; z++) {
						geometry.vertices.push(new THREE.Vector3(0, 0, z * spacing));
						geometry.vertices.push(new THREE.Vector3(gridSize, 0, z * spacing));
					  }

					  for (var x = 0; x <= divisions; x += Math.floor(spacing / studSize)) {
						for (var z = 0; z <= divisions; z += Math.floor(spacing / studSize)) {
						  geometry.vertices.push(new THREE.Vector3(x * spacing + studSize / 2, studSize, z * spacing + studSize / 2));
						}
					  }

						var grid = new THREE.Line(geometry, material);
						grid.opacity = 1.0;
						grid.transparent = false;
						return grid;
					}


				function init() {

				  container = document.createElement('div');

					document.body.appendChild(container);


					camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

					camera.position.set(150, 200, 250);


					scene = new THREE.Scene();
					
					var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
					scene.add( ambientLight );


					pointLight = new THREE.PointLight(0xffffff, 1);

					pointLight.position.set(-1000, 1200, 1500);

					scene.add(pointLight);


					renderer = new THREE.WebGLRenderer();

					renderer.setPixelRatio(window.devicePixelRatio);

					renderer.setSize(window.innerWidth, window.innerHeight);

					renderer.setClearColor(0x808080);

					container.appendChild(renderer.domElement);

					transformControls = new THREE.TransformControls(camera, renderer.domElement);

					scene.add(transformControls);

				  controls = new THREE.OrbitControls(camera, renderer.domElement);

				  transformControls = new THREE.TransformControls(camera, renderer.domElement);

					scene.add(transformControls);
					
					var gridSize = 200;
					var studSize = 10;
					var divisions = 20;

					var customGrid = createCustomGrid(gridSize, studSize, divisions);
					scene.add(customGrid);

					lDrawLoader = new THREE.LDrawLoader();

					//lDrawLoader.setPath('https://raw.githubusercontent.com/gkjohnson/ldraw-parts-library/master/complete/ldraw/');
					
					lDrawLoader.setPath('https://raw.githubusercontent.com/pybricks/ldraw/refs/heads/master/');

					raycaster = new THREE.Raycaster();

					mouse = new THREE.Vector2();


					window.addEventListener('resize', onWindowResize, true);

					window.addEventListener('click', onMouseClick, false);

				}
				
				function findParentBlock(object) {
				  let parent = object.parent;
				  while (parent && !parent.userData.isBlock) {
					parent = parent.parent;
				  }
				  return parent;
				}

				var snappingEnabled = false;
				var gridSpacing = 1;
				
				let blocks = [];

				function addBlock() {
					
					let currentY = 0;
					let maxIterations = 1;

					lDrawLoader.load(part, function (group) {
						var blockMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
						 group.traverse(function (child) {
							if (child.isMesh) {
								child.material = new THREE.MeshLambertMaterial({ color: partColor });
								child.userData.selectable = true;
								child.userData.isBlock = true;
								child.opacity = 1.0;
								child.wireframe = true;
								child.transparent = false;

								child.parent.remove(child);
								const blockGroup = new THREE.Group();
								blockGroup.name = `block_${scene.children.length}`;
								blockGroup.add(child);

								scene.add(blockGroup);
								console.log('Added block ' + blockGroup.name)
								blocks.push(blockGroup);
								updateBlockList();
								
								detachedChild = blockGroup;
							}
						});


					detachedChild.position.set(
					  Math.random() * 200 - 100,
					  currentY,
					  Math.random() * 200 - 100
					);
					detachedChild.rotation.x = Math.PI;

					if (selectedObject) {
						previousSelectedObject = selectedObject; // Store the previous selected object
					}

						  if (selectedObject) {
							transformControls.detach(selectedObject);
						  }
						  selectedObject = detachedChild;
						  transformControls.attach(selectedObject);
						});
						
					}
					function updateBlockList() {
						const blockList = document.getElementById('block-list');
						blockList.innerHTML = '';

						blocks.forEach((block, index) => {
							const listItem = document.createElement('li');
							listItem.textContent = `Block ${index + 1}`;
							blockList.appendChild(listItem);
						});
					}
				
				function onDrag(event) {
				  const delta = new THREE.Vector3();
				  raycaster.setFromCamera(mouse, camera);
				  raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,  
				 1, 0), 0), delta);
				  selectedObject.position.add(delta);

				  if (checkOverlap(selectedObject)) {
					selectedObject.position.sub(delta);
					let initialDelta = delta.clone();
					delta.set(0, 0, 0);

					let foundPosition = false;
					let offset = 50;

					while (!foundPosition) {
					  selectedObject.position.add(new THREE.Vector3(0, offset, 0));
					  if (!checkOverlap(selectedObject)) {
						foundPosition = true;
						// Optionally update delta to reflect the adjusted movement
						delta.copy(selectedObject.position.sub(initialDelta));
					  } else {
						offset *= 2;
					  }
				  }
				}
				}
				
				function checkOverlap(block) {
				  // Iterate through existing blocks
				  for (let existingBlock of scene.children) {
					if (existingBlock !== block) {
					  // Check if the new block intersects with the existing block
					  if (intersects(block, existingBlock)) {
						return true; // Overlap detected
					  }
					}
				  }

				  return false; // No overlap found
				}
				
				function intersects(blockA, blockB) {
				  // Get the bounding boxes of the two blocks
				  const boxA = new THREE.Box3().setFromObject(blockA);
				  const boxB = new THREE.Box3().setFromObject(blockB);

				  // Check if the bounding boxes intersect
				  return boxA.intersectsBox(boxB);
				}

				// Function to handle snapping the block to the grid
				function snapToGrid(object) {
				  if (snappingEnabled) {
					// Calculate nearest grid position
					var gridX = Math.round(object.position.x / gridSpacing) * gridSpacing;
					var gridZ = Math.round(object.position.z / gridSpacing) * gridSpacing;

					// Snap the object to the grid position
					object.position.x = gridX;
					object.position.z = gridZ;
				  }
				}
					var selectedObjects = [];

					function onMouseClick(event) {
						event.preventDefault();

						mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
						mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

						raycaster.setFromCamera(mouse,  
					 camera);

						var intersects = raycaster.intersectObjects(scene.children, true);

						if (intersects.length > 0) {
							var object = intersects[0].object;  


							// Check if the object is a block and is not already selected
							if (object.userData.isBlock && !selectedObjects.includes(object)) {
								// Deselect the current selected object if any
								if (selectedObject) {
									transformControls.detach(selectedObject);
								}

								// Select the new object
								selectedObjects.push(object);
								transformControls.attach(object);
							} else if (object.userData.isBlock) {
								// If clicked on the same block, re-select it
								transformControls.detach(object);
								selectedObjects.splice(selectedObjects.indexOf(object), 1);
							}
						} else {
							// Deselect all objects if clicking on empty space
							for (let selectedObject of selectedObjects) {
								transformControls.detach(selectedObject);
							}
							selectedObjects = [];
						}
					}

				function onWindowResize() {

				  camera.aspect = window.innerWidth / window.innerHeight;

					camera.updateProjectionMatrix();

					renderer.setSize(window.innerWidth, window.innerHeight);

				}

				function animate() {

				  requestAnimationFrame(animate);

				  controls.update();

					render();

				if (selectedObject && scene.children.includes(selectedObject)) {

					transformControls.update();

				} else {

					transformControls.detach();

					selectedObject = null;

				  }
				 
				}


				function render() {

				  renderer.render(scene, camera);

				}
				
				
    </script>

    <!-- LDraw.org CC BY 2.0 Parts Library attribution -->
    <div style="display: block; position: absolute; bottom: 0px; right: 0px; width: 160px; padding: 2px; border: #838A92 1px solid; background-color: #F3F7F8;">
        <center>
            <a href="http://www.ldraw.org"><img style="width: 145px" src="files/ldraw_org_logo/Stamp145.png"></a>
            <br />
            <a href="http://www.ldraw.org/" style="color:#000;">This software uses the LDraw Parts Library</a>
        </center>
    </div>

</body>
</html>

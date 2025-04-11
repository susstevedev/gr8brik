<!-- GR8BRIK VERSION 4-11-2025 -->
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Modeler | GR8BRIK</title>
  <meta charset="utf-8">
  <meta name="viewport"
    content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
  <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/stats.js/7/Stats.js"></script>
  <style>
    body {
      font-family: Verdana, sans-serif;
      font-size: 16px;
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
      display: block;
    }

    #info a {
      color: #f00;
      font-weight: bold;
      text-decoration: underline;
      cursor: pointer
    }

    #left-container {
      display: block;
      pointer-events: auto;
      position: fixed;
      left: 0;
      top: 0;
      width: 20%;
      height: 100%;
      background-color: #333333;
      color: #FAFAFA;
      font-size: 20px;
      padding: 5px;
      border: 1px;
      overflow-y: scroll;
      overflow-x: hidden;
      transition: all 0.2s ease-in-out;
    }

    .btn,
    .btn-alt {
      transition: all 0.2s ease-in-out;
      background-color: #87CEEB;
      padding: 6px 16px;
      text-align: center;
      border: none;
      border-radius: 2px;
      cursor: pointer;
    }

    .btn:hover {
      box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.10);
      background-color: #add8e6;
      cursor: pointer;
    }

    .btn-disabled {
      background-image: linear-gradient(#D3D3D3, #808080);
    }

    .btn-disabled:hover {
      cursor: not-allowed;
      background-image: linear-gradient(#808080, #D3D3D3);
    }

    .tab-button {
      box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.10);
      background-color: #d3d3d3;
      color: #000;
      cursor: pointer;
      padding: 6px;
      text-align: center;
      border: none;
    }

    #save-popup {
      display: none;
      border-radius: 15px;
      padding: 10px;
      border: 1px #D3D3D3 solid;
      background-color: #121212;
      color: #ffffff;
      position: fixed;
      z-index: 9999;
      margin: auto;
      width: 50%;
      height: 25%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 5px 30px 0 rgb(0 0 0 / 10%);
      transition: all 0.5s ease-in-out;
      text-align: center;
    }

    #username-field {
      display: none;
      position: fixed;
      right: 10px !important;
      top: 5px !important;
      text-align: center;
      color: #fff;
      text-decoration: none;
    }

    #link-home {
      position: fixed;
      left: 10px !important;
      top: 5px !important;
      text-align: center;
      display: flex;
    }

    #link-home a {
      color: #fff;
      text-decoration: none;
    }

    #top-container {
      background-color: #333333;
      color: #fff;
      z-index: 1000;
      position: fixed;
      margin-right: 15%;
      width: 100%;
      height: 5%;
      padding: 2px 2px 2px 2px;
    }

    #logo-img {
      border-radius: 50%;
      width: 25px;
      height: 25px;
    }

    .mobile-toggle {
      display: none;
    }

    #select-block {
      display: block;
    }

    #select-block li,
    #block-list li {
      padding: 20px 20px 20px 20px;
      border: none;
      cursor: pointer;
    }

    #block-list {
      display: none;
    }

    #search-parts,
    #save-popup input[type=text] {
      border: none;
      border-radius: 2px;
      width: 75%;
      height: 30px;
      outline: 0;
    }

    #save-popup textarea {
      border: none;
      border-radius: 2px;
      outline: 0;
      padding: 5px 5px 5px 5px;
    }

    #preloaded-logo {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
    }

    #preloaded-logo .img {
        background-image: url("/img/logo.jpg");
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        width: 200px;
        height: 200px;
        z-index: 999999;
        border-radius: 50%;
    }

    @media (max-width: 768px) {
      #left-container {
        position: fixed;
        left: -250px;
        top: 0;
        height: 100%;
        padding: 10px;
        z-index: 1000;
        width: 50%;
      }

      .mobile-toggle {
        position: fixed;
        top: 30px;
        right: 10px;
        background: #333333;
        color: white;
        padding: 10px;
        border: 2px rgba(0, 0, 0, 0.16) solid;
        border-radius: 2px;
        cursor: pointer;
        z-index: 1100;
        display: inline-block;
        // from https://getcssscan.com/css-box-shadow-examples (number #12)
        box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
      }
    }
  </style>
</head>

<body>
  <div id="top-container">
    <span id="link-home"><img src="/img/logo.jpg" id="logo-img" /><a href="/"><span>&nbsp;Gr8brik&nbsp;</span></a></span>
    <a href="http://www.gr8brik.rf.gd/acc/login" id="username-field"></a>
  </div>

  <div id="info">
    <p style="height: 1vh;"></p>
    <a href="https://www.gr8brik.rf.gd/" target="_blank">Gr8brik beta</a>
    <b style="color:blue;"> - April 2025</b>
    <b style="color:blue;"> - <a href="https://www.gr8brik.rf.gd/old-modeler" target="_blank">Old modeler</a></b><br />
  </div>

  <script src="https://cdn.jsdelivr.net/npm/three@latest/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@latest/examples/js/loaders/LDrawLoader.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@latest/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dat.gui@latest/build/dat.gui.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@latest/examples/js/controls/TransformControls.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.1/spectrum.min.css" />

  <button id="toggleMenu" class="mobile-toggle">☰</button>
  <div id="left-container">
    <p style="height: 1vh;"></p>

    <button class="btn" title="Save creation to our database of LEGO(R) made by others."
      id="save-popup-open">Save Creation</button><br />
    <button class="btn" title="Change controls to arrows to move blocks up and down, side-by-side."
      id="move-block-t">Drag</button>
    <button class="btn" title="Change controls to rotate blocks, in all directions."
      id="move-block-r">Rotate</button>
    <hr />

    <label for="color-picker">Color</label>
    <input type="text" id="color-picker" /><br />

    <label for="part-type-filter">Filter by</label>

    <select id="part-type-filter" style="display: inline-block;">
        <option value="brick" selected>Bricks</option>
        <option value="plate">Plates</option>
        <option value="tile">Tiles</option>
        <option value="slope">Slopes</option>
        <option value="minifig">Minifigs</option>
        <option value="duplo">Duplo</option>
        <option value="animal">Animals</option>
        <option value="technic">Technic</option>
        <option value="wedge">Wedges</option>
        <option value="hinge">Hinges</option>
        <option value="clip_&_bar">Clips & Bars</option>
        <option value="connector">Connectors</option>
        <option value="wheel_&_tyre">Wheels & Tyres</option>
        <option value="train">Train Parts</option>
        <option value="panel">Panels</option>
        <option value="round_&_curved">Round & Curved</option>
        <option value="other">Miscellaneous</option>
    </select><br />

    <input type="text" id="search-parts" placeholder="search parts..." /><br />

    <button id="tab1" class="tab-button">Add blocks</button>
    <button id="tab2" class="tab-button">Scene blocks</button>
    <hr />

    <span id="select-block"></span>
    <ul id="block-list"></ul>
  </div>

  <div id="save-popup">
    <button class="btn-alt" style="float: right; top: 0;">&#10006;</button>
    <h3><span>Save Creation</span></h3>
    <div id="save-popup-form">
      <input class="w3-input w3-border" type="text" name="name" placeholder="Name"><br /><br />
      <textarea name="desc" rows="4" cols="50" placeholder="Description"></textarea><br /><br />
      <button class="btn" title="Finish saving" id="download-json">Save Creation</button>
    </div>
  </div>

  <div id="preloaded-logo">
    <div class="img"></div>
  </div>

  <script>
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
    });

    var partColor = "#ff0000";
    $(document).ready(function () {

        $(document).on('click', 'a', function(event) { 
            event.preventDefault();           
            let url = $(this).attr("href");

            if (url || url.match("^http")) {
                window.location.href = url;
            }
        });

      function login() {
          $.ajax({
            url: "/ajax/user.php",
            method: "GET",
            data: {
              ajax: true
            },
            success: function (response) {
              document.title = response.user + " | " + document.title;
              $("#username-field").show().text(response.user);
              $("#username-field").attr("href", "/acc/creations");
              tooltip('Logged in as ' + response.user);
            },
            error: function (jqXHR, textStatus, errorThrown) {
              var response = JSON.parse(jqXHR.responseText);
              console.error('Server status code: ' + textStatus + ' ' +
                jqXHR.status + ' ' + errorThrown + ' ' + response.error);
              document.title = "Guest | " + document.title;
              tooltip(response.error);
            }
          });
      }
      login();

        let displayed_parts = [];
        let current_type = '';

      function loadParts(type) {
        console.log(`loading ${type} category`);
        current_type = type;

        $.ajax({
          url: `https://susstevedev.github.io/gr8brik-new/parts/${type}.json`,
          method: 'GET',
          dataType: 'json',
          success: function (data) {
            console.log(`${type} parts loaded`);
            displayed_parts = data;
            displayParts();
          },
          error: function (err) {
            console.error('error loading parts ', err);
            tooltip('Failed to load parts');
          }
        });
      }

      function displayParts() {
        $('#select-block').html('');
        displayed_parts.forEach(part => {
          $('#select-block').append(
            `<li id="${part.file}" value="${part.file}">${part.name}</li>`
          );
        });
      }

      $('#part-type-filter').on('change', function () {
        let selectedType = $(this).val();
        loadParts(selectedType);
      });

      loadParts('brick');

      $(document).on("click", "#select-block li", function () {
        let selectedPart = $(this).attr("value");
        if (!selectedPart) {
          console.error("selected part is not valid");
          return;
        }

        part = 'parts/' + selectedPart;
        partName = selectedPart;
        console.log("selected peice: ", selectedPart);
        addBlock();
      });

      $(document).on("click", "#save-popup .btn-alt", function () {
        $("#save-popup").fadeOut();
      });

      $(document).on("click", "#save-popup-open", function () {
        $("#save-popup").fadeIn();
      });

      $(document).on("click", "#download-json", function () {
        let sceneJSON = generateSceneJSON();

        if (sceneJSON) {
          const jsonData = sceneJSON;
          console.log(jsonData);

          const date = new Date();
          date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000));
          document.cookie = "localsave=" + btoa(jsonData) + "; expires=" + date
            .toUTCString() + "";

          let name = $("#save-popup input[name='name']").val().trim();
          let desc = $("#save-popup textarea[name='desc']").val().trim();
          let screenshot = capture();

          $.ajax({
            url: "/ajax/build.php",
            type: "POST",
            data: {
              save_build: true,
              creation: jsonData,
              name: name,
              desc: desc,
              screenshot: screenshot
            },
            success: function (response) {
              console.log(`OK: ${response.success}`);
              tooltip(response.success);
            },
            error: function (xhr, status, error) {
              try {
                var response = JSON.parse(xhr.responseText);
                console.error(`ERR: ${response.error} (${error}).`);
                tooltip(response.error);
              } catch (e) {
                console.error("Invalid error response:", xhr.responseText);
                tooltip("An unknown error occurred.");
              }
            }
          });
        }
      });

      $("#color-picker").spectrum({
        color: "#ff0000",
        showInput: true,
        showPalette: true,
        palette: [
          ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#00FFFF", "#FF00FF"],
          ["#000000", "#FFFFFF", "#808080", "#FFA500", "#800080", "#FFC0CB"],
          ["#A52A2A", "#FFD700", "#C0C0C0", "#8B0000", "#006400", "#00008B"],
          ["#C91A09", "#A0BCAC", "#7789A5", "#958A73", "#A3A2A4", "#635F61"]
        ],
        change: function (color) {
          console.log(`selected color is ${color.toHexString()}`);
          partColor = color.toHexString();
          if (color) {
            changeBlockColor(color.toHexString());
          }
        }
      });

      $("#search-parts").on("keyup", function () {
          let value = $(this).val().toLowerCase().replace(/\s+/g, " ").trim();
          let list = $("#select-block li");

          list.sort(function (a, b) {
              let textA = $(a).text().toLowerCase().replace(/\s+/g, " ").trim();
              let textB = $(b).text().toLowerCase().replace(/\s+/g, " ").trim();

              let matchA = textA.indexOf(value) > -1 ? 0 : 1;
              let matchB = textB.indexOf(value) > -1 ? 0 : 1;

              return matchA - matchB;
          });

          $("#select-block").html(list);
          list.each(function () {
              let text = $(this).text().toLowerCase().replace(/\s+/g, " ").trim();
              $(this).toggle(text.indexOf(value) > -1);
          });
      });

      $(document).on("click", ".scene-block-item", function () {
        let id = $(this).data("id");
        transformControls.detach(selectedObject);
        selectedObject = null;
        let sceneBlock = blocks.find(block => block.userData.block_id === Number(
          id));

        if (sceneBlock) {
          transformControls.attach(sceneBlock);
          selectedObject = sceneBlock;
          tooltip('Block selected');
        }
      });
    });
  </script>
  <script>
    const studSize = 1000;
    let partList = document.getElementById('blk');
    let colList = document.getElementById('select-color');

    document.getElementById("color-picker").addEventListener("click", function () {
      console.log("color picker clicked");
    });

    document.getElementById("toggleMenu").addEventListener("click", function () {
      var left = document.getElementById("left-container");
      if (left.style.left === "0px" || left.style.left === "") {
        left.style.left = "-250px";
      } else {
        left.style.left = "0px";
      }
    });

    document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', function () {
        const is1 = this.id === 'tab1';
        document.getElementById('select-block').style.display = is1 ? 'block' :
          'none';
        document.getElementById('block-list').style.display = is1 ? 'none' :
          'block';
      });
    });

    var container, camera, scene, renderer, sunlight, moonlight, controls, grid_helper, ldraw_loader, raycaster, mouse = null;

    var selectedObject = null;
    var previousSelectedObject = null;

    init();
    animate();

    function createCustomGrid(gridSize, studSize, divisions) {
      var gridMaterial = new THREE.LineBasicMaterial({
        color: 0x333333
      });
      var gridGeometry = new THREE.BufferGeometry();
      var gridVertices = [];
      var spacing = gridSize / (divisions - 1);

      for (var x = 0; x <= divisions; x++) {
        gridVertices.push(x * spacing, 0, 0);
        gridVertices.push(x * spacing, 0, gridSize);
      }
      for (var z = 0; z <= divisions; z++) {
        gridVertices.push(0, 0, z * spacing);
        gridVertices.push(gridSize, 0, z * spacing);
      }

      gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(
        gridVertices, 3));
      var grid = new THREE.LineSegments(gridGeometry, gridMaterial);

      var studMaterial = new THREE.PointsMaterial({
        color: 0x666666,
        size: studSize * 0.5,
        sizeAttenuation: false
      });
      var studGeometry = new THREE.BufferGeometry();
      var studVertices = [];

      for (var x = 0; x < gridSize; x += studSize) {
        for (var z = 0; z < gridSize; z += studSize) {
          studVertices.push(x + studSize / 2, 0.01, z + studSize / 2); // Raised slightly to avoid overlap
        }
      }

      studGeometry.setAttribute('position', new THREE.Float32BufferAttribute(
        studVertices, 3));
      var studs = new THREE.Points(studGeometry, studMaterial);

      var group = new THREE.Group();
      group.add(grid);
      group.add(studs);

      return group;
    }

    function snapToGrid(value, gridSize) {
      return Math.round(value / gridSize) * gridSize;
    }

    function init() {
        container = document.createElement('div');
        container.classList.add("scene");

        document.body.appendChild(container);
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(250, 150, 500);
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xF5F5F5);

        sunlight = new THREE.DirectionalLight(0xffffff, 2.5);
        sunlight.position.set(250, 500, -250);
        sunlight.castShadow = true;
        scene.add(sunlight);

        moonlight = new THREE.DirectionalLight(0xffffff, 2.5);
        moonlight.position.set(-250, 500, 250);
        moonlight.castShadow = true;
        scene.add(moonlight);

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        transformControls = new THREE.TransformControls(camera, renderer.domElement);
        scene.add(transformControls);

        controls = new THREE.OrbitControls(camera, renderer.domElement);

        const stud_size = 20; // 1 stud = 20
        const grid_size = stud_size * 16; // studs wide
        const divisions = 16; // 1 division per stud

        grid_helper = new THREE.GridHelper(grid_size, divisions, 0xffffff, 0x888888);
        scene.add(grid_helper);

        ldraw_loader = new THREE.LDrawLoader();
        ldraw_loader.preloadMaterials('https://raw.githubusercontent.com/gkjohnson/ldraw-parts-library/master/colors/ldcfgalt.ldr');
        ldraw_loader.setPath('https://raw.githubusercontent.com/gkjohnson/ldraw-parts-library/master/complete/ldraw/');
        ldraw_loader.setPartsLibraryPath("https://raw.githubusercontent.com/gkjohnson/ldraw-parts-library/master/complete/ldraw/");
        ldraw_loader.displayLines = false;

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        window.addEventListener('keydown', function (event) {
            let activeElement = document.activeElement;

            if (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA") {
                return;
            }

            switch (event.code) {
                case 'KeyT':
                    moveBlock('t')
                    break
                case 'KeyR':
                    moveBlock('r')
                    break
                case 'KeyS':
                    moveBlock('s')
                    break
                case 'Escape':
                    transformControls.detach(selectedObject);
                    break
                case 'Delete':
                    transformControls.detach(selectedObject);
                    scene.remove(selectedObject);
                    tooltip('Deleted block')
                    break
            }
        })

      document.getElementById('move-block-t').addEventListener('click', function () {
        if (selectedObject) {
          moveBlock('t');
        }
      });

      document.getElementById('move-block-r').addEventListener('click', function () {
        if (selectedObject) {
          moveBlock('r');
        }
      });

    window.addEventListener('resize', onWindowResize, true);
    window.addEventListener('pointerdown', onMouseClick, true);
    //window.addEventListener('click', onMouseClick, true);

      transformControls.addEventListener('mouseDown', function () {
        controls.enabled = false;
      });

      transformControls.addEventListener('mouseUp', function () {
        controls.enabled = true;
      });

      transformControls.addEventListener('dragging-changed', function (event) {
        controls.enabled = !event.value;
      });

        transformControls.addEventListener('objectChange', function () {
            if (selectedObject) {
                selectedObject.position.set(
                    snapToGrid(selectedObject.position.x, 10), 
                    snapToGrid(selectedObject.position.y, 4), 
                    snapToGrid(selectedObject.position.z, 10)
                );

                selectedObject.rotation.set(
                    Math.round(selectedObject.rotation.x / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45),
                    Math.round(selectedObject.rotation.y / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45),
                    Math.round(selectedObject.rotation.z / THREE.MathUtils.degToRad(45)) * THREE.MathUtils.degToRad(45)
                );

                selectedObject.updateMatrixWorld(true);
            }
            updateSceneData();
        });
    }

    function changeBlockColor(color) {
      if (!selectedObject) {
        tooltip("No block selected");
        return;
      }

      selectedObject.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set(color);
          child.material.needsUpdate = true;
        }
      });

      console.log(`block color changed to ${color}`);
      tooltip(`Block color changed`);
    }

    function capture() {
      renderer.render(scene, camera);
      let screenshot = renderer.domElement.toDataURL("image/png");
      return screenshot;
    }

    function makeid(length) {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }

    let blocks = [];
    let blockGroups = [];

    function addBlock() {
        if (!ldraw_loader || typeof ldraw_loader.load !== 'function') {
            console.error('ldrawloader is not initialized');
            return;
        }

        if (!part) {
            console.error('piece is undefined');
            tooltip('Please select a block');
            return;
        }

        if (!partColor) {
            console.error('color is undefined/invalid');
            tooltip('Please select a color for the current block');
            return;
        }

        transformControls.detach(selectedObject);
        console.log("Loading part:", part);

        ldraw_loader.load(part, function (loadedGroup) {
            ldraw_loader.smoothNormals = true;
            ldraw_loader.displayLines = false;

            if (!loadedGroup) {
                console.error("group is undefined");
                return;
            }

            console.log("loaded group:", JSON.stringify(loadedGroup));

            let blockGroup = new THREE.Group();
            blockGroup.name = `ldraw_${makeid(10)}`;
            blockGroup.ldraw = part;

            loadedGroup.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: new THREE.Color(partColor || "#ffffff"),
                        roughness: 0.05,
                        metalness: 0.0,
                        clearcoat: 1.0,
                        clearcoatRoughness: 0.05,
                        reflectivity: 0.9
                    });
                    child.material.needsUpdate = true;
                    child.userData.selectable = true;
                }
            });

            blockGroup.add(loadedGroup);

            blockGroup.rotation.x = Math.PI;
            let position = new THREE.Vector3(
                snapToGrid(blockGroup.position.x, 10),
                snapToGrid(blockGroup.position.y, 4),
                snapToGrid(blockGroup.position.z, 10)
            );
            blockGroup.position.copy(position);

            blockGroup.userData.isBlock = true;
            blockGroup.userData.partName = partName;

            scene.add(blockGroup);

            console.log("block group added:", JSON.stringify(blockGroup));
            tooltip(`Added block ${part}`);

            selectedObject = blockGroup;
            transformControls.attach(blockGroup);

            blocks.push(blockGroup);
            blockGroups.push(blockGroup);

            updateBlockList(partName, partColor, blocks.length, blockGroup.userData.block_id);
            
        }, undefined, function (error) {
            console.error('error loading piece:', error);
        });
    }

    function updateBlockList(part, color, count, id) {
      let blockList = document.getElementById('block-list');

      let listItem = document.createElement('li');
      listItem.classList.add('scene-block-item');
      listItem.setAttribute('data-id', id);
      listItem.textContent = `${part} (${color}, Num ${count})`;

      blockList.appendChild(listItem);
    }

    // TODO: stop double encoding json
    // @3/20/25 8:49 AM
    function generateSceneJSON() {
      let gr8brikid = makeid(5);

      const sceneData = {
        blocks: []
      };

      if (selectedObject) {
        transformControls.detach(selectedObject);
        selectedObject = null;
    }

      blockGroups.forEach(function (group) {
        let mesh_child = null;
        group.traverse(function (child) {
          if (child.isMesh) {
            mesh_child = child;
          }
        });

        if (mesh_child) {
            let ldraw = group.ldraw.replace("parts/", "");
            const blockData = {
                partName: group.userData.partName,
                color: mesh_child.material.color.getHexString(),
                position: {
                    x: group.position.x,
                    y: group.position.y,
                    z: group.position.z
                },
                rotation: {
                    x: group.rotation.x,
                    y: group.rotation.y,
                    z: group.rotation.z
                },
                scale: {
                    x: group.scale.x,
                    y: group.scale.y,
                    z: group.scale.z
                },
                blockID: group.name,
                ldraw: ldraw,
            };
          sceneData.blocks.push(blockData);
        }
      });

      return JSON.stringify(sceneData, null, 1);
    }

    function updateSceneData() {
        if (blockGroups && blockGroups.length > 0) {
            blockGroups.forEach(function (group) {
                let mesh_child = null;
                group.traverse(function (child) {
                    if (child.isMesh) {
                        mesh_child = child;
                    }
                });

                if (mesh_child != null) {
                    group.updateMatrixWorld(true);
                    mesh_child.updateMatrixWorld(true);
                    console.log('updated block data for', group.name);
                }
            });
        }

        if (selectedObject) {
            selectedObject.updateMatrixWorld(true);
            console.log('updated selected block data:', selectedObject.name);
        }
    }

    function onMouseClick(event) {
        let target = event.target;
        let container = document.querySelector(".scene");

        if (!container.contains(target)) {
            return;
        } else {
            event.preventDefault();
        }

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            selectObject(intersects[0].object);
        }
    }

    function selectObject(object) {
        while (object.parent && !object.userData.isBlock) {
            object = object.parent;
        }

        if (!object.userData.isBlock || !transformControls.enabled) {
            return;
        }

        if (object === selectedObject) {
            return;
        }

        deselectObject();
        selectedObject = object;
        transformControls.attach(object);
    }

    function deselectObject() {
        if (selectedObject) {
            transformControls.detach(selectedObject);
            selectedObject = null;
        }
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function moveBlock(mode) {
        if (mode === "t") {
            transformControls.setMode('translate');
            tooltip('Changed to drag blocks');
        }

        if (mode === "r") {
            transformControls.setMode('rotate');
            tooltip('Changed to rotate blocks');
        }

        if (mode === "s") {
            transformControls.setMode('scale');
            tooltip('Changed to secret scale blocks');
        }
    }

    function animate() {
      THREE.ShaderChunk.encodings_fragment = THREE.ShaderChunk.colorspace_fragment;

      document.addEventListener('DOMContentLoaded', function () {
        const stats = new Stats();

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.zIndex = '99999999';
        stats.domElement.style.left = '0px';
        stats.domElement.style.bottom = '0px';
        document.body.appendChild(stats.domElement);

        setInterval(function () {
          stats.update();
        }, 1000 / 60);
      });

      requestAnimationFrame(animate);
      controls.update();
      render();
    }


    function render() {
      renderer.render(scene, camera);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    function tooltip(text) {
        const tooltip = document.createElement('div');

        tooltip.textContent = text;
        tooltip.setAttribute('id', 'tooltip');

        tooltip.style.position = 'absolute';
        tooltip.style.zIndex = '99999999' + Date.now();
        tooltip.style.right = '0px';
        tooltip.style.top = '0px';
        tooltip.style.backgroundColor = '#ddd';
        tooltip.style.color = '#000';
        tooltip.style.padding = '5px 5px 5px 5px';
        tooltip.style.borderRadius = '0px';

        document.body.appendChild(tooltip);

        if (tooltip) {
            setTimeout(() => {
            tooltip.remove();
            }, 5000);
        }
    }

    window.onload = function() {
        setTimeout(() => {
            if (document.getElementById("preloaded-logo")) {
                document.getElementById("preloaded-logo").style.display = "none";
            }
        }, 1000);
    }
  </script>

  <!-- LDRAW.ORG CC BY 2.0 PARTS LIBRARY ATTRIBUTION -->
  <div style="display: block; position: absolute; bottom: 0px; right: 0px; width: 175px; padding: 2px; border: #838A92 1px solid; background-color: #F3F7F8;">
        <a href="http://www.ldraw.org">
            <img style="width: 145px" src="https://threejs.org/examples/models/ldraw/ldraw_org_logo/Stamp145.png">
        </a>
        <a href="http://www.google.com/chromebook/" target="_blank">
            <img src="https://lh3.googleusercontent.com/1GkePzki6ZaVDoZOECVzvrrOu9jDOwinjdGafhaAjj9pfO9yFzqPqeuYOqIQ41JlwOlyNhAOrPSGGbioBeVd_eiH0cn_1X6uRWf-uA" style="width: 50px; height: 50px; float: right;" />
        </a>
    <br />
    <a href="http://www.ldraw.org/" style="color:#000;">This software uses the LDraw Parts Library</a>
  </div>

</body>
</html>
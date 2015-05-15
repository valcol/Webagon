var scene = new THREE.Scene();

//Center hexagon object
var hexagon = new THREE.Object3D();

//Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 110;
camera.position.y = -30;
camera.position.x = -30;
camera.lookAt(scene.position);

//Raycaster
var raycaster = new THREE.Raycaster();

//Controls
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;
controls.addEventListener('change', render);

//Keyboard
var keyboard = new THREEx.KeyboardState();

//Render
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
THREEx.WindowResize(renderer, camera);

var playing = false;

//Array containing the obstacles
var arrayObstacles = [];

//Array containing the background
var arrayBackground = [];

//Degrees of the level
// /!\ 360(modulo)degrees should be equal to 0 
var degrees = 60;

//Number of obstacles
var n_obstacles_max = 360 / degrees;

//Obstacles.y
var spawn_y = 600;

//Obstacle width
var spawn_width = 8;

//Initial size of the obstacle, 
var spawn_size;

//Rotation function var
var current_rotation;
var rotation_needed;

//Level var
var frames;
var spawn_obstacle_delay;
var obstacle_speed;
var fastrotate_level_delay;
var rotate_level_speed;
var fastrotate_level_speed;
var pattern_duration;
var current_pattern;
var current_obstacle_position;

var r;
var g;
var b;
var rgb;


spawn_size = (spawn_y * getTanDeg(degrees / 2)) * 2;

//Central hexagon
var geometry_hexagon = new THREE.CylinderGeometry(14, 14, 5, 0);
var hexagon1 = new THREE.Mesh(geometry_hexagon, new THREE.MeshBasicMaterial({
    color: new THREE.Color("rgb(20,245,117)"),
    opacity: 1
}));
hexagon1.position.x = 0;
hexagon1.position.y = 0;
hexagon1.rotation.x = 90 * (Math.PI / 180);
hexagon.add(hexagon1);

var geometry_hexagonbis = new THREE.CylinderGeometry(13, 13, 6, 0);
var hexagonbis = new THREE.Mesh(geometry_hexagonbis, new THREE.MeshBasicMaterial({
    color: new THREE.Color("rgb(0,0,0)"),
    opacity: 1
}));
hexagonbis.position.x = 0;
hexagonbis.position.y = 0;
hexagonbis.rotation.x = 90 * (Math.PI / 180);
hexagon.add(hexagonbis);

//Player
var geometry = new THREE.BoxGeometry(4, 3, 4);
var material = new THREE.MeshBasicMaterial({
    color: new THREE.Color("rgb(20,245,117)"),
    opacity: 1
});
var player = new THREE.Mesh(geometry, material);
player.geometry.vertices[0].x = player.geometry.vertices[2].x - 2;
player.geometry.vertices[1].x = player.geometry.vertices[1].x - 2;
player.geometry.vertices[4].x = player.geometry.vertices[6].x + 2;
player.geometry.vertices[5].x = player.geometry.vertices[6].x + 2;
player.geometry.verticesNeedUpdate = true;
player.position.z = 0;
player.position.x = 0;
player.position.y = 20;


function getTanDeg(deg) {
    var rad = deg * Math.PI / 180;
    return Math.tan(rad);
}

function rotateEuler(object, x, axis) {

    var eul = new THREE.Euler(0, 0, x, "XYZ");

    if (axis === "X")
        object.rotation.x = object.rotation.x + x;
    else if (axis === "Y")
        object.rotation.y = object.rotation.y + x;
    else if (axis === "Z")
        object.rotation.z = object.rotation.z + x;

    object.position = object.position.applyEuler(eul);
}


function setupScene() {
    
    resetGame();
    
    current_rotation = 0;
    rotation_needed = 0;
    frames = 0;
    spawn_obstacle_delay = 40;
    obstacle_speed = 0.0035;
    fastrotate_level_delay = 380;
    rotate_level_speed = 2;
    fastrotate_level_speed = 6;
    pattern_duration = 450;
    current_pattern = 1;
    current_obstacle_position = 1;

    rotateEuler(player, 0.0.1, "Z");
    
    scene.add(player);
    scene.add(hexagon);
    generateBackground();

}

function resetGame() {
    
    var children = scene.children;
    for(var i = children.length-1;i>=0;i--){
        var child = children[i];
        scene.remove(child);
    };
    
}


function generateBackground() {

    var tan_degree = 600 * getTanDeg(degrees);

    for (i = 0; i < n_obstacles_max; i++) {

        //triangles
        var t1 = new THREE.Geometry();

        t1.vertices.push(
            new THREE.Vector3(600, tan_degree, 0),
            new THREE.Vector3(600, 0, 0),
            new THREE.Vector3(0, 0, 0)
        );

        t1.faces.push(new THREE.Face3(0, 1, 2));

        var triangleMaterial;

        if (i % 2 === 0) {

            triangleMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color("rgb(0,0,0)"),
                side: THREE.DoubleSide, transparent:true
            });
            
            triangleMaterial.opacity = 0.1;
        } else {

            triangleMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color("rgb(3,38,18)"),
                side: THREE.DoubleSide, transparent:true
            });
            
            triangleMaterial.opacity = 0.3;
        }


        var triangleMesh = new THREE.Mesh(t1, triangleMaterial);


        triangleMesh.position.x = 0;
        triangleMesh.position.y = 0;
        triangleMesh.position.z = -1;

        rotateEuler(triangleMesh, ((degrees * i)+(degrees/2)) * (Math.PI / 180), "Z");

        arrayBackground.push(triangleMesh);
        scene.add(triangleMesh);
    }

}


function spawnObjects(pos) {

    var y = spawn_y;

    var material = new THREE.MeshBasicMaterial({
        color: new THREE.Color("rgb(20,245,117)"),
        opacity: 1
    });

    var geometry = new THREE.BoxGeometry(spawn_size, spawn_width, 4);

    var obstacle = new THREE.Mesh(geometry, material);

    obstacle.position.y = y;
    obstacle.position.z = 0;

    rotateEuler(obstacle, ((degrees / 2) + (degrees * (pos - 1))) * (Math.PI / 180), "Z");

    arrayObstacles.push(obstacle);
    scene.add(obstacle);

}


function rotateGame(speed) {

    scene.rotation.z += speed * (Math.PI / 180);

    if (rotation_needed > 0) {
        rotateEuler(scene, fastrotate_level_speed * (Math.PI / 180), "Z");
        rotation_needed -= Math.abs(speed * 4);
    }

}

function moveWithMusic() {

    console.log(boost);
    var scale = boost / 80;

    if (scale > 1) {

        if (scale > 1.1)
            scale = 1.1;

        hexagon.scale.x = (scale < 1 ? 1 : scale);
        hexagon.scale.y = (scale < 1 ? 1 : scale);
    }

}

function changeGameColors() {
    
    var color = getUiColor();
    var colorThree = new THREE.Color(color);
    
    if (typeof arrayObstacles === 'object' && arrayObstacles.length > 0) {
        for (var i = 0; i < arrayObstacles.length; i++) {
            arrayObstacles[i].material.color.set(colorThree);
        }
    }
    
    if (typeof arrayBackground === 'object' && arrayBackground.length > 0) {
        for (var i = 0; i < arrayBackground.length; i++) {
            arrayBackground[i].material.color.set(colorThree);
        }
    }
    
    player.material.color.set(colorThree);
    hexagon1.material.color.set(colorThree);
}

function switchPattern(pattern){
    
    current_pattern = pattern;
    current_obstacle_position = 1;

    
    if (pattern == 1){
        
      spawn_obstacle_delay = 40;
    }
             
   if (pattern == 2){
       spawn_obstacle_delay = 30;
    }
    
    if (pattern == 3){
       spawn_obstacle_delay = 50;
    }
    
    if (pattern == 4){
       spawn_obstacle_delay = 25;
    }
        
}

function followPattern(){

    if (current_pattern == 1){
        
        for (i = 0; i < n_obstacles_max-1; i++) {
            spawnObjects(Math.floor((Math.random() * n_obstacles_max) + 1));
        }

    }
             
   if (current_pattern == 2){

      var selected = Math.floor((Math.random() * n_obstacles_max) + 1);
       
       spawnObjects(selected);
       
      if (selected <= Math.floor(n_obstacles_max)/2){
        spawnObjects(selected + Math.floor(n_obstacles_max)/2);
          selected++;
      }
      else {
        spawnObjects(selected - Math.floor(n_obstacles_max)/2);
          selected--;
      }
       
      if (selected <= Math.floor(n_obstacles_max)/2)
        spawnObjects(selected + Math.floor(n_obstacles_max)/2);
      else
        spawnObjects(selected - Math.floor(n_obstacles_max)/2);
       
       spawnObjects(selected);
        
            
    }
        
    if (current_pattern == 3){
        
        var empty = Math.floor((Math.random() * n_obstacles_max) + 1);
        for (i = 1; i <= n_obstacles_max; i++) {
            
            if (i != empty)
                spawnObjects(i);
        }
    }
        
    if (current_pattern == 4){

        if (current_obstacle_position%2 != 0)
            for (i = 1; i <= n_obstacles_max; i++) {
                if (i % 2 == 0){
                    spawnObjects(i);
                    current_obstacle_position = i;
                }
            }
        else
            for (i = 1; i <= n_obstacles_max; i++) {
                if (i % 2 != 0){
                    spawnObjects(i);
                    current_obstacle_position = i;
                }
            }
    }
            
}

function moveBlocs(speed_percent) {


    if (typeof arrayObstacles === 'object' && arrayObstacles.length > 0) {
        for (var i = 0; i < arrayObstacles.length; i++) {


            var x = Math.abs(arrayObstacles[i].position.x);
            var y = Math.abs(arrayObstacles[i].position.y);
            
            //Distance of the obsctacle
            var k = arrayObstacles[i].position.distanceTo(new THREE.Vector3(0, 0, 0));
            var percent_base = spawn_y * speed_percent;
            var new_percent = ((percent_base) / k);


            //If the obstacle is still in front of the player
            if (k > 1) {

                arrayObstacles[i].position.setY(arrayObstacles[i].position.y - (arrayObstacles[i].position.y * new_percent));
                arrayObstacles[i].position.setX(arrayObstacles[i].position.x - (arrayObstacles[i].position.x * new_percent));

                k = arrayObstacles[i].position.distanceTo(new THREE.Vector3(0, 0, 0));

                var lenght_1 = ((k + (spawn_width / 2)) * getTanDeg(degrees / 2));
                var lenght_2 = ((k - (spawn_width / 2)) * getTanDeg(degrees / 2));

                arrayObstacles[i].geometry.vertices[0].x = lenght_1;
                arrayObstacles[i].geometry.vertices[1].x = lenght_1;
                arrayObstacles[i].geometry.vertices[2].x = lenght_2;
                arrayObstacles[i].geometry.vertices[3].x = lenght_2;
                arrayObstacles[i].geometry.vertices[4].x = -lenght_1;
                arrayObstacles[i].geometry.vertices[5].x = -lenght_1;
                arrayObstacles[i].geometry.vertices[6].x = -lenght_2;
                arrayObstacles[i].geometry.vertices[7].x = -lenght_2;


                //indicate that the vertices need update
                arrayObstacles[i].geometry.verticesNeedUpdate = true;


            //Else the obstacle is deleted
            } else {
                
                scene.remove(arrayObstacles[i]);
                arrayObstacles.splice(i, 1);
                i--;
            }

        }
    }

    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(player.matrixWorld);


    var or = new THREE.Vector3(vector.x * 0.99, vector.y * 0.99, 0);
    var dir = new THREE.Vector3().subVectors(vector, or).normalize();


    //Update the picking ray with the camera and mouse position	
    raycaster.set(or, dir);



    //Calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        if (intersects[0].distance < 5) {
            intersects[0].object.material.color.set(0xffffff);
            playing = false;
            gameOver();
        }

    }

}


var render = function() {

    requestAnimationFrame(render);

    changeGameColors();

    rotateGame(rotate_level_speed);

    if (playing) {
    
        //moveWithMusic();
        
        if (frames % pattern_duration == 0){
            switchPattern(Math.floor((Math.random() * 4) + 1));
        }

        moveBlocs(obstacle_speed);

        if (keyboard.pressed("left")) {
            rotateEuler(player, 0.15, "Z");
        }

        if (keyboard.pressed("right")) {
            rotateEuler(player, -0.15, "Z");
        }


        if (frames % spawn_obstacle_delay == 0) {
            followPattern();
        }

        if (frames % fastrotate_level_delay == 0) {
            rotation_needed = 180;
        }

        if (frames % 600 == 0) {
            rotate_level_speed = rotate_level_speed * -1;
        }
        
        frames++;

        displayTime(frames, '#current_n');
        store(frames);
       

    }
    
     renderer.render(scene, camera);
};

setupScene();
render();

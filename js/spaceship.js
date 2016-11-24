"use strict"

var pro5 = pro5 || {};

pro5.spaceship = (function(){

    var Spaceship = function(mesh){

        this.mesh = mesh;
        this.mesh.name = "ship";
    }

    var createShip, updateShip, ship, checkForCollision, calculateSunDistance;

    createShip = function createShip(){
        pro5.engine.loadObject("objects/rocket/rocket.json", function(mesh){
            ship = new Spaceship(mesh);
            ship.mesh.position.y = 50;
            ship.mesh.scale.set(3, 3, 3);
			pro5.engine.loadObject("objects/rocket/flame.json", function(mesh){

				// parent flame mesh to rocket
				ship.mesh.add(mesh);
				mesh.position.y = -0.59;
				//mesh.scale.set(0,0,0);
				ship.mesh.children[0].visible = false;
				mesh.material.materials[0].emissive = new THREE.Color(0xb1932e);
				pro5.gui.addThreeColor(mesh.material.materials[0], "emissive");

				// add point light for flame
				var flame = new THREE.PointLight(0xe8b714, 1, 10);
				flame.position.y = -0.77;
				flame.position.z = 0.8;
				flame.intensity = 0;
				ship.mesh.add(flame);

				if(DEBUG){
					pro5.gui.add(flame.position, "y");
					pro5.gui.add(flame.position, "z");
					pro5.gui.add(flame, "intensity");
					pro5.gui.addThreeColor(flame, "color");
				}
			});
        });
    }

    calculateSunDistance = function calculateSunDistance() {
        var elem = document.getElementById("bar-top--currentdistance-calc");

        if(ship != undefined){
            elem.innerHTML = (Math.round( (ship.mesh.position.y-pro5.world.radiusSun) * 1160000)).toLocaleString();
        }
    }

    //Collision
    checkForCollision = function checkForCollision(){

        if(ship != undefined){

            //console.log(ship.mesh);

            /*for(var i = 0; i < pro5.Planet.arrayPlanets.length; i++){
                if()
            }*/
            // direction vectors
            var rays = [
                /*new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(0, -1, 0),
                new THREE.Vector3(-1, 1, 1),
                new THREE.Vector3(1, 1, 1),
                new THREE.Vector3(1, 1, -1),
                new THREE.Vector3(-1, 1, -1),
                new THREE.Vector3(1, -1, -1),
                new THREE.Vector3(1, -1, 1),
                new THREE.Vector3(-1, -1, 1),
                new THREE.Vector3(-1, -1, -1)*/

                new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(1, 1, 0),
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(1, -1, 0),
                new THREE.Vector3(0, -1, 0),
                new THREE.Vector3(-1, -1, 0),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(-1, 1, 0),
            ];

            for (var vertexIndex = 0; vertexIndex < rays.length; vertexIndex++)
            {
                var raycaster = new THREE.Raycaster();
                raycaster.set(ship.mesh.position, rays[vertexIndex]);

                var intersections = raycaster.intersectObjects(pro5.Planet.arrayPlanets);


                if(intersections.length > 0 && intersections[0].distance <= 20){
                    // handle collision...
                    console.log(intersections[0].object.name);
                }
            }
        }
    }

    //Update Spaceship
    var keyboard = new THREEx.KeyboardState();
    var a = new THREE.Vector2(0, 0);
    var maxspeed = 0.7;
    var rotspeed = 0.1;
    var acc = 0.03;
    var damping = 0.9;
    var cameraY,
        boundry;
    var moving = false;

    updateShip = function updateShip(cameraY, boundry){

        if(keyboard.pressed("left")) {
            ship.mesh.rotation.z += rotspeed;
            a.rotateAround({x:0, y:0}, rotspeed);
        }
        if(keyboard.pressed("right")) {
            ship.mesh.rotation.z -= rotspeed;
            a.rotateAround({x:0, y:0}, -rotspeed);
        }
        if(keyboard.pressed("up")){
            if(a.length() < maxspeed){
                a.y += acc * Math.cos(ship.mesh.rotation.z);
                a.x += -acc * Math.sin(ship.mesh.rotation.z);
				//ship.mesh.children[0].scale.set(1,1,1);
				ship.mesh.children[0].visible = true;
				ship.mesh.children[1].intensity = 1;
                moving = true;
            }
        } else if(keyboard.pressed("down")) {
            if(a.length() < maxspeed){
                a.y -= acc * Math.cos(ship.mesh.rotation.z);
                a.x -= -acc * Math.sin(ship.mesh.rotation.z);
                moving = true;
            }
        } else {
            a.y *= damping;
            a.x *= damping;
			if(ship && ship.mesh.children[0] && ship.mesh.children[1]){
				//ship.mesh.children[0].scale.set(0,0,0);
				ship.mesh.children[0].visible = false;
				ship.mesh.children[1].intensity = 0;
			}
            moving = false;
        }

        if(ship){

            ship.mesh.position.y += a.y;

            // checks boundries
            if(ship.mesh.position.x + a.x <= boundry - 3.5 && ship.mesh.position.x + a.x >= -boundry + 3.5)
                ship.mesh.position.x += a.x;

            if(cameraY == undefined){
                return 50;
            } else{
                if(ship.mesh.position.y >= cameraY + 10 ){
                    if(moving)
                        pro5.engine.cameraZoom(true);
                    else
                        pro5.engine.cameraZoom(false);

                    return ship.mesh.position.y - 10;
                }
                else if(ship.mesh.position.y <= cameraY - 10){
                    if(moving)
                        pro5.engine.cameraZoom(true);
                    else
                        pro5.engine.cameraZoom(false);

                    return ship.mesh.position.y + 10;
                } else {
                    if(!moving)
                        pro5.engine.cameraZoom(false);
                }

            }
            return cameraY;

        }


    }

    return{
        createShip:createShip,
        updateShip:updateShip,
        checkForCollision:checkForCollision,
        calculateSunDistance:calculateSunDistance
    }

})();

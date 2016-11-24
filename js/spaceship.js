"use strict"

var pro5 = pro5 || {};

pro5.spaceship = (function(){

    var Spaceship = function(mesh){

        this.mesh = mesh;
        this.mesh.name = "ship";
    }
    
    var ship, currentPlanet = "mercury", planetNr=0,

        createShip,
        updateShip,
        checkForCollision,
        calculateSunDistance,
        setDistanceToNext;

    createShip = function createShip(){
        pro5.engine.loadObject("objects/rocket/rocket.json", function(mesh){
            ship = new Spaceship(mesh);
            ship.mesh.position.y = 50;
            ship.mesh.scale.set(3, 3, 3);
        });
    }

    setDistanceToNext = function setDistanceToNext(currentSunDistance) {
        var setNext = false;
        var setPrevious = false;
        var currentPlanet = pro5.world.planetDistances.root[planetNr];

        var distanceToNext = currentPlanet.distance;
        var currentPlanetName = currentPlanet.name;
        var currentDistanceToNext = distanceToNext - currentSunDistance;

        if(currentDistanceToNext < 0 && !setNext){
            planetNr++;
            setNext = true;
        }

        if(planetNr != 0){
            var lastPlanet = pro5.world.planetDistances.root[planetNr-1];

            if( (currentDistanceToNext > (distanceToNext - lastPlanet.distance)) && !setPrevious ) {
                planetNr--;
                setPrevious = true;
            }
        }
        var planetName = document.getElementById("bar-top--nextplanet-name");
        var planetDistance = document.getElementById("bar-top--nextplanet-distance-calc");

        if(ship != undefined){
            planetName.innerHTML = currentPlanetName;
            planetDistance.innerHTML = Math.floor((currentDistanceToNext/1000000)).toLocaleString();
        }

    }

    calculateSunDistance = function calculateSunDistance() {
        var elem = document.getElementById("bar-top--currentdistance-calc");
        var currentSunDistance;

        if(ship != undefined){
            currentSunDistance = Math.round( (ship.mesh.position.y-pro5.world.radiusSun) * 1160000);
            elem.innerHTML = currentSunDistance.toLocaleString();
        }

        setDistanceToNext(currentSunDistance);
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

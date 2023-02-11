import * as THREE from '../node_modules/three/build/three.module.js';
import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from '../node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js'

class App {
	constructor() {
		const divContainer = document.querySelector("#webgl_container");
		this._divContainer = divContainer;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;
		renderer.shadowMap.enabled = true;
		renderer.setSize(window.innerWidth, window.innerHeight);
		const scene = new THREE.Scene();
		this._scene = scene;

		this._setupCamera();
		this._setupLight();
		this._setupModel();
		// this._setupControls();
		this._setBackground();
		this._setGameControls();
		window.onresize = this.resize.bind(this);
		this.resize();
		this.currDirection = 0
		this.xDown = null
		this.yDown = null

		requestAnimationFrame(this.render.bind(this));
		
		
	}
	_setGameControls(){
		
        document.addEventListener('touchstart', this._handleTouchStart.bind(this), false);        
        document.addEventListener('touchmove', this._handleTouchMove.bind(this), false);
        document.addEventListener('keydown', this._keydownEvent(this), false); 
        this.xDown = null;                                                        
        this.yDown = null;
	}
    _getTouches(evt) {
        return evt.touches ||             
                evt.originalEvent.touches; 
        }                                                     
                                                                                
    _handleTouchStart(evt) {
            const firstTouch = this._getTouches(evt)[0];                                      
            this.xDown = firstTouch.clientX;                                      
            this.yDown = firstTouch.clientY;                              
        }                                               
                                                                                
    _handleTouchMove(evt) {
            if ( ! this.xDown || ! this.yDown ) {
                return;
            }
    
            let xUp = evt.touches[0].clientX;                                    
            let yUp = evt.touches[0].clientY;
    
            let xDiff = this.xDown - xUp;
            let yDiff = this.yDown - yUp;
                                                                                
            if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
                if ( xDiff > 0 ) {
                    this.currDirection = 3; //-x
                } else {
                    this.currDirection = 2; //+x
                }                       
            } else {
                if ( yDiff > 0 ) {
                    this.currDirection = 0; //-z
                } else { 
                    this.currDirection = 1; //+z
                }                                                                 
            }
            /* reset values */
            this.xDown = null;
            this.yDown = null;     
			console.log(this.currDirection)
        }
    _keydownEvent(e){
                if(e.keyCode === 37){
                    this.currDirection = 3;
                }
                else if(e.keyCode === 38){
                    this.currDirection = 0;
                }
                else if(e.keyCode === 39){
                    this.currDirection = 2;
                }
                else if(e.keyCode === 40){
                    this.currDirection = 1;
                }
        }
	


	_setBackground(){
		this._scene.background = new THREE.Color(0xc4e4fe)
		
	}



	_setupControls(){
		new OrbitControls(this._camera, this._divContainer);
	}

	_setupCamera() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;
		const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
		camera.position.set(0, 40, 40)
		camera.zoom = 0.25
		camera.lookAt(0,0,0)
		this._camera = camera;
	}

	_setupLight() {
		const auxLight = new THREE.DirectionalLight(0xffffff, 0.7);
		auxLight.position.set(20, 40, 30);
		this._scene.add(auxLight);



		const color = 0xffffff;
		const intensity = 0.6;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(20, 40, 30);
		this._scene.add(light);
		light.castShadow = true;
		light.shadow.mapSize.width = light.shadow.mapSize.height = 1024
		light.shadow.radius = 5
	}

	_setupModel() {
		const baseHeight = 100;
		const baseWidth = 29;
		const baseGeometry = new RoundedBoxGeometry(baseWidth,baseHeight,baseWidth, 10, 0.3);
		const baseMaterial = new THREE.MeshPhysicalMaterial({
			color: 0x37FF33,
			emissive: 0x000000,
			roughness: 1,
			metalness: 0,
			wireframe: false,
			flatShading: false,
			clearcoat:1,
			clearcoatRoughness:0
		})
		const base = new THREE.Mesh(baseGeometry, baseMaterial);
		base.position.set(0, - baseHeight /2 )
		this._scene.add(base);
		base.receiveShadow = true;

        const cubeGeometry = new RoundedBoxGeometry(1,1,1,10,0.1);
        const cubeMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x33CBFF,
			emissive: 0x000000,
			roughness: 1,
			metalness: 0,
			wireframe: false,
			flatShading: false,
			clearcoat:1,
			clearcoatRoughness:0
        })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(0,0.5,0);
        this._scene.add(cube)
		cube.castShadow = true
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height);
	}

	render(time) {
		this._renderer.render(this._scene, this._camera);
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001;
		console.log(this.currDirection)
	}
}



window.onload = function () {
	new App();
};


// let camera, scene, renderer, controls;
// window.addEventListener("resize", onResize, false);
// function onResize(){
//     camera.aspect = window.innerWidth / (window.innerHeight);
//     camera.updateProjectionMatrix();
//     renderer.setSize(window.innerWidth, window.innerHeight);
// }

// function init(){

//     game();

//     function game(){
//         document.querySelector("body").innerHTML = `		<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" integrity="sha384-w76AqPfDkMBDXo30jS1Sgez6pr3x5MlQ1ZAGC+nuZB+EYdgRZgiwxhTBTkF7CXvN" crossorigin="anonymous"></script>
// 		<script src="https://threejs.org/build/three.min.js"></script>
// 		<script src="https://threejs.org/examples/js/controls/OrbitControls.js"></script>
// 		<script src="main.js"></script>`
//         document.querySelector("body").insertAdjacentHTML('beforeend',`<div id = "score">score : 0</div>		<div class="modal fade" id="loseModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
//         <div class="modal-dialog modal-dialog-centered">
//           <div class="modal-content" style="background-color: rgba(0,0,0,0); border-color: rgba(0,0,0,0);">
//             <div class="modal-body" >
//                 <div style ="font-size: 40px; color : #ffffff">Game Over!</div>
//                 <br>
//                 <button type="button" class="btn btn-primary" id="restart" >restart</button>
//             </div>
//           </div>
//         </div>
//     </div>`)
//         document.querySelector("#restart").addEventListener("click", ()=>{
//             game();
//         })
//         const scoreBoard = document.querySelector("#score");
//         /////////////////swife detector////////////////////////////////////////
//         let curr_direction = 0
//         document.addEventListener('touchstart', handleTouchStart, false);        
//         document.addEventListener('touchmove', handleTouchMove, false);
//         document.addEventListener('keydown', keydownEvent, false); 
//         let xDown = null;                                                        
//         let yDown = null;
    
//         function getTouches(evt) {
//         return evt.touches ||             
//                 evt.originalEvent.touches; 
//         }                                                     
                                                                                
//         function handleTouchStart(evt) {
//             const firstTouch = getTouches(evt)[0];                                      
//             xDown = firstTouch.clientX;                                      
//             yDown = firstTouch.clientY;                                      
//         };                                                
                                                                                
//         function handleTouchMove(evt) {
//             if ( ! xDown || ! yDown ) {
//                 return;
//             }
    
//             let xUp = evt.touches[0].clientX;                                    
//             let yUp = evt.touches[0].clientY;
    
//             let xDiff = xDown - xUp;
//             let yDiff = yDown - yUp;
                                                                                
//             if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
//                 if ( xDiff > 0 ) {
//                     curr_direction = 3;
//                 } else {
//                     curr_direction = 2;
//                 }                       
//             } else {
//                 if ( yDiff > 0 ) {
//                     curr_direction = 0;
//                 } else { 
//                     curr_direction = 1;
//                 }                                                                 
//             }
//             /* reset values */
//             xDown = null;
//             yDown = null;                                             
//         };
//         function keydownEvent(e){
//                 if(e.keyCode === 37){
//                     curr_direction = 3;
//                 }
//                 else if(e.keyCode === 38){
//                     curr_direction = 0;
//                 }
//                 else if(e.keyCode === 39){
//                     curr_direction = 2;
//                 }
//                 else if(e.keyCode === 40){
//                     curr_direction = 1;
//                 }
//         }
//         ////////////////////////////////////////////////////////////////
    
    
//         scene = new THREE.Scene();
//         camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
//         camera.position.set(-60,60,25);
//         camera.lookAt(scene.position);
    
    
//         let spotLight = new THREE.SpotLight(0xffffff);
//         spotLight.position.set(-40, 60, 70);
//         spotLight.castShadow = true;
//         scene.add(spotLight);
        
    
//         const planeLen = 29
//         let plane = new THREE.Mesh(
    
//             new THREE.PlaneGeometry(planeLen,planeLen,1,1),
//             new THREE.MeshBasicMaterial({color: 0x777777})
//             );
//         plane.rotation.x = -0.5 * Math.PI;
//         plane.position.set(0,0,0);
//         plane.receiveShadow = true;
//         scene.add(plane);
    
    
        
//         let boxLenX = 1;
//         let boxLenY = 1;
//         let boxLenZ = 1;
//         let cube = new THREE.Mesh(
//             new THREE.BoxGeometry(boxLenX,boxLenY,boxLenZ),
//             new THREE.MeshLambertMaterial({color: 0x00ffff})
//         );
//         cube.matrixAutoUpdate = false;
//         cube.castShadow = true;
//         scene.add(cube);
    
//         const radius = 0.45;
//         let apple = new THREE.Mesh(
//             new THREE.PlaneGeometry( radius * 2, radius * 2, 1,1), 
//             new THREE.MeshBasicMaterial( { color: 0xffff00 } )
//         )
//         apple.matrixAutoUpdate = false;
//         function rangeRandom(){
//             return Math.floor(Math.random() * planeLen) - (planeLen - 1)/2;
//         }
//         let appleCoordinate = {x:rangeRandom(), z:rangeRandom()};
//         apple.matrix = new THREE.Matrix4().makeTranslation(appleCoordinate.x,0.1,appleCoordinate.z).multiply(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    
//         scene.add(apple)
//         const myModalEl = new bootstrap.Modal(document.querySelector('#loseModal'));
        
//         let i = 0;
//         let j = 0;
//         let score = 0;
//         let increment = 1;
//         let start = true
//         let worldLen = {x : boxLenX, y : boxLenY, z : boxLenZ}
//         let coordinate = {x : 0, z : 0};
//         let worldToLocal = {x : 0, y : 1, z : 2};
//         let direction = 0;
//         let staticMatrix = new THREE.Matrix4();
//         function renderScene(){
            
//             camera.lookAt(scene.position);
//             if(start){
//                 i += 0.05;
//                 //x+
                
//                 if(direction === 0){
//                     cube.matrix = new THREE.Matrix4().makeTranslation(worldLen.x/2 + coordinate.x,0,coordinate.z).multiply(
//                         new THREE.Matrix4().makeRotationZ(-i).multiply(
//                         new THREE.Matrix4().makeTranslation(-worldLen.x/2,worldLen.y/2,0).multiply(
//                             staticMatrix
//                         )))
//                     if (i >= Math.PI/2){
//                         start = false
//                         coordinate.x += worldLen.x/2 + worldLen.y/2;
//                         staticMatrix = new THREE.Matrix4().makeRotationZ(Math.PI / 2).multiply(staticMatrix);
//                         [worldLen.x, worldLen.y] = [worldLen.y, worldLen.x];
//                         [worldToLocal.x, worldToLocal.y] = [worldToLocal.y, worldToLocal.x];
//                     }
//                 }            
//                 //x-
//                 else if(direction === 1){
//                     cube.matrix = new THREE.Matrix4().makeTranslation(-worldLen.x/2 + coordinate.x,0,coordinate.z).multiply(
//                         new THREE.Matrix4().makeRotationZ(i).multiply(
//                         new THREE.Matrix4().makeTranslation(worldLen.x/2,worldLen.y/2,0).multiply(
//                             staticMatrix
//                         )))
//                     if (i >= Math.PI/2){
//                         start = false
//                         coordinate.x -= worldLen.x/2 + worldLen.y/2;
//                         staticMatrix = new THREE.Matrix4().makeRotationZ(Math.PI / 2).multiply(staticMatrix);
//                         [worldLen.x, worldLen.y] = [worldLen.y, worldLen.x];
//                         [worldToLocal.x, worldToLocal.y] = [worldToLocal.y, worldToLocal.x];
//                     }                
//                 }            
//                 //z+
//                 else if(direction === 2){
//                     cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,0,worldLen.z/2 + coordinate.z).multiply(
//                         new THREE.Matrix4().makeRotationX(i).multiply(
//                         new THREE.Matrix4().makeTranslation(0,worldLen.y/2, -worldLen.z/2).multiply(
//                             staticMatrix
//                         )))
//                     if (i >= Math.PI/2){
//                         start = false
//                         coordinate.z += worldLen.z/2 + worldLen.y/2;
//                         staticMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2).multiply(staticMatrix);
//                         [worldLen.z, worldLen.y] = [worldLen.y, worldLen.z];
//                         [worldToLocal.z, worldToLocal.y] = [worldToLocal.y, worldToLocal.z];
//                     }
//                 }
//                 //z-
//                 else if(direction === 3){
//                     cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,0,-worldLen.z/2 + coordinate.z).multiply(
//                         new THREE.Matrix4().makeRotationX(-i).multiply(
//                         new THREE.Matrix4().makeTranslation(0,worldLen.y/2, worldLen.z/2).multiply(
//                             staticMatrix
//                         )))
//                     if (i >= Math.PI/2){
//                         start = false
//                         coordinate.z -= worldLen.z/2 + worldLen.y/2;
//                         staticMatrix = new THREE.Matrix4().makeRotationX(Math.PI / 2).multiply(staticMatrix);
//                         [worldLen.z, worldLen.y] = [worldLen.y, worldLen.z];
//                         [worldToLocal.z, worldToLocal.y] = [worldToLocal.y, worldToLocal.z];
//                     }
//                 }
    
    
                
//             }
//             else{
                
//                 direction = curr_direction;
//                 i = 0
//                 if(Math.abs(coordinate.x*2) - worldLen.x > planeLen-1 || Math.abs(coordinate.z*2) - worldLen.z > planeLen-1){
//                     myModalEl.show();
//                     j += 0.5;
//                     cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,worldLen.y/2 - j,coordinate.z).multiply(staticMatrix)
//                 }
//                 else if(Math.abs(appleCoordinate.x - coordinate.x) < radius + worldLen.x/2 && Math.abs(appleCoordinate.z - coordinate.z) < radius + worldLen.z/2){
//                     j+= 0.1;
//                     cube.matrix = new THREE.Matrix4().makeTranslation(coordinate.x,(worldLen.y + j) / 2,coordinate.z).multiply(
//                         new THREE.Matrix4().makeScale(1,(worldLen.y + j)/worldLen.y,1).multiply(staticMatrix)
//                     )
//                     if (j>increment){
//                         j =0;
//                         start = true;
//                         staticMatrix = new THREE.Matrix4().makeScale(1,(worldLen.y + increment)/worldLen.y,1).multiply(staticMatrix);
//                         worldLen.y += increment
//                         appleCoordinate = {x:rangeRandom(), z:rangeRandom()};
                        
//                         apple.matrix = new THREE.Matrix4().makeTranslation(appleCoordinate.x,0.1,appleCoordinate.z).multiply(new THREE.Matrix4().makeRotationX(- Math.PI/2));
//                         score++
//                         console.log(score)
//                         scoreBoard.innerHTML = `score : ${score}`
//                     }
    
//                 }
//                 else{
//                     start = true;
    
//                 }
//             }
//             // controls.update();
//             requestAnimationFrame(renderScene);
//             renderer.render(scene, camera);
//         }
    
        
//         //renderer
//         renderer = new THREE.WebGLRenderer( {antialias : true} );
//         renderer.setClearColor(0xEEEEEE);
//         renderer.setSize( window.innerWidth, window.innerHeight );
//         renderer.shadowMap.enabled = true;
//         document.body.appendChild(renderer.domElement);
//         // controls = new THREE.OrbitControls( camera, renderer.domElement );
//         renderScene();
//     }
// }
// window.onload = init;

// //작아지는 거

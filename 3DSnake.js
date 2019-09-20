//global: THREE Scene obj, store whole scene of 3D Snake Game
var scene;

//global: THREE Renderer obj, store renderer
var renderer;

//global: THREE Camera obj, store camera
var camera;

//global: JQuery, <p>, store length of snake
var $score;

//-------------------------------------------------------guideLine
//global: store all guideLines
var guideLines = {x:[],y:[],z:[]};

function drawGuideLines(whichAxis,x,y,z){
    var geometry = null;
    var xyz = [];
    
    switch(whichAxis){
        case 'x':
            xyz = [x,10.5,10.5];
            var material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
            break;
        case 'y':
            xyz = [10.5,y,10.5];
            var material = new THREE.LineBasicMaterial( { color: 0x005500 } );
            break;
        case 'z':
            xyz = [10.5,10.5,z];
            var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
            break;
    }
   for(var i=0;i<=6;i+=2){
        geometry = new THREE.Geometry();
        var point1 = [...xyz];
        var point2 = [...xyz];
       
       switch(whichAxis){
            case 'x':
                var bit1 = 1;
                var bit2 = 2;
                if(i&4){
                    var bit1 = 2;
                    var bit2 = 1;
                }
                break;
            case 'y':
                var bit1 = 0;
                var bit2 = 2;
                if(i&4){
                    var bit1 = 2;
                    var bit2 = 0;
                }
                break;
            case 'z':
                var bit1 = 0;
                var bit2 = 1;
                if(i&4){
                    var bit1 = 1;
                    var bit2 = 0;
                }
                break;
        }
       if(i&1){
            point1[bit1] = -xyz[bit1];
        }
        if(i&2){
            point1[bit2] = -xyz[bit2];
        }
        if((i+1)&1){
            point2[bit1] = -xyz[bit1];
        }
        if((i+1)&2){
            point2[bit2] = -xyz[bit2];
        }
        geometry.vertices.push(new THREE.Vector3( point1[0], point1[1], point1[2]) );
        geometry.vertices.push(new THREE.Vector3( point2[0], point2[1], point2[2]) );
        var line = new THREE.Line( geometry, material);
        scene.add(line);
       
        switch(whichAxis){
            case 'x':
                guideLines.x.push(line);
                break;
            case 'y':
                guideLines.y.push(line);
                break;
            case 'z':
                guideLines.z.push(line);
                break;
        }
    } 

}

function updateGuideLine(){
    var lineX = guideLines.x;
    lineX.forEach(l=>{
        l.position.x = head.cubeLook.position.x;
    })
    
    var lineY = guideLines.y;
    lineY.forEach(l=>{
        l.position.y = head.cubeLook.position.y;
    })
    
    var lineZ = guideLines.z;
    lineZ.forEach(l=>{
        l.position.z = head.cubeLook.position.z;
    })
}
//-------------------------------------------------------guideLine

//-------------------------------------------------------createScene
//global: object,int,the end of space
var boundingBox = {left:10,right:-10,top:10,bottom:-10,front:10,back:-10};

//global: Cube,first cube
var head;

//global: int,animation setInterval return value
var animation;

function fillScene(){
    //global: scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xeeeeee, 2000, 4000 );
    //global: renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor( scene.fog.color, 1 );
    
    document.body.appendChild( renderer.domElement );
    
    //global: camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 5;
    
    //light
    var ambientLight = new THREE.AmbientLight( 0x555555 );
    scene.add(ambientLight);
    
    //camera control
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set(0,0,0);
    
    drawBoundingGrid();
    
    drawGuideLines('x',0,0,0);
    drawGuideLines('y',0,0,0);
    drawGuideLines('z',0,0,0);
}

//global: THREE Group, store all grid lines groups
var gridGroups = [];

function drawBoundingGrid(){
    var g = _drawGrid();
    g.position.z = -10.5;
    gridGroups.push(g);
    scene.add(g);
    
    g = _drawGrid();
    g.position.z = 10.5;
    gridGroups.push(g);
    scene.add(g);
    
    g = _drawGrid();
    g.position.x = 10.5;
    g.rotation.y = Math.PI/2;
    gridGroups.push(g);
    scene.add(g);
    
    g = _drawGrid();
    g.position.x = -10.5;
    g.rotation.y = Math.PI/2;
    gridGroups.push(g);
    scene.add(g);
    
    g = _drawGrid();
    g.position.y = 10.5;
    g.rotation.x = Math.PI/2;
    gridGroups.push(g);
    scene.add(g);
    
    g = _drawGrid();
    g.position.y = -10.5;
    g.rotation.x = Math.PI/2;
    gridGroups.push(g);
    scene.add(g);
}

//draw a grid plane
function _drawGrid() {
    var group = new THREE.Group();
    var material = new THREE.LineBasicMaterial({color: 'rgb(146,225,253)'});
    var geometry;
    for(var i=-11;i<=10;i++){
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( i+0.5, -10.5, 0) );
        geometry.vertices.push(new THREE.Vector3( i+0.5, 10.5, 0) );

        var line = new THREE.Line( geometry, material );

        group.add( line );
    }
    for(var i=-11;i<=10;i++){
        geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3( -10.5, i+0.5, 0) );
        geometry.vertices.push(new THREE.Vector3( 10.5, i+0.5, 0) );

        var line = new THREE.Line( geometry, material );

        group.add( line );
    }

    return group;
}

//create the cubeLook property of one Cube
function _createCubeLook(color){
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    //console.log(color);
    var material = new THREE.MeshLambertMaterial( { color: color } );
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;
    return cube;
}

//create a Cube instance and add to the scene
function addCube(color){
    var cube = new Cube();
    var r = Math.floor(Math.random()*128 + 128);
    var g = Math.floor(Math.random()*128 + 128);
    var b = Math.floor(Math.random()*128 + 128);
    var c = color||'rgb(' + r + ',' + g + ',' + b + ')';
    cube.cubeLook = _createCubeLook(c);
    scene.add(cube.cubeLook);
    return cube;
}

//create the snake head cube
function createGuideCube(){
    var guideCube = new Cube();
    guideCube.cubeLook = new THREE.Group();

    var loaderTX = new THREE.TextureLoader();
    var t;
    
    var wG = new THREE.PlaneGeometry( 1, 1, 32 );
    t = loaderTX.load( 'obj/tx_W.png' );
    var wM = new THREE.MeshBasicMaterial( {map:t, side: THREE.DoubleSide} );
    var wMesh = new THREE.Mesh( wG, wM );
    wMesh.position.y = 0.5;
    wMesh.rotation.x = - Math.PI * 0.5;
    guideCube.cubeLook.add( wMesh );
    
    var sG = new THREE.PlaneGeometry( 1, 1, 32 );
    t = loaderTX.load( 'obj/tx_S.png' );
    var sM = new THREE.MeshBasicMaterial( {map:t, side: THREE.DoubleSide} );
    var sMesh = new THREE.Mesh( sG, sM );
    sMesh.position.y = - 0.5;
    sMesh.rotation.x = - Math.PI * 0.5
    guideCube.cubeLook.add( sMesh );
    
    var aG = new THREE.PlaneGeometry( 1, 1, 32 );
    t = loaderTX.load( 'obj/tx_A.png' );
    var aM = new THREE.MeshBasicMaterial( {map:t, side: THREE.DoubleSide} );
    var aMesh = new THREE.Mesh( aG, aM );
    aMesh.position.x = -0.5;
    aMesh.rotation.y = Math.PI * 0.5;
    guideCube.cubeLook.add( aMesh );
    
    var dG = new THREE.PlaneGeometry( 1, 1, 32 );
    t = loaderTX.load( 'obj/tx_D.png' );
    var dM = new THREE.MeshBasicMaterial( {map:t, side: THREE.DoubleSide} );
    var dMesh = new THREE.Mesh( sG, dM );
    dMesh.position.x = 0.5;
    dMesh.rotation.y = Math.PI * 0.5;
    guideCube.cubeLook.add( dMesh );
    
    var qG = new THREE.PlaneGeometry( 1, 1, 32 );
    t = loaderTX.load( 'obj/tx_Q.png' );
    var qM = new THREE.MeshBasicMaterial( {map:t, side: THREE.DoubleSide} );
    var qMesh = new THREE.Mesh( qG, qM );
    qMesh.position.z = 0.5;
    guideCube.cubeLook.add( qMesh );
    
    var eG = new THREE.PlaneGeometry( 1, 1, 32 );
    t = loaderTX.load( 'obj/tx_E.png' );
    var eM = new THREE.MeshBasicMaterial( {map:t, side: THREE.DoubleSide} );
    var eMesh = new THREE.Mesh( eG, eM );
    eMesh.position.z = - 0.5;
    eMesh.rotation.y = Math.PI ;
    guideCube.cubeLook.add( eMesh );
    
    scene.add(guideCube.cubeLook);
    
    return guideCube;
    
}

//create the snake head cube, one body cube, boundry grids and guide grid
function init(){
    fillScene();
    
    //create head
    head = createGuideCube();
    
    head.next = addCube();
    head.end = head.next;
    
    head.next.cubeLook.position.x = -1;
    head.next.cubeData.x = -1;
    
    document.addEventListener('keydown',keyDown);
    
    animation = setInterval(animate,10);
    
    //initial score
    $score.text($score.text() + ' 2');
}
//-------------------------------------------------------createScene

//-------------------------------------------------------eatbox

//global: array, to store all food(eat boxes)
var eatBoxes;

//global: bool,
var TOEATBOX;
//gobal: int, time interval for creating a new eat box
var TIMEINTERVAL_EATBOX = 500;
//global: int, specific time interal for creating a new eat box
var timeInterval_eatBox;
//global: Cube, store the eat box which is eaten by the head
var hasEat = null;

function createEatBox(){
    var c = addCube();
    
    var headX = head.cubeLook.position.x;
    var headY = head.cubeLook.position.y;
    var headZ = head.cubeLook.position.z;
    
    var x,y,z;
    do{
        x = Math.floor(Math.random()*boundingBox.left*2 - boundingBox.left);
        y = Math.floor(Math.random()*boundingBox.top*2 - boundingBox.top);
        z = Math.floor(Math.random()*boundingBox.front*2 - boundingBox.front);
    }while(_checkCollideWithHead(headX,headY,headZ,x,y,z))
        
    c.cubeLook.position.x = x;
    c.cubeLook.position.y = y;
    c.cubeLook.position.z = z;
    
    eatBoxes.push(c);
}

//based on the direction, to check if head cube will collide with other cube during next movement
function _checkCollideWithHead(headX,headY,headZ,x,y,z){
    var headVect = new THREE.Vector3(headX+0.5,headY-0.5,headZ+0.5);
    var colBoxVect = new THREE.Vector3(x+0.5,y-0.5,z+0.5);
    
    var d = Math.round(headVect.distanceTo(colBoxVect));
    
    if(d!=0){
        return false;
    }else{
        return true;
    }
}

//determine if to create food cube or not based on timeInterval_eatBox
function _shouldCreateEatBox(){
    timeInterval_eatBox--;
    if(timeInterval_eatBox){
        return false;
    }else{
        timeInterval_eatBox = Math.floor(Math.random()*TIMEINTERVAL_EATBOX/2+ TIMEINTERVAL_EATBOX);
        return true;
    }
}

//if should create food cube then turn the TOEATBOX to true
function updateTOEATBOX(){
    if(_shouldCreateEatBox()){
        TOEATBOX = true;
    }else{
        TOEATBOX = false;
    }
}

//calculate the next position of head cube based on direction
function _headNextPosition(){
    var p = {x:head.cubeLook.position.x,y:head.cubeLook.position.y,z:head.cubeLook.position.z};
    
    switch(direction){
        case 'up':
            p.y = Math.round((p.y + 1)*100)/100;//to make sure the position will be integrete
            break;
        case 'down':
            p.y = Math.round((p.y - 1)*100)/100;
            break;
        case 'right':
            p.x = Math.round((p.x + 1)*100)/100;
            break;
        case 'left':
            p.x = Math.round((p.x - 1)*100)/100;
            break;
        case 'front':
            p.z = Math.round((p.z + 1)*100)/100;
            break;
        case 'back':
            p.z = Math.round((p.z - 1)*100)/100;
            break;
    }
    return p;
}

//if head collide with eatBox, then change hasEat value and hasEat will append to the end of body
function checkForEat(){
    
    var headNextP = _headNextPosition();
    
    eatBoxes.forEach(function(eatBox,i,arr){
        var x = eatBox.cubeLook.position.x;
        var y = eatBox.cubeLook.position.y;
        var z = eatBox.cubeLook.position.z;
        if(_checkCollideWithHead(headNextP.x,headNextP.y,headNextP.z,x,y,z)){
            //move out from eatBoxes
            var t = arr[arr.length-1];
            arr[arr.length-1] = arr[i]
            arr[i] = t;
            arr.pop();
            
            var next = head.end?head.end:head.next;
            
            hasEat = eatBox;
            eatBox.cubeLook.visible = false;
                            
            eatBox.cubeData.pX = next.cubeLook.position.x;
            eatBox.cubeData.pY = next.cubeLook.position.y;
            eatBox.cubeData.pZ = next.cubeLook.position.z;

            eatBox.cubeData.x = next.cubeLook.position.x;
            eatBox.cubeData.y = next.cubeLook.position.y;
            eatBox.cubeData.z = next.cubeLook.position.z;
            
            eatBox.cubeLook.position.x = next.cubeLook.position.x;
            eatBox.cubeLook.position.y = next.cubeLook.position.y;
            eatBox.cubeLook.position.z = next.cubeLook.position.z;

        }
    })//forEach
    
}

//-------------------------------------------------------eatbox

//-------------------------------------------------------updateFrame
//global: string,direction of move, the default direction is right
var direction = 'right';

//global: bool, should pause or not
var pause = false;

//global: bool,indicate its time to move
var TOMOVE;
//global: int,time interval for moving
var TIMEINTERVAL = 50;
//global: specific time interval for moving
var timeInterval = TIMEINTERVAL;

//global: int,moving speed
var SPEED = 0.1;

//key down event, move head
function keyDown(e){
    if(TOMOVE)return;
    d = direction;
    switch(e.keyCode){
        case 87://w
            direction = 'up';
            //console.log('up');
            break;
        case 68://d
            direction = 'right';
            //console.log('right');
            break;
        case 65://a
            direction = 'left';
            //console.log('left');
            break;
        case 83://s
            direction = 'down';
            //console.log('down');
            break;
        case 81://q
            direction = 'front';
            //console.log('front');
            break;
        case 69://e
            direction = 'back';
            //console.log('back');
            break;
        case 32://space
            pause = !pause;
            if(pause){
                scene.fog = new THREE.Fog( 0x222222, 2000, 4000 );
                renderer.setClearColor( scene.fog.color, 1 );
                
                gridGroups.forEach(i=>{
                    i.children.forEach(j=>{
                        j.material.color = new THREE.Color('rgb(50,50,50)');
                    })
                })
                
                showIntoductionButton();
            }else{
                scene.fog = new THREE.Fog( 0xeeeeee, 2000, 4000 );
                renderer.setClearColor( scene.fog.color, 1 );
                
                gridGroups.forEach(i=>{
                    i.children.forEach(j=>{
                        j.material.color = new THREE.Color('rgb(146,225,253)');
                    })
                })
                
                unshowIntroductionButton();
            }
            //console.log('pause');
            break;
    }//end switch
    //console.log(moveLimit());
    direction = (moveLimit()==direction)?d:direction;
}

function showIntoductionButton(){
    var $introductionButton = $('<img src="obj/introduction.png" id="introductionButton">');
    $introductionButton.css({top:'40%',left:'50%',position:'absolute',marginLeft:'-20%'});
    $introductionButton.css({width:'40%',position:"absolute"});
    
    $introductionButton.on('mouseover',introductionB_MOver);
    $introductionButton.on('mouseout',introductionB_MOut);
    $introductionButton.on('click',introductionB_click);
    
    var $back = $('<img src="obj/back.png" id="backButton">');
    $back.css({position:'absolute',top:'60%',left:'50%',marginLeft:'-100px',width:'20%'});
    $back.on('mouseover',back_MOver);
    $back.on('mouseout',back_MOut);
    $back.on('click',back_click);
    
    $introductionButton.appendTo(document.body);
    $back.appendTo(document.body);
    
    return;
    
    function introductionB_MOut(){
        $introductionButton.attr('src','obj/introduction.png');
    }
    function introductionB_MOver(){
        $introductionButton.attr('src','obj/introduction_over.png');
    }
    function introductionB_click(){
        $('#introductionButton').remove();
        $('#backButton').remove();
        
        var $intoPage = $('<img src="obj/introPage.png" id="introduction">');
        $intoPage.css({position:'absolute',top:'50%',left:'50%',marginLeft:'-450px',marginTop:'-300px'});
        
        var $back = $('<img src="obj/back.png" id="backButton">');
        $back.css({position:'absolute',top:'85%',left:'40%',width:'10%'});
        $back.on('mouseover',back_MOver);
        $back.on('mouseout',back_MOut);
        $back.on('click',back_click);
        
        $intoPage.appendTo(document.body);
        $back.appendTo(document.body);
        
        return;
    }
    function back_MOver(){
        $('#backButton').attr('src','obj/back_over.png');
    }
    function back_MOut(){
        $('#backButton').attr('src','obj/back.png');
    }
    function back_click(){
        backToGame();
    }
    function backToGame(){
        $('#introductionButton').remove();
        $('#backButton').remove();
        $('#introduction').remove();
        
        scene.fog = new THREE.Fog( 0xeeeeee, 2000, 4000 );
        renderer.setClearColor( scene.fog.color, 1 );

        gridGroups.forEach(i=>{
            i.children.forEach(j=>{
                j.material.color = new THREE.Color('rgb(146,225,253)');
            })
        })
        pause = false;
    }
}

function unshowIntroductionButton(){
    $('#introductionButton').remove();
    
    $('#introduction').remove();
    $('#backButton').remove();
}

//to limit the direction snake can go, to avoid the snake head go back and immidiately collide with its next body cube
function moveLimit(){
    var headX = head.cubeLook.position.x;
    var headY = head.cubeLook.position.y;
    var headZ = head.cubeLook.position.z;
    var x = head.next.cubeLook.position.x;
    var y = head.next.cubeLook.position.y;
    var z = head.next.cubeLook.position.z;
    if(_checkCollideWithHead(headX+1,headY,headZ,x,y,z)){
        return 'right';
    }
    if(_checkCollideWithHead(headX-1,headY,headZ,x,y,z)){
        return 'left';
    }
    if(_checkCollideWithHead(headX,headY+1,headZ,x,y,z)){
        return 'up';
    }
    if(_checkCollideWithHead(headX,headY-1,headZ,x,y,z)){
        return 'down';
    }
    if(_checkCollideWithHead(headX,headY,headZ+1,x,y,z)){
        return 'front';
    }
    if(_checkCollideWithHead(headX,headY,headZ-1,x,y,z)){
        return 'back';
    }
}

function _shouldMove(){
    timeInterval--;
    if(timeInterval>=0){
        return false
    }else if(timeInterval>=-(TIMEINTERVAL/5)){
        return true;
    }else{
        timeInterval = TIMEINTERVAL;
        return false;
    }   
}

function updateTOMOVE(){
    if(_shouldMove()){
        TOMOVE = true;
    }else{
        TOMOVE = false;
    }
}

function updatePosition(){
    var c = head;
    
    checkForEat();
    
    switch(direction){
        case 'up':
            c.cubeLook.position.y = Math.round((c.cubeLook.position.y + SPEED)*100)/100;
            break;
        case 'down':
            c.cubeLook.position.y = Math.round((c.cubeLook.position.y - SPEED)*100)/100;
            break;
        case 'left':
            c.cubeLook.position.x = Math.round((c.cubeLook.position.x - SPEED)*100)/100;
            break;
        case 'right':
            c.cubeLook.position.x = Math.round((c.cubeLook.position.x + SPEED)*100)/100;
            break;
        case 'front':
            c.cubeLook.position.z = Math.round((c.cubeLook.position.z + SPEED)*100)/100;
            break;
        case 'back':
            c.cubeLook.position.z = Math.round((c.cubeLook.position.z - SPEED)*100)/100;
            break;
    }
    
    var t = TIMEINTERVAL/4;
    while(c.next){
        c = c.next;
        c.cubeLook.position.x = Math.round((c.cubeLook.position.x + Math.round(c.cubeData.x - c.cubeData.pX)/t)*100)/100;
        c.cubeLook.position.y = Math.round((c.cubeLook.position.y + Math.round(c.cubeData.y - c.cubeData.pY)/t)*100)/100;
        c.cubeLook.position.z = Math.round((c.cubeLook.position.z + Math.round(c.cubeData.z - c.cubeData.pZ)/t)*100)/100;
    }
}

function updateCubeData(){
    var c = head;
    
    c.cubeData.pX = c.cubeLook.position.x;
    c.cubeData.pY = c.cubeLook.position.y;
    c.cubeData.pZ = c.cubeLook.position.z;
    
    while(c.next){
        c.next.cubeData.x = c.cubeLook.position.x;
        c.next.cubeData.y = c.cubeLook.position.y;
        c.next.cubeData.z = c.cubeLook.position.z;
        
        c.next.cubeData.pX = c.next.cubeLook.position.x;
        c.next.cubeData.pY = c.next.cubeLook.position.y;
        c.next.cubeData.pZ = c.next.cubeLook.position.z;
        
        c = c.next;
    }
}

function animate() {
    if(!pause){
        updateTOEATBOX();

        if(TOEATBOX){
            if(eatBoxes.length<10)createEatBox();
        }

        updateTOMOVE();

        if(TOMOVE){
            checkForDead();
            
            updatePosition();
        }else{
            roundPos();
            updateCubeData();
            
            updateGuideLine();
            
            if(hasEat){
                if(head.end){
                    head.end.next = hasEat;
                }else{
                    head.next = hasEat;
                }
                head.end = hasEat;
                
                hasEat.cubeLook.visible = true;
                hasEat = null;
                //change the length of snake
                var tx = $score.text().split(':')[0];
                var s = parseInt($score.text().split(':')[1]);
                $score.text(tx + ': ' + (++s).toString());
            }
        }
    }
    renderer.render( scene, camera );
};

//to make sure the position is integrate
function roundPos(){
    head.cubeLook.position.x = Math.round(head.cubeLook.position.x);
    head.cubeLook.position.y = Math.round(head.cubeLook.position.y);
    head.cubeLook.position.z = Math.round(head.cubeLook.position.z);
    
    var c = head;
    while(c.next){
        c = c.next;
        c.cubeLook.position.x = Math.round(c.cubeLook.position.x);
        c.cubeLook.position.y = Math.round(c.cubeLook.position.y);
        c.cubeLook.position.z = Math.round(c.cubeLook.position.z);
    }
}

//check if the head collide with the boundry or other body cube
function checkForDead(){
    if(head.cubeLook.position.x > boundingBox.left||
       head.cubeLook.position.y > boundingBox.top ||
       head.cubeLook.position.x < boundingBox.right||
       head.cubeLook.position.y < boundingBox.bottom||
       head.cubeLook.position.z < boundingBox.back||
       head.cubeLook.position.z > boundingBox.front
      ){
        clearInterval(animation);
        animation = null;
        TOMOVE = false;
        restart();
    }
    b = head.next;
    while(b){
        var headX = head.cubeLook.position.x;
        var headY = head.cubeLook.position.y;
        var headZ = head.cubeLook.position.z;
        var x = b.cubeLook.position.x;
        var y = b.cubeLook.position.y;
        var z = b.cubeLook.position.z;
        
        if(_checkCollideWithHead(headX,headY,headZ,x,y,z)){
            clearInterval(animation);
            animation = null;
            TOMOVE = false;
            restart();
            break;   
        }
        
        b = b.next;   
    }
}
//-------------------------------------------------------updateFrame

//-------------------------------------------------------Cube
//class: Cube
function Cube(){
    this.cubeLook = null;
    this.cubeData = {x:null,y:null,z:null,pX:0,pY:0,pZ:0};
    this.end = null;
    this.next = null;
}
//-------------------------------------------------------Cube

//store user input
var $snakeName = '';

//the first page
function startPage(){
    document.body.innerHTML = '';
    
    var $userDiv = $('<div id="userDiv">');
    var $userNameTag = $('<label for="userName">Snake Name: </label>');
    var $userName = $('<input type="text" id="userName">');
    var $bgImg = $('<img src="obj/bg.png">');
    
    $userNameTag.css({color:'#62b8e5'})
    $bgImg.css({position:'absolute',left:'-10px',top:'-8px',zIndex:-1});
    
    $userDiv.css({marginLeft:'-110px',marginTop:'-12px',width:'250px',height:'24px',top:'50%',left:'50%',position:'absolute'});
    
    $userNameTag.appendTo($userDiv);
    $userName.appendTo($userDiv);
    $bgImg.appendTo($userDiv);
    
    var $startButton = $('<img src="obj/start.png">');
    $startButton.css({width:'10%',position:"absolute"});
    $startButton.css({top:'60%',left:'35%',position:'absolute'});
    var $introductionButton = $('<img src="obj/introduction.png">');
    $introductionButton.css({top:'60%',left:'50%',position:'absolute'});
    $introductionButton.css({width:'20%',position:"absolute"});
    
    $startButton.on('mouseover',startB_MOver);
    $startButton.on('mouseout',startB_MOut);
    $startButton.on('click',startB_click);
    $introductionButton.on('mouseover',introductionB_MOver);
    $introductionButton.on('mouseout',introductionB_MOut);
    $introductionButton.on('click',introductionB_click);
    
    $userDiv.appendTo(document.body);
    $startButton.appendTo(document.body);
    $introductionButton.appendTo(document.body);
    
    var $d = $(document.body);
    $d.addClass('bg');
    
    return $userName;
    
    function startB_MOver(){
        $startButton.attr('src','obj/start_over.png');
    }
    function startB_MOut(){
        $startButton.attr('src','obj/start.png');
    }
    function startB_click(){
        document.body.innerHTML = '';
        startGame();
    }
    
    function introductionB_MOut(){
        $introductionButton.attr('src','obj/introduction.png');
    }
    function introductionB_MOver(){
        $introductionButton.attr('src','obj/introduction_over.png');
    }
    function introductionB_click(){
        document.body.innerHTML = '';
        
        var $intoPage = $('<img src="obj/introPage.png">');
        $intoPage.css({position:'absolute',top:'50%',left:'50%',marginLeft:'-450px',marginTop:'-300px'});
        
        var $back = $('<img src="obj/back.png">');
        $back.css({position:'absolute',top:'88%',left:'40%',width:'10%'});
        $back.on('mouseover',back_MOver);
        $back.on('mouseout',back_MOut);
        $back.on('click',back_click);
        
        $intoPage.appendTo(document.body);
        $back.appendTo(document.body);
        
        return;
        
        function back_MOver(){
            $back.attr('src','obj/back_over.png');
        }
        function back_MOut(){
            $back.attr('src','obj/back.png');
        }
        function back_click(){
            document.body.innerHTML = '';
            
            startPage();
        }
    }
}

//the game page
function startGame(){
    //init global variables
    var name = $snakeName.val()||'Snake';
    $score= $('<p>'+ 'the length of ' + name + ' is: </p>');
    $score.appendTo(document.body);
    
    TOMOVE = false;
    timeInterval = TIMEINTERVAL;
    
    TOEATBOX = false;
    timeInterval_eatBox = Math.floor(Math.random()*TIMEINTERVAL_EATBOX);
    
    eatBoxes = [];
    guideLines = {x:[],y:[],z:[]};
    
    direction = 'right';
    pause = false;
    
    head = null;
    
    init();
}

function restart(){
    var $reStartIcon = $('<img>');
    $reStartIcon.attr('src','obj/playAgain.png');
    $reStartIcon.css({'position':'absolute','top':document.body.clientHeight/2,'left':document.body.clientWidth/2-250});
    
    $reStartIcon.on('mouseover',reStart_MOver);
    $reStartIcon.on('mouseout',reStart_MOut);
    
    $reStartIcon.appendTo(document.body);
    
    var $s= $('<p>');
    $s.text('Score: '+$score.text().split(':')[1]);
    $s.appendTo(document.body);
    var w = $s.width();
    var h = parseInt($reStartIcon.css('top')) ;
    console.log(w);
    $s.css({top:h+60,left:document.body.clientWidth/2-w/2-100,position:'absolute',"font-size":'3em',color:'#5DD9ED'});
   
    $reStartIcon.on('click',reStartClick);
    
    function reStart_MOver(){
        $reStartIcon.attr('src','obj/playAgain_over.png');
    }
    function reStart_MOut(){
        $reStartIcon.attr('src','obj/playAgain.png');
    }
}

function reStartClick(){
    $('canvas').remove();
    $('p').text('Length:');
    TOMOVE = false;
    timeInterval = TIMEINTERVAL;
    TOEATBOX = false;
    timeInterval_eatBox = Math.floor(Math.random()*TIMEINTERVAL_EATBOX);
    eatBoxes = [];
    guideLines = {x:[],y:[],z:[]};
    direction = 'right';
    pause = false;
    var $reStartIcon = $('img');
    $reStartIcon.remove();
    head = null;
    
    startGame();
}

//create the first page
$snakeName = startPage();
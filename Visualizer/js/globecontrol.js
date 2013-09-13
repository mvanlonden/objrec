
        //map function to be used to map values from leap into proper degrees (0-360)
        function map(value, inputMin, inputMax, outputMin, outputMax){
        outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
        if(outVal >  outputMax){
          outVal = outputMax;
        }
        if(outVal <  outputMin){
          outVal = outputMin;
        }
        return outVal;
      }

      //create scene
      var scene = new THREE.Scene();
      var renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);


      // create a Directional light as pretend sunshine.
      directional = new THREE.DirectionalLight( 0xCCCCCC, 1.2 )
      directional.castShadow = true
      directional.position.set( 100, 200, 300 )
      directional.target.position.copy( new THREE.Vector3(0,0,0) )
      directional.shadowCameraTop     =  1000
      directional.shadowCameraRight   =  1000
      directional.shadowCameraBottom  = -1000
      directional.shadowCameraLeft    = -1000
      directional.shadowCameraNear    =  600
      directional.shadowCameraFar     = -600
      directional.shadowBias          =   -0.0001
      directional.shadowDarkness      =    0.4
      directional.shadowMapWidth      = directional.shadowMapHeight = 2048
      scene.add( directional )

      window.ambient = new THREE.AmbientLight( 0x666666 )
      scene.add( ambient )


      // create the stars
      var pMaterial = new THREE.ParticleBasicMaterial({
          color: 0xFFFFFF,
          size: 10,
          map: THREE.ImageUtils.loadTexture(
            "./media/particle.png"
          ),
          transparent: true,
          blending: THREE.CustomBlending,
          blendSrc: THREE.SrcAlphaFactor,
          blendDst: THREE.OneMinusSrcColorFactor,
          blendEquation: THREE.AddEquation
      });
      var particleCount = 3600;
      var particles = new THREE.Geometry(), pMaterial
      for(var p = 0; p < particleCount; p++) {
        var a1 = Math.random() * Math.PI * 2,
            a2 = Math.random() * Math.PI * 2,
            d = Math.random() * 500 + 500,
            particle = new THREE.Vector3(d*Math.sin(a1)*Math.cos(a2), d*Math.sin(a1)*Math.sin(a2), d*Math.cos(a1));
        particles.vertices.push(particle);
      }
      scene.add(particles)
      window.particleSystem = new THREE.ParticleSystem(particles, pMaterial);
      particleSystem.sortParticles = true;
      scene.add(particleSystem);


      //clouds object
      window.clouds = new THREE.Mesh(
        new THREE.SphereGeometry( 50 + 1, 32, 32 ),
        new THREE.MeshLambertMaterial({
          map: THREE.ImageUtils.loadTexture( './media/clouds.jpg' ),
          transparent: true,
          blending: THREE.CustomBlending,
          blendSrc: THREE.SrcAlphaFactor,
          blendDst: THREE.OneMinusSrcColorFactor,
          blendEquation: THREE.AddEquation
        })
      )
      clouds.position.set( 0, 0, 0 )
      clouds.receiveShadow = true
      clouds.castShadow = true
      scene.add( clouds )


      //earth object
      var earthBumpImage = THREE.ImageUtils.loadTexture( "./media/earthBumpMap.jpg" );
      var geometry = new THREE.SphereGeometry(50, 40, 40)
      var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture( './media/earthSatTexture.jpg' ), ambient: 0x050505, color: 0xFFFFFF, specular: 0x555555, bumpMap: earthBumpImage, bumpScale: 19, metal: true } );
      window.earth = new THREE.Mesh( geometry, material );
      scene.add(earth);


      //add camera
      WIDTH      = window.innerWidth,
      HEIGHT     = window.innerHeight,
      VIEW_ANGLE = 45,
      ASPECT     = WIDTH / HEIGHT,
      NEAR       = 0.1,
      FAR        = 10000
      window.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR );
      camera.lookAt( scene.position )
      camera.position.set( 0, 0, 290 )
      console.log(camera);

      //initite variables
      var firstValidFrame = null
      var cameraRadius = 290
      var rotateY = 90, rotateX = 0, curY = 0
      var fov = camera.fov;


      //request animation frame and connect to leap socket
      Leap.loop(function(frame) {
        if (frame.valid) {

          //rotate cloud and earth independently
          clouds.rotation.y+=.002
          earth.rotation.y+=.001

          if (!firstValidFrame) firstValidFrame = frame
          var t = firstValidFrame.translation(frame)

          //limit y-axis between 0 and 180 degrees
          curY = map(t[1], -300, 300, 0, 179)

          //assign rotation coordinates
          rotateX = t[0]
          rotateY = -curY

          zoom = Math.max(0, t[2] + 200);
          zoomFactor = 1/(1 + (zoom / 150));

          //adjust 3D spherical coordinates of the camera
          camera.position.x = earth.position.x + cameraRadius * Math.sin(rotateY * Math.PI/180) * Math.cos(rotateX * Math.PI/180)
          camera.position.z = earth.position.y + cameraRadius * Math.sin(rotateY * Math.PI/180) * Math.sin(rotateX * Math.PI/180)
          camera.position.y = earth.position.z + cameraRadius * Math.cos(rotateY * Math.PI/180)
          camera.fov = fov * zoomFactor;
        }

        camera.updateProjectionMatrix();
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
      });

      //window resize method
      window.addEventListener( 'resize', onWindowResize, false );
      function onWindowResize(){
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();

          renderer.setSize( window.innerWidth, window.innerHeight );
      }
    
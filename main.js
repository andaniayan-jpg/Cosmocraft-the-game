import * as THREE from 'three';

class InputManager {
  constructor(domElement) {
    this.domElement = domElement;

    this.keysDown = new Set();

    this.keysJustPressed = new Set();

    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;

    this.isPointerLocked = false;

    this._bindEvents();
  }

  _bindEvents() {
    window.addEventListener('keydown', (e) => {

      if (!e.repeat) {
        this.keysJustPressed.add(e.code);
      }
      this.keysDown.add(e.code);
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
    });

    this.domElement.addEventListener('click', () => {
      if (!this.isPointerLocked) {
        this.domElement.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.domElement;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isPointerLocked) return;
      this.mouseDeltaX += e.movementX;
      this.mouseDeltaY += e.movementY;
    });

    this.domElement.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  isKeyDown(code) {
    return this.keysDown.has(code);
  }

  wasKeyJustPressed(code) {
    return this.keysJustPressed.has(code);
  }

  endFrame() {
    this.keysJustPressed.clear();
  }

  consumeMouseDelta() {
    const delta = { x: this.mouseDeltaX, y: this.mouseDeltaY };
    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    return delta;
  }
}

const PLANETS = [
  {
    id: 'earth',
    name: 'Earth',
    position: { x: 0, z: 0 },
    groundRadius: 200,
    terrainType: 'rolling',
    terrainColor: 0x4c7a3d,
    rockColor: 0x6b6b6b,
    skyColor: 0x8fc7ff,
    fogColor: 0x8fc7ff,
    fogNear: 60,
    fogFar: 220,
    gravity: -18,
    amplitude: 1,
    resources: [
      { name: 'Iron', color: 0x8a7a6b },
      { name: 'Copper', color: 0xc06a3c },
    ],
  },
  {
    id: 'moon',
    name: 'Moon',
    position: { x: 300, z: 150 },
    groundRadius: 150,
    terrainType: 'cratered',
    terrainColor: 0xb9b9b9,
    rockColor: 0x9a9a9a,
    skyColor: 0x05060a,
    fogColor: 0x0a0c14,
    fogNear: 500,
    fogFar: 3000,
    gravity: -2.8,
    amplitude: 1.6,
    resources: [
      { name: 'Titanium', color: 0xaeb4bd },
      { name: 'Iron', color: 0x8a7a6b },
    ],
  },
  {
    id: 'mars',
    name: 'Mars',
    position: { x: 900, z: -200 },
    groundRadius: 190,
    terrainType: 'dunes',
    terrainColor: 0xb1502a,
    rockColor: 0x8a3d20,
    skyColor: 0xd98a56,
    fogColor: 0xd98a56,
    fogNear: 90,
    fogFar: 260,
    gravity: -6.8,
    amplitude: 0.7,
    resources: [
      { name: 'Iron', color: 0x8a7a6b },
      { name: 'Crystal', color: 0xd66bff },
    ],
  },
  {
    id: 'asteroid-belt',
    name: 'Asteroid Belt',
    position: { x: 1500, z: 300 },
    groundRadius: 160,
    terrainType: 'field',
    terrainColor: 0x6b5a4a,
    rockColor: 0x5a4d40,
    skyColor: 0x030305,
    fogColor: 0x030305,
    fogNear: 500,
    fogFar: 3000,
    gravity: -0.4,
    amplitude: 2.4,
    resources: [
      { name: 'Gold', color: 0xe0b23c },
      { name: 'Uranium', color: 0x8fff6b },
    ],
  },
  {
    id: 'jupiter-orbit',
    name: 'Jupiter Orbit',
    position: { x: 2200, z: -300 },
    groundRadius: 55,
    terrainType: 'platform',
    terrainColor: 0x445566,
    rockColor: 0x445566,
    skyColor: 0x0a0810,
    fogColor: 0x0a0810,
    fogNear: 500,
    fogFar: 3000,
    gravity: -1.0,
    amplitude: 0,
    backdrop: { type: 'gasGiant', color: 0xd2a679, bandColor: 0xa87e52, radius: 260, distance: 700 },
    resources: [
      { name: 'Crystal', color: 0xd66bff },
      { name: 'Uranium', color: 0x8fff6b },
    ],
  },
  {
    id: 'europa',
    name: 'Europa',
    position: { x: 2450, z: -100 },
    groundRadius: 95,
    terrainType: 'cracked',
    terrainColor: 0xdfeeff,
    rockColor: 0xaad4ee,
    skyColor: 0xdfefff,
    fogColor: 0xdfefff,
    fogNear: 70,
    fogFar: 200,
    gravity: -1.5,
    amplitude: 0.5,
    resources: [
      { name: 'Crystal', color: 0xd66bff },
      { name: 'Titanium', color: 0xaeb4bd },
    ],
  },
  {
    id: 'saturn-orbit',
    name: 'Saturn Orbit',
    position: { x: 3100, z: 400 },
    groundRadius: 55,
    terrainType: 'platform',
    terrainColor: 0x554433,
    rockColor: 0x554433,
    skyColor: 0x0a0810,
    fogColor: 0x0a0810,
    fogNear: 500,
    fogFar: 3000,
    gravity: -1.0,
    amplitude: 0,
    backdrop: { type: 'ringedGiant', color: 0xd8c093, bandColor: 0xb39a6b, radius: 240, distance: 700 },
    resources: [
      { name: 'Gold', color: 0xe0b23c },
      { name: 'Titanium', color: 0xaeb4bd },
    ],
  },
  {
    id: 'titan',
    name: 'Titan',
    position: { x: 3350, z: 250 },
    groundRadius: 135,
    terrainType: 'rolling',
    terrainColor: 0x8a6a3f,
    rockColor: 0x5f4a2c,
    skyColor: 0xd8a15a,
    fogColor: 0xc98f4a,
    fogNear: 50,
    fogFar: 170,
    gravity: -2.2,
    amplitude: 0.9,
    resources: [
      { name: 'Uranium', color: 0x8fff6b },
      { name: 'Gold', color: 0xe0b23c },
    ],
  },
];

const DEEP_SPACE = {
  id: 'deep-space',
  name: 'Deep Space',
  skyColor: 0x000005,
  fogColor: 0x000005,
  fogNear: 800,
  fogFar: 4200,
  gravity: -0.15,
};

const NO_GROUND_HEIGHT = -5000;
const ZONE_BUFFER = 40;
const SKY_BLEND_SPEED = 1.5;
const SURFACE_PATCH_SIZE = 900;
const SURFACE_PATCH_SEGMENTS = 92;
const PLANET_SPACE_DISTANCE = 4.2;
const ATMOSPHERE_EXIT_HEIGHT = 260;
const ATMOSPHERE_ENTRY_HEIGHT = 70;
const SPACE_GRAVITY_STRENGTH = 18000;
const MAX_SPACE_GRAVITY = 7.5;
const SPACE_PLANET_MIN_RADIUS = 34;
const SPACE_PLANET_MAX_RADIUS = 130;

class World {
  constructor(scene) {
    this.scene = scene;
    this.planets = PLANETS;
    this.currentPlanet = this.planets[0];
    this.surfacePlanet = this.planets[0];
    this.mode = 'surface';
    this._bgColor = new THREE.Color(this.currentPlanet.skyColor);
    this._fogColor = new THREE.Color(this.currentPlanet.fogColor);
    this._lastPatchCenter = new THREE.Vector2(Infinity, Infinity);
    this._tmpGravity = new THREE.Vector3();

    this._buildLighting();
    this._buildStarfield();
    this._buildAllPlanets();
    this._buildSpaceBodies();

    this.scene.background = this._bgColor;
    this.scene.fog = new THREE.Fog(this._fogColor, this.currentPlanet.fogNear, this.currentPlanet.fogFar);
    this._showSurfaceOnly(this.surfacePlanet);
    this.placeSurfaceAround(0, 0, true);
  }

  _buildLighting() {
    const ambient = new THREE.HemisphereLight(0xbfe0ff, 0x3a4a2f, 0.7);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xfff4dd, 1.4);
    sun.position.set(60, 90, 40);
    sun.castShadow = true;
    sun.shadow.camera.left = -120;
    sun.shadow.camera.right = 120;
    sun.shadow.camera.top = 120;
    sun.shadow.camera.bottom = -120;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 450;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.bias = -0.0005;
    this.scene.add(sun);
    this.sun = sun;
  }

  _buildStarfield() {
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const radius = 9000;

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 2.1, sizeAttenuation: false, transparent: true, opacity: 0 });
    this.starfield = new THREE.Points(geometry, material);
    this.starfield.visible = false;
    this.scene.add(this.starfield);
  }

  _buildAllPlanets() {
    for (const planet of this.planets) {
      this._buildPlanetTerrain(planet);
      if (planet.terrainType !== 'platform') {
        this._scatterRocks(planet);
      }
      if (planet.backdrop) {
        this._buildBackdrop(planet);
      }
    }
  }

  _buildPlanetTerrain(planet) {
    const size = planet.terrainType === 'platform' ? 420 : Math.max(SURFACE_PATCH_SIZE, planet.groundRadius * 3.2);
    const segments = planet.terrainType === 'platform' ? 44 : SURFACE_PATCH_SEGMENTS;
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const material = new THREE.MeshStandardMaterial({
      color: planet.terrainColor,
      flatShading: true,
      roughness: planet.terrainType === 'platform' ? 0.6 : 1.0,
      metalness: planet.terrainType === 'platform' ? 0.4 : 0.0,
    });

    const terrain = new THREE.Mesh(geometry, material);
    terrain.receiveShadow = true;
    terrain.visible = false;
    this.scene.add(terrain);

    planet._terrainMesh = terrain;
    planet._surfaceSize = size;
    planet._surfaceCenter = new THREE.Vector2(0, 0);
    this._fillTerrainMesh(planet, 0, 0);
  }

  _fillTerrainMesh(planet, centerX, centerZ) {
    const terrain = planet._terrainMesh;
    if (!terrain) return;

    const position = terrain.geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const worldX = centerX + position.getX(i);
      const worldZ = centerZ + position.getZ(i);
      position.setY(i, this._computeLocalHeight(planet, worldX, worldZ));
    }

    position.needsUpdate = true;
    terrain.geometry.computeVertexNormals();
    terrain.position.set(centerX, 0, centerZ);
    planet._surfaceCenter.set(centerX, centerZ);
    this._placeRocks(planet, centerX, centerZ);
  }

  _computeLocalHeight(planet, lx, lz) {
    const amp = planet.amplitude;

    switch (planet.terrainType) {
      case 'rolling':
        return (
          Math.sin(lx * 0.04) * 2.2 * amp +
          Math.cos(lz * 0.05) * 2.0 * amp +
          Math.sin((lx + lz) * 0.02) * 1.5 * amp
        );

      case 'cratered': {
        const base = Math.sin(lx * 0.03) * 1.0 * amp + Math.cos(lz * 0.035) * 0.8 * amp;
        const craterDips = -Math.abs(Math.sin(lx * 0.09) * Math.cos(lz * 0.11)) * 3 * amp;
        return base + craterDips;
      }

      case 'dunes':
        return (
          Math.abs(Math.sin(lx * 0.02)) * 2.2 * amp +
          Math.cos(lz * 0.018) * 1.6 * amp +
          Math.sin((lx - lz) * 0.01) * 1.2 * amp
        );

      case 'cracked':
        return (
          Math.sin(lx * 0.18) * 0.6 * amp +
          Math.cos(lz * 0.21) * 0.6 * amp +
          Math.sin((lx + lz) * 0.25) * 0.4 * amp
        );

      case 'field':
        return (
          Math.sin(lx * 0.06) * 1.5 * amp +
          Math.cos(lz * 0.08) * 1.3 * amp +
          Math.sin(lx * 0.11 + lz * 0.13) * 1.0 * amp +
          Math.cos(lx * 0.19 - lz * 0.05) * 0.8 * amp
        );

      case 'platform':
      default:
        return 0;
    }
  }

  _scatterRocks(planet) {
    const rockGeomEtry = new THREE.IcosahedroneGeometry(1, 0);
    const rockMarterial = new THREE.MeshStandardMaterial({ color: planet.rockColor, flatShading: true, roughness: 1 });
    const group = new THREE.Group();
    const isField = planet.terrainType === 'field';
    const rockCount = isField ? 90 : Math.round(planet.groundRadius / 4.5);
    const scaleRange = isField ? 90 : Math.round(planet.groundRadius / 4.5);
    const spread = (planet._surfaceSize || SURFACE_PATCH_SIZE) * 0.8;

    for (let i = 0; i < rockCount; i++) {
      const rock = new THREE.Mesh(rockGeomEtry, rockMaterial);
      const localX = (Math.random() - 0.5) * spread;
      const LocalZ = (Math.random() - 0.5) * spread;
      rock.userData.localX = localX;
      rock.userData.localZ = localZ;
      rock.position.set(localX, 0, localZ);
      rock.scale.setScalar(scaleRange[0] + Math.random() * (scaleRange[1] - scaleRange[0]));
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rock.castShadow = true;
      rock.receiveShadow = true;
      group.add(rock);

    }

    group.visible = false;
    this.scene.add(group);
    planet._rockGroup = group;
    this._placeRocks(planet, 0, 0);





  }

  _placeRocks(planet, centerX, centerZ) {
    const group = planet._rockGroup;
    if (!group) return;

    group.position.set(centerX, 0, centerZ);
    for (const rock of group.children) {
      const wx = centerX + rock.userData.localX;
      const wz = centerZ + rock.userData.localZ;
      rock.position.y = this._computeLocalHeight(planet, wx, wz);

    }

    
  }

  _buildBackdrop(planet) {
    const { type, color, bandColor, radius, distance } = planet. backDrop;
    const group = new THREE.Group();
    const center = this._spacePositionFor(planet);
    const shpere = new THREE.Mesh(
      new THREE.SphereGeometry(Math.min(radius, 260), 24, 16),
      new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 1, emissive: color, emissiveIntensity: 0.08 })

    );
    Sphere.position.set(center.x + distance * 0.45, center.y + distance * 0.16, center.z + distance * 0.45);
    group.add(sphere);

    for(let i = 0; i < 3; i++) {
      const band = new THREE.Mesh(
        new THREE.TorusGeometry(Math.min(radius, 260) * 0.97, Math.min(radius, 260) * 0.06, 6, 24),
        new THREE.MeshStandardMaterial({ color: bandColor, flatShading: true, roughness: 1 })


      );
      band.position.copy(sphere.position);
      band.rotation.x = Math.PI / 2 + (i - 1) * 0.35;
      band.rotation.y = 0.3;
      group.add(band);

    }

    group.visible = false;
    this.scene.add(group);
    planet._backdropGroup = group;
  }

  _buildSpaceBodies() {
    for (const planet of this.planets) {
      const group = new THREE.Group();
      const radius = this._bodyRadius(planet);
      const bodyColor = planet.backdrop ? planet.backdrop.color : planet.terrainColor;
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 18),
        new THREE.MeshStandardMaterial({ color: bodyColor, flatShading: true, roughness: 0.95, emissive: bodyColor, emissiveIntensity: 0.04 })

      );
      sphere.castShadow = true;
      sphere.receiveShadow = true;
      group.add(sphere);


      if (planet.id == 'earth' || planet.id === 'mars' || planet.id === 'titan') {
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.08, 32, 18),
          new THREE.MeshBasicMaterial({ color: planet.skyColor, transparent: true, opacity: planet.id === 'earth' ? 0.22 : 0.14, side: THREE.Backside })

        );
        group.add(atmosphere);

      }

      if (planet.id === 'saturn-orbit' || planet.backdrop?.type === 'ringedGiant') {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(radius * 1.45, radius * 2.2, 48),
          new THREE.MeshStandardMaterial({ color: 0xcbb98a, side: THREE.DoubleSide, transparent: true, opacity: 0.82, roughness: 1 })
        );
        ring.rotation.x = Math.PI / 2.7;
        group.add(ring);

      }

      group.position.copy(this._spacePositionFor(planet));
      group.visible = false;
      this.scene.add(group);
      planet._spaceGroup = group;
      planet._bodyRadius = radius;

    }
  }


  _spacePositionFor(planet) {
    if (planet._bodyRadius) return planet._bodyRadius;
    if (planet.backdrop) return SPACE_PLANET_MAX_RADIUS;
    return Math.max(SPACE_PLANET_MIN_RADIUS, Math.min(SPACE_PLANET_MAX_RADIUS, planet.groundRadius * 0.46));

  }

  _atmosphereHeight(planet) {
    if (planet.id === 'earth') return ATMOSPHERE_EXIT_HEIGHT;
    if (planet.id === 'mars') return 190;
    if (planet.id === 'titan') return 170;
    if (planet.terrainType === 'platform') return 95;
    return 120;
  }

   _showSurfaceOnly(planet) {
    this.mode = 'surface';
    this.surfacePlanet = planet;
    for (const item of this.planets) {
      if (item._terrainMesh) item._terrainMesh.visible = item === planet;
      if (item._rockGroup) item._rockGroup.visible = item === planet;
      if (item._spaceGroup) item._spaceGroup.visible = false;
      if (item._backdropGroup) item._backdropGroup.visible = false;
    }
    if (this.starfield) {
      this.starfield.visible = false;
      this.starfield.material.opacity = 0;
    }

  }

  _showSpaceOnly() {
    this.mode = 'space';
    for (const planet of this.planet) {
      if (planet._terrainMesh) planet._terrainMesh.visible = false;
      if (planet._rockGroup) planet._rockGroup.visible = false;
      if (planet._spaceGroup) planet.saceGroup.visible = true;
      if (planet._backdropGroup) planet._backdropGroup.visible -= true;

    }
    if (this.starfield) {
      this.starfield.visible = true;
      this.starfield.material.opacity = 1;

    }
  }

  placeSurfaceAround(x,z, force = false) {
    if (this.mode !== 'surface' || !this.surfacePlanet) return;
    const planet = this.surfacePlanet;
    const size = planet._surfaceSize || SURFACE_PATCH_SIZE;
    const grid = size * 0.28;
    const centerX = Math.round(x / grid) * grid;
    const centrerZ = Math.round(z / grid) * grid;
    const old = planet._surfaceCnter;
    const moved = Math.abs(centerX - old.c) > 1 || Math.abs(centerZ - old.y) > 1;
    if (force || moved) this._fillTerrainMesh(planet, centerX, centerZ);


  }

  updateTravelState(ship) {
    if (!ship || !ship.isPiloted) return;

    if (this.mode === 'surface') {
      const altitude = this.getSurfaceAltitude(ship.position);
      if (altitude = this._atmosphereHeight(this.surfacePlanet)) {
        this.enterSpaceFromSurface(ship);

      }
      return;
        
      }

      const planet = this._landingCandidate(ship.position);
      if (planet) this.enterSurfaceFromSpace(planet, ship);


    }

    enterSpaceFromSurface(ship) {
      const planet = this.surfacePlanet || this.planet[0];
      const center = this._spacePositionFor(planet);
      const radius = this._bodyRadius(planet);
      const local = new THREE.Vector2(ship.position.x, ship.position.z);
      const side = local.lengthSq() > 0.01 ? local.normalize() : new THREE.Vector2(0,1);
      const sideScale = Math.min(radius * 0.35, Math.sqrt(ship.position.x * ship.position.x + ship.position.z) * 0.035);

      ship.position.set(center.x + side.x * sideScale, center.y + radius + 95, center.z + side.y * sideScale);
      ship.velocity.multiplyScalar(0.35);
      ship.velocity.multiplyScalar(0.35);
      ship.velocity.y = Math.max(ship.velocity.y, 14);
      ship.isLanded = false;
      ship.setGearDeployed(false);
      this.currentPlanet = DEEP_SPACE;
      this._showSpaceOnly();
      
    }

    enterSurfaceFromSpace(planet, ship) {
      this._showSurfaceOnly(planet);
      this.currentPlanet = planet;
      const landingX = 0;
      const landingZ = 0;
      this.placeSurfaceAround(landingX, landingZ, true);
      const ground = this.getHeightAt(landingX, landingZ);
      ship.position.set(landingX, ground + 28, landingZ);
      ship.velocity.set(0, -3, 0);
      ship.pitch = 0;
      ship.roll = 0;
      ship.visualPitch = 0;
      ship.isLanded = false;
      ship.setGearDeployed(true);

    }

    _landingCandidate(position) {
      let best = null;
      let bestAltitude = Infinity;

      for (const planet of this.planets) {
        const center = this._spacePositionFor(planet);
        const radius = this._bodyRadius(planet);
        const altitude = position.distance(center) - radius;
        if (altitude < ATMOSPHERE_ENTRY_HEIGHT && altitude > -radius * 0.4 && altitude < bestAltitude) {
          best = planet;
          bestAltitude = altitude;

        }
      }

      return best;
    }

    getHeightAt(x, z) {
      if (this.mode !== 'surface' || !this.surfcePlanet) return NO_GROUND_HEIGHT;
      return DEEP_SPACE.gravity;

    }

    getGravityVectorAt(position) {
      if (this.mode === 'surface' && this.surfacePlanet) {
        return new THREE.Vector3(0, this.surfacePlanet.gravity, 0);

      }

      const pull = this._tmpGravity.set(0, 0, 0);
      for (const planet of this.planets) {
        const center = this._spacePositionFor(planet);
        const dir = center.clone().sub(position);
        const distSq = Math.max(dir.lengthSq(), this._bodyRadius(planet) * this._bodyRadius(planet));
        const force = Math.min(MAX_SPACE_GRAVITY, (SPACE_GRAVITY_STRENGTH * this._bodyRadius(planet)) / distSq);
        pull.addScaledVector(dir.normalize(), force);

      }

      return pull.clone();




    }

    getCurrentPlanet(position) {
      if (this.mode === 'surface') return this.surfacePlanet || this.planets[0];

      let best = DEEP_SPACE;
      let bestAltitude = Infinity;
      for (const planet of this.planets) {
        const altitude = position.distanceTo(this._spacePositionFor(planet)) - this._bodyRadius(planet);
        if (altitude < 260 && altitude < bestAltitude) {
          best = planet;
          bestAltitude = altitude;

        }
      }
      return best;


    }

    getSurfaceAltitude(position) {
      if (this.mode === 'surface') return position.y - this.getHeightAt(position.x, position.z);

      let bestAltitude = Infinity;
      for (const planet of this.planets) {
        const altitude = position.distance(this._spacePositionsFor(planet)) - this._bodyRadius(planet);
        if (altitude < bestAltitude) bestAltitude = altitude;

      }
      return bestAltitude;
    }

    getAtmosphereExitHeight() {
      return this.mode === 'surface' && this.surfacePlanet ? this._atmosphereHeight(this._atmosphereHeight.surfacePlanet) : 0;

    }

    update(deltaTime, referencePosition) {
      if (this.mode === 'surface' && referencePosition) {
        this.placeSurfaceAround(referencePosition.x, referencePosition.z);

      }

      this.currentPlanet = referencePosition ? this.getCurrentPlanet(referencePosition) : this.currentPlanet;
      const skyTarget = this.mode === 'space' ? DEEP_SPACE : this.currentPlanet;
      const t = 1 - Math.exp(-SKY_BLEND_SPEED * deltaTime);
      this._bgColor.lerp(new THREE.Color(skyTarget.skyColor), t);
      this._fogColor.lerp(new THREE.Color(skyTarget.fogColor), t);
      this.scene.fog.color.copy(this._fogColor);
      this.scene.fog.near += (skyTarget.fogNear - this.scene.fog.near) * t;
      this.scene.fog.far += (skyTarget.fogFar - this.scene.fog.far) * t;

    }



  }

  const WALK_SPEED = 4.2;
  const RUN_SPEED = 8.0;
  const JUMP_VELOCITY = 7.5;
  const TURN_SMOOTHING = 12;

  class Player {
    constructor(scene, world) {
      this.scene = scene;
      this.world = world;

      this.velocity = new THREE.Vector3();
      this.position = new THREE.Vector3(0, 0, 0);
      this.isGrounded = true;
      this.isRunning = false;

      this.health = 100;
      this.oxygen = 100;
      this.fuel = 100;
      this._buildMesh();
      this.setPosition(0, this.world.getHeightAt(0, 0), 0);

    }

    _buildMesh() {
      this.group = new THREE.Group();

      const suitMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8e8e8,
        flatShading: true,
        roughness: 0.8,

      });
      const visorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2b8fd6,
      flatShading: true,
      roughness: 0.2,
      metalness: 0.6,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6432b,
      flatShading: true,
      roughness: 0.7,
    });

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.32, 0.55, 2, 6), suitMaterial);
    torso.position.y = 1.05;
    torso.castShadow = true;
    this.group.add(torso);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), suitMaterial);
    helmet.position.y = 1.65;
    helmet.castShadow = true;
    this.group.add(helmet);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 8), visonMaterial);
    visor.position.set(0, 1.65, 0.16);
    visor.scale.set(1, 0.8, 0.6);
    this.group.add(visor);

    const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, 0.22), accentMaterial);
    backpack.position.set(0, 1.05, -0.28);
    backpack.castShadow = true;
    this.group.add(backpack);

    this.leftArm = this._buildLimb(suitMaterial, 0.11, 0.55);
    this.leftArm.position.set(0.42, 1.25, 0);
    this.group.add(this.leftArm);

    this.rightArm = this._buildLimb(suitMaterial, 0.11, 0.55);
    this.rightArm.position.set(-0.42, 1.25, 0);
    this.group.add(this.rightArm);

    this.leftLeg = this._buildLimb(suitMaterial, 0.14, 0.6);
    this.leftLeg.position.set(0.15, 0.55, 0);
    this.group.add(this.leftLeg);

    this.rightLeg = this._buildLimb(suitMaterial, 0.14, 0.6);
    this.rightLeg.position.set(-0.15, 0.55, 0);
    this.group.add(this.rightLeg);

    this.scene.add(this.group);

    this.walkCycleTime = 0;

    _buildLimb(material, radius, length) {
    const geometry = new THREE.CapsuleGeometry(radius, length, 2, 6);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;

    mesh.geometry.translate(0, -length / 2 - radius, 0);
    return mesh;
  }

  setPosition(x, y, z) {
    this.position.set(x, y, z);
    this.group.position.copy(this.position);
  }

  update(deltaTime, input, cameraYaw) {
    this._handleMovement(deltaTime, input, cameraYaw);
    this._applyGravity(deltaTime);
    this._resolveGroundCollision();
    this._animateLimbs(deltaTime);

    this.group.position.copy(this.position);
  }

  _handleMovement(deltaTime, input, cameraYaw) {
    const forward = input.isKeyDown('KeyW') ? 1 : input.isKeyDown('KeyS') ? -1 : 0;
    const strafe = input.isKeyDown('KeyD') ? 1 : input.isKeyDown('KeyA') ? -1 : 0;

    this.isRunning = input.isKeyDown('ShiftLeft') || input.isKeyDown('ShiftRight');
    const speed = this.isRunning ? RUN_SPEED : WALK_SPEED;

    const moveVector = new THREE.Vector3(strafe, 0, -forward);
    this.isMoving = moveVector.lengthSq() > 0;

    if (this.isMoving) {
      moveVector.normalize().multiplyScalar(speed * deltaTime);
      moveVector.applyAxisAngle(new THREE.Vector3(0, 1, 0), cameraYaw);

      this.position.x += moveVector.x;
      this.position.z += moveVector.z;

      const targetAngle = Math.atan2(moveVector.x, moveVector.z);
      this.group.rotation.y = this._lerpAngle(
        this.group.rotation.y,
        targetAngle,
        1 - Math.exp(-TURN_SMOOTHING * deltaTime)
      );
    }

    if (input.isKeyDown('Space') && this.isGrounded) {
      this.velocity.y = JUMP_VELOCITY;
      this.isGrounded = false;
    }
  }

  _applyGravity(deltaTime) {
    const gravity = this.world.getGravityAt(this.position.x, this.position.z);
    this.velocity.y += gravity * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }

  _resolveGroundCollision() {
    const groundHeight = this.world.getHeightAt(this.position.x, this.position.z);

    if (this.position.y <= groundHeight) {
      this.position.y = groundHeight;
      this.velocity.y = 0;
      this.isGrounded = true;
    } else {
      this.isGrounded = false;
    }
  }

  _animateLimbs(deltaTime) {
    if (this.isMoving && this.isGrounded) {
      const cycleSpeed = this.isRunning ? 10 : 6;
      this.walkCycleTime += deltaTime * cycleSpeed;

      const swing = Math.sin(this.walkCycleTime) * 0.6;
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
      this.leftArm.rotation.x = -swing * 0.8;
      this.rightArm.rotation.x = swing * 0.8;
    } else {

      this.leftLeg.rotation.x *= 0.85;
      this.rightLeg.rotation.x *= 0.85;
      this.leftArm.rotation.x *= 0.85;
      this.rightArm.rotation.x *= 0.85;
    }
  }

  _lerpAngle(current, target, t) {
    let delta = target - current;
    delta = ((delta + Math.PI) % (Math.PI * 2)) - Math.PI;
    return current + delta * t;
  }
}

const MOUSE_SENSITIVITY = 0.0022;
const MIN_PITCH = -0.9;
const MAX_PITCH = 1.0;
const DISTANCE = 6;
const HEIGHT_OFFSET = 1.5;

class ThirdPersonCamera {
  constructor(camera, target) {
    this.camera = camera;
    this.target = target;

    this.yaw = 0;
    this.pitch = 0.25;

    this._desiredPosition = new THREE.Vector3();
    this._lookTarget = new THREE.Vector3();
  }

  update(input) {
    const { x, y } = input.consumeMouseDelta();
    this.yaw -= x * MOUSE_SENSITIVITY;
    this.pitch -= y * MOUSE_SENSITIVITY;
    this.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, this.pitch));

    const horizontalDistance = DISTANCE * Math.cos(this.pitch);
    const verticalDistance = DISTANCE * Math.sin(this.pitch);

    const offsetX = horizontalDistance * Math.sin(this.yaw);
    const offsetZ = horizontalDistance * Math.cos(this.yaw);

    this._desiredPosition.set(
      this.target.position.x + offsetX,
      this.target.position.y + HEIGHT_OFFSET + verticalDistance,
      this.target.position.z + offsetZ
    );

    this.camera.position.copy(this._desiredPosition);

    this._lookTarget.set(
      this.target.position.x,
      this.target.position.y + HEIGHT_OFFSET,
      this.target.position.z
    );
    this.camera.lookAt(this._lookTarget);
  }
}

class EngineAudio {
  constructor() {
    this.context = null;
    this.isStarted = false;
  }

  start() {
    if (this.isStarted) return;
    this.isStarted = true;

    this.context = new (window.AudioContext || window.webkitAudioContext)();

    this.oscillatorA = this.context.createOscillator();
    this.oscillatorB = this.context.createOscillator();
    this.oscillatorA.type = 'sawtooth';
    this.oscillatorB.type = 'sawtooth';
    this.oscillatorA.frequency.value = 55;
    this.oscillatorB.frequency.value = 55 * 1.01;

    this.filter = this.context.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.value = 220;

    this.gain = this.context.createGain();
    this.gain.gain.value = 0;

    this.oscillatorA.connect(this.filter);
    this.oscillatorB.connect(this.filter);
    this.filter.connect(this.gain);
    this.gain.connect(this.context.destination);

    this.oscillatorA.start();
    this.oscillatorB.start();
  }

  stop() {
    if (!this.isStarted) return;
    this.isStarted = false;
    this.oscillatorA.stop();
    this.oscillatorB.stop();
    this.context.close();
    this.context = null;
  }

  setThrottle(throttle) {
    if (!this.isStarted || !this.context) return;

    const now = this.context.currentTime;
    const targetVolume = 0.02 + throttle * 0.08;
    const targetFreq = 55 + throttle * 90;
    const targetFilterFreq = 220 + throttle * 900;

    this.gain.gain.setTargetAtTime(targetVolume, now, 0.15);
    this.oscillatorA.frequency.setTargetAtTime(targetFreq, now, 0.15);
    this.oscillatorB.frequency.setTargetAtTime(targetFreq * 1.01, now, 0.15);
    this.filter.frequency.setTargetAtTime(targetFilterFreq, now, 0.15);
  }
}

const MAX_FUEL = 620;

class Ship {
  constructor(scene, world, spawnPosition) {
    this.scene = scene;
    this.world = world;

    this.position = spawnPosition.clone();
    this.velocity = new THREE.Vector3();

    this.yaw = 0;
    this.pitch = 0;
    this.roll = 0;
    this.visualYaw = 0;
    this.visualPitch = 0;

    this.fuel = MAX_FUEL;
    this.isPiloted = false;
    this.isLanded = true;
    this.isBoosting = false;
    this.throttle = 0;

    this.doorOpen = false;
    this.doorAngle = 0;
    this.doorTargetAngle = 0;

    this.gearDeployed = true;
    this.gearAmount = 1;
    this.gearTargetAmount = 1;

    this._elapsed = 0;

    this._buildMesh();
    this._buildLandingPad();
    this.syncTransform();
  }

  _buildMesh() {
    this.group = new THREE.Group();

    const hullMaterial = new THREE.MeshStandardMaterial({
      color: 0xc7ccd4,
      flatShading: true,
      roughness: 0.45,
      metalness: 0.55,
    });
    const darkPanelMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d434b,
      flatShading: true,
      roughness: 0.6,
      metalness: 0.4,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b35,
      flatShading: true,
      roughness: 0.55,
      metalness: 0.2,
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x8fe3ff,
      flatShading: true,
      roughness: 0.05,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    });
    this.thrusterMaterial = new THREE.MeshStandardMaterial({
      color: 0x2266ff,
      emissive: 0x3388ff,
      emissiveIntensity: 0,
      flatShading: true,
    });
    this.thrusterCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xbfe8ff,
      emissiveIntensity: 0,
      flatShading: true,
      transparent: true,
      opacity: 0.9,
    });

    this._buildFuselage(hullMaterial, darkPanelMaterial, glassMaterial, accentMaterial);
    this._buildWingsAndEngines(hullMaterial, darkPanelMaterial, accentMaterial);
    this._buildDoor(darkPanelMaterial);
    this._buildLandingGear(darkPanelMaterial);
    this._buildNavLights();

    this.scene.add(this.group);
  }

  _buildFuselage(hullMaterial, darkPanelMaterial, glassMaterial, accentMaterial) {

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.62, 1.5, 7), hullMaterial);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 1.55;
    nose.castShadow = true;
    this.group.add(nose);

    const midHull = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.78, 2.1, 7), hullMaterial);
    midHull.rotation.x = Math.PI / 2;
    midHull.position.z = 0.15;
    midHull.castShadow = true;
    midHull.receiveShadow = true;
    this.group.add(midHull);

    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.4, 1.3, 7), hullMaterial);
    tail.rotation.x = Math.PI / 2;
    tail.position.z = -1.3;
    tail.castShadow = true;
    this.group.add(tail);

    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 2.6), darkPanelMaterial);
    spine.position.set(0, 0.68, 0);
    this.group.add(spine);

    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.46, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.6), glassMaterial);
    canopy.position.set(0, 0.42, 0.85);
    canopy.rotation.x = -0.25;
    canopy.scale.set(1, 0.85, 1.35);
    this.group.add(canopy);

    const canopyFrame = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.04, 6, 10), accentMaterial);
    canopyFrame.position.set(0, 0.42, 0.55);
    canopyFrame.rotation.x = Math.PI / 2;
    this.group.add(canopyFrame);

    const computerMaterial = new THREE.MeshStandardMaterial({
      color: 0x10263a,
      emissive: 0x27ccff,
      emissiveIntensity: 0.75,
      roughness: 0.28,
      metalness: 0.3,
    });
    this.computerScreen = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.05, 0.38), computerMaterial);
    this.computerScreen.position.set(0, 0.03, 0.95);
    this.computerScreen.rotation.x = -0.72;
    this.group.add(this.computerScreen);

    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.06, 1.1, 3), accentMaterial);
    fin.position.set(0, 0.75, -1.75);
    fin.rotation.x = Math.PI / 2;
    fin.rotation.z = Math.PI / 2;
    fin.scale.set(1, 1, 1.6);
    this.group.add(fin);
  }

  _buildWingsAndEngines(hullMaterial, darkPanelMaterial, accentMaterial) {

    const wingShape = () => {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.09, 1.1), darkPanelMaterial);
      return wing;
    };

    this.leftWing = wingShape();
    this.leftWing.position.set(-1.15, -0.05, -0.35);
    this.leftWing.rotation.z = 0.08;
    this.leftWing.rotation.y = 0.18;
    this.leftWing.castShadow = true;
    this.group.add(this.leftWing);

    this.rightWing = wingShape();
    this.rightWing.position.set(1.15, -0.05, -0.35);
    this.rightWing.rotation.z = -0.08;
    this.rightWing.rotation.y = -0.18;
    this.rightWing.castShadow = true;
    this.group.add(this.rightWing);

    this.leftEngine = this._buildEngine(hullMaterial, accentMaterial);
    this.leftEngine.position.set(-1.85, -0.12, -0.75);
    this.group.add(this.leftEngine);

    this.rightEngine = this._buildEngine(hullMaterial, accentMaterial);
    this.rightEngine.position.set(1.85, -0.12, -0.75);
    this.group.add(this.rightEngine);
  }

  _buildEngine(hullMaterial, accentMaterial) {
    const engineGroup = new THREE.Group();

    const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 1.5, 8), hullMaterial);
    nacelle.rotation.x = Math.PI / 2;
    nacelle.castShadow = true;
    engineGroup.add(nacelle);

    const intakeRing = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 6, 10), accentMaterial);
    intakeRing.position.z = 0.76;
    engineGroup.add(intakeRing);

    const exhaustHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.24, 0.3, 8), hullMaterial);
    exhaustHousing.rotation.x = Math.PI / 2;
    exhaustHousing.position.z = -0.9;
    engineGroup.add(exhaustHousing);

    const outerFlame = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.7, 8), this.thrusterMaterial);
    outerFlame.rotation.x = -Math.PI / 2;
    outerFlame.position.z = -1.25;
    engineGroup.add(outerFlame);
    engineGroup.userData.outerFlame = outerFlame;

    const innerFlame = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.4, 6), this.thrusterCoreMaterial);
    innerFlame.rotation.x = -Math.PI / 2;
    innerFlame.position.z = -1.15;
    engineGroup.add(innerFlame);
    engineGroup.userData.innerFlame = innerFlame;

    return engineGroup;
  }

  _buildDoor(darkPanelMaterial) {

    this.doorHinge = new THREE.Group();
    this.doorHinge.position.set(0.72, -0.25, 0.3);
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.05, 0.85), darkPanelMaterial);
    doorPanel.position.set(0, 0.5, 0.42);
    doorPanel.castShadow = true;
    this.doorHinge.add(doorPanel);
    this.group.add(this.doorHinge);
  }

  _buildLandingGear(darkPanelMaterial) {

    this.legs = [];
    const hipPositions = [
      [0.95, -0.15, 1.0],
      [-0.95, -0.15, 1.0],
      [0.95, -0.15, -1.1],
      [-0.95, -0.15, -1.1],
    ];

    for (const [x, y, z] of hipPositions) {
      const hip = new THREE.Group();
      hip.position.set(x, y, z);

      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.85, 5), darkPanelMaterial);
      strut.position.y = -0.42;
      strut.castShadow = true;
      hip.add(strut);

      const footPad = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.06, 8), darkPanelMaterial);
      footPad.position.y = -0.85;
      footPad.castShadow = true;
      hip.add(footPad);

      hip.rotation.x = (z > 0 ? 1 : -1) * 0.18;
      hip.rotation.z = (x > 0 ? -1 : 1) * 0.35;
      hip.userData.deployedRotationZ = hip.rotation.z;

      this.group.add(hip);
      this.legs.push(hip);
    }
  }

  _buildNavLights() {

    const redMat = new THREE.MeshStandardMaterial({ color: 0xff2b2b, emissive: 0xff2b2b, emissiveIntensity: 1 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x2bff5b, emissive: 0x2bff5b, emissiveIntensity: 1 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 });

    const lightGeometry = new THREE.SphereGeometry(0.05, 6, 6);

    this.portLight = new THREE.Mesh(lightGeometry, redMat);
    this.portLight.position.set(-2.1, -0.1, -0.35);
    this.group.add(this.portLight);

    this.starboardLight = new THREE.Mesh(lightGeometry, greenMat);
    this.starboardLight.position.set(2.1, -0.1, -0.35);
    this.group.add(this.starboardLight);

    this.strobeLight = new THREE.Mesh(lightGeometry, whiteMat);
    this.strobeLight.position.set(0, 0.85, -1.85);
    this.group.add(this.strobeLight);
  }

  _buildLandingPad() {

    const padGeometry = new THREE.CylinderGeometry(3.2, 3.2, 0.15, 16);
    const padMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a4048,
      flatShading: true,
      roughness: 0.9,
    });
    const pad = new THREE.Mesh(padGeometry, padMaterial);
    const groundHeight = this.world.getHeightAt(this.position.x, this.position.z);
    pad.position.set(this.position.x, groundHeight - 0.05, this.position.z);
    pad.receiveShadow = true;
    this.scene.add(pad);
    this.pad = pad;
  }

  distanceTo(point) {
    return this.position.distanceTo(point);
  }

  setDoorOpen(isOpen) {
    this.doorOpen = isOpen;
    this.doorTargetAngle = isOpen ? Math.PI * 0.65 : 0;
  }

  setGearDeployed(isDeployed) {
    this.gearDeployed = isDeployed;
    this.gearTargetAmount = isDeployed ? 1 : 0;
  }

  updateDoor(deltaTime) {
    const t = 1 - Math.exp(-8 * deltaTime);
    this.doorAngle += (this.doorTargetAngle - this.doorAngle) * t;
    this.doorHinge.rotation.y = this.doorAngle;
  }

  updateGear(deltaTime) {
    const t = 1 - Math.exp(-6 * deltaTime);
    this.gearAmount += (this.gearTargetAmount - this.gearAmount) * t;

    for (const hip of this.legs) {
      hip.rotation.z = hip.userData.deployedRotationZ * this.gearAmount;
      hip.scale.setScalar(0.4 + 0.6 * this.gearAmount);
    }
  }

  updateLights(deltaTime) {
    this._elapsed += deltaTime;
    const strobePulse = Math.max(0, Math.sin(this._elapsed * 3.2)) ** 6;
    const navPulse = 0.5 + 0.5 * Math.sin(this._elapsed * 1.6);

    this.strobeLight.material.emissiveIntensity = 0.3 + strobePulse * 3;
    this.portLight.material.emissiveIntensity = 0.4 + navPulse * 0.8;
    this.starboardLight.material.emissiveIntensity = 0.4 + navPulse * 0.8;
  }

  syncTransform() {
    this.group.position.copy(this.position);
    this.group.rotation.set(this.visualPitch, this.visualYaw, this.roll, 'YXZ');
  }
}

const SHIP_CAM_DISTANCE = 8;
const SHIP_CAM_HEIGHT_OFFSET = 2.2;
const FOLLOW_SMOOTHING = 5;
const BASE_FOV = 65;
const BOOST_FOV = 76;
const FOV_SMOOTHING = 4;
const SHIP_COMPUTER_FOV = 50;

class ShipCamera {
  constructor(camera, ship) {
    this.camera = camera;
    this.ship = ship;
    this._currentPosition = camera.position.clone();
    this._desired = new THREE.Vector3();
    this._lookTarget = new THREE.Vector3();
    this._forward = new THREE.Vector3();
    this._euler = new THREE.Euler();
  }

  update(deltaTime, computerView = false) {
    this._euler.set(this.ship.pitch, this.ship.yaw, 0, 'YXZ');
    this._forward.set(0, 0, -1).applyEuler(this._euler);

    let targetFov = BASE_FOV;

    if (computerView) {
      const seat = new THREE.Vector3(0, 0.58, 1.55).applyEuler(this._euler);
      const screen = new THREE.Vector3(0, 0.12, 0.82).applyEuler(this._euler);
      this._desired.copy(this.ship.position).add(seat);
      this._lookTarget.copy(this.ship.position).add(screen);
      targetFov = SHIP_COMPUTER_FOV;
    } else {
      this._desired.copy(this.ship.position)
        .addScaledVector(this._forward, -SHIP_CAM_DISTANCE)
        .add(new THREE.Vector3(0, SHIP_CAM_HEIGHT_OFFSET, 0));
      this._lookTarget.copy(this.ship.position).addScaledVector(this._forward, 6);
      targetFov = this.ship.isBoosting && this.ship.throttle > 0.1 ? BOOST_FOV : BASE_FOV;
    }

    const t = 1 - Math.exp((computerView ? -FOLLOW_SMOOTHING * 1.7 : -FOLLOW_SMOOTHING) * deltaTime);
    this._currentPosition.lerp(this._desired, t);
    this.camera.position.copy(this._currentPosition);
    this.camera.lookAt(this._lookTarget);

    const fovT = 1 - Math.exp(-FOV_SMOOTHING * deltaTime);
    this.camera.fov += (targetFov - this.camera.fov) * fovT;
    this.camera.updateProjectionMatrix();
  }

  snapToShip() {
    const forward = new THREE.Vector3(0, 0, -1);
    const euler = new THREE.Euler(this.ship.pitch, this.ship.yaw, 0, 'YXZ');
    forward.applyEuler(euler);
    this._currentPosition.copy(this.ship.position)
      .addScaledVector(forward, -SHIP_CAM_DISTANCE)
      .add(new THREE.Vector3(0, SHIP_CAM_HEIGHT_OFFSET, 0));
  }
}

const SHIP_MOUSE_SENSITIVITY = 0.0018;
const SHIP_MAX_PITCH = 1.3;
const THRUST_ACCEL = 34;
const BOOST_MULTIPLIER = 2.15;
const ATMOSPHERE_DRAG = 0.986;
const SPACE_DRAG = 0.9985;
const CLIMB_SPEED = 22;
const ROLL_SPEED = 2.2;
const ROLL_RECOVERY = 3;
const HULL_LAG_SPEED = 6;
const FUEL_BURN_RATE = 0.46;
const LANDED_REFUEL_RATE = 8;
const LANDING_HEIGHT_OFFSET = 1.0;
const GEAR_RETRACT_ALTITUDE = 7;

class ShipController {
  constructor(ship, world) {
    this.ship = ship;
    this.world = world;
  }

  update(deltaTime, input, computerOpen = false) {
    if (!this.ship.isPiloted) {
      this._handleIdleRefuel(deltaTime);
      this.ship.throttle *= 1 - Math.min(deltaTime * 4, 1);
      this._updateThrusterVisuals();
      return;
    }

    if (computerOpen) {
      input.consumeMouseDelta();
      this.ship.isBoosting = false;
      this.ship.throttle += (0 - this.ship.throttle) * Math.min(deltaTime * 6, 1);
      this.ship.roll *= 1 - Math.min(deltaTime * ROLL_RECOVERY, 1);
    } else {
      this._handleLook(input);
      this._handleThrust(deltaTime, input);
      this._handleRoll(deltaTime, input);
    }

    this._applyPhysics(deltaTime);
    this._resolveGroundCollision();
    this._updateLandingGear();
    this._updateHullLag(deltaTime);
    this._updateThrusterVisuals();
    this.ship.syncTransform();
  }

  _handleIdleRefuel(deltaTime) {
    if (this.world.mode === 'surface' && this.ship.isLanded && this.ship.fuel < MAX_FUEL) {
      this.ship.fuel = Math.min(MAX_FUEL, this.ship.fuel + LANDED_REFUEL_RATE * deltaTime);
    }
  }

  _handleLook(input) {
    const { x, y } = input.consumeMouseDelta();
    this.ship.yaw -= x * SHIP_MOUSE_SENSITIVITY;
    this.ship.pitch -= y * SHIP_MOUSE_SENSITIVITY;
    this.ship.pitch = Math.max(-SHIP_MAX_PITCH, Math.min(SHIP_MAX_PITCH, this.ship.pitch));
  }

  _handleThrust(deltaTime, input) {
    const hasFuel = this.ship.fuel > 0;
    const forwardInput = input.isKeyDown('KeyW') ? 1 : input.isKeyDown('KeyS') ? -1 : 0;
    const climbInput = input.isKeyDown('Space') ? 1 : input.isKeyDown('ControlLeft') ? -1 : 0;
    this.ship.isBoosting = input.isKeyDown('ShiftLeft') || input.isKeyDown('ShiftRight');

    let thrustMagnitude = 0;
    let fuelWork = 0;

    if (hasFuel && (forwardInput !== 0 || climbInput !== 0)) {
      const multiplier = this.ship.isBoosting ? BOOST_MULTIPLIER : 1;
      const forward = this._getForwardVector();
      this.ship.velocity.addScaledVector(forward, forwardInput * THRUST_ACCEL * multiplier * deltaTime);
      this.ship.velocity.y += climbInput * CLIMB_SPEED * deltaTime;
      thrustMagnitude = Math.abs(forwardInput) * multiplier + Math.abs(climbInput) * 0.55;
      fuelWork = Math.abs(forwardInput) + Math.abs(climbInput) * 0.55;
      this.ship.isLanded = false;
    }

    const targetThrottle = Math.min(thrustMagnitude, 1);
    this.ship.throttle += (targetThrottle - this.ship.throttle) * Math.min(deltaTime * 6, 1);

    if (hasFuel && fuelWork > 0) {
      const boostCost = this.ship.isBoosting ? 1.65 : 1;
      const burn = FUEL_BURN_RATE * fuelWork * boostCost * this._burnMultiplier() * deltaTime;
      this.ship.fuel = Math.max(0, this.ship.fuel - burn);
    }
  }

  _burnMultiplier() {
    if (this.world.mode !== 'surface') return 0.58;
    const altitude = Math.max(0, this.world.getSurfaceAltitude(this.ship.position));
    const exitHeight = Math.max(1, this.world.getAtmosphereExitHeight());
    const thickAir = Math.max(0, 1 - altitude / exitHeight);
    const gravityLoad = Math.min(0.45, Math.abs(this.world.getGravityAt()) / 45);
    return 1 + thickAir * 0.7 + gravityLoad;
  }

  _handleRoll(deltaTime, input) {
    const rollInput = input.isKeyDown('KeyD') ? -1 : input.isKeyDown('KeyA') ? 1 : 0;

    if (rollInput !== 0) {
      this.ship.roll += rollInput * ROLL_SPEED * deltaTime;
      this.ship.roll = Math.max(-0.9, Math.min(0.9, this.ship.roll));
    } else {
      this.ship.roll *= 1 - Math.min(deltaTime * ROLL_RECOVERY, 1);
    }
  }

  _applyPhysics(deltaTime) {
    if (!this.ship.isLanded) {
      const gravity = this.world.getGravityVectorAt(this.ship.position);
      this.ship.velocity.addScaledVector(gravity, 0.22 * deltaTime);
    }

    const drag = this.world.mode === 'space' ? SPACE_DRAG : ATMOSPHERE_DRAG;
    const dragFactor = Math.pow(drag, deltaTime * 60);
    this.ship.velocity.multiplyScalar(dragFactor);
    this.ship.position.addScaledVector(this.ship.velocity, deltaTime);
  }

  _resolveGroundCollision() {
    if (this.world.mode !== 'surface') return;

    const groundHeight = this.world.getHeightAt(this.ship.position.x, this.ship.position.z);
    const landingHeight = groundHeight + LANDING_HEIGHT_OFFSET;

    if (this.ship.position.y <= landingHeight) {
      this.ship.position.y = landingHeight;
      const wasDescendingGently = this.ship.velocity.y > -9;
      this.ship.velocity.y = 0;
      this.ship.isLanded = wasDescendingGently;
    }
  }

  _updateLandingGear() {
    if (this.world.mode === 'space') {
      this.ship.setGearDeployed(false);
      return;
    }

    const groundHeight = this.world.getHeightAt(this.ship.position.x, this.ship.position.z);
    const altitude = this.ship.position.y - groundHeight;

    if (this.ship.isLanded) {
      this.ship.setGearDeployed(true);
    } else if (altitude > GEAR_RETRACT_ALTITUDE) {
      this.ship.setGearDeployed(false);
    } else {
      this.ship.setGearDeployed(true);
    }
  }

  _updateHullLag(deltaTime) {
    const t = 1 - Math.exp(-HULL_LAG_SPEED * deltaTime);
    this.ship.visualYaw = this._lerpAngle(this.ship.visualYaw, this.ship.yaw, t);
    this.ship.visualPitch += (this.ship.pitch - this.ship.visualPitch) * t;
  }

  _updateThrusterVisuals() {
    const intensity = this.ship.throttle * 2.5;
    this.ship.thrusterMaterial.emissiveIntensity = intensity;
    this.ship.thrusterCoreMaterial.emissiveIntensity = intensity * 1.4;
    this.ship.thrusterCoreMaterial.opacity = 0.4 + this.ship.throttle * 0.5;

    const scale = 1 + this.ship.throttle * 0.7;
    for (const engine of [this.ship.leftEngine, this.ship.rightEngine]) {
      engine.userData.outerFlame.scale.set(1, 1, scale);
      engine.userData.innerFlame.scale.set(1, 1, scale * 1.1);
    }
  }

  _getForwardVector() {
    const forward = new THREE.Vector3(0, 0, -1);
    const euler = new THREE.Euler(this.ship.pitch, this.ship.yaw, 0, 'YXZ');
    forward.applyEuler(euler);
    return forward;
  }

  _lerpAngle(current, target, t) {
    let delta = target - current;
    delta = ((delta + Math.PI) % (Math.PI * 2)) - Math.PI;
    return current + delta * t;
  }
}

class InteractionPrompt {
  constructor() {
    this.element = document.createElement('div');
    this.element.id = 'interaction-prompt';
    this.element.classList.add('hidden');
    document.getElementById('hud').appendChild(this.element);
  }

  show(text) {
    this.element.textContent = text;
    this.element.classList.remove('hidden');
  }

  hide() {
    this.element.classList.add('hidden');
  }
}

class PlanetLabel {
  constructor() {
    this.element = document.createElement('div');
    this.element.id = 'planet-label';
    document.getElementById('hud').appendChild(this.element);

    this.nameEl = document.createElement('div');
    this.nameEl.id = 'planet-label-name';
    this.element.appendChild(this.nameEl);

    this.detailEl = document.createElement('div');
    this.detailEl.id = 'planet-label-detail';
    this.element.appendChild(this.detailEl);

    this._lastPlanetId = null;
  }

  update(planet) {
    if (planet.id === this._lastPlanetId) return;
    this._lastPlanetId = planet.id;

    this.nameEl.textContent = planet.name.toUpperCase();

    if (planet.gravity !== undefined) {

      const relative = (planet.gravity / -18) * 1.0;
      this.detailEl.textContent = `GRAVITY ${relative.toFixed(2)}g`;
    } else {
      this.detailEl.textContent = '';
    }

    this.element.classList.remove('flash');
    void this.element.offsetWidth;
    this.element.classList.add('flash');
  }
}

class ShipComputer {
  constructor() {
    this.isOpen = false;
    this.element = document.createElement('div');
    this.element.id = 'ship-computer';
    this.element.style.cssText = [
      'position:absolute',
      'top:8%',
      'right:4%',
      'width:min(360px, 88vw)',
      'padding:18px 20px',
      'border:1px solid rgba(127,214,255,0.45)',
      'border-radius:8px',
      'background:rgba(4,10,18,0.82)',
      'box-shadow:0 0 28px rgba(39,204,255,0.22)',
      'backdrop-filter:blur(8px)',
      'color:#e8f0ff',
      'font-family:Segoe UI, Roboto, Arial, sans-serif',
      'letter-spacing:0.04rem',
      'opacity:0',
      'transform:translateY(14px) scale(0.98)',
      'transition:opacity 0.35s ease, transform 0.35s ease',
      'pointer-events:none',
      'z-index:20'
    ].join(';');
    document.getElementById('hud').appendChild(this.element);
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.element.style.opacity = '1';
    this.element.style.transform = 'translateY(0) scale(1)';
  }

  close() {
    this.isOpen = false;
    this.element.style.opacity = '0';
    this.element.style.transform = 'translateY(14px) scale(0.98)';
  }

  update(world, ship) {
    if (!this.isOpen) return;

    const planet = world.currentPlanet || world.surfacePlanet || DEEP_SPACE;
    const altitude = world.getSurfaceAltitude(ship.position);
    const fuelPercent = Math.max(0, Math.min(100, (ship.fuel / MAX_FUEL) * 100));
    const speed = ship.velocity.length();
    const gravity = planet.gravity !== undefined ? `${((planet.gravity / -18) || 0).toFixed(2)}g` : '0.00g';
    const place = world.mode === 'space' ? 'SPACE FLIGHT' : `${planet.name.toUpperCase()} SURFACE`;
    const atmosphere = world.mode === 'surface'
      ? `${Math.max(0, world.getAtmosphereExitHeight() - altitude).toFixed(0)} m TO ATMOSPHERE EXIT`
      : 'PLANETS ARE REAL BODIES NOW';

    this.element.innerHTML = `
      <div style="font-size:0.72rem;color:#7fd6ff;margin-bottom:8px;letter-spacing:0.16rem;">SHIP COMPUTER</div>
      <div style="font-size:1.35rem;font-weight:300;margin-bottom:14px;text-shadow:0 0 12px rgba(127,214,255,0.45);">${place}</div>
      <div style="display:grid;grid-template-columns:1fr auto;gap:8px 18px;font-size:0.82rem;line-height:1.45;">
        <span style="color:#8fa4c0;">FUEL</span><span>${fuelPercent.toFixed(0)}%</span>
        <span style="color:#8fa4c0;">TANK</span><span>${ship.fuel.toFixed(1)} / ${MAX_FUEL}</span>
        <span style="color:#8fa4c0;">ALTITUDE</span><span>${Math.max(0, altitude).toFixed(1)} m</span>
        <span style="color:#8fa4c0;">SPEED</span><span>${speed.toFixed(1)} m/s</span>
        <span style="color:#8fa4c0;">GRAVITY</span><span>${gravity}</span>
        <span style="color:#8fa4c0;">MODE</span><span>${world.mode.toUpperCase()}</span>
      </div>
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(127,214,255,0.22);font-size:0.72rem;color:#9fb6ca;line-height:1.5;">${atmosphere}</div>
    `;
  }
}

const ENTER_SHIP_RANGE = 4.5;
const DOOR_CLOSE_DELAY_MS = 1400;

class Game {
  constructor() {
    this._setLoadingText('Building renderer...');
    this._initRenderer();

    this._setLoadingText('Generating terrain...');
    this._initScene();

    this._setLoadingText('Suiting up astronaut...');
    this._initPlayer();

    this._setLoadingText('Calibrating camera...');
    this._initCamera();

    this._setLoadingText('Fueling spaceship...');
    this._initShip();

    this.input = new InputManager(this.renderer.domElement);
    this.interactionPrompt = new InteractionPrompt();
    this.planetLabel = new PlanetLabel();
    this.fuelGaugeEl = document.getElementById('fuel-gauge');
    this.fuelGaugeFillEl = document.getElementById('fuel-gauge-fill');
    this.shipComputer = new ShipComputer();

    this.mode = 'onFoot';

    window.addEventListener('resize', () => this._onResize());

    this.clock = new THREE.Clock();

    this._hideLoadingScreen();
    this._tick();
  }

  _initRenderer() {
    const canvas = document.getElementById('game-canvas');
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  _initScene() {
    this.scene = new THREE.Scene();
    this.world = new World(this.scene);
  }

  _initPlayer() {
    this.player = new Player(this.scene, this.world);
  }

  _initCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      0.1,
      18000
    );
    this.thirdPersonCamera = new ThirdPersonCamera(this.perspectiveCamera, this.player);
  }

  _initShip() {

    const spawnPosition = new THREE.Vector3(6, 0, -4);
    spawnPosition.y = this.world.getHeightAt(spawnPosition.x, spawnPosition.z) + 1.0;

    this.ship = new Ship(this.scene, this.world, spawnPosition);
    this.shipController = new ShipController(this.ship, this.world);
    this.shipCamera = new ShipCamera(this.perspectiveCamera, this.ship);
    this.engineAudio = new EngineAudio();
  }

  _onResize() {
    this.perspectiveCamera.aspect = window.innerWidth / window.innerHeight;
    this.perspectiveCamera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _tick() {
    requestAnimationFrame(() => this._tick());

    const deltaTime = Math.min(this.clock.getDelta(), 0.1);

    this._handleComputerInput();
    this._handleShipInteraction();

    if (this.mode === 'onFoot') {
      this.thirdPersonCamera.update(this.input);
      this.player.update(deltaTime, this.input, this.thirdPersonCamera.yaw);
    } else {
      this.shipController.update(deltaTime, this.input, this.shipComputer.isOpen);
      this.world.updateTravelState(this.ship);
      this.shipCamera.update(deltaTime, this.shipComputer.isOpen);
    }

    const activePosition = this.mode === 'onFoot' ? this.player.position : this.ship.position;
    this.world.update(deltaTime, activePosition);
    this.planetLabel.update(this.world.currentPlanet);

    this.ship.updateDoor(deltaTime);
    this.ship.updateGear(deltaTime);
    this.ship.updateLights(deltaTime);
    this.engineAudio.setThrottle(this.ship.throttle);
    this.shipComputer.update(this.world, this.ship);
    this._updateFuelGauge();

    this.input.endFrame();
    this.renderer.render(this.scene, this.perspectiveCamera);
  }

  _handleShipInteraction() {
    const nearShip = this.ship.distanceTo(this.player.position) <= ENTER_SHIP_RANGE;

    if (this.mode === 'onFoot') {
      this.shipComputer.close();
      if (nearShip) {
        this.interactionPrompt.show('Press E to enter ship');
      } else {
        this.interactionPrompt.hide();
      }

      if (nearShip && this.input.wasKeyJustPressed('KeyE')) {
        this._enterShip();
      }
    } else {
      const exitText = this.world.mode === 'surface' && this.ship.isLanded ? 'Press E to exit ship' : 'Land before exiting';
      const computerText = this.shipComputer.isOpen ? 'Press X to close computer' : 'Press X for computer';
      this.interactionPrompt.show(`${exitText} | ${computerText}`);

      if (this.input.wasKeyJustPressed('KeyE')) {
        this._exitShip();
      }
    }
  }

  _handleComputerInput() {
    if (this.mode === 'piloting' && this.input.wasKeyJustPressed('KeyX')) {
      this.shipComputer.toggle();
    }
  }

  _enterShip() {
    this.mode = 'piloting';
    this.player.group.visible = false;

    this.ship.isPiloted = true;
    this.ship.setDoorOpen(true);
    this.shipCamera.snapToShip();

    this.engineAudio.start();

    setTimeout(() => this.ship.setDoorOpen(false), DOOR_CLOSE_DELAY_MS);
  }

  _exitShip() {
    if (this.world.mode !== 'surface' || !this.ship.isLanded) {
      this.interactionPrompt.show('Land before exiting ship');
      return;
    }

    this.mode = 'onFoot';
    this.ship.isPiloted = false;
    this.ship.setDoorOpen(true);
    this.shipComputer.close();

    const exitOffset = new THREE.Vector3(2.2, 0, 0.5).applyEuler(
      new THREE.Euler(0, this.ship.yaw, 0)
    );
    const exitX = this.ship.position.x + exitOffset.x;
    const exitZ = this.ship.position.z + exitOffset.z;
    const exitY = this.world.getHeightAt(exitX, exitZ);

    this.player.setPosition(exitX, exitY, exitZ);
    this.player.group.visible = true;

    setTimeout(() => this.ship.setDoorOpen(false), DOOR_CLOSE_DELAY_MS);
  }

  _updateFuelGauge() {
    if (this.mode === 'piloting') {
      this.fuelGaugeEl.classList.remove('hidden');
      const percent = Math.max(0, Math.min(100, (this.ship.fuel / MAX_FUEL) * 100));
      this.fuelGaugeFillEl.style.width = percent + '%';
      const hue = Math.round((percent / 100) * 45);
      this.fuelGaugeFillEl.style.background = `linear-gradient(90deg, hsl(${hue}, 90%, 55%), hsl(${hue + 10}, 90%, 60%))`;
    } else {
      this.fuelGaugeEl.classList.add('hidden');
    }
  }

  _setLoadingText(text) {
    const el = document.getElementById('loading-text');
    if (el) el.textContent = text;
    const fill = document.getElementById('loading-bar-fill');
    if (fill) {
      const current = parseFloat(fill.style.width) || 0;
      fill.style.width = Math.min(current + 25, 100) + '%';
    }
  }

  _hideLoadingScreen() {
    const fill = document.getElementById('loading-bar-fill');
    if (fill) fill.style.width = '100%';

    setTimeout(() => {
      const screen = document.getElementById('loading-screen');
      if (screen) screen.classList.add('hidden');
    }, 300);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Game();
});


  

  


}
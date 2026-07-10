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

  


}
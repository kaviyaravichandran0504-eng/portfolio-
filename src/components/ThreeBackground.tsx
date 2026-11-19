import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const _vec3 = new THREE.Vector3();
const _color = new THREE.Color();
const _dummy = new THREE.Object3D();

interface SculptureNode {
  group: THREE.Group;
  innerRing: THREE.Mesh;
  outerRing: THREE.Mesh;
  baseY: number;
  speed: number;
  phase: number;
}

interface BarSpec {
  x: number;
  z: number;
  baseHeight: number;
  phase: number;
  speed: number;
}

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const bgHex = 0x06090f;
    scene.background = new THREE.Color(bgHex);
    scene.fog = new THREE.FogExp2(bgHex, 0.032);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 130);
    camera.position.set(0, 1.5, 14.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // 3-Point Warm/Cool Studio Lighting
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x080c15, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1db, 2.3);
    keyLight.position.set(9, 13, 10);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.near = 1;
      keyLight.shadow.camera.far = 42;
      keyLight.shadow.camera.left = -15;
      keyLight.shadow.camera.right = 15;
      keyLight.shadow.camera.top = 15;
      keyLight.shadow.camera.bottom = -15;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x14b8a6, 1.5);
    rimLight.position.set(-11, 5, -9);
    scene.add(rimLight);

    const disposables: Array<{ dispose: () => void }> = [envTexture];

    // 1. Undulating Quantitative Data Surface Mesh (onBeforeCompile PBR displacement)
    const terrainGeo = new THREE.PlaneGeometry(76, 60, 68, 54);
    terrainGeo.rotateX(-Math.PI / 2);
    disposables.push(terrainGeo);

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0e2a3b,
      emissive: 0x071a24,
      emissiveIntensity: 0.55,
      metalness: 0.72,
      roughness: 0.42,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    terrainMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      terrainMat.userData.shader = shader;
      shader.vertexShader = `uniform float uTime;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float wave1 = sin(transformed.x * 0.22 + uTime * 0.5) * cos(transformed.z * 0.2 + uTime * 0.38) * 1.1;
        float wave2 = sin(transformed.x * 0.44 - uTime * 0.32 + transformed.z * 0.28) * 0.42;
        transformed.y += wave1 + wave2;
        `
      );
    };
    disposables.push(terrainMat);

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -6.4, -10);
    scene.add(terrainMesh);

    // 2. Central-Right 3D Quantitative Ledger Network Globe (Composite 5-part Group)
    const networkGroup = new THREE.Group();
    networkGroup.position.set(6.2, 1.1, -5.2);

    const latticeGeo = new THREE.IcosahedronGeometry(2.6, 1);
    const latticeEdges = new THREE.EdgesGeometry(latticeGeo);
    const latticeMat = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.35,
    });
    const latticeLines = new THREE.LineSegments(latticeEdges, latticeMat);
    networkGroup.add(latticeLines);

    const innerVaultGeo = new THREE.OctahedronGeometry(1.15, 0);
    const innerVaultMat = new THREE.MeshPhysicalMaterial({
      color: 0x102033,
      metalness: 0.94,
      roughness: 0.16,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
    });
    const innerVault = new THREE.Mesh(innerVaultGeo, innerVaultMat);
    networkGroup.add(innerVault);

    const meridianGeo1 = new THREE.TorusGeometry(3.25, 0.032, 14, 96);
    const meridianMat1 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.92,
      roughness: 0.22,
      emissive: 0x78350f,
      emissiveIntensity: 0.28,
    });
    const meridianRing1 = new THREE.Mesh(meridianGeo1, meridianMat1);
    meridianRing1.rotation.x = Math.PI / 2.8;
    networkGroup.add(meridianRing1);

    const meridianGeo2 = new THREE.TorusGeometry(3.7, 0.022, 12, 96);
    const meridianMat2 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.8,
      roughness: 0.45,
      emissive: 0x0c4a6e,
      emissiveIntensity: 0.3,
    });
    const meridianRing2 = new THREE.Mesh(meridianGeo2, meridianMat2);
    meridianRing2.rotation.y = Math.PI / 3.2;
    networkGroup.add(meridianRing2);

    const satGeo = new THREE.BoxGeometry(0.18, 0.18, 0.18);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const sat = new THREE.Mesh(satGeo, i % 2 === 0 ? meridianMat1 : meridianMat2);
      sat.position.set(Math.cos(a) * 3.25, 0, Math.sin(a) * 3.25);
      meridianRing1.add(sat);
    }
    scene.add(networkGroup);
    disposables.push(
      latticeGeo,
      latticeEdges,
      latticeMat,
      innerVaultGeo,
      innerVaultMat,
      meridianGeo1,
      meridianMat1,
      meridianGeo2,
      meridianMat2,
      satGeo
    );

    // 3. Secondary Orbiting Composite Financial Prism Sculptures
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x162235,
      metalness: 0.92,
      roughness: 0.2,
      clearcoat: 0.7,
    });
    const tealRingMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      metalness: 0.72,
      roughness: 0.48,
      emissive: 0x064e3b,
      emissiveIntensity: 0.35,
    });
    const slateRingMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      metalness: 0.88,
      roughness: 0.25,
    });
    const coreGeo = new THREE.OctahedronGeometry(0.95, 0);
    const collarGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.12, 6);
    const innerRingGeo = new THREE.TorusGeometry(1.65, 0.034, 14, 68);
    const outerRingGeo = new THREE.TorusGeometry(2.1, 0.022, 12, 76);
    disposables.push(coreMat, tealRingMat, slateRingMat, coreGeo, collarGeo, innerRingGeo, outerRingGeo);

    const sculptureSpecs = [
      { pos: new THREE.Vector3(-8.4, 0.4, -7.4), scale: 0.92, speed: -0.2, phase: 1.4 },
      { pos: new THREE.Vector3(-1.4, 4.6, -13.8), scale: 1.15, speed: 0.16, phase: 3.1 },
    ];

    const sculptures: SculptureNode[] = sculptureSpecs.map((spec) => {
      const group = new THREE.Group();
      group.position.copy(spec.pos);
      group.scale.setScalar(spec.scale);

      const core = new THREE.Mesh(coreGeo, coreMat);
      core.castShadow = !isSoftwareGl;
      group.add(core);

      const collar = new THREE.Mesh(collarGeo, slateRingMat);
      collar.rotation.z = Math.PI / 5;
      group.add(collar);

      const innerRing = new THREE.Mesh(innerRingGeo, tealRingMat);
      innerRing.rotation.x = Math.PI / 2.6;
      group.add(innerRing);

      const outerRing = new THREE.Mesh(outerRingGeo, slateRingMat);
      outerRing.rotation.y = Math.PI / 3.2;
      group.add(outerRing);

      scene.add(group);
      return {
        group,
        innerRing,
        outerRing,
        baseY: spec.pos.y,
        speed: spec.speed,
        phase: spec.phase,
      };
    });

    // 4. Instanced 3D Financial Growth Bar Arc (44 rising & breathing ledger columns)
    const barCount = 44;
    const barGeo = new THREE.BoxGeometry(0.24, 1, 0.24);
    barGeo.translate(0, 0.5, 0); // bottom-center pivot so bars sit on the horizon plane
    const barMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.78,
      roughness: 0.28,
    });
    disposables.push(barGeo, barMat);

    const barMesh = new THREE.InstancedMesh(barGeo, barMat, barCount);
    const barSpecs: BarSpec[] = [];
    const barPalette = [0x14b8a6, 0x0ea5e9, 0xf59e0b, 0x2dd4bf];

    for (let i = 0; i < barCount; i++) {
      const t = i / (barCount - 1);
      const angle = (t - 0.5) * Math.PI * 0.95;
      const radius = 15.5 + (i % 2) * 1.4;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius * 0.72 - 3.5;
      const baseHeight = 1.2 + Math.sin(t * Math.PI * 2.5) * 0.8 + (i % 5) * 0.55;

      barSpecs.push({
        x,
        z,
        baseHeight,
        phase: i * 0.35,
        speed: 0.85 + (i % 4) * 0.18,
      });

      _dummy.position.set(x, -6.2, z);
      _dummy.scale.set(1, baseHeight, 1);
      _dummy.rotation.set(0, -angle, 0);
      _dummy.updateMatrix();
      barMesh.setMatrixAt(i, _dummy.matrix);

      _color.setHex(barPalette[i % barPalette.length]);
      barMesh.setColorAt(i, _color);
    }
    barMesh.instanceMatrix.needsUpdate = true;
    if (barMesh.instanceColor) barMesh.instanceColor.needsUpdate = true;
    barMesh.computeBoundingSphere();
    scene.add(barMesh);

    // 5. Instanced Data Constellation Particles
    const instanceCount = 300;
    const instGeo = new THREE.OctahedronGeometry(0.06, 0);
    const instMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.65,
      roughness: 0.32,
    });
    disposables.push(instGeo, instMat);

    const instMesh = new THREE.InstancedMesh(instGeo, instMat, instanceCount);
    const paletteHex = [0x14b8a6, 0x38bdf8, 0xf59e0b, 0x64748b];

    for (let i = 0; i < instanceCount; i++) {
      const x = (Math.random() - 0.5) * 36;
      const y = (Math.random() - 0.5) * 18 + 1.5;
      const z = -Math.random() * 26 - 1;

      _dummy.position.set(x, y, z);
      _dummy.scale.setScalar(0.7 + Math.random() * 0.9);
      _dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      _dummy.updateMatrix();
      instMesh.setMatrixAt(i, _dummy.matrix);

      _color.setHex(paletteHex[i % paletteHex.length]);
      instMesh.setColorAt(i, _color);
    }

    instMesh.instanceMatrix.needsUpdate = true;
    if (instMesh.instanceColor) instMesh.instanceColor.needsUpdate = true;
    instMesh.computeBoundingSphere();
    scene.add(instMesh);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;
    let targetScrollY = window.scrollY;
    let currentScrollY = window.scrollY;

    const handlePointerMove = (e: PointerEvent) => {
      targetPointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetPointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function updateScene(elapsed: number, delta: number) {
      currentPointerX = THREE.MathUtils.damp(currentPointerX, targetPointerX, 3.2, delta);
      currentPointerY = THREE.MathUtils.damp(currentPointerY, targetPointerY, 3.2, delta);
      currentScrollY = THREE.MathUtils.damp(currentScrollY, targetScrollY, 3.5, delta);

      const scrollFactor = Math.min(currentScrollY / 2400, 1.6);
      camera.position.x = currentPointerX * 1.25;
      camera.position.y = 1.5 - currentPointerY * 0.7 - scrollFactor * 1.7;
      camera.position.z = 14.5 - scrollFactor * 2.5;
      _vec3.set(currentPointerX * 0.4, -scrollFactor * 1.1, -6);
      camera.lookAt(_vec3);

      if (terrainMat.userData.shader) {
        terrainMat.userData.shader.uniforms.uTime.value = elapsed;
      }

      // Network Globe animation
      networkGroup.position.y = 1.1 + Math.sin(elapsed * 0.55) * 0.35;
      networkGroup.rotation.y = elapsed * 0.14;
      innerVault.rotation.x = elapsed * 0.35;
      innerVault.rotation.z = elapsed * 0.25;
      meridianRing1.rotation.z = elapsed * 0.32;
      meridianRing2.rotation.x = -elapsed * 0.24;

      // Secondary composite sculptures
      for (let i = 0; i < sculptures.length; i++) {
        const s = sculptures[i];
        s.group.position.y = s.baseY + Math.sin(elapsed * 0.7 + s.phase) * 0.38;
        s.group.rotation.y = elapsed * s.speed + s.phase;
        s.group.rotation.x = Math.sin(elapsed * 0.25 + s.phase) * 0.14;
        s.innerRing.rotation.z = elapsed * (s.speed * 1.8);
        s.outerRing.rotation.x = elapsed * (-s.speed * 1.3);
      }

      // Animated financial growth bars
      for (let i = 0; i < barSpecs.length; i++) {
        const b = barSpecs[i];
        const h = b.baseHeight + Math.sin(elapsed * b.speed + b.phase) * 0.65;
        _dummy.position.set(b.x, -6.2, b.z);
        _dummy.scale.set(1, Math.max(0.4, h), 1);
        _dummy.rotation.set(0, 0, 0);
        _dummy.updateMatrix();
        barMesh.setMatrixAt(i, _dummy.matrix);
      }
      barMesh.instanceMatrix.needsUpdate = true;

      instMesh.rotation.y = elapsed * 0.016;
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      updateScene(elapsed, delta);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (prefersReducedMotion) {
      updateScene(0.6, 0.016);
      renderer.render(scene, camera);
    } else {
      tick();
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

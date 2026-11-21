import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const _vec3 = new THREE.Vector3();
const _color = new THREE.Color();
const _dummy = new THREE.Object3D();

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
    scene.fog = new THREE.FogExp2(bgHex, 0.048);

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 15);

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
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = false;

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;
    pmremGenerator.dispose();

    // Subtle studio lighting with warm/cool balance
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x06090f, 0.75);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1db, 1.5);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x14b8a6, 0.9);
    rimLight.position.set(-10, 4, -8);
    scene.add(rimLight);

    const disposables: Array<{ dispose: () => void }> = [envTexture];

    // 1. Calm undulating hairline horizon plane (gentle, low-contrast architectural mesh)
    const terrainGeo = new THREE.PlaneGeometry(68, 52, 54, 42);
    terrainGeo.rotateX(-Math.PI / 2);
    disposables.push(terrainGeo);

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x0f293a,
      emissive: 0x05131c,
      emissiveIntensity: 0.4,
      metalness: 0.65,
      roughness: 0.45,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    terrainMat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = { value: 0 };
      terrainMat.userData.shader = shader;
      shader.vertexShader = `uniform float uTime;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float wave = sin(transformed.x * 0.16 + uTime * 0.28) * cos(transformed.z * 0.15 + uTime * 0.22) * 0.85;
        transformed.y += wave;
        `
      );
    };
    disposables.push(terrainMat);

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.position.set(0, -5.6, -9);
    scene.add(terrainMesh);

    // 2. Single serene architectural centerpiece (5-part composite sculpture)
    const centerpiece = new THREE.Group();
    centerpiece.position.set(6.4, 0.8, -7.8);

    const coreGeo = new THREE.IcosahedronGeometry(1.55, 0);
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e1a2b,
      metalness: 0.92,
      roughness: 0.2,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    centerpiece.add(coreMesh);

    const latticeEdges = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.15, 1));
    const latticeMat = new THREE.LineBasicMaterial({
      color: 0x14b8a6,
      transparent: true,
      opacity: 0.18,
    });
    const latticeMesh = new THREE.LineSegments(latticeEdges, latticeMat);
    centerpiece.add(latticeMesh);

    const primaryRingGeo = new THREE.TorusGeometry(2.75, 0.018, 12, 96);
    const primaryRingMat = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      metalness: 0.72,
      roughness: 0.48,
      emissive: 0x064e3b,
      emissiveIntensity: 0.25,
    });
    const primaryRing = new THREE.Mesh(primaryRingGeo, primaryRingMat);
    primaryRing.rotation.x = Math.PI / 2.6;
    centerpiece.add(primaryRing);

    const secondaryRingGeo = new THREE.TorusGeometry(3.25, 0.014, 12, 96);
    const secondaryRingMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.24,
    });
    const secondaryRing = new THREE.Mesh(secondaryRingGeo, secondaryRingMat);
    secondaryRing.rotation.y = Math.PI / 3.4;
    centerpiece.add(secondaryRing);

    const nodeGeo = new THREE.OctahedronGeometry(0.1, 0);
    for (let i = 0; i < 2; i++) {
      const angle = i * Math.PI;
      const node = new THREE.Mesh(nodeGeo, secondaryRingMat);
      node.position.set(Math.cos(angle) * 2.75, 0, Math.sin(angle) * 2.75);
      primaryRing.add(node);
    }

    scene.add(centerpiece);
    disposables.push(
      coreGeo,
      coreMat,
      latticeEdges,
      latticeMat,
      primaryRingGeo,
      primaryRingMat,
      secondaryRingGeo,
      secondaryRingMat,
      nodeGeo
    );

    // 3. Sparse, quiet ambient depth nodes (90 tiny points, low visual noise)
    const particleCount = 90;
    const dotGeo = new THREE.OctahedronGeometry(0.038, 0);
    const dotMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.45,
      transparent: true,
      opacity: 0.65,
    });
    disposables.push(dotGeo, dotMat);

    const dotMesh = new THREE.InstancedMesh(dotGeo, dotMat, particleCount);
    const dotPalette = [0x14b8a6, 0x334155, 0x475569, 0xd97706];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 16 + 0.8;
      const z = -Math.random() * 20 - 3;

      _dummy.position.set(x, y, z);
      _dummy.scale.setScalar(0.6 + Math.random() * 0.7);
      _dummy.rotation.set(0, 0, 0);
      _dummy.updateMatrix();
      dotMesh.setMatrixAt(i, _dummy.matrix);

      _color.setHex(dotPalette[i % dotPalette.length]);
      dotMesh.setColorAt(i, _color);
    }
    dotMesh.instanceMatrix.needsUpdate = true;
    if (dotMesh.instanceColor) dotMesh.instanceColor.needsUpdate = true;
    dotMesh.computeBoundingSphere();
    scene.add(dotMesh);

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
      currentPointerX = THREE.MathUtils.damp(currentPointerX, targetPointerX, 2.5, delta);
      currentPointerY = THREE.MathUtils.damp(currentPointerY, targetPointerY, 2.5, delta);
      currentScrollY = THREE.MathUtils.damp(currentScrollY, targetScrollY, 3.0, delta);

      const scrollFactor = Math.min(currentScrollY / 2600, 1.2);
      camera.position.x = currentPointerX * 0.45;
      camera.position.y = 1.2 - currentPointerY * 0.28 - scrollFactor * 1.1;
      camera.position.z = 15 - scrollFactor * 1.4;
      _vec3.set(currentPointerX * 0.15, -scrollFactor * 0.6, -7);
      camera.lookAt(_vec3);

      if (terrainMat.userData.shader) {
        terrainMat.userData.shader.uniforms.uTime.value = elapsed;
      }

      // Slow, composed motion for the centerpiece
      centerpiece.position.y = 0.8 + Math.sin(elapsed * 0.35) * 0.2;
      centerpiece.rotation.y = elapsed * 0.07;
      coreMesh.rotation.x = elapsed * 0.09;
      primaryRing.rotation.z = elapsed * 0.12;
      secondaryRing.rotation.x = -elapsed * 0.08;

      dotMesh.rotation.y = elapsed * 0.008;
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
      updateScene(0.5, 0.016);
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

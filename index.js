const markerSvg = `<svg viewBox="-4 0 36 36">
  <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
  <circle fill="black" cx="14" cy="14" r="7"></circle>
</svg>`;

const gData = [
  {
    lat: 35.6839,
    lng: 139.7744,
    size: 35,
    color: "yellow",
    label: "Tokyo",
    url: "https://mikosea.io",
  },
  {
    lat: 35.0117,
    lng: 135.7683,
    size: 25,
    color: "yellow",
    label: "Kyoto",
    url: "https://mikosea.io",
  },
  {
    lat: 21.0245,
    lng: 105.8412,
    size: 30,
    color: "red",
    label: "Hanoi",
    url: "https://mikosea.io",
  },
  {
    lat: 10.8167,
    lng: 106.6333,
    size: 35,
    color: "yellow",
    label: "Hochiminh",
    url: "https://mikosea.io",
  },
];

const backgroundImg =
  "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/night-sky.png";
const globeImageUrl =
  "https://raw.githubusercontent.com/vasturiano/three-globe/master/example/img/earth-day.jpg";
const cloudImageUrl =
  "https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/clouds/clouds.png";

// Add clouds sphere
const CLOUDS_IMG_URL = cloudImageUrl; // from https://github.com/turban/webgl-earth
const CLOUDS_ALT = 0.004;
const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

const GLOBE_ROTATION_SPEED = 0.4;

const defaultPointView = {
  lat: 21.028511,
  lng: 135.804817,
  altitude: 1.7,
};
const MAX_RADIUS = 35;

let world;
const init = () => {
  const _size = window.innerWidth < 1000 ? window.innerWidth : 772;
  world = Globe({
    animateIn: true,
  })(document.getElementById("globe"))
    .width(_size)
    .height(_size)
    .backgroundColor("rgba(0, 0, 0, 0)")
    .globeImageUrl(globeImageUrl)
    .onZoom((e) => {
      // if (e.lat < -MAX_RADIUS) {
      //   e.lat = -MAX_RADIUS;
      // }
      // if (e.lat > MAX_RADIUS) {
      //   e.lat = MAX_RADIUS;
      // }
      world?.pointOfView({
        lat: e.lat,
        lng: e.lng,
        altitude: defaultPointView.altitude,
      });
    })
    // .backgroundImageUrl(backgroundImg);
    // .htmlElementsData(gData)
    .htmlElement((d) => {
      const el = document.createElement("div");
      el.innerHTML = markerSvg;
      el.style.color = d.color;
      el.style.width = `${d.size}px`;

      el.style["pointer-events"] = "auto";
      el.style.cursor = "pointer";
      el.onclick = () => {
        // window.open(d.url);
      };
      return el;
    });

  world.controls().autoRotate = true;
  world.controls().autoRotateSpeed = GLOBE_ROTATION_SPEED;
  world.pointOfView(defaultPointView);

  new THREE.TextureLoader().load(CLOUDS_IMG_URL, (cloudsTexture) => {
    const clouds = new THREE.Mesh(
      new THREE.SphereGeometry(
        world.getGlobeRadius() * (1 + CLOUDS_ALT),
        75,
        75
      ),
      new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
    );
    world.scene().add(clouds);

    (function rotateClouds() {
      clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
      requestAnimationFrame(rotateClouds);
    })();
  });
};

window.addEventListener("resize", (e) => {
  init();
});
init();

# Graphics Portfolio

**Live site: [manisha-graphics.vercel.app](https://manisha-graphics.vercel.app/)**

A collection of real-time rendering demos, originally written in C/C++ with OpenGL and rebuilt in WebGL so they run straight in the browser — no downloads, no build steps, just a link.

## Demos

| Demo | Description | Original |
| --- | --- | --- |
| [Volumetric Clouds](https://manisha-graphics.vercel.app/volumetric-clouds) | Ray-marched clouds with procedural noise (Perlin/simplex FBM) and single-scattering illumination. Tweak octaves, noise type, time of day, and animation speed live. | [volumetric-rendering](https://github.com/gmanishaa/volumetric-rendering) |
| [Twisted Cylinder](https://manisha-graphics.vercel.app/twisted-cylinder) | A vertex shader deforms a cylinder through sine, spiral, and growing-spiral twists. Drag to orbit, or play the full twist sequence. | — |

More demos are on the way.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/), built with [Vite](https://vite.dev/)
- [three.js](https://threejs.org/) via [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) for the WebGL canvases, with custom GLSL shaders
- [Leva](https://github.com/pmndrs/leva) for the live control panels
- [GSAP](https://gsap.com/) for page and card animations
- Deployed on [Vercel](https://vercel.com/)

## Running locally

```sh
npm install
npm run dev      # dev server with HMR
npm run build    # type-check + production build
npm run lint     # oxlint
```

## Project structure

```
src/
├── components/   # Nav, DemoLayout (shared demo page shell)
├── data/         # demo metadata (titles, tags, repo links)
├── demos/        # one folder per demo: canvas, meshes, shaders
└── pages/        # routed pages (Home + one per demo)
```

Each demo page wraps its canvas in `DemoLayout` and registers its metadata in `src/data/demos.ts`, which also drives the cards on the home page.

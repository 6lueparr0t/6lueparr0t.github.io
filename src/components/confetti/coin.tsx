import { useEffect, useMemo, useState } from "react";

import { loadAll } from "@tsparticles/all";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";

// if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
// import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

interface ConfettiProps {
  active?: boolean;
}

const Confetti = ({ active = false }: ConfettiProps) => {
  const [init, setInit] = useState(false);

  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadAll(engine);
      // await loadFull(engine);
      // await loadSlim(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // this will be called every time the particles are loaded
  const particlesLoaded = async (_container?: Container): Promise<void> => {
    // console.log(container);
  };

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: {
        zIndex: 1,
      },
      particles: {
        number: {
          value: 0,
        },
        color: {
          value: ["#D4AF37", "#FFD700", "#F5C200", "#C9B037"],
        },
        shape: {
          type: ["circle"],
          options: {},
        },
        opacity: {
          value: {
            min: 0,
            max: 1,
          },
          animation: {
            enable: true,
            speed: 5,
            startValue: "max",
            destroy: "min",
          },
        },
        size: {
          value: {
            min: 8,
            max: 8,
          },
        },
        links: {
          enable: false,
        },
        life: {
          duration: {
            sync: true,
            value: 5,
          },
          count: 1,
        },
        move: {
          enable: true,
          gravity: {
            // enable: true,
            acceleration: 2,
            // inverse: true,
          },
          speed: {
            min: 1,
            max: 100,
          },
          decay: 0.02,
          direction: "none",
          straight: false,
          outModes: {
            default: "destroy",
            top: "none",
          },
        },
        rotate: {
          value: {
            min: 0,
            max: 360,
          },
          direction: "random",
          move: true,
          animation: {
            enable: true,
            speed: 60,
          },
        },
        tilt: {
          direction: "random",
          enable: true,
          move: true,
          value: {
            min: 0,
            max: 360,
          },
          animation: {
            enable: true,
            speed: 60,
          },
        },
        roll: {
          darken: {
            enable: true,
            value: 25,
          },
          enable: true,
          speed: {
            min: 15,
            max: 25,
          },
        },
        wobble: {
          distance: 30,
          enable: true,
          move: true,
          speed: {
            min: -15,
            max: 15,
          },
        },
      },
      emitters: {
        life: {
          count: 1,
          duration: 0.1,
          delay: 0.5,
        },
        rate: {
          delay: 0.01,
          quantity: 50,
        },
        size: {
          width: 0,
          height: 0,
        },
      },
    }),
    []
  );

  if (!init || !active) {
    return null;
  }

  return <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />;
};

export default Confetti;

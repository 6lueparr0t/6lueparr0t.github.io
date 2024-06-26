import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadAll } from "@tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
// import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

const Confetti = () => {
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

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
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
          value: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
        },
        shape: {
          type: ["heart"],
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
            min: 10,
            max: 20,
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
            enable: true,
            acceleration: 2,
          },
          speed: {
            min: 10,
            max: 20,
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
          count: 0,
          duration: 0.1,
          delay: 0.5,
        },
        rate: {
          delay: 0.5,
          quantity: 150,
        },
        size: {
          width: 0,
          height: 0,
        },
      },
    }),
    []
  );

  if (init) {
    return (
      <div className="flex w-full h-screen z-50">
        <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={options} />
      </div>
    );
  }

  return <></>;
};

export default Confetti;

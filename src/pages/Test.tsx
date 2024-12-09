import type { ActionFunctionArgs } from "react-router";
import { sleep } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CircleParticle, RectParticle } from "confetti.ts";
import { useEffect } from "react";

// 다른 confetti
function Test() {
  const helloHandler = () => {
    // alert("Hello, World!");
    CircleParticle.draw({
      position: {
        x: 50,
        y: 300,
      },
      radius: 20,
      color: "red",
    });

    // Moving example
    CircleParticle.draw({
      position: {
        x: 100,
        y: 300,
      },
      radius: 20,
      color: "red",
      movementXY: {
        velocity: {
          y: 0.5, // Slowly moves down
        },
      },
    });

    // Accelerating example
    CircleParticle.draw({
      position: {
        x: 150,
        y: 300,
      },
      radius: 20,
      color: "red",
      movementXY: {
        velocity: {
          y: -7, // Moves upwards initially
          x: 1, // Slightly moves right all the time
        },
        acceleration: {
          y: 0.1, // But then "gravity" pulls it down
        },
      },
    });

    // Example with angled movement
    CircleParticle.draw({
      position: {
        x: 200,
        y: 300,
      },
      radius: 20,
      color: "red",
      movementAngle: {
        angle: 35,
        velocity: {
          x: 1,
        },
        acceleration: 0.05,
      },
    });

    // Example with rotation
    RectParticle.draw({
      position: {
        x: 250,
        y: 300,
      },
      width: 20,
      height: 10,
      color: "magenta",
      rotation: {
        velocity: {
          x: 3,
          z: 4,
        },
      },
    });

    for (let i = 0; i < 15; i++) {
      RectParticle.draw({
        position: {
          x: 400,
          y: 400
        },
        width: 15,
        height: 8,
        color: 'blue',
        movementAngle: {
          angle: Math.random() * 360,
          velocity: {
            x: 2,
            min: 0
          },
          acceleration: -0.01
        },
        rotation: {
          switchDirection: Math.random() > 0.5,
          value: {
            x: Math.random() * 360,
            z: Math.random() * 360
          },
          velocity: {
            x: 4,
            z: 3,
            min: 0
          },
          acceleration: {
            x: -0.01 - Math.random() * 0.03,
            z: -0.01 - Math.random() * 0.03
          }
        }
      });
    }
  };

  useEffect(() => {});

  return (
    <>
      <div className="w-full m-2 bg-white text-gray-800 dark:bg-gray-800 dark:text-white">
        <Button onClick={helloHandler}>Test2</Button>
      </div>
    </>
  );
}

export default Test;

export async function action({ request }: ActionFunctionArgs) {
  await sleep();

  const formData = await request.formData();
  console.info(formData);

  return new Response(null, {
    status: 302,
    headers: { Location: "/test" },
  });
}

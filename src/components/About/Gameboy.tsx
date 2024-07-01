import "@/style/gameboy.scss";
import { useState, useEffect, useRef } from "react";
import loading from "@/assets/loading.gif";
import ash from "@/assets/ash.gif";

// import { useState, useEffect } from "react";
// import modalStore from "@/store/modal";

function Gameboy() {
  // const { pushModals, popModals } = modalStore();

  // const [value, setValue] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, []);

  return (
    <div className="gameboy">
      <div className="gameboy-screen-cont">
        <div className="gameboy-screen">
          <div className="power power-on"></div>
          <label id="mute-toggle" className="sound sound-off">
            <input id="mute" type="checkbox" style={{ display: "none" }} />
          </label>
          <div className="header">DOT MATRIX WITH STEREO SOUND</div>
          <div className="main">
            {loaded ? (
              <>
                <div className="ash">
                  <img src={ash.src} alt="ash" />
                </div>
                <span className="text" style={{ whiteSpace: "break-spaces" }}></span>
              </>
            ) : (
              <div className="flex w-full h-[calc(100vh-6rem)] items-center justify-center">
                <img src={loading.src} alt="loading" className="object-cover w-[250px] h-[85px]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Gameboy;

// import "@/style/gameboy.scss";
import ash from "@/assets/ash.gif";

import { useEffect } from "react";
// import { useState, useEffect } from "react";
// import modalStore from "@/store/modal";

function Gameboy() {
  // const { pushModals, popModals } = modalStore();

  // const [value, setValue] = useState("");

  useEffect(() => {}, []);

  return (
    <>
      <div className="gameboy">
        <div className="gameboy-screen-cont">
          <div className="gameboy-screen">
            <div className="power power-on"></div>
            <label id="mute-toggle" className="sound sound-off">
              <input id="mute" type="checkbox" style={{ display: "none" }} />
            </label>
            <div className="header">DOT MATRIX WITH STEREO SOUND</div>
            <div className="main">
              <div className="ash">
                <img src={ash.src} />
              </div>
              <span className="text" style={{ whiteSpace: "break-spaces" }}></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Gameboy;

import "@/style/gameboy.scss";
import { useState, useEffect, useRef } from "react";
import { ReactTyped } from "react-typed";
import loading from "@/assets/loading.gif";
import ash from "@/assets/ash.gif";
import sfx from "@/assets/sound/sfx_sounds_Blip7.wav";
import bgm from "@/assets/sound/bgm_25_Route_30.mp3";

function Gameboy() {
  const sfxRef = useRef<HTMLAudioElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [typingStart, setTypingStart] = useState(false);
  const [sound, setSound] = useState(true);
  const [loaded, setLoaded] = useState(false);

  const handleBgmPlay = (onOff: boolean) => {
    if (audioRef.current && onOff === true) {
      audioRef.current.volume = 0.1;
      audioRef.current.play();
    } else if (audioRef.current && onOff === false) {
      audioRef.current.pause();
    }
  };

  const handleSfxPlay = () => {
    if (sfxRef.current) {
      sfxRef.current.volume = 0.1;
      sfxRef.current.currentTime = 0;
      var playPromise = sfxRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then((_) => {}).catch(() => {});
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (sound) {
      handleBgmPlay(true);

      if (typingStart) {
        timer = setInterval(() => {
          handleSfxPlay();
        }, 100);
      }
    } else {
      handleBgmPlay(false);
    }

    return () => {
      clearInterval(timer);
    };
  }, [sound, typingStart]);

  return (
    <div className="gameboy">
      <div className="gameboy-screen-cont">
        <div className="gameboy-screen">
          <div className="power power-on"></div>
          <label id="mute-toggle" className={`sound ${sound ? "sound-on" : "sound-off"}`}>
            <input
              id="mute"
              type="checkbox"
              style={{ display: "none" }}
              onClick={() => setSound((prev) => !prev)}
            />
            <audio className="hidden" ref={audioRef} src={bgm} loop />
          </label>
          <div className="header">DOT MATRIX WITH STEREO SOUND</div>
          <div className="main">
            {loaded ? (
              <>
                <div className="ash">
                  <img src={ash.src} alt="ash" />
                </div>
                <div className="text" style={{ whiteSpace: "break-spaces" }}>
                  <div>
                    <audio className="hidden" ref={sfxRef} src={sfx} />
                    <ReactTyped
                      strings={[
                        'Name : Daehyun Lim^1000\n\nBirth : 1991 / 12 / 30^1000\n\nGender : Male^1000\n\nJob : Web Developer (FE)^1000 `\n\n\n<div class="close"><a href="/"" >[ Back ]</a></div>\n\n`',
                      ]}
                      startDelay={2000}
                      backSpeed={100}
                      typeSpeed={100}
                      preStringTyped={() => {
                        setTypingStart(true);
                      }}
                      onTypingPaused={() => {
                        setTypingStart(false);
                      }}
                      onTypingResumed={() => {
                        setTypingStart(true);
                      }}
                      onStringTyped={() => {
                        setTypingStart(false);
                      }}
                      onComplete={() => {
                        setTypingStart(false);
                      }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="loading">
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

import { useState, useEffect, useRef } from "react";
import { useKey } from "react-use";
import { ReactTyped } from "react-typed";
import ash1 from "@/assets/ash1.gif";
import sfx from "@/assets/sound/sfx_sounds_Blip7.wav";
import bgm from "@/assets/sound/bgm_25_Route_30.mp3";

const About = () => {
  const sfxRef = useRef<HTMLAudioElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [typingStart, setTypingStart] = useState(false);
  const [sound, setSound] = useState(true);
  const [start, setStart] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const loadedRef = useRef(loaded);

  const handleBgmPlay = (onOff: boolean) => {
    if (audioRef.current && onOff === true) {
      audioRef.current.volume = 0.8;
      try {
        audioRef.current.play();
      } catch (e) {
        /* empty */
      }
    } else if (audioRef.current && onOff === false) {
      audioRef.current.pause();
    }
  };

  const handleSfxPlay = () => {
    if (sfxRef.current) {
      sfxRef.current.volume = 0.8;
      sfxRef.current.currentTime = 0;
      const playPromise = sfxRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {}).catch(() => {});
      }
    }
  };

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

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 1000);
    loadedRef.current = loaded;
  }, [loaded, loadedRef]);

  const handlePlay = () => {
    if (loadedRef.current) {
      setStart(true);
    }
  };

  useKey("Enter", () => {
    handlePlay();
  });

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
            {start && <audio className="hidden" ref={audioRef} src={bgm} loop />}
          </label>
          <div className="header">DOT MATRIX WITH STEREO SOUND</div>
          <div className="main">
            {loaded && start ? (
              <>
                <div className="ash">
                  <img src={ash1} alt="ash1" />
                </div>
                <div className="text whitespace-break-spaces">
                  <div>
                    <audio className="hidden" ref={sfxRef} src={sfx} />
                    <ReactTyped
                      strings={[
                        'Name : Daehyun Lim^1000\n\nBirth : 1991 / 12 / 30^1000\n\nGender : Only Man^1000\n\nJob : Web Developer (Front-End)^1000 `\n\n\n<div class="close"><a href="/"" >[ Back ]</a></div>\n\n`',
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
              <div
                className="text text-4xl whitespace-break-spaces flex h-[calc(100%-2rem)] justify-center items-center cursor-pointer"
                onClick={() => handlePlay()}
              >
                {loaded ? "Click to Start" : "Loading ..."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

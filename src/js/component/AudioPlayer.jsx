import React, { useRef, useState, useEffect } from "react";


const AudioPlayer = () => {
    const urlBase = "https://playground.4geeks.com"
    const songRef = useRef()
    const [play, setPlay] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(undefined)
    const [time, setTime] = useState(0)
    const [displayTime, setDisplayTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playList, setPlaylist] = useState(null)

    const updatePLaylist = () => {
        fetch("https://playground.4geeks.com/sound/songs")
            .then((response) => {
                return response.json()
            })
            .then((newResponse) => {
                setPlaylist(newResponse.songs)
            })
    }

    const updateDisplayTime = (e) => {
        setDisplayTime(Math.floor(e.target.currentTime));
    };

    useEffect(() => {
        updatePLaylist()
    }, []);

    const playControl = () => {
        currentIndex !== undefined && (play ? songRef.current.pause() : songRef.current.play())
    }

    const changeRef = (song, index) => {
        if (index == currentIndex) {
            playControl()
        } else if (index == playList.length) {
            songRef.current.src = urlBase + playList[0].url
            setCurrentIndex(0)
        } else if (index < 0) {
            songRef.current.src = urlBase + playList[2].url
            setCurrentIndex(2)
        } else {
            songRef.current.src = urlBase + song.url
            setCurrentIndex(index)
        }
    }

    const songEnded = () => {
        changeRef(playList[currentIndex + 1], currentIndex + 1)
    }

    const sliderTimeChanger = (event) => {
        if (currentIndex !== undefined) {
            const newTime = event.target.value;
            setTime(newTime);
            songRef.current.currentTime = time;
        }
    }

    const domList = <ul className="pointerHover list-group">
        {!!playList && playList.map((item, index) => (
            <li className="list-group-item bg-dark text-white border-secondary" onClick={() => changeRef(item, index)} key={index} >
                {currentIndex == index && (!play ? (
                    <i onClick={() => playControl()} className="fa-solid fa-pause"></i>
                ) : (
                    <i onClick={() => playControl()} className="fa-solid fa-play"></i>
                ))} {item.name}
            </li>
        ))}
    </ul>

    return (
        <div>
            {domList}

            <audio onTimeUpdate={(e) => updateDisplayTime(e)} ref={songRef} src={songRef.src} autoPlay onPlay={() => setPlay(true)} onPause={() => setPlay(false)}
                onEnded={() => songEnded()} onLoadedMetadata={(e) => setDuration(Math.round(e.target.duration))} />

            <div className="playerBar fixed-bottom bg-dark pt-3">
                <div className="d-flex justify-content-center align-items-center">
                    <p className="text-white align-self-center my-0 mx-2" >
                        {currentIndex !== undefined && (Math.floor(displayTime / 60) + ":" + ((displayTime % 60) < 10 ? "0" + (displayTime % 60) : (displayTime % 60)))}
                    </p>
                    <input className="timeControl" type="range" min={0} max={duration} value={displayTime}
                        onChange={(e) => sliderTimeChanger(e)} />

                    <p className="text-white align-self-center my-0 mx-2" >
                        {currentIndex !== undefined && (Math.floor(duration / 60) + ":" + ((duration % 60) < 10 ? "0" + (duration % 60) : (duration % 60)))}
                    </p>
                </div>
                <div className="controls p-3 d-flex justify-content-center pointerHover">
                    <i onClick={() => changeRef(playList[currentIndex - 1], currentIndex - 1)} className="fa-solid fa-backward-step text-white fa-2x mx-2 pointerHover"></i>
                    {play ? (
                        <i onClick={() => playControl()} className="fa-solid fa-pause text-white fa-2x mx-2 resumeBtn pointerHover"></i>
                    ) : (
                        <i onClick={() => playControl()} className="fa-solid fa-play text-white fa-2x mx-2 resumeBtn pointerHover"></i>
                    )}
                    <i onClick={() => changeRef(playList[currentIndex + 1], currentIndex + 1)} className="fa-solid fa-forward-step text-white fa-2x mx-2 pointerHover"></i>
                </div>
            </div>
        </div>
    )

}

export default AudioPlayer
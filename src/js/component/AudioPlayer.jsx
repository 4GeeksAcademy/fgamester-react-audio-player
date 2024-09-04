import React, { useRef, useState, useEffect } from "react";


const AudioPlayer = () => {
    const urlBase = "https://playground.4geeks.com"
    const songRef = useRef()
    const [play, setPlay] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(undefined)
    const [time, setTime] = useState(0)
    const [displayTime, setDisplayTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [playList, setPlaylist] = useState([])

    /*     const playList = [
            { "id": 1, "name": "Mario Castle", "url": "/sound/files/mario/songs/castle.mp3", "category": "category" },
            { "id": 2, "name": "Mario Star", "url": "/sound/files/mario/songs/hurry-starman.mp3", "category": "category" },
            { "id": 3, "name": "Mario Overworld", "url": "/sound/files/mario/songs/overworld.mp3", "category": "category" },
            { "id": 4, "name": "Mario Stage 1", "url": "/sound/files/mario/songs/stage1.mp3", "category": "category" },
            { "id": 5, "name": "Mario Stage 2", "url": "/sound/files/mario/songs/stage2.mp3", "category": "category" },
            { "id": 6, "name": "Mario Star", "url": "/sound/files/mario/songs/starman.mp3", "category": "category" },
            { "id": 7, "name": "Mario Underworld", "url": "/sound/files/mario/songs/underworld.mp3", "category": "category" },
            { "id": 8, "name": "Mario Underwater", "url": "/sound/files/mario/songs/underwater.mp3", "category": "category" },
            { "id": 9, "name": "Zelda Castle", "url": "/sound/files/videogame/songs/zelda_castle.mp3", "category": "category" },
            { "id": 10, "name": "Zelda Outworld", "url": "/sound/files/videogame/songs/zelda_outworld.mp3", "category": "category" },
            { "id": 11, "name": "Zelda Titles", "url": "/sound/files/videogame/songs/zelda_title.mp3", "category": "category" },
            { "id": 12, "name": "Sonic Brain Zone", "url": "/sound/files/videogame/songs/sonic_brain-zone.mp3", "category": "category" },
            { "id": 13, "name": "Zelda Link To Past", "url": "/sound/files/videogame/songs/zelda_link-to-past.mp3", "category": "category" },
            { "id": 14, "name": "Flintstones", "url": "/sound/files/cartoons/songs/flintstones.mp3", "category": "cartoon" },
            { "id": 15, "name": "power-rangers", "url": "/sound/files/cartoons/songs/power-rangers.mp3", "category": "cartoon" },
            { "id": 16, "name": "simpsons", "url": "/sound/files/cartoons/songs/simpsons.mp3", "category": "cartoon" },
            { "id": 17, "name": "south-park", "url": "/sound/files/cartoons/songs/south-park.mp3", "category": "cartoon" },
            { "id": 18, "name": "thundercats", "url": "/sound/files/cartoons/songs/thundercats.mp3", "category": "cartoon" },
            { "id": 19, "name": "x-men", "url": "/sound/files/cartoons/songs/x-men.mp3", "category": "cartoon" }
        ];
     */


    const updatePLaylist = () => {
        fetch("https://playground.4geeks.com/sound/songs")
            .then((response) => {
                return response.json()
            })
            .then((newResponse) => {
                console.log(newResponse)
                setPlaylist(newResponse.songs)
            })
    }

    const updateDisplayTime = (e) => {
        // setDisplayTime(Math.floor(songRef?.current?.currentTime));
        setDisplayTime(Math.floor(e.target.currentTime));
    };

    useEffect(() => {
        updatePLaylist()

        /* songRef.current.addEventListener('timeupdate', updateDisplayTime);
        return () => {
            songRef.current.removeEventListener('timeupdate', updateDisplayTime);
        }; */
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
                    <input className="timeControl col-7" type="range" min={0} max={duration} value={displayTime}
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
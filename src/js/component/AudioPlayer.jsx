import React, { useRef, useState } from "react";


const AudioPlayer = () => {
    const urlBase = "https://playground.4geeks.com"
    const songRef = useRef()
    const [play, setPlay] = useState(false)
    const [currentIndex, setCurrentIndex] = useState()

    const changeRef = (song, index) => {
        if (index == playList.length) {
            songRef.current.src = urlBase + playList[0].url
            setCurrentIndex(0)
        } else {
            songRef.current.src = urlBase + song.url
            setCurrentIndex(index)
        }
    }

    const playControl = () => {
        play ? songRef.current.pause() : songRef.current.play()
        setPlay(!play)
    }

    const playList = [
        {
            "id": 1,
            "name": "Mario Castle",
            "url": "/sound/files/mario/songs/castle.mp3",
            "category": "category"
        },
        {
            "id": 2,
            "name": "Mario Star",
            "url": "/sound/files/mario/songs/hurry-starman.mp3",
            "category": "category"
        },
        {
            "id": 3,
            "name": "Mario Overworld",
            "url": "/sound/files/mario/songs/overworld.mp3",
            "category": "category"
        }]

    const domList = <ul className="pointerHover list-group">
        {playList.map((item, index) => (
            <li className="list-group-item bg-dark-subtle" onClick={() => changeRef(item, index)} key={index} >{item.name} </li>
        ))}
    </ul>

    return (
        <div>
            {domList}
            <audio ref={songRef} src={songRef.src} autoPlay onPlay={() => setPlay(true)}></audio>
            <div className="playerBar fixed-bottom bg-dark p-3 d-flex justify-content-center pointerHover">
                <i onClick={() => changeRef(playList[currentIndex - 1], currentIndex - 1)} className="fa-solid fa-backward-step text-white fa-2x mx-2 pointerHover"></i>
                {play ? (
                    <i onClick={() => playControl()} className="fa-solid fa-pause text-white fa-2x mx-2 pointerHover"></i>
                ) : (
                    <i onClick={() => playControl()} className="fa-solid fa-play text-white fa-2x mx-2 pointerHover"></i>
                )}
                <i onClick={() => changeRef(playList[currentIndex + 1], currentIndex + 1)} className="fa-solid fa-forward-step text-white fa-2x mx-2 pointerHover"></i>
            </div>
        </div>
    )

}

export default AudioPlayer
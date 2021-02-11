import React, { useEffect, useState, Fragment, useRef, useCallback } from "react";
import "./App.css";

function useInterval(callback, delay) {
    const savedCallback = useRef();
    const intervalId = useRef(null);
    const [currentDelay, setDelay] = useState(delay);

    const toggleRunning = useCallback(() => setDelay((currentDelay) => (currentDelay === null ? delay : null)), [
        delay,
    ]);

    const clear = useCallback(() => clearInterval(intervalId.current), []);

    // Remember the latest function.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }

        if (intervalId.current) clear();

        if (currentDelay !== null) {
            intervalId.current = setInterval(tick, currentDelay);
        }

        return clear;
    }, [currentDelay, clear]);

    return [toggleRunning, !!currentDelay];
}

const App = () => {
    const wpmList = [60, 120, 240, 360, 480, 540, 720];
    const wpmToMillisecond = (wpm) => 1000 / (wpm / 60);
    const seussBlurb =
        "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose. You’re on your own. And you know what you know. And YOU are the guy who’ll decide where to go. You’ll get mixed up, of course, as you already know. You’ll get mixed up with many strange birds as you go. So be sure when you step. Step with care and great tact and remember that Life’s A Great Balancing Act. And will you succeed? Yes! You will, indeed! (98 and ¾ percent guaranteed.) KID, YOU’LL MOVE MOUNTAINS!";

    const [currentWord, setCurrentWord] = useState("");
    const [words, setWords] = useState(seussBlurb);
    const [speed, setSpeed] = useState(480);
    const [count, setCount] = useState(0);

    const [toggle, running] = useInterval(() => {
        if (!words) {
            return;
        }
        const wordArray = words.split(" ").filter((word) => word !== "");
        console.log(wordArray);
        console.log(count);

        count < wordArray.length - 1 ? setCount((count) => count + 1) : setCount(0);

        setCurrentWord(wordArray[count]);
    }, wpmToMillisecond(speed));

    useEffect(() => {
        setCount(0);
    }, [words]);

    const RenderSpeedButtons = () => {
        const buttonClassName = "button is-link";
        return wpmList.map((wpm, index) => (
            <button
                className={wpm !== speed ? buttonClassName.concat(" is-inverted") : buttonClassName}
                disabled={running}
                id={wpm}
                key={index}
                onClick={() => {
                    setSpeed(wpm);
                }}
            >
                {wpm}
            </button>
        ));
    };

    return (
        <div className="App">
            <div className="header">
                <h1 className="is-size-1 has-text-weight-semibold has-text-left">Speed Reader</h1>
            </div>
            <div className="container">
                <h1 className="current-word">{currentWord}</h1>

                <textarea
                    className="textarea is-large is-info has-fixed-size"
                    rows="10"
                    cols="100"
                    placeholder="Add text to start"
                    defaultValue={seussBlurb}
                    onChange={(e) => {
                        setWords(e.target.value);
                    }}
                />

                <div className="buttons">
                    <RenderSpeedButtons />

                    <button className="button is-link" onClick={toggle}>
                        <span className="icon is-small">
                            {!running ? <i className="fas fa-play" /> : <i className="fas fa-pause" />}
                        </span>
                    </button>
                </div>

                <h1>{`${speed} words per second`}</h1>
            </div>
        </div>
    );
};

export default App;

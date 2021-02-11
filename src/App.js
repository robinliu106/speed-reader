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

    const [currentWord, setCurrentWord] = useState("");
    const [words, setWords] = useState("");
    const [speed, setSpeed] = useState(60);
    const [count, setCount] = useState(0);

    const [toggle, running] = useInterval(() => {
        if (!words) {
            return;
        }
        const wordArray = words.split(" ");

        setCount((count) => count < wordArray.length && count + 1);

        setCurrentWord(wordArray[count]);
    }, wpmToMillisecond(speed));

    const RenderSpeedButtons = () => {
        const buttonClassName = "button is-link";
        return wpmList.map((wpm, index) => (
            <button
                className={wpm === speed ? buttonClassName.concat(" is-inverted") : buttonClassName}
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

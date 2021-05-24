import React, {useEffect, useState} from 'react';
import "./button-live-button.scss";

export const BlogLiveButton = () => {

    useEffect(() => {
        const d = 40;

        document.querySelectorAll('.rocket-button').forEach(elem => {

            elem.querySelectorAll('.default, .success > div').forEach(text => {
                // What does this do???
                // charming(text);
                text.querySelectorAll('span').forEach((span, i) => {
                    span.innerHTML = span.textContent == ' ' ? '&nbsp;' : span.textContent;
                    span.style.setProperty('--d', i * d + 'ms');
                    span.style.setProperty('--ds', text.querySelectorAll('span').length * d - d - i * d + 'ms');
                });
            });

            elem.addEventListener('click', e => {
                e.preventDefault();
                if(elem.classList.contains('animated')) {
                    return;
                }
                elem.classList.add('animated');
                elem.classList.toggle('live');
                setTimeout(() => {
                    elem.classList.remove('animated');
                }, 2400);
            });
        });

    }, [])

    const [animating, setAnimating] = useState<boolean>(false)
    const [live, setLive] = useState<boolean>(false)

    const onClick = (e) => {
        e.preventDefault();

    }

    return (
        <div className="rocket-button" onClick={onClick}>
            <div className="default">Launch Site</div>
            <div className="success">
                {/*SVG for button here*/}
                <div>Site live</div>
            </div>
            <div className="animation">
                <div className="rocket">
                    {/*SVG for rocket here*/}
                </div>
                <div className="smoke">
                    <i></i><i></i><i></i><i></i><i></i><i></i>
                </div>
            </div>
        </div>
    )
}
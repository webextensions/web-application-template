// References:
//     https://stackoverflow.com/questions/35963070/react-router-how-to-disable-a-link-if-its-active/48482607#48482607
//     https://www.npmjs.com/package/react-router-link-nostack

/* eslint-disable react/prop-types */

import React from 'react';
import { Link, useLocation } from 'react-router';

import './NonSelfLink.css';

const NonSelfLink = function ({
    onClick,
    to,
    target,
    style,
    children,
    strictMatch = false
}) {
    const location = useLocation();

    if (!to) {
        return <React.Fragment>{children}</React.Fragment>;
    }

    const handleClick = function (event) {
        const urlObject = new URL(to, window.location.href);
        let flagMatch = false;
        if (strictMatch) {
            flagMatch = (to === location.pathname);
        } else {
            flagMatch = (urlObject.pathname === location.pathname);
        }
        if (
            flagMatch &&
            document.documentElement.scrollTop === 0
        ) {
            event.preventDefault(); // Do not add a state in browser history

            const previousEl = document.getElementById('bodyShiningEffect');
            if (previousEl) {
                previousEl.remove();
            }
            const el = document.createElement('div');
            el.id = 'bodyShiningEffect';
            document.body.append(el);
            setTimeout(() => {
                if (el) {
                    el.remove();
                }
            }, 750);
        } else {
            // Without this "setTimeout()", the scroll effect may not work in Firefox
            setTimeout(() => {
                window.scrollTo({
                    behavior: 'smooth',
                    top: 0
                });
            });
        }

        if (onClick) {
            onClick();
        }
    };

    let toProp;
    if (to === location.pathname) {
        toProp = {
            pathname: to,
            state: {
                moveToTop: true
            }
        };
    } else {
        toProp = to;
    }

    return (
        <Link
            onClick={handleClick}
            to={toProp}
            target={target}
            style={style}
        >
            {children}
        </Link>
    );
};

export { NonSelfLink };

import React from 'react';

import Button from '@mui/material/Button/index.js';

const JsPerformanceMonitor = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, alignContent: 'center' }}>
                JS performance monitor:
            </div>
            <Button
                variant="contained"
                size="small"
                onClick={function () {
                    // Reference: https://github.com/mrdoob/stats.js/#bookmarklet
                    if (!window.flagStatsJsPerformanceMonitor) {
                        const script = document.createElement('script');
                        script.addEventListener('load', function () {
                            const stats = new Stats(); // eslint-disable-line no-undef
                            const elStats = document.body.appendChild(stats.dom); // eslint-disable-line unicorn/prefer-dom-node-append
                            window.elStatsJsPerformanceMonitor = elStats;
                            const style = elStats.style;
                            style.top = '75px';
                            style.right = '10px';
                            style.left = '';
                            style.zIndex = '100000';
                            requestAnimationFrame(function loop() {
                                stats.update();
                                requestAnimationFrame(loop);
                            });
                        });
                        script.src = '/resources/3rdparty/autoloaded/stats.js/stats.min.js';
                        document.head.append(script);

                        window.flagStatsJsPerformanceMonitor = true;
                    }

                    if (window.elStatsJsPerformanceMonitor) {
                        const style = window.elStatsJsPerformanceMonitor.style;
                        style.display = (style.display === 'none' ? '' : 'none');
                    }
                }}
            >
                Show / Hide
            </Button>
        </div>
    );
};

export { JsPerformanceMonitor };

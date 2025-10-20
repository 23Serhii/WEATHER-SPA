import React, {useMemo} from 'react';
import {themeClassFromWeather} from '../theme';
import RainFX from './RainFX';

function makeItems(n, seed = 0) {
    // детермінована "випадковість": при одному сиді макет стабільний
    const rnd = (i) => {
        const x = Math.sin(i * 9301 + seed * 49297) * 233280;
        return x - Math.floor(x);
    };
    return Array.from({length: n}, (_, i) => ({
        left: rnd(i) * 100,
        top: rnd(i + 1) * 100,
        dur: 5 + rnd(i + 2) * 7,
        delay: rnd(i + 3) * 5,
        op: 0.45 + rnd(i + 4) * 0.5,
        size: 60 + rnd(i + 5) * 180,
    }));
}

export default function WeatherBackground({main, icon, temp, rain1h, children}) {
    const theme = useMemo(() => themeClassFromWeather(main), [main]);

    const lower = (main || '').toLowerCase();
    const isSunny = lower.includes('clear');
    const isRainy = lower.includes('rain') || lower.includes('drizzle');
    const isThunder = lower.includes('thunder');
    const isSnowy = lower.includes('snow');
    const isCloudy = lower.includes('cloud');
    const isMist = lower.includes('mist') || lower.includes('fog') || lower.includes('haze');
    const isNight = (icon || '').endsWith('n');
    const isDrizzle = lower.includes('drizzle');

    const isHot = typeof temp === 'number' && temp >= 28;
    const isWarm = typeof temp === 'number' && temp >= 18 && temp < 28;
    const isLightFrost = typeof temp === 'number' && temp < 0 && temp > -10;
    const isDeepFreeze = typeof temp === 'number' && temp <= -10;

    const rainLevel = useMemo(() => {
        if (isThunder) return 3;
        if (typeof rain1h === 'number') {
            if (rain1h >= 10) return 3;
            if (rain1h >= 2) return 2;
            if (rain1h > 0) return 1;
        }
        if (isRainy) return 2;
        if (isDrizzle) return 1;
        return 0;
    }, [isThunder, isRainy, isDrizzle, rain1h]);

    const snowflakes = useMemo(() => (isSnowy ? makeItems(110, 1) : []), [isSnowy]);
    const stars = useMemo(() => (isNight && (isSunny || isCloudy) ? makeItems(120, 2) : []), [isNight, isSunny, isCloudy]);
    const bokehDots = useMemo(() => (!(isRainy || isThunder || isSnowy || isMist) ? makeItems(28, 3) : []), [isRainy, isThunder, isSnowy, isMist]);

    const ripples = useMemo(() => {
        if (rainLevel === 0) return [];
        const count = rainLevel === 1 ? 4 : rainLevel === 2 ? 8 : 14;
        return makeItems(count, 4).map((it) => ({
            left: 5 + (it.left * 0.95), // 5..100 vw
            size: 60 + (it.size % (rainLevel === 3 ? 140 : 90)),
            delay: it.delay * 0.45,
        }));
    }, [rainLevel]);

    return (
        <div className={`${theme} min-h-screen relative cold-vignette`}>
            <div className="bg-layer">
                {isSunny && (
                    <>
                        <div className="sun-glow"/>
                        <div className="sun-rays"/>
                    </>
                )}

                {isCloudy && (
                    <>
                        <div className="clouds" style={{position: 'absolute', inset: 0}}/>
                        <div className="clouds-soft"/>
                    </>
                )}

                {rainLevel > 0 && (
                    <>
                        <div className={`rain-l1 ${rainLevel >= 2 ? 'opacity-90' : 'opacity-70'}`}/>
                        {rainLevel >= 2 && <div className="rain-l2 opacity-80"/>}
                        {rainLevel >= 3 && <div className="rain-l3 opacity-75"/>}
                        {rainLevel >= 2 && <div className="rain-glass"/>}
                    </>
                )}

                {isThunder && <div className="lightning"/>}

                {isSnowy && (
                    <div style={{position: 'absolute', inset: 0}}>
                        {snowflakes.map((s, i) => (
                            <div
                                key={i}
                                className="snowflake"
                                style={{
                                    left: `${s.left}vw`,
                                    animationDuration: `${s.dur}s`,
                                    animationDelay: `${s.delay}s`,
                                    opacity: s.op
                                }}
                            />
                        ))}
                    </div>
                )}

                {isMist && <div className="mist"/>}

                {isNight && (
                    <div style={{position: 'absolute', inset: 0}}>
                        {stars.map((st, i) => (
                            <div
                                key={i}
                                className="star"
                                style={{left: `${st.left}vw`, top: `${st.top}vh`, animationDelay: `${st.delay}s`}}
                            />
                        ))}
                    </div>
                )}

                {isLightFrost && (<>
                    <div className="frost"/>
                    <div className="frost-edges"/>
                </>)}
                {isDeepFreeze && (<>
                    <div className="frost" style={{opacity: .85}}/>
                    <div className="frost-edges"/>
                    {/* іскорки кристалів — тонко, без перевантаження */}
                    <div className="sparkles">
                        {makeItems(80, 5).map((sp, i) => (
                            <div
                                key={i} className="spark"
                                style={{left: `${sp.left}vw`, top: `${sp.top}vh`, animationDelay: `${sp.delay * 0.5}s`}}
                            />
                        ))}
                    </div>
                </>)}

                {isWarm && <div className="heat-haze"/>}
                {isHot && (<>
                    <div className="heat-haze"/>
                    <div className="heat-waves"/>
                </>)}

                {rainLevel > 0 && (
                    <div className="ripples">
                        {ripples.map((r, i) => (
                            <div
                                key={i}
                                className="ring"
                                style={{
                                    left: `${r.left}vw`,
                                    width: `${r.size}px`,
                                    height: `${r.size}px`,
                                    animationDelay: `${r.delay}s`
                                }}
                            />
                        ))}
                    </div>
                )}
                {rainLevel > 0 && <RainFX level={rainLevel} thunder={isThunder} angleDeg={18}/>}

                <div className="bokeh">
                    {bokehDots.map((d, i) => (
                        <div
                            key={i}
                            className="dot"
                            style={{
                                left: `${d.left}vw`,
                                top: `${d.top}vh`,
                                width: `${d.size}px`,
                                height: `${d.size}px`,
                                animationDuration: `${10 + (d.dur % 6)}s`,
                                opacity: 0.3 + ((d.op - 0.45) * 0.6),
                            }}
                        />
                    ))}
                </div>

                {/* 🌓 Контраст-вуаль для дуже світлих сцен */}
                {(isSnowy || isSunny) && <div className="contrast-veil"/>}
            </div>

            {/* контент */}
            <div className={`relative z-10 ${isSnowy || isSunny ? 'light-ui' : ''}`}>
                {children}
            </div>
        </div>
    );
}

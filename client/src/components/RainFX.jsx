import React, { useEffect, useRef } from 'react';

function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }

export default function RainFX({ level = 2, angleDeg = 18, thunder = false }) {
    const ref = useRef(null);
    const rafRef = useRef(0);
    const lastRef = useRef(0);
    const dropsRef = useRef([]);

    useEffect(() => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        let mounted = true;

        const DPR = clamp(window.devicePixelRatio || 1, 1, 2); // не більше 2х
        const resize = () => {
            const { innerWidth: w, innerHeight: h } = window;
            canvas.width = Math.floor(w * DPR);
            canvas.height = Math.floor(h * DPR);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            spawn(true);
        };

        const rand = (a, b) => a + Math.random() * (b - a);

        const spawn = (reset=false) => {
            const { width, height } = canvas;
            const W = width / DPR, H = height / DPR;

            const count =
                level === 1 ? Math.floor(W * H / 12000) :
                    level === 2 ? Math.floor(W * H / 8000)  :
                        Math.floor(W * H / 5000);

            const angle = angleDeg * Math.PI/180;
            const sin = Math.sin(angle), cos = Math.cos(angle);

            const drops = [];
            for (let i = 0; i < count; i++) {
                const z = Math.random(); // “глибина”: 0..1
                const len = clamp(10 + z * 24 + (level-1)*4, 10, 50);
                const speed = clamp(260 + z * 420 + (level-1)*60, 220, 720); // px/s
                drops.push({
                    x: Math.random() * (W + 100) - 50,
                    y: reset ? Math.random() * (H + 100) - 50 : -rand(0, H * 0.4),
                    vx: speed * sin,
                    vy: speed * cos,
                    l: len,
                    a: clamp(.25 + z * .35 + (level-1)*.05, .25, .8), // альфа
                    z
                });
            }
            dropsRef.current = drops;
        };

        let flash = 0;

        const step = (t) => {
            if (!mounted) return;
            const ctx = canvas.getContext('2d');
            const { width, height } = canvas;
            const W = width / DPR, H = height / DPR;

            const last = lastRef.current || t;
            const dt = Math.min(50, t - last) / 1000; // сек
            lastRef.current = t;

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(10,15,20,0.35)';
            ctx.fillRect(0, 0, W, H);

            ctx.globalCompositeOperation = 'lighter';
            ctx.lineCap = 'round';

            const drops = dropsRef.current;
            for (let i = 0; i < drops.length; i++) {
                const d = drops[i];
                d.x += d.vx * dt;
                d.y += d.vy * dt;

                ctx.strokeStyle = `rgba(255,255,255,${d.a})`;
                ctx.lineWidth = clamp(0.6 + d.z * 1.1, 0.6, 1.7);
                ctx.beginPath();
                ctx.moveTo(d.x, d.y);
                ctx.lineTo(d.x - d.vx * (d.l / (d.vy || 1)), d.y - d.l);
                ctx.stroke();

                if (d.y - d.l > H + 60 || d.x < -80 || d.x > W + 80) {
                    d.x = Math.random() * (W + 100) - 50;
                    d.y = -Math.random() * 80 - 20;
                }
            }

            if (thunder && Math.random() < 0.003) flash = 1;
            if (flash > 0) {
                ctx.globalCompositeOperation = 'screen';
                ctx.fillStyle = `rgba(255,255,255,${0.35*flash})`;
                ctx.fillRect(0, 0, W, H);
                flash *= 0.85;
            }

            rafRef.current = requestAnimationFrame(step);
        };

        resize();
        window.addEventListener('resize', resize);
        spawn(true);
        rafRef.current = requestAnimationFrame(step);

        return () => {
            mounted = false;
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [level, angleDeg, thunder]);

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return null;

    return (
        <canvas
            ref={ref}
            aria-hidden
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0
            }}
        />
    );
}

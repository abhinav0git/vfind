import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AnimatedNamesProps = {
    names: string[];
    className?: string;
};

export function AnimatedNames({ names, className = "" }: AnimatedNamesProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);

    useEffect(() => {
        if (!names || names.length === 0) return;
        const interval = setInterval(() => {
            setCurrentWordIndex((prev) => (prev + 1) % names.length);
        }, 1800);
        return () => clearInterval(interval);
    }, [names]);

    return (
        <span
            className={
                `relative inline-flex items-baseline align-baseline leading-none min-w-[5ch] h-[1em] pl-0.5  ${className}`
            }
            style={{ verticalAlign: "baseline" }}
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={names[currentWordIndex]}
                    initial={{ x: "40%", opacity: 0, scale: 1.1 }}
                    animate={{ x: "0%", opacity: 1, scale: 1 }}
                    exit={{ x: "-30%", opacity: 0, scale: 0.8 }}
                    transition={{
                        duration: 0.5,
                        type: "spring",
                        stiffness: 120,
                        damping: 20,
                    }}
                    className="absolute left-0 top-0 w-full font-bold !text-indigo-400 leading-none !font-serif"
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: "100%",
                        lineHeight: "inherit",
                        fontSize: "inherit",
                    }}
                >
                    {names[currentWordIndex]}
                </motion.span>
            </AnimatePresence>
            <span className="opacity-0 select-none pointer-events-none font-bold" aria-hidden>
                {names.reduce((a, b) => (a.length > b.length ? a : b), "")}
            </span>
        </span>
    );
}
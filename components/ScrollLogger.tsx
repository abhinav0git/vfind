import { useScroll } from "framer-motion";
import { useEffect } from "react";

const ScrollLogger = () => {
    const { scrollY } = useScroll();

    useEffect(() => {
        const unsubscribe = scrollY.onChange((latest) => {
            if (latest > 2000) {
                console.log("Scrolled more than 2000px:", latest);
            }
            else if (latest > 2400) {
                console.log("Scrolled more than 2400px:", latest);
            }
        });
        return () => unsubscribe();
    }, [scrollY]);

    return null;
};

export default ScrollLogger;

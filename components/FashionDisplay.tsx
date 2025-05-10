import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
// import ScrollLogger from "./ScrollLogger";

const FashionDisplay = () => {
    const images = [
        {
            id: 1,
            src: "/simi1.jpg",
        },
        {
            id: 2,
            src: "/simi2.jpg",
        },
        {
            id: 3,
            src: "/simi3.jpg",
        },
    ];

    return (
        <motion.div
            variants={containerVariants}
            viewport={{ once: true, amount: 0.6 }}
            className="min-h-md flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white-50 py-8 rounded-2xl"
        >
            {/* <ScrollLogger /> */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col items-center justify-center mb-8 py-6">
                <motion.h1 className="text-3xl font-bold text-center text-gray-800 outfit-font pb-4">
                    Upload Image
                </motion.h1>
            </motion.div>

            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={itemVariants}
                className="relative flex items-end justify-center gap-[-40px] md:gap-[-60px]">

                {/* Left Image */}
                <motion.div
                    custom="left"
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={cardVariant}
                    viewport={{ amount: 0.8 }}
                    className=""
                >
                    <Image
                        src={images[1].src}
                        alt="Fashion 2"
                        width={260}
                        height={400}
                        className="rounded-3xl shadow-xl"
                    />
                </motion.div>

                {/* Center Image */}
                <motion.div
                    custom="center"
                    id="center-image"
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={cardVariant}
                    viewport={{ amount: 0.75 }}
                    className="z-20 "
                >
                    <Image
                        src={images[0].src}
                        alt="Fashion 1"
                        width={280}
                        height={400}
                        className="rounded-3xl shadow-2xl -translate-y-5"
                    />
                    <div className="absolute inset-0 [@media(min-width:730px)]:flex flex-col items-center justify-center hidden"
                    >
                        <Button className="pointer-events-auto mt-80 bg-white text-black rounded-full px-6 py-2 shadow-lg hover:bg-gray-100">
                            <Upload className="h-4 w-4 " />
                            Upload
                        </Button>

                    </div>
                </motion.div>

                {/* Right Image */}
                <motion.div
                    custom="right"
                    id="right-image"
                    initial="offscreen"
                    whileInView="onscreen"
                    variants={cardVariant}
                    viewport={{ amount: 0.8 }}
                    className=""
                >
                    <Image
                        src={images[2].src}
                        alt="Fashion 3"
                        width={260}
                        height={400}
                        className="rounded-3xl shadow-xl"
                    />
                </motion.div>
            </motion.div >
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex flex-col items-center justify-center my-4 px-5 w-full max-w-md mx-auto"
            >
                <div className="relative w-full h-[150px] rounded-3xl overflow-hidden shadow-lg scale-80 hover:scale-105 transition-transform duration-300 ease-in-out">
                    {/* bg Image */}
                    <Image
                        src="/test2.jpg"
                        alt="Fashion backdrop"
                        className="object-cover object-center"
                        priority
                        fill
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-gradient bg-gradient-to-tr from-slate-100 to-[#d8d9de] opacity-90" />
                    <div className="absolute bottom-0 p-6 text-black z-10 ">
                        <h2 className="text-xl sm:text-2xl font-bold leading-tight mb-1">
                            Search similar or
                            <span className="text-blue-500"> better?</span>
                        </h2>

                        <p className="text-sm sm:text-base md:text-base text-black/90 leading-tight mb-1">
                            Simply upload a photo to find similar products online from thousands of retailers.
                        </p>
                    </div>
                </div>
            </motion.div>

        </motion.div >
    );
};

export default FashionDisplay;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
}

const cardVariant = {
    offscreen: {
        y: 50,
        rotate: 0,
        scale: 0.85,
    },
    onscreen: (direction: "left" | "center" | "right") => ({
        y: 0,
        rotate: direction === "left" ? -10 : direction === "right" ? 10 : 0,
        scale: direction === "center" ? 1.1 : 1,
        transition: {
            type: "spring",
            bounce: 0.1,
            duration: 0.4,
        },
    }),
    exit: {
        opacity: 0,
    },
};
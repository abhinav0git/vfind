"use client"

import type React from "react"
import { useRouter } from "next/navigation";
import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Camera, Upload, Search, ArrowRight, CheckCircle2, ImageIcon, LayoutDashboard, LogIn, Wand2Icon, CircleXIcon, PlusCircleIcon, RocketIcon, ChromeIcon, Github } from "lucide-react"
import { useAuth } from "./lib/authContext";
import toast, { ToastBar } from "react-hot-toast";

const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  }),
}

export default function LandingPage() {

  const router = useRouter();
  const { user, loading } = useAuth();
  const [image, setImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [searchResult, setSearchResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    console.log("Dragging over")
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    console.log("Dragged out")
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    console.log("Dropped")
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setImage(event.target.result as string)
          setIsUploaded(true)
          toast.success("Image Uploaded!")
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File changed")
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setImage(event.target.result as string)
          setIsUploaded(true)
          toast.success("Image Uploaded!")
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRetry = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Retry image")
    e.preventDefault()

    setImage(null)
    setIsUploaded(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Clear file input val
    }
  }

  const handleSearch = async () => {
    // console.dir("Searching with image:", image?.slice(0, 30));

    setSearchResult(null);
    setIsLoading(true);

    if (!image) return;

    try {
      const promise = fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: image.split(",")[1] }),
      });

      toast.promise(promise, {
        loading: "Searching...",
        success: "Search successful!",
        error: "Search failed!",
      });

      const response = await promise;
      const data = await response.json();

      if (!response.ok) {
        throw new Error(response.statusText);
        console.error("Error searching with image:", response.statusText);
      } else {
        setSearchResult(data);

        data.results.map((result: any) => {
          console.log("Result:", result.productName, result.image);
        });

        console.log("Search success!!", response.statusText);

      }
    } catch (error) {
      console.error("Error searching with image:", error);
    } finally {
      setIsLoading(false);
    }
  };


  //varients motion
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
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background" >
      {/* Header */}
      <header className="w-full max-w-screen-2xl px-[10%] py-[1.25%] fixed flex items-center justify-between z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <div className="bg-primary rounded-full p-2">
          </div>
          <span className="font-bold text-xl">
            VFind
          </span>
        </motion.div>

        <nav className="hidden md:flex gap-6 font-sans-medium">
          <button
            onClick={() =>
              document.getElementById("features")?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Features
          </button>

          <button
            onClick={() =>
              document.getElementById("extension")?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Extension
          </button>

          <button
            onClick={() => {
              toast.success("github.com/abhinav0git/vfind",
                {
                  duration: 4000,
                  position: "bottom-center",
                  icon: <Github />
                })
            }}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            How it works
          </button>

        </nav>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            size="sm"
            onClick={() => {
              router.push(user ? "/dashboard" : "/auth");
            }}
          >
            {user ? (<LayoutDashboard color="#ffffff" />) : (<LogIn color="#ffffff" />)}
            <span className="md:inline hidden font-sans-medium">
              {user ? "Dashboard" : "Sign Up"}
            </span>
          </Button>
        </motion.div>
      </header>


      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl px-6 pt-10 pb-10" >
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center gap-12 py-8 mt-[6%]"
        >
          {/* Hero Section Heading and Para*/}
          <motion.div variants={itemVariants} className="text-left max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-3 py-1 mb-6 text-sm font-medium rounded-full bg-muted text-foreground border border-border"
            >
              👁️ Visual Search Tech
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-foreground"
            >
              Find Any Product{" "}
              <span className="relative inline-block">
                <span className="font-serif relative border-foreground">Online</span>
              </span>{" "}
              with an Image
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground mt-6">
              Upload an image to discover matching products instantly. Our AI-powered visual
              search finds exactly what you're looking for.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-8">
              <Button
                size="lg"
                className="gap-2 group"
                onClick={() => document.getElementById("upload-section")?.scrollIntoView({ behavior: "smooth", block: "center" })
                }>
                Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "center" })
                }>
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Hero Section Image*/}
          <motion.div variants={itemVariants} className="w-full md:w-1/2 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 70 }}
              className="relative z-10"
            >
              <Image
                src="/image1.png"
                alt="Product illustration"
                width={100}
                height={100}
                className="w-full h-auto rounded-2xl shadow-2xl"
                priority
              />
            </motion.div>
            <div className="absolute -bottom-2 -left-2 w-[100%] h-[100%] bg-slate-200 rounded-2xl -z-9"></div>
          </motion.div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 50 }}
          className="relative mt-20 mb-24"
          id="upload-section"
        >
          <div className="absolute inset-0 bg-slate-200 rounded-3xl transform -bottom-2 -left-2 right-2 top-2 scale-100"></div>
          <div className="relative bg-card border border-border rounded-3xl p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">
                  Upload Your Image
                </h2>
                <p className="text-muted-foreground mb-6">
                  Drag and drop your image to find similar products online.
                </p>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-colors group ${isDragging
                    ? "border-primary bg-primary/5"
                    : isUploaded
                      ? "border-muted-foreground bg-accent"
                      : "border-border hover:border-foreground"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />

                  <AnimatePresence mode="wait">
                    {isUploaded ? (
                      <motion.div
                        key="uploaded"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center"
                      >
                        <CheckCircle2 className="h-12 w-12 text-foreground mb-2" />
                        <p className="text-foreground font-medium">Image uploaded successfully!</p>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center cursor-pointer">
                        <Upload className="h-12 w-12 text-muted-foreground mb-2 group-hover:-translate-y-2 group-hover:scale-[1.1] transition delay-60 duration-200 ease-in-out" />
                        <p className="font-medium">Drag & drop your image here or click to browse</p>
                        <p className="text-sm text-muted-foreground mt-1">Supports JPG & PNG (max 5MB)</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex mt-2 justify-center">
                  <Button onClick={handleSearch} disabled={isUploaded == false || isLoading == true} className="items-center">
                    <Search className="h-4 w-4" /> Search </Button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">

                {/* Input image Preview */}
                <AnimatePresence>
                  {image && image.startsWith("data:image") ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-full max-w-xs aspect-[3/4] rounded-xl overflow-hidden shadow-lg sm:aspect-square max-sm:h-60 max-sm:w-auto"
                    >
                      <Image src={image || "/placeholder.svg"} alt="Uploaded preview" fill className="object-cover" />
                      <Button size="sm" variant="ghost" onClick={handleRetry} className="absolute top-2 right-2 z-10">
                        <CircleXIcon className="h-4 w-4 text-gray-500" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center p-8 rounded-xl bg-muted w-full max-w-xs aspect-square"
                    >
                      <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground text-center">
                        Your image will appear here once uploaded
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {searchResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className="mt-8 w-full"
                >
                  {searchResult.results && searchResult.results.length > 0 ? (
                    <div className="bg-card border border-border rounded-xl p-4">
                      <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
                        Search Results
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {searchResult.results.map((result: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group flex flex-col bg-card rounded-lg border border-border hover:border-foreground transition-all duration-300 
                              ${hoveredIndex !== null && hoveredIndex !== index ? 'opacity-40 blur-[4px] scale-90' : ''
                              }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          >
                            <div className="relative aspect-[3/4] w-full bg-muted max-sm:h-60 group">
                              <Image
                                src={result.image || "/placeholder.svg?height=160&width=160"}
                                alt={result.productName || "Product image"}
                                className="object-contain max-sm:h-60 max-sm:w-auto transition-transform duration-200 rounded-md group-hover:scale-105 group-hover:cursor-pointer"
                                onClick={() => window.open("https://www.myntra.com/" + result.id)}
                                fill
                              />

                              <button
                                className="hidden group-hover:flex items-center justify-center absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1.5 md:px-4 md:py-2 rounded-md bg-primary text-primary-foreground text-xs md:text-sm font-medium hover:bg-foreground transition-all"
                                onClick={(e) => {
                                  localStorage.removeItem("vtonInputImage");
                                  e.preventDefault();
                                  if (result.image.startsWith("http://")) {
                                    result.image = result.image.replace("http://", "https://");
                                  }
                                  localStorage.setItem("vtonInputImage", result.image);
                                  console.log("image selected for vton", result.productName, result.image);
                                  router.push("/dashboard");
                                }}
                              >
                                Try V-Ton
                              </button>
                            </div>

                            <div className="p-3">
                              <h3 className="font-medium max-sm:text-xs text-foreground line-clamp-2 group-hover:font-bold transition-all group-hover:underline">
                                {result.productName}
                              </h3>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : searchResult && (!searchResult.results || searchResult.results.length === 0) ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-muted border border-border text-muted-foreground rounded-lg"
                    >
                      <h3 className="text-lg font-semibold flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        No Results Found
                      </h3>
                      <p className="ml-7">
                        We couldn't find similar products for your image. Try another image or adjust your search.
                      </p>
                    </motion.div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          id="features"
          className="py-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-muted text-foreground border border-border">
              Key Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Discover the Power of Visual Search
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Our advanced AI technology makes finding products simple and intuitive
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="h-8 w-8 group-hover:rotate-x-2 transition-transform" />}
              title="Upload Images"
              description="Simply upload a photo to find similar products online from thousands of retailers."
              color=""
              index={0}
            />
            <FeatureCard
              icon={<Wand2Icon className="h-8 w-8" />}
              title="V-Ton"
              description="Use search result product and try it on your own image. Just click on the product image and see the magic!"
              color=""
              index={1}
            />
            <FeatureCard
              icon={<ChromeIcon className="h-8 w-8" />}
              title="Chrome Extension"
              description="Install our Chrome extension to search for products seamlessly while browsing any website."
              color=""
              index={2}
            />
          </div>
        </motion.div>

        {/* Chrome Extension Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          id="extension"
          className="py-16"
        >
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div variants={itemVariants} className="w-full md:w-1/2 relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100 }}
                className="relative z-10"
              >
                <Image
                  src="/image2.png"
                  alt="chrome extension illustration"
                  width={50}
                  height={50}
                  className="w-full h-auto rounded-2xl border border-border"
                />
              </motion.div>

            </motion.div>

            <motion.div variants={containerVariants} className="w-full md:w-1/2">
              <motion.div
                variants={itemVariants}
                className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-muted text-foreground border border-border"
              >
                Browser Extension
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold">
                Search While You Browse
              </motion.h2>
              <motion.p variants={itemVariants} className="text-muted-foreground mt-4">
                Install our Chrome extension to search for products seamlessly while browsing any website. Just
                right-click on any image to find where to buy it.
              </motion.p>
              <motion.ul variants={containerVariants} className="mt-6 space-y-4">
                <motion.li variants={itemVariants} className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                  </div>
                  <span>Right-click on any image to search</span>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                  </div>
                  <span>Compare prices across multiple retailers</span>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-foreground" />
                  </div>
                  <span>Save products to your wishlist</span>
                </motion.li>
              </motion.ul>
              <motion.div variants={itemVariants} className="mt-8">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={() => {
                    toast.success("Coming Soon!", { position: "bottom-right", icon: <RocketIcon /> });
                  }}
                >
                  <PlusCircleIcon
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  Add to Chrome
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Coming Soon
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 50 }}
          className="mt-20 mb-10 relative"
        >
          {/* <div className="absolute inset-0 bg-muted rounded-3xl transform rotate-1 scale-[103%]"></div> */}
          <div className="absolute inset-0"></div>
          <div className="relative bg-primary text-primary-foreground text-center py-16 px-8 rounded-3xl overflow-hidden">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-bold"
            >
              Find Any Product in Seconds
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-xl mt-4 max-w-2xl mx-auto text-primary-foreground/80"
            >
              Stop searching with words when you can search with images.
              <br />
              Try VFind today!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              <Button
                size="lg"
                variant="secondary"
                className="bg-background text-foreground hover:bg-accent"
                onClick={() => {
                  if (user) {
                    toast.success("Already registered!", { position: "bottom-right" });
                  }
                  router.push("/dashboard")
                }}
              >
                Get Started for Free
              </Button>
              <Button
                size="lg"
                variant="link"
                className="bg-background text-foreground hover:bg-accent hover:-translate-y-1 transition-transform duration-100 ease-in-out"
                onClick={() => window.open("https://www.loom.com/share/f7173cbfa4784cb3ac08b5bad9c06149")}>
                Watch Demo?
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      < footer className="w-full bg-background border-t border-border py-8" >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-full p-2">
                {/* <Search className="h-5 w-5 text-primary-foreground" /> */}
              </div>
              <span className="font-bold text-xl">VFind</span>
            </div>
            <div className="flex gap-20 md:gap-8">
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                onClick={(e) => e.preventDefault()}
              >
                Privacy
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  wip!
                </span>
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                onClick={(e) => e.preventDefault()}
              >
                Terms
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  wip!
                </span>
              </a>
              <a href="mailto:abhinav07c@gmail.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} VFind. All rights reserved.
            </div>
          </div>
        </div>
      </footer >
    </div >
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  index,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  index: number
}) {
  return (
    <motion.div
      custom={index}
      variants={featureVariants}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative bg-card border border-border rounded-xl p-8 overflow-hidden"
    >
      <div className="mb-6 inline-flex items-center justify-center p-3 rounded-xl bg-muted text-foreground">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-muted rounded-tl-full -z-10 opacity-0 group-hover:opacity-50 transition-opacity"></div>
    </motion.div>
  )
}
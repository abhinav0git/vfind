"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Camera, Link, Upload, Search, ArrowRight, CheckCircle2, ImageIcon } from "lucide-react"

// Move the featureVariants definition outside of the main component, right before the LandingPage component definition
const featureVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  }),
}

export default function LandingPage() {
  // Remove the featureVariants definition from here since we moved it outside
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
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.value)
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
    console.dir("Searching with image:", image?.slice(0, 30))
    setSearchResult(null)
    setIsLoading(true)
    if (!image) return

    try {
      const response = await fetch("http://127.0.0.1:8000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: image.split(",")[1] }),
      })

      const data = await response.json()
      console.dir("DATA fetch:", data?.toString())

      if (!response.ok) {
        console.log("Error searching with image:", response.statusText)
      } else {
        setSearchResult(data)
        console.log("Search success!!", response.statusText)
        console.log("response:", data.toString())
      }

      console.log("Search done!")
    } catch (error) {
      console.error("Error searching with image:", error)
    }
    finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 geist-mono-regular">
      {/* bg decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-duration-5000"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-2000 animation-duration-6000"></div>
        <div className="absolute -bottom-40 left-40 w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000 animation-duration-7000"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-blob animation-delay-3000 animation-duration-8000"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-screen-2xl px-8 py-4 fixed flex items-center justify-between z-20 bg-transparent bg-[radial-gradient(transparent_1px,#ffffff40_1px)] bg-[size:4px_4px] backdrop-blur-[6px] mask-[linear-gradient(rgb(0,0,0)_60%,rgba(0,0,0,0)_100%)]">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-2">
            <Search className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">VFind</span>
        </div>

        <nav className="hidden md:flex gap-6 space-mono-regular">
          <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
            How it works
          </a>
          <a href="#extension" className="text-sm font-medium hover:text-primary transition-colors">
            Extension
          </a>
        </nav>
        <Button size="sm">Sign Up</Button>
      </header>

      <main className="flex-1 w-full max-w-7xl px-6 pt-10 pb-20">
        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col md:flex-row items-center gap-12 py-8"
        >
          <motion.div variants={itemVariants} className="text-left max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-3 py-1 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary"
            >
              🔍Visual Search Tech!
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="space-mono-bold-italic text-4xl md:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white"
            >
              Find Any Product{" "}
              <span className="relative inline-block before:absolute before:-inset-1 before:block before:-skew-y-2 before:bg-sky-500">
                <span className="font-serif relative text-white">Online</span>
              </span>{" "}
              with an Image
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-slate-600 dark:text-slate-300 mt-6">
              Upload an image or paste an image link to discover matching products instantly. Our AI-powered visual
              search finds exactly what you're looking for.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-8">
              <Button size="lg" className="gap-2 group">
                Get Started <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full md:w-1/2 relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 60 }}
              className="relative z-10"
            >
              <Image
                src="/placeholder.svg?height=200&width=250"
                alt="Product illustration"
                width={250}
                height={200}
                className="w-full h-auto rounded-2xl shadow-2xl"
                priority
              />
            </motion.div>
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-br from-primary/10 to-purple-400/10 rounded-2xl -z-9"></div>
          </motion.div>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 50 }}
          className="relative mt-12 mb-24"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-400/40 rounded-3xl transform rotate-1 scale-105"></div>
          <div className="relative bg-white dark:bg-slate-800 shadow-xl rounded-3xl p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-4">Upload Your Image</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  Drag and drop your image or paste a URL to find similar products online.
                </p>

                <div
                  className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-colors group ${isDragging
                    ? "border-primary bg-primary/5"
                    : isUploaded
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-primary"
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
                        <Button size="sm" variant="outline" onClick={handleRetry} className="mb-2 bg-red-400">
                          Retry!?
                        </Button>
                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                        <p className="text-green-600 dark:text-green-400 font-medium">Image uploaded successfully!</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upload-prompt"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center cursor-pointer"
                      >
                        <Upload className="h-12 w-12 text-slate-400 mb-2 group-hover:-translate-y-2 group-hover:scale-[1.1] transition delay-60 duration-200 ease-in-out" />
                        <p className="font-medium">Drag & drop your image here or click to browse</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Supports JPG & PNG (max 5MB)</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex mt-2 justify-center">
                  <Button onClick={handleSearch} disabled={isUploaded == false || isLoading == true} className="items-center">
                    <Search className="h-4 w-4 mr-1" /> Search
                    {isLoading && (
                      <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence>
                  {image && image.startsWith("data:image") ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-full max-w-xs aspect-[3/4] rounded-xl overflow-hidden shadow-lg"
                    >
                      <Image src={image || "/placeholder.svg"} alt="Uploaded preview" fill className="object-cover" />
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center p-8 rounded-xl bg-slate-100 w-full max-w-xs aspect-square"
                    >
                      <ImageIcon className="h-16 w-16 text-slate-400 mb-4" />
                      <p className="text-slate-500 dark:text-slate-400 text-center">
                        Your image will appear here once uploaded
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

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
                    <div className="bg-white/50 backdrop-blur-md rounded-xl p-4">
                      <h2 className="text-2xl font-bold mb-4 text-center text-green-600">
                        Search Results!
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {searchResult.results.map((result: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-slate-100 
                              ${hoveredIndex !== null && hoveredIndex !== index ? 'opacity-40 blur-[4px] scale-90' : ''
                              }`}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                          >
                            <div
                              className="relative aspect-[3/4] w-full bg-slate-50 sm:text-2xl"
                              onClick={() => window.open("https://www.myntra.com/" + result.id)}>
                              <Image
                                src={result.image || "/placeholder.svg?height=160&width=160"}
                                alt={result.productName || "Product image"}
                                className="object-contain group-hover:scale-105 transition-transform duration-200 rounded-md"
                                fill
                              />
                            </div>
                            <div className="p-3">
                              <h3 className="font-medium text-slate-800 line-clamp-2 group-hover:font-bold group-hover:text-lg transition-all">
                                {result.productName}
                              </h3>
                              {result.price && (
                                <p className="text-sm font-semibold text-primary mt-1">{result.price}</p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : searchResult && (!searchResult.results || searchResult.results.length === 0) ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg shadow-sm"
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
            <div className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Key Features
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">How VFind Works</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-4 max-w-2xl mx-auto">
              Our advanced AI technology makes finding products simple and intuitive
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="h-8 w-8" />}
              title="Upload Images"
              description="Simply upload a photo to find similar products online from thousands of retailers."
              color="from-blue-500 to-cyan-400"
              index={0}
            />
            <FeatureCard
              icon={<Link className="h-8 w-8" />}
              title="Use Image Links"
              description="Paste an image URL from any website to discover where to buy the exact product or similar items."
              color="from-purple-500 to-pink-400"
              index={1}
            />
            <FeatureCard
              icon={<Search className="h-8 w-8" />}
              title="AI-Powered Search"
              description="Our advanced visual recognition technology identifies products with incredible accuracy."
              color="from-amber-500 to-orange-400"
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
                  src="/placeholder.svg?height=400&width=500"
                  alt="Chrome extension illustration"
                  width={500}
                  height={400}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
              </motion.div>
              <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-tr from-amber-400/10 to-pink-400/10 rounded-2xl -z-9"></div>
            </motion.div>

            <motion.div variants={containerVariants} className="w-full md:w-1/2">
              <motion.div
                variants={itemVariants}
                className="inline-block px-3 py-1 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary"
              >
                Browser Extension
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold">
                Search While You Browse
              </motion.h2>
              <motion.p variants={itemVariants} className="text-slate-600 dark:text-slate-300 mt-4">
                Install our Chrome extension to search for products seamlessly while browsing any website. Just
                right-click on any image to find where to buy it.
              </motion.p>
              <motion.ul variants={containerVariants} className="mt-6 space-y-4">
                <motion.li variants={itemVariants} className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Right-click on any image to search</span>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Save products to your wishlist</span>
                </motion.li>
                <motion.li variants={itemVariants} className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span>Compare prices across multiple retailers</span>
                </motion.li>
              </motion.ul>
              <motion.div variants={itemVariants} className="mt-8">
                <Button size="lg" className="gap-2">
                  <Image
                    src="/placeholder.svg?height=20&width=20"
                    alt="Chrome logo"
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  Add to Chrome
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
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-purple-600 rounded-3xl transform -rotate-1 scale-105 opacity-90"></div>
          <div className="relative bg-gradient-to-r from-primary to-purple-600 text-white text-center py-16 px-8 rounded-3xl shadow-xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_40%)]"></div>

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
              className="text-xl mt-4 max-w-2xl mx-auto text-white/90"
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
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
                Get Started for Free
              </Button>
              <Button size="lg" variant="secondary" className="border-white text-primary hover:bg-white/10">
                Watch Demo?
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-full p-2">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">VisualFind</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                Contact
              </a>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} VisualFind. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
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
      className="group relative bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
    >
      <div className={`absolute top-0 left-0 h-2 w-full bg-gradient-to-r ${color}`}></div>
      <div
        className={`mb-6 inline-flex items-center justify-center p-3 rounded-xl bg-gradient-to-br ${color} text-white`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>

      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-slate-100 to-transparent dark:from-slate-700/30 rounded-tl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  )
}


"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Search, Upload, X, RefreshCw } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function ImageSearch() {
    const router = useRouter()
    const [image, setImage] = useState<string | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [isUploaded, setIsUploaded] = useState(false)
    const [searchResult, setSearchResult] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0])
        }
    }

    const processFile = (file: File) => {
        const reader = new FileReader()
        reader.onload = (event) => {
            if (event.target) {
                setImage(event.target.result as string)
                setIsUploaded(true)
                toast.success("Image Ready!")
            }
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setImage(null)
        setIsUploaded(false)
        setSearchResult(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleSearch = async () => {
        setSearchResult(null)
        setIsLoading(true)

        if (!image) return

        try {
            const promise = fetch("/api/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image: image.split(",")[1] }),
            })

            toast.promise(promise, {
                loading: "Searching...",
                success: "Found similar items!",
                error: "Search failed!",
            })

            const response = await promise
            const data = await response.json()

            if (!response.ok) {
                throw new Error(response.statusText);
                console.error("Error searching with image:", response.statusText)
            } else {
                setSearchResult(data)
            }
        } catch (error) {
            console.error("Error searching with image:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-xl">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-serif font-bold mb-3">Visual Search</h2>
                    <p className="text-muted-foreground">
                        Upload an image to find similar fashion items instantly.
                    </p>
                </div>

                <div
                    className={`relative overflow-hidden transition-all duration-300 ease-in-out bg-card border-2 border-dashed rounded-2xl ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border"
                        } ${image ? "border-solid p-0" : "p-12 hover:border-foreground/50 cursor-pointer"}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !image && fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />

                    <AnimatePresence mode="wait">
                        {!image ? (
                            <motion.div
                                key="upload-prompt"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex flex-col items-center justify-center gap-4"
                            >
                                <div className="p-4 bg-muted rounded-full">
                                    <Upload className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <div className="text-center">
                                    <p className="text-lg font-medium text-foreground">Click or drag image to upload</p>
                                    <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG, WEBP</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="image-preview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative aspect-[3/4] md:aspect-[4/3] w-full bg-black/5"
                            >
                                <Image
                                    src={image}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="h-8 w-8 p-0 rounded-full shadow-sm"
                                        onClick={handleRemoveImage}
                                        title="Remove image"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>

                                {/* Overlay change prompt */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <p className="text-white font-medium">Click to replace</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {image && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="mt-6 flex justify-center"
                        >
                            <Button
                                size="lg"
                                onClick={handleSearch}
                                disabled={isLoading}
                                className="w-full sm:w-auto min-w-[200px] text-lg h-12 shadow-lg hover:shadow-xl transition-all"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        <Search className="mr-2 h-5 w-5" />
                                        Find Similar Items
                                    </>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Search Results */}
            <AnimatePresence>
                {searchResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        className="w-full mt-16 border-t pt-12"
                    >
                        <h3 className="text-2xl font-serif font-bold mb-8 text-center text-foreground">Matched Products</h3>
                        {searchResult.results && searchResult.results.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {searchResult.results.map((result: any, index: number) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`group relative bg-card rounded-xl overflow-hidden border border-border hover:border-foreground/20 hover:shadow-md transition-all duration-300
                                                    ${hoveredIndex !== null && hoveredIndex !== index ? "opacity-50 scale-95 grayscale-[0.5]" : ""}`}
                                        onMouseEnter={() => setHoveredIndex(index)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    >
                                        <div className="relative aspect-[3/4] bg-muted">
                                            <Image
                                                src={result.image || "/placeholder.svg?height=400&width=300"}
                                                alt={result.productName || "Product"}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    className="w-full bg-white text-black hover:bg-white/90"
                                                    onClick={() => window.open("https://www.myntra.com/" + result.id)}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    className="w-full bg-black/50 text-white hover:bg-black/70 border border-white/20 backdrop-blur-sm"
                                                    onClick={(e) => {
                                                        localStorage.removeItem("vtonInputImage")
                                                        e.preventDefault()
                                                        if (result.image.startsWith("http://")) {
                                                            result.image = result.image.replace("http://", "https://")
                                                        }
                                                        localStorage.setItem("vtonInputImage", result.image)
                                                        window.location.href = "/dashboard?tab=vton"
                                                    }}
                                                >
                                                    <Shirt className="w-3.5 h-3.5 mr-2" />
                                                    Try On
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <h4 className="font-medium text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                                                {result.productName}
                                            </h4>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                                <p className="text-muted-foreground">No matches found. Try a clearer image.</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

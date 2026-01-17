"use client"

import type React from "react"

import { useAuth } from "../../lib/authContext"
import ProtectedRoute from "../../components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { CupSodaIcon, FileStack, HomeIcon as House, LineChart, LogOut, Upload } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { Separator } from "@/components/ui/separator"
import ImageSearch from "@/components/ImageSearch"


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"vton" | "search" | "more">("vton")
  const [personImage, setPersonImage] = useState<string | null>(null)
  const [clothImage, setClothImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const personInputRef = useRef<HTMLInputElement>(null)
  const clothInputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error: any) {
      alert("Logout failed: " + error.message)
      toast.error("Logout failed :" + error.message)
    } finally {
      toast.success("Logged out!", {
        duration: 2000,
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "person" | "cloth") => {
    console.log("handleImageUpload", type)
    const file = e.target.files?.[0]

    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        type === "person" ? setPersonImage(base64) : setClothImage(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!personImage || !clothImage) {
      toast.error("Please upload both images.")
      return
    }

    setLoading(true)
    console.log("handleGenerate")

    try {
      console.log("sending images to server...")
      const response = await fetch("/api/vton", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personImage, clothImage }),
      })

      const data = await response.json()
      console.log("data from server sucessfully generated")
      console.dir(data)

      if (response.ok) {
        setResultImage(`data:image/jpeg;base64,${data.result.data}`)
        toast.success("Image generated successfully!", {
          duration: 3000,
        })
      } else {
        toast.error("Error: " + data.message)
        console.log("Error:", data)
      }
    } catch (error) {
      console.error("Fetch error:", error)
      toast.error("An error occurred while generating the image.")
      setResultImage(null)
    } finally {
      setLoading(false)
    }
  }

  const triggerFileInput = (type: "person" | "cloth") => {
    if (type === "person" && personInputRef.current) {
      personInputRef.current.click()
    } else if (type === "cloth" && clothInputRef.current) {
      clothInputRef.current.click()
    }
  }

  useEffect(() => {
    const storedImageUrl = localStorage.getItem("vtonInputImage");
    if (storedImageUrl) {
      fetch(storedImageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "vton-image.jpg", { type: blob.type });

          // set image preview
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = reader.result as string;
            setClothImage(base64);
          };
          reader.readAsDataURL(file);

          // set file to input
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          if (personInputRef.current) {
            personInputRef.current.files = dataTransfer.files;
          }

          // clean up required?
          //localStorage.removeItem("vtonInputImage");
        })
        .catch(err => {
          console.error("Failed to fetch image for VTON:", err);
        });
    }
  }, []);


  return (
    <ProtectedRoute>
      <SidebarProvider>
        <DashboardSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
          userEmail={user?.email}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
            <div className="flex items-center gap-2 px-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              {/* Dynamic Title based on Active Tab */}
              <h2 className="text-lg font-semibold capitalize">
                {activeTab === "vton" ? "Virtual Try-On" : activeTab === "search" ? "Image Search" : "More Features"}
              </h2>
            </div>
          </header>

          <main className="flex-1 flex flex-col p-4 md:p-8 pt-6">
            <AnimatePresence mode="wait">
              {activeTab === "vton" ? (
                <motion.div
                  key="vton"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl mx-auto"
                >
                  <div className="text-center mb-8">
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                      Virtual Try-On
                    </h1>
                    <p className="text-muted-foreground opacity-80 mb-4 py-2">
                      Welcome, {user?.email?.split("@")[0].toUpperCase()}
                    </p>
                  </div>

                  <div className="bg-card border border-border rounded-xl px-4 py-6 md:p-8 mb-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex flex-col items-center">
                        <h2 className="text-lg font-medium text-foreground mb-4">Person Image</h2>
                        <input
                          ref={personInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "person")}
                          className="hidden"
                        />
                        <motion.div
                          className={`w-full aspect-square rounded-lg border-2 border-dashed ${personImage ? "border-foreground" : "border-border"} flex items-center justify-center overflow-hidden cursor-pointer hover:border-foreground transition-colors`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => triggerFileInput("person")}
                        >
                          {personImage ? (
                            <motion.img
                              src={personImage}
                              alt="Person"
                              className="w-full h-full object-contain"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <div className="text-center p-4">
                              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Upload person image</p>
                            </div>
                          )}
                        </motion.div>
                      </div>

                      <div className="flex flex-col items-center">
                        <h2 className="text-lg font-medium text-foreground mb-4">Clothing Image</h2>
                        <input
                          ref={clothInputRef}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "cloth")}
                          className="hidden"
                        />
                        <motion.div
                          className={`w-full aspect-square rounded-lg border-2 border-dashed ${clothImage ? "border-foreground" : "border-border"} flex items-center justify-center overflow-hidden cursor-pointer hover:border-foreground transition-colors`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => triggerFileInput("cloth")}
                        >
                          {clothImage ? (
                            <motion.img
                              src={clothImage}
                              alt="Cloth"
                              className="w-full h-full object-contain"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            />
                          ) : (
                            <div className="text-center p-4">
                              <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                              <p className="text-muted-foreground">Upload clothing image</p>
                            </div>
                          )}
                        </motion.div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center">
                      <motion.div className="rounded-lg" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={handleGenerate} disabled={loading || !personImage || !clothImage}>
                          {loading ? (
                            <div className="flex items-center">
                              <motion.div
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "linear" }}
                              />
                              Generating
                            </div>
                          ) : (
                            <span>Generate</span>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {resultImage && (
                      <motion.div
                        className="bg-card border border-border rounded-xl p-6 md:p-8 overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                      >
                        <h2 className="text-xl font-bold text-center mb-6 text-foreground">Your Result</h2>
                        <div className="flex justify-center">
                          <motion.img
                            src={resultImage}
                            alt="Result"
                            className="max-w-full max-h-[500px] rounded-lg shadow-md"
                            layoutId="resultImage"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : activeTab === "search" ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex-1 max-w-5xl mx-auto flex flex-col justify-center"
                >
                  <ImageSearch />
                </motion.div>
              ) : (
                <motion.div
                  key="more"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full max-w-4xl mx-auto"
                >
                  <div className="text-center mb-8">
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                      More Features
                    </h1>
                    <p className="text-muted-foreground opacity-80 mb-4 py-2">
                      Exciting things coming soon to VFind!
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center hover:border-foreground transition-colors">
                      <div className="bg-muted p-4 rounded-full mb-4">
                        <LineChart className="h-8 w-8 text-foreground" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Chrome Extension</h3>
                      <p className="text-muted-foreground">Shop instantly from any website using our upcoming browser extension.</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center hover:border-foreground transition-colors">
                      <div className="bg-muted p-4 rounded-full mb-4">
                        <FileStack className="h-8 w-8 text-foreground" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">Expanded Recommendations</h3>
                      <p className="text-muted-foreground">We're increasing our match results from 3 to 10 similar products.</p>
                    </div>
                    <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center hover:border-foreground transition-colors md:col-span-2">
                      <div className="bg-muted p-4 rounded-full mb-4">
                        <CupSodaIcon className="h-8 w-8 text-foreground" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">And much more...</h3>
                      <p className="text-muted-foreground">Stay tuned for more updates and features coming your way.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}

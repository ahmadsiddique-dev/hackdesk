"use client"

import * as React from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/apiClient"
import {
  IconCloudUpload,
  IconFile,
  IconCheck,
  IconLoader,
  IconX,
  IconAlertCircle
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"

export function KbUpload() {
  const [file, setFile] = React.useState<File | null>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const [localError, setLocalError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState(false)
  const [processing, setProcessing] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const uploadUrl = `${process.env.NEXT_PUBLIC_DESKRAG_URI}/upload/file`
  const { loading, error: apiError, execute: uploadFile, setData } = useApi(
    React.useCallback(async (uploadingFile: File) => {
      const formData = new FormData()
      formData.append("file", uploadingFile)
      const res = await axios.post(uploadUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-api-key": process.env.NEXT_PUBLIC_DESKRAG_API_KEY || "",
        },
      })
      return res.data
    }, [])
  )


  React.useEffect(() => {
    if (!file && fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [file])

  const validateAndSetFile = (selectedFile: File) => {
    setLocalError(null)
    setSuccess(false)
    setData(null)

    const isPdf = selectedFile.type === "application/pdf"
    const isTxt = selectedFile.type === "text/plain"

    if (!isPdf && !isTxt) {
      setLocalError("Only PDF and TXT files are allowed.")
      setFile(null)
      return
    }

    if (selectedFile.size > 250 * 1024) {
      setLocalError("File size exceeds the 250KB limit.")
      setFile(null)                             
      return
    }

    setFile(selectedFile)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!file) return
    const result = await uploadFile(file)
    if (result && result.jobId) {
      setProcessing(true)
      const jobId = result.jobId
      const interval = setInterval(async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_DESKRAG_URI}/upload/status/${jobId}`, {
            headers: {
              "x-api-key": process.env.NEXT_PUBLIC_DESKRAG_API_KEY || "",
            },
          })
          if (res.data.status === "completed") {
            clearInterval(interval)
            setProcessing(false)
            setSuccess(true)
            setFile(null)
          } else if (res.data.status === "failed") {
            clearInterval(interval)
            setProcessing(false)
            setLocalError("File processing failed. Try again")
            setFile(null)
          }
        } catch (err) {
          clearInterval(interval)
          setProcessing(false)
          setLocalError("Failed to check status")
        }
      }, 2000)
    }
  }

  const handleClear = () => {
    setFile(null)
    setLocalError(null)
    setSuccess(false)
    setProcessing(false)
    setData(null)
  }

  const activeError = localError || apiError

  return (
    <Card className="w-full max-w-2xl border border-border/40 bg-card/30 backdrop-blur-md hover:border-border/60 transition-all duration-300 shadow-xl rounded-2xl mx-auto">
      <CardContent className="p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold text-foreground">
            Upload File
          </h2>
          <p className="text-xs text-muted-foreground">
            Add documents to your knowledge base. Supported formats: PDF, TXT.
          </p>
        </div>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
          className={cn(
            "relative flex flex-col items-center justify-center border border-dashed rounded-xl p-10 cursor-pointer transition-all duration-300 group min-h-64",
            dragActive
              ? "border-orange-500 bg-orange-500/5 shadow-lg shadow-orange-500/5 scale-[1.01]"
              : "border-border/60 bg-background/30 hover:border-orange-500/40 hover:bg-orange-500/1"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center gap-4 text-center">
            <div className={cn(
              "flex size-14 items-center justify-center rounded-2xl border transition-all duration-300",
              dragActive
                ? "border-orange-500 bg-orange-500/10 text-orange-500"
                : "border-border/60 bg-muted/40 text-muted-foreground group-hover:border-orange-500/20 group-hover:bg-orange-500/5 group-hover:text-orange-500"
            )}>
              <IconCloudUpload className="size-7" />
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                Upload or Drag & Drop
              </span>
              <span className="text-xs text-muted-foreground">
                Click to browse files or drag them here
              </span>
            </div>
          </div>
        </div>

        {file && (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/40 bg-background/50 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex size-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500 shrink-0">
                <IconFile className="size-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-foreground truncate max-w-xs sm:max-w-md">
                  {file.name}
                </span>
                <span className="text-3xs text-muted-foreground font-mono">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="size-7 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <IconX className="size-4" />
            </button>
          </div>
        )}

        {activeError && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 text-xs text-destructive animate-in fade-in duration-200">
            <IconAlertCircle className="size-4 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 leading-relaxed font-medium">
              {activeError}
            </div>
            <button
              onClick={handleClear}
              className="size-5 flex items-center justify-center rounded-full hover:bg-destructive/10 text-destructive shrink-0"
            >
              <IconX className="size-3.5" />
            </button>
          </div>
        )}

        {processing && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5 text-xs text-orange-500 animate-in fade-in duration-200">
            <IconLoader className="size-4 shrink-0 mt-0.5 animate-spin" />
            <div className="flex-1 min-w-0 leading-relaxed font-medium">
              Processing and vector indexing in progress...
            </div>
          </div>
        )}

        {success && (
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-500 animate-in fade-in duration-200">
            <IconCheck className="size-4 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 leading-relaxed font-medium">
              File uploaded successfully to knowledge base!
            </div>
            <button
              onClick={handleClear}
              className="size-5 flex items-center justify-center rounded-full hover:bg-emerald-500/10 text-emerald shrink-0"
            >
              <IconX className="size-3.5" />
            </button>
          </div>
        )}

        {file && (
          <Button
            onClick={handleUpload}
            disabled={loading || processing}
            className="w-full h-10 rounded-xl bg-linear-to-r from-orange-600 to-amber-500 text-white font-bold hover:from-orange-500 hover:to-amber-400 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <IconLoader className="mr-2 size-4.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : processing ? (
              <>
                <IconLoader className="mr-2 size-4.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>Upload Document</span>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

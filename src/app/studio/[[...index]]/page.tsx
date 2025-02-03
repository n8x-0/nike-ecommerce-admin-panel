"use client"
import { SanityConfig } from "@/sanity/sanity.config"
import { NextStudio } from "next-sanity/studio"

const Studio = () => {
  return (
    <NextStudio config={SanityConfig}></NextStudio>
  )
}

export default Studio
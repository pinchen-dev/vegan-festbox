"use server"

import {
  BoxColor,
  BoxFinish,
  BoxSet,
  Occasion,
} from "@prisma/client"
import { db } from "@/db"
import { redirect } from "next/navigation"

export type SaveConfigArgs = {
  color: BoxColor
  finish: BoxFinish
  boxSet: BoxSet
  occasion: Occasion
  decoration: string[]
  configId: string
}

export async function saveConfig({
  color,
  finish,
  boxSet,
  occasion,
  decoration,
  configId,
}: SaveConfigArgs) {
  if (!configId) {
    throw new Error("找不到設定 ID")
  }

  await db.configuration.update({
    where: { id: configId },
    data: {
      color,
      finish,
      boxSet,
      occasion,
      decoration,
    },
  })

  redirect(`/configure/preview?id=${configId}`)
}
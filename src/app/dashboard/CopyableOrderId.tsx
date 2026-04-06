"use client"

import { Copy } from "lucide-react"
import { toast } from "sonner"

export const CopyableOrderId = ({ orderId }: { orderId: string }) => {
  const shortId = `#${orderId.slice(0, 8).toUpperCase()}`

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(orderId)
    toast.success(`訂單編號已複製: ${shortId}`)
  }

  return (
    <div className='flex items-center gap-2 group/copy'>
      <code className='text-sm font-bold text-foreground bg-zinc-100 px-2 py-1 rounded'>
        {shortId}
      </code>
      <button 
        onClick={copyToClipboard}
        className='opacity-0 group-hover/copy:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-zinc-200 text-muted-foreground'
      >
        <Copy className='h-3.5 w-3.5' />
      </button>
    </div>
  )
}
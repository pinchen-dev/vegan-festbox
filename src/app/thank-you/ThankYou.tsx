'use client'

import { useQuery } from '@tanstack/react-query'
import { getPaymentStatus } from './actions'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, Copy, Leaf, ShoppingBag, Sparkles } from 'lucide-react'
import { OrderSummary } from '@/components/OrderSummary'
import { toast } from 'sonner'
import { Suspense, useEffect } from 'react'
import { BoxPreview } from '@/components/ui/BoxPreview'
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const ThankYouContent = () => {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || ''

  const { data } = useQuery({
    queryKey: ['get-payment-status', orderId],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 500,
    enabled: !!orderId,
  })

  useEffect(() => {
    if (data && typeof data === 'object') {
      toast.success("付款成功！", {
        description: "我們已收到您的訂單，正準備開始包裝您的 Vegan Festbox 🌿",
        duration: 5000, 
      })
    }
  }, [data])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderId)
    toast.success("訂單編號已複製")
  }

  if (data === undefined || data === false) {
    return (
      <div className='w-full mt-24 flex justify-center bg-background min-h-screen'>
        <div className='flex flex-col items-center gap-4'>
          <Loader2 className='h-10 w-10 animate-spin text-primary' />
          <h3 className='font-black text-xl tracking-tight text-foreground'>
            {data === undefined ? "正在準備您的專屬禮盒細節..." : "正在確認付款狀態..."}
          </h3>
        </div>
      </div>
    )
  }

  const { configuration } = data

  return (
    <div className='bg-background min-h-screen py-10 sm:py-20'>
      <div className='mx-auto max-w-4xl px-6 lg:px-8'>
        <div className='flex flex-col items-center text-center mb-16'>
          <div className='bg-primary text-primary-foreground p-5 rounded-full mb-8 shadow-lg shadow-primary/20'>
            <CheckCircle2 className='h-12 w-12' />
          </div>
          <span className='bg-primary/10 text-primary text-[12px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-6'>
            Order Successful 訂單成功
          </span>
          <h1 className='text-4xl font-black tracking-tighter text-foreground sm:text-6xl'>
            Vegan Festbox <br /> <span className="text-primary">準備中</span>
          </h1>
          
          <div className='mt-10 flex items-center gap-3 bg-card px-6 py-3 rounded-2xl border border-border shadow-sm'>
            <span className='text-sm font-bold text-muted-foreground'>訂單編號</span>
            <code className='text-base font-black text-primary'>
              #{orderId.slice(0, 8).toUpperCase()}
            </code>
            <button 
              onClick={copyToClipboard}
              className='ml-2 p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors'
            >
              <Copy className='h-4 w-4' />
            </button>
          </div>
        </div>

        <div className='mb-12 flex justify-center'>
          <div className='relative w-full aspect-[16/9] md:aspect-[21/9] bg-white/10 rounded-[3rem] shadow-xl border border-border overflow-hidden flex items-center justify-center p-8 group'>
            <div className='absolute inset-0 opacity-5 bg-[url("/paper-texture.jpg")]' />
            <BoxPreview 
              color={configuration?.color}
              finish={configuration?.finish}
              occasion={configuration?.occasion}
              decoration={configuration?.decoration ?? []}
              className="h-full aspect-square w-auto transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className='absolute top-6 right-8 flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full shadow-sm z-10'>
              <Sparkles className='w-4 h-4 text-primary' />
              <span className='text-[10px] font-black text-foreground uppercase tracking-[0.2em]'>Your Design</span>
            </div>
          </div>
        </div>

        <div className='bg-card rounded-[3rem] shadow-sm border border-border overflow-hidden'>
          <div className='p-8 lg:p-12'>
            <div className='flex items-center justify-between mb-10'>
              <div className='flex items-center gap-3'>
                <ShoppingBag className='w-6 h-6 text-primary' />
                <h2 className='text-2xl font-black text-foreground tracking-tight'>訂單細節總覽</h2>
              </div>
              <div className='hidden md:flex items-center gap-2 bg-primary/10 px-4 py-1.5 rounded-full'>
                <span className='text-[10px] font-black text-primary uppercase tracking-widest'>Paid 已支付</span>
                <CheckCircle2 className='w-4 h-4 text-primary' />
              </div>
            </div>
            <OrderSummary order={data} />

          </div>
        </div>

        <div className='mt-8 bg-primary text-primary-foreground rounded-[2.5rem] p-8 shadow-xl flex items-center gap-6'>
          <div className='bg-white/20 p-4 rounded-2xl shrink-0'>
            <Leaf className='w-6 h-6 text-white' />
          </div>
          <p className='text-sm leading-relaxed font-medium'>
            <span className='font-black block text-base mb-1 uppercase tracking-wider'>您的選擇，正在改變世界</span>
            感謝您的支持與購買。 <br />堅持使用 100% 植物性材料與環保包裝，是我們對永續生活的承諾。
          </p>
        </div>

        <div className='mt-12 flex flex-col items-center'>
          <Link
            href="/"
            className={buttonVariants({
              variant: "default",
              size: "lg",
              className: "w-full max-w-sm h-16 text-base rounded-2xl font-black shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
            })}
          >
            回到首頁
          </Link>
        </div>
      </div>
    </div>
  )
}

const ThankYou = () => {
  return (
    <Suspense fallback={
      <div className='w-full mt-24 flex justify-center bg-background min-h-screen'>
        <Loader2 className='h-10 w-10 animate-spin text-primary' />
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  )
}

export default ThankYou
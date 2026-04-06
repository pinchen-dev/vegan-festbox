import { formatPrice, getConfigurationSpecs } from '@/lib/utils'

import { Sparkles, FileText, MapPin } from 'lucide-react'



export const OrderSummary = ({ order }: { order: any }) => {

  if (!order || !order.configuration) return null



  const specs = getConfigurationSpecs(order.configuration) || []



  return (

    <div className='space-y-8'>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 mb-12'>

        <div className='space-y-8'>

          <div>

            <div className='flex items-center gap-2 mb-4 text-primary'>

              <Sparkles className='w-5 h-5' />

              <h3 className='font-black text-sm uppercase tracking-widest text-foreground'>客製規格</h3>

            </div>

            <div className='space-y-3'>

              {specs.map((spec, i) => (

                <div key={i} className='flex justify-between items-center border-dashed border-border pb-2 text-sm'>

                  <span className='font-bold text-muted-foreground'>{spec.label}</span>

                  <span className='font-black text-foreground'>{spec.value}</span>

                </div>

              ))}

            </div>

          </div>



          <div>

            <div className='flex items-center gap-2 mb-4 text-primary'>

              <FileText className='w-5 h-5' />

              <h3 className='font-black text-sm uppercase tracking-widest text-foreground'>購買者資訊</h3>

            </div>

            <div className='bg-muted/30 rounded-2xl p-4 border border-border/50 text-sm'>

              <p className='text-[10px] font-black text-muted-foreground uppercase mb-1'>帳號信箱</p>

              <p className='font-bold text-foreground'>{order?.user?.email || "無資料"}</p>

              <div className='mt-4'>

                <p className='text-[10px] font-black text-muted-foreground uppercase mb-1'>發票資訊</p>

                <p className='font-bold text-foreground'>

                  {order?.invoiceType === "ELECTRONIC"

                    ? "個人電子載具"

                    : `公司三聯 (${order?.companyTitle || "未填寫抬頭"})`}

                </p>

                <p className='text-primary font-black mt-0.5'>{order?.invoiceValue || ""}</p>

              </div>

            </div>

          </div>

        </div>



        <div className='space-y-8'>

          <div>

            <div className='flex items-center gap-2 mb-4 text-primary'>

              <MapPin className='w-5 h-5' />

              <h3 className='font-black text-sm uppercase tracking-widest text-foreground'>配送細節</h3>

            </div>

            <div className='bg-muted/30 rounded-2xl p-5 border border-border/50 text-sm'>

              <p className='text-foreground font-black text-base'>{order?.shippingAddress?.name || "未填寫"}</p>

              <p className='text-foreground font-medium leading-relaxed mt-1'>

                {order?.shippingAddress?.postalCode} {order?.shippingAddress?.city}{order?.shippingAddress?.district}{order?.shippingAddress?.address}

              </p>

              <p className='text-primary font-bold mt-3 text-base'>{order?.shippingAddress?.phoneNumber || "未提供電話"}</p>

            </div>

          </div>



          <div className='pt-4'>

            <div className='flex flex-col gap-4 bg-primary/[0.03] rounded-3xl p-6 border border-primary/10'>

              <div className='flex justify-between items-center text-sm'>

                <span className='text-muted-foreground font-bold'>商品合計</span>

                <span className='font-black text-foreground'>{formatPrice(order?.amount || 0)}</span>

              </div>

              <div className='flex justify-between items-center text-sm'>

                <div className='flex flex-col'>

                  <span className='text-muted-foreground font-bold'>環境友善物流</span>

                  <span className='text-[10px] text-primary font-black uppercase'>Eco-Friendly Shipping</span>

                </div>

                <span className='font-black text-primary'>免運</span>

              </div>

              <div className='h-px bg-border my-2 border-dashed' />

              <div className='flex justify-between items-end'>

                <span className='text-lg font-black text-foreground'>結帳總計</span>

                <span className='text-4xl font-black text-primary tracking-tighter'>

                  {formatPrice(order?.amount || 0)}

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}


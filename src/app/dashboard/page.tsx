import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from '@/db'
import { formatPrice } from '@/lib/utils'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound } from 'next/navigation'
import StatusDropdown from './StatusDropdown'
import { Search, MapPin, Receipt, Phone } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CopyableOrderId } from './CopyableOrderId'
import { OrderDetailsDialog } from '@/components/OrderDetailsDialog'

const Page = async (props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  console.log("Current User Email:", user?.email)
console.log("Admin Email from Env:", process.env.ADMIN_EMAIL)
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL

  if (!user || user.email !== ADMIN_EMAIL) return notFound()

  const resolvedParams = await props.searchParams
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined
  const orderStatus = typeof resolvedParams.status === 'string' ? resolvedParams.status : undefined

  const orders = await db.order.findMany({
    where: {
      isPaid: true,
      ...(orderStatus ? { status: orderStatus as any } : {}),
      ...(search ? {
        OR: [
          { user: { email: { contains: search, mode: 'insensitive' } } },
          { shippingAddress: { name: { contains: search, mode: 'insensitive' } } },
          { shippingAddress: { address: { contains: search, mode: 'insensitive' } } },
          { id: { contains: search, mode: 'insensitive' } },
        ],
      } : {}),
      createdAt: {
        gte: new Date(new Date().setDate(new Date().getDate() - 7)),
      },
    },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      shippingAddress: true,
      configuration: true,
    },
  })

  const lastWeekSum = await db.order.aggregate({
    where: { isPaid: true, createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
    _sum: { amount: true },
  })

  const lastMonthSum = await db.order.aggregate({
    where: { isPaid: true, createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) } },
    _sum: { amount: true },
  })

  return (
    <div className='flex min-h-screen w-full bg-background font-sans text-foreground'>
      <div className='max-w-7xl w-full mx-auto flex flex-col sm:gap-10 py-12 px-4 sm:px-6 lg:px-8'>
        
        <div className='grid gap-6 sm:grid-cols-2'>
          <Card className='rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden relative'>
            <div className='absolute top-0 left-0 w-full h-1 bg-primary/20' />
            <CardHeader className='pb-2 pt-8 px-8'>
              <CardDescription className='font-black text-[20px] uppercase tracking-[0.2em] text-primary'>上週營收</CardDescription>
              <CardTitle className='text-4xl font-black tracking-tighter text-foreground'>{formatPrice(lastWeekSum._sum.amount ?? 0)}</CardTitle>
            </CardHeader>
            <CardFooter className='px-8 pb-8'>
              <Progress className='h-2 bg-muted [&>div]:bg-primary' value={((lastWeekSum._sum.amount ?? 0) * 100) / 50000} />
            </CardFooter>
          </Card>

          <Card className='rounded-[2.5rem] border-none shadow-sm bg-card overflow-hidden relative'>
            <div className='absolute top-0 left-0 w-full h-1 bg-primary' />
            <CardHeader className='pb-2 pt-8 px-8'>
              <CardDescription className='font-black text-[20px] uppercase tracking-[0.2em] text-primary'>本月營收</CardDescription>
              <CardTitle className='text-4xl font-black tracking-tighter text-foreground'>{formatPrice(lastMonthSum._sum.amount ?? 0)}</CardTitle>
            </CardHeader>
            <CardFooter className='px-8 pb-8'>
              <Progress className='h-2 bg-muted [&>div]:bg-primary' value={((lastMonthSum._sum.amount ?? 0) * 100) / 200000} />
            </CardFooter>
          </Card>
        </div>

        <div className='flex flex-col gap-8'>
          <div className='flex flex-col lg:flex-row lg:items-end justify-between mt-8 gap-6'>
            <div>
              <h1 className='text-4xl font-black tracking-tighter text-foreground'>
                Incoming Orders <span className='text-primary block sm:inline sm:ml-2'>新進訂單</span>
              </h1>
              <p className='text-muted-foreground font-bold mt-2'>管理最近 7 天內的訂單</p>
            </div>
            
            <div className='relative w-full lg:w-96'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary' />
              <form action="/dashboard" method="GET">
                <Input 
                  name="search"
                  placeholder="搜尋姓名、Email、地址或編號..." 
                  defaultValue={search}
                  className='pl-12 h-14 rounded-2xl border-none bg-card shadow-md focus-visible:ring-2 focus-visible:ring-primary text-foreground placeholder:text-muted-foreground'
                />
              </form>
            </div>
          </div>

          <div className='rounded-[2.5rem] bg-card border border-border shadow-xl overflow-visible'>
            <Table>
              <TableHeader className='bg-muted/50'>
                <TableRow className='hover:bg-transparent border-border'>
                  <TableHead className='py-6 px-8 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground'>收件資訊</TableHead>
                  <TableHead className='hidden xl:table-cell py-6 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground'>配送細節</TableHead>
                  <TableHead className='hidden md:table-cell py-6 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground'>發票 / 編號</TableHead>
                  <TableHead className='py-6 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground'>狀態與操作</TableHead>
                  <TableHead className='text-right py-6 px-8 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground'>金額</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='h-64 text-center'>
                      <div className='flex flex-col items-center gap-2'>
                        <Search className='h-8 w-8 text-muted' />
                        <p className='text-muted-foreground font-bold text-lg'>目前尚無訂單資料</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow 
                      key={order.id} 
                      className='relative border-border/50 hover:bg-primary/[0.04] transition-colors'
                    >
                      <TableCell className='py-8 px-8'>
                        <div className='font-black text-foreground text-lg tracking-tight'>
                          {order.shippingAddress?.name || "未填寫姓名"}
                        </div>
                        <div className='text-sm font-bold text-muted-foreground mt-1'>
                          {order.user?.email || "未知用戶"}
                        </div>
                        <div className='flex items-center gap-1 mt-2 text-primary'>
                          <Phone className='w-4 h-4' />
                          <span className='text-sm font-black'>{order.shippingAddress?.phoneNumber || "無電話"}</span>
                        </div>
                      </TableCell>

                      <TableCell className='hidden xl:table-cell min-w-[200px]'>
                        {order.shippingAddress ? (
                          <div className='flex items-start gap-2'>
                            <MapPin className='w-4 h-4 text-primary mt-0.5 shrink-0' />
                            <div className='text-sm font-bold text-muted-foreground leading-relaxed'>
                              {order.shippingAddress.postalCode} {order.shippingAddress.city}{order.shippingAddress.district}
                              <br />
                              {order.shippingAddress.address}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted text-sm italic">無配送資訊</span>
                        )}
                      </TableCell>

                      <TableCell className='hidden md:table-cell'>
                        <div className='space-y-2'>
                          <CopyableOrderId orderId={order.id} />
                          <div className='flex items-center gap-1.5 text-[12px] font-black text-muted-foreground uppercase'>
                            <Receipt className='w-4 h-4 text-primary' />
                            {order.invoiceType === "ELECTRONIC" ? "個人電子" : "公司三聯"}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className='align-top py-8'>
                        <div className='flex flex-col items-start gap-3 min-w-[150px]'>
                          <StatusDropdown id={order.id} orderStatus={order.status} />
                          <OrderDetailsDialog order={order} />
                        </div>
                      </TableCell>

                      <TableCell className='text-right px-8'>
                        <span className='font-black text-3xl tracking-tighter text-foreground block'>
                          {formatPrice(order.amount || 0)}
                        </span>
                        <span className='text-[12px] font-bold text-muted-foreground uppercase tracking-widest'>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('zh-TW') : "日期未知"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
import { OrderDetailsDialog } from "@/components/OrderDetailsDialog";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/db";
import { cn, formatPrice } from "@/lib/utils";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Eye, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    return redirect("/");
  }

  const orders = await db.order.findMany({
    where: {
      userId: user.id,
      isPaid: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      configuration: true,
      shippingAddress: true,
    },
  });

  return (
    <div className="flex min-h-screen w-full bg-background font-sans text-foreground">
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "-ml-2 text-muted-foreground hover:text-primary font-bold",
            )}
          >
            返回首頁
          </Link>
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">
            My Orders{" "}
            <span className="text-primary block sm:inline sm:ml-2">
              我的訂單
            </span>
          </h1>
          <p className="text-muted-foreground font-bold mt-2 text-lg">
            查看您的歷史訂單與配送進度
          </p>
        </div>

        <div className="rounded-[2.5rem] bg-card border border-border shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="py-8 px-8 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground">
                  購買日期
                </TableHead>
                <TableHead className="py-8 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground">
                  訂單編號
                </TableHead>
                <TableHead className="py-8 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground">
                  訂單狀態
                </TableHead>
                <TableHead className="text-right py-8 px-8 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground">
                  總額
                </TableHead>
                <TableHead className="text-right py-8 px-8 font-black uppercase text-[12px] tracking-[0.2em] text-muted-foreground">
                  訂單內容
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-80 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ShoppingBag className="h-12 w-12 text-muted" />
                      <p className="text-muted-foreground font-bold text-xl">
                        目前尚無任何訂單紀錄
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="border-border/50 hover:bg-primary/[0.04] transition-colors"
                  >
                    <TableCell className="py-8 px-8">
                      <div className="font-black text-foreground text-lg">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              "zh-TW",
                            )
                          : "---"}
                      </div>
                      <div className="text-xs font-bold text-muted-foreground mt-1 uppercase">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleTimeString(
                              "zh-TW",
                              {
                                timeZone: "Asia/Taipei",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              },
                            )
                          : ""}
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-sm text-muted-foreground uppercase tracking-wider font-bold">
                      {order.id.slice(0, 8)}
                    </TableCell>

                    <TableCell>
                      <span
                        className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest ${
                          order.status === "fulfilled"
                            ? "bg-green-100 text-green-700"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {order.status === "fulfilled"
                          ? "已完成"
                          : order.status === "shipped"
                            ? "已出貨"
                            : "處理中"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right px-8 font-black text-2xl tracking-tighter text-foreground">
                      {formatPrice(order.amount || 0)}
                    </TableCell>

                    <TableCell className="text-right px-8">
                      <OrderDetailsDialog order={order}>
                        <Eye className="h-5 w-5" />
                      </OrderDetailsDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;

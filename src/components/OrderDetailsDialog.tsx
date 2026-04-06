"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderSummary } from "./OrderSummary";
import { Button } from "@/components/ui/button";

export const OrderDetailsDialog = ({ order }: { order: any }) => {
  if (!order?.id || !order?.configuration) return null;

  const displayId = String(order.id).slice(0, 8).toUpperCase();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-10 px-6 rounded-full text-primary font-black text-xs tracking-[0.15em] uppercase transition-all duration-300 hover:bg-primary/10 hover:text-primary active:scale-95"
        >
          訂單詳情
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto p-0 border-none bg-background shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] focus:outline-none">
        <div className="relative p-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-2xl font-black tracking-tight text-foreground">
              訂單詳情 <span className="text-primary">Order Details</span>
              <span className="ml-2 text-xs font-bold text-muted-foreground">#{displayId}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-2">
            <OrderSummary order={order} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
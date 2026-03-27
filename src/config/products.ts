export const BASE_PRICE = 0

export const PRODUCT_PRICES = {
  boxSet: {
    snack: 880,
    produce: 1580,
    bath: 1280,
    kitchen: 2100,
    premium: 2280,
    healing: 2800,
    outdoor: 3800,
    ultimate: 5500,
  },
  finish: {
    standard: 0,           
    recycled: 100, 
    linen: 150,    
  },
  decoration: {
    twine: 15,
    wax_seal: 30,
    botanical: 45,
  },
} as const
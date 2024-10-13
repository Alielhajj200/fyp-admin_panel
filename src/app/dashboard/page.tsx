'use client'
import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { fetchData, ProductOptions } from "@/utils/fetchData";
import { useEffect, useState } from "react";
const TOKEN_KEY = 'abcd123';
interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | ArrayBuffer; // Use ArrayBuffer for base64 image data
  quantity: number;
  category: string;
}
interface Order {
  _id: string;
  userId: string;
  items: Array<any>; // Replace `any` with the specific type of items if known
  address: string;
  status: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  __v: number;
}

export default function Page(): React.JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const tokenResponse = localStorage.getItem(TOKEN_KEY);
        if (!tokenResponse) {
          console.error('Token not found in localStorage.');
          return;
        }
        
        const productData: Product[] = await fetchData('http://192.168.56.1:3007/fyp/store/products', ProductOptions(tokenResponse));
        const orderData: Order[] = await fetchData('http://192.168.56.1:3007/fyp/store/admin/orders', ProductOptions(tokenResponse));
        setOrders(orderData);
        setLoading(false); 
        if (productData) {
          const decodedItems = productData.map((item: any) => ({
            ...item,
            imageUrl: `data:image/jpeg;base64,${item.imageUrl}`, // Assuming the image is JPEG format
          }));
          setProducts(decodedItems);
          console.log(products)
          
        }
        
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  return (
    <Grid container spacing={3}>
      
      <Grid lg={6} sm={6} xs={6}>
  <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="0" />
</Grid>

<Grid lg={6} sm={6} xs={6}>
  <TotalProfit sx={{ height: '100%' }} value="$0" />
</Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={products}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={orders}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}

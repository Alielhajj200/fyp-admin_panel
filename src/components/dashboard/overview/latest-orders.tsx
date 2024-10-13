import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
const TOKEN_KEY = 'abcd123';
const statusMap = {
  pending: { label: 'Pending', color: 'warning' },
  delivered: { label: 'Delivered', color: 'success' },
  refunded: { label: 'Refunded', color: 'error' },
} as const;
interface Order {
  _id: string;
  userId: string;
  items: Array<any>; // Replace `any` with the specific type of items if known
  address: string;
  status: string | any;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  __v: number;
}

export interface LatestOrdersProps {
  orders?: Order[];
  sx?: SxProps;
}

export function LatestOrders({ orders = [],  sx }: LatestOrdersProps): React.JSX.Element {
  const handleStatusClick = async (orderId: string) => {
    try {
      const tokenResponse = localStorage.getItem(TOKEN_KEY);
    
      if (!tokenResponse) {
        console.error('No token found in localStorage');
        return;
      }else{
        console.log(tokenResponse)
      }
    
      const response = await fetch(`http://192.168.56.1:3007/fyp/store/order/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenResponse}`,
        },
      });
    
      if (response.ok) {
        console.log('Order status updated to delivered.');
        // Optionally, you can refresh the orders list or update the UI state here
      } else {
        const errorText = await response.text(); // You can also try to parse the JSON if needed
        console.error(`Failed to update order status: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
    
  };

  return (
    <Card sx={sx}>
      <CardHeader title="Latest orders" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell sortDirection="desc">Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const { label, color } = statusMap[order.status] ?? { label: 'Unknown', color: 'default' };

              return (
                <TableRow hover key={order._id}>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Chip
                      color={color}
                      label={label}
                      size="small"
                      onClick={() => handleStatusClick(order._id)}
                      style={{ cursor: 'pointer' }} // Adds a pointer cursor to indicate it's clickable
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button
          color="inherit"
          endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
          size="small"
          variant="text"
        >
          View all
        </Button>
      </CardActions>
    </Card>
  );
}

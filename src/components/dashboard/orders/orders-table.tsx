'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import Chip from '@mui/material/Chip';
import { useSelection } from '@/hooks/use-selection';
import { Button } from '@mui/material';

function noop(): void {
  // do nothing
}

export interface Order {
  _id: string;
  userId: string;
  items: Array<any>; // Replace `any` with the specific type of items if known
  address: string;
  status: string | any;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  __v: number;
}
interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Product[];
  rowsPerPage?: number;
}

export function OrdersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer._id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const statusMap = {
    pending: { label: 'Pending', color: 'warning' },
    delivered: { label: 'Delivered', color: 'success' },
    refunded: { label: 'Refunded', color: 'error' },
  } as const;
  const TOKEN_KEY = 'abcd123';
  const deleteProduct = async (id: string) => {
    try {
      const tokenResponse = localStorage.getItem(TOKEN_KEY);
      if (!tokenResponse) {
        console.error('Token not found in localStorage.');
        return;
      }
      const response = await fetch(`http://localhost:3007/fyp/store/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenResponse}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
  
      alert('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

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
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              
              <TableCell>Customer Id</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              
             
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
               const { label, color } = statusMap[row.status] ?? { label: 'Unknown', color: 'default' };
              const isSelected = selected?.has(row._id);

              return (
                <TableRow hover key={row._id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row._id);
                        } else {
                          deselectOne(row._id);
                        }
                      }}
                    />
                  </TableCell>
                 
                  <TableCell>{row.userId}</TableCell>
                  
                  <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell>
                    <Chip
                      color={color}
                      label={label}
                      size="small"
                      onClick={() => handleStatusClick(row._id)}
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
      
    </Card>
  );
}

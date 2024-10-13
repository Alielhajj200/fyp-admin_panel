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

import { useSelection } from '@/hooks/use-selection';
import { Button } from '@mui/material';

function noop(): void {
  // do nothing
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | ArrayBuffer; // Use ArrayBuffer for base64 image data
  quantity: number;
  category: string;
}
interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Product[];
  rowsPerPage?: number;
}
 
export function CustomersTable({
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

  const TOKEN_KEY = 'abcd123';
  const deleteCategory = async (id: string) => {
    try {
      const tokenResponse = localStorage.getItem(TOKEN_KEY);
      if (!tokenResponse) {
        console.error('Token not found in localStorage.');
        return;
      }
      const response = await fetch(`http://localhost:3007/fyp/store/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenResponse}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete category');
      }
  
      alert('Category deleted successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
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
              
              <TableCell>Id</TableCell>
              <TableCell>name</TableCell>
              <TableCell>Action</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
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
                  <TableCell>
                    <TableBody>{row._id}</TableBody>
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  
                 
                  <Button sx={{backgroundColor:'red' ,color:'white',margin:1}} onClick={() => deleteCategory(row._id)}>
                    <Typography>Delete</Typography>
                    </Button>
                    

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

'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import TablePagination from '@mui/material/TablePagination';

import { config } from '@/config';
import { WorkoutsFilter } from '@/components/dashboard/workouts/workouts-filters';
import { WorkoutsTable } from '@/components/dashboard/workouts/workouts-table';
import type { Customer } from '@/components/dashboard/products/products-table';
import { fetchData, CustomerOptions } from '@/utils/fetchData';

export default function Page(): React.ReactElement {
  const [product, setproduct] = useState<Customer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchproduct = async () => {
      let CustomerData: Customer[] = [];

      try {
        CustomerData = await fetchData(
          'http://192.168.56.1:3007/fyp/workout',
          CustomerOptions('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY2NDU5ZjhkYTg0YmMwNTEyYTVmYmQyNiIsImVtYWlsIjoiYWZ0ZXJAZ21haWwuY29tIiwicm9sZSI6WyJhZG1pbiJdLCJhZ2UiOjEyLCJnZW5kZXIiOiJtYWxlIiwid2VpZ2h0Ijo3MCwiaGVpZ2h0IjoxNzcsImFjdGl2aXR5TGV2ZWwiOiJBY3RpdmUiLCJnb2FsIjoiR2FpbndlaWdodCIsImJtaSI6MjIuMzQzNTE1NTkyNTgxOTUsImJvZHlUeXBlIjoiaWRlYWwiLCJfX3YiOjB9LCJpYXQiOjE3MjA5NDQ0MDQsImV4cCI6MTc1MjQ4MDQwNH0._WTc8CvRR3Y_Ydgr2ub8dOWC9TyO5TG_BYSOWyNr2-0')
        );

        setproduct(CustomerData);
        console.log(CustomerData);
      } catch (error) {
        setError('Failed to fetch customer data.');
        console.error('Error fetching data:', error);
      }
    };

    fetchproduct();
  }, []);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const paginatedproduct = applyPagination(product, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Workouts</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <br></br>
            <br></br>
          </Stack>
        </Stack>
        <div>
          <Button href='http://localhost:3000/dashboard/createworkout' startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <WorkoutsFilter />
      <WorkoutsTable
        count={product.length}
        page={page}
        rows={paginatedproduct}
        rowsPerPage={rowsPerPage}
      />
      <TablePagination
        component="div"
        count={product.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

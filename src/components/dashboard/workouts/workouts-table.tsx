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

export interface Exercise {
  _id: string;           
  bodyPart: string;      
  equipment: string;      
  gifUrl: string | null;  
  id: string;            
  name: string;         
  target: string;      
  secondaryMuscles: string[];
  instructions: string[];
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Exercise[];
  rowsPerPage?: number;
}

export function WorkoutsTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;


  const TOKEN_KEY = 'abcd123';
  const deleteWorkout = async (name: string) => {
    try {
      const tokenResponse = localStorage.getItem(TOKEN_KEY);
      if (!tokenResponse) {
        console.error('Token not found in localStorage.');
        return;
      }
      const response = await fetch(`http://localhost:3007/fyp/workout/${name}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${tokenResponse}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete workout');
      }
  
      alert('Workout deleted successfully');
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Error deleting workout');
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
              
              <TableCell>image</TableCell>
              <TableCell>BodyPart</TableCell>
              <TableCell>Equipment</TableCell>
              <TableCell>name</TableCell>
              <TableCell>target</TableCell>
              <TableCell>Action</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                 
                  
                    {row.gifUrl ? (
      <Box
        component="img"
        src={row.gifUrl} 
        sx={{ borderRadius: 1, height: '48px', width: '48px' }}
      />
    ) : (
      <Box
        sx={{
          borderRadius: 1,
          backgroundColor: 'var(--mui-palette-neutral-200)',
          height: '48px',
          width: '48px',
        }}
      />
    )}
                    </Stack>
                  </TableCell>
                  <TableCell>{row.bodyPart}</TableCell>
                  
                  <TableCell>{row.equipment}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.target}</TableCell>
                  <Button sx={{backgroundColor:'red' ,color:'white',margin:1}} onClick={() => deleteWorkout(row.name)}>
                    <Typography>Delete</Typography>
                    </Button>

                    <Button
  sx={{ backgroundColor: 'red', color: 'white', margin: 1 }}
  onClick={() => {
    window.location.href = `/dashboard/updateworkout?id=${row.name}`;
  }}
>
  <Typography>Edit</Typography>
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

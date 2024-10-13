import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

import { config } from '@/config';
import { CreateCategoryForm } from '@/components/dashboard/createcategory/add-category-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';

export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Create Category</Typography>
      </div>
      <Grid container spacing={3}>
        
        <Grid lg={8} md={6} xs={12}>
          <CreateCategoryForm />
        </Grid>
      </Grid>
    </Stack>
  );
}

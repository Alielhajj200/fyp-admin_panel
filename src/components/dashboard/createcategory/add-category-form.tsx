'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Unstable_Grid2';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { fetchData, ProductOptions } from '@/utils/fetchData';

export function CreateCategoryForm(): React.JSX.Element {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [category, setCategory] = useState<string>('');
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);

  const TOKEN_KEY = 'abcd123';

  interface Categories {
    _id: string;
    name: string;
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const tokenResponse = localStorage.getItem(TOKEN_KEY);
        if (!tokenResponse) {
          console.error('Token not found in localStorage.');
          return;
        }

        const categoriesData: Categories[] = await fetchData(
          'http://192.168.56.1:3007/fyp/store/categories',
          ProductOptions(tokenResponse)
        );
        setCategories(categoriesData);
        setLoading(false);

      } catch (error) {
        console.error('Error fetching initial data:', error);
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name ) {
      setMessage("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    const data = {
      name,
    };
    try {
      const tokenResponse = localStorage.getItem(TOKEN_KEY);
      if (!tokenResponse) {
        console.error('Token not found in localStorage.');
        return;
      }

      const response = await fetch('http://192.168.56.1:3007/fyp/store/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${tokenResponse}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      setSuccessMessage('Category created successfully.');
      setMessage("");
      // Optionally, reset the form here
    } catch (error) {
      setMessage(`Error creating category: ${error.message}`);
      setSuccessMessage("");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Create Category" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  label="Name"
                  name="name"
                  type="text"
                />
              </FormControl>
            </Grid>
            
            
            
           
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">Create Category</Button>
        </CardActions>
      </Card>
      {message && <p className="text-red-500 mt-3">{message}</p>}
      {successMessage && <p className="text-green-500 mt-3">{successMessage}</p>}
    </form>
  );
}

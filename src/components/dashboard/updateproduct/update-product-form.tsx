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
import { useSearchParams } from 'next/navigation';
export function UpdateProductForm(): React.JSX.Element {
  //const [image, setImage] = useState<File | null>(null);
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
  
    if (!name || !description || price === undefined || quantity === undefined || !category) {
      setMessage("All fields are required.");
      return;
    }
  
    // Ensure price and quantity are numbers
    const data = {
      name,
      description,
      price: parseFloat(price.toString()),
      quantity: parseInt(quantity.toString(), 10),
      category
    };
  
    try {
      const tokenResponse = localStorage.getItem(TOKEN_KEY);
      if (!tokenResponse) {
        console.error('Token not found in localStorage.');
        return;
      }
  
      const response = await fetch(`http://192.168.56.1:3007/fyp/store/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${tokenResponse}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Stringify the data object
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Get error details from response
        throw new Error(`Network response was not ok: ${errorText}`);
      }
  
      const result = await response.json();
      setSuccessMessage('Product updated successfully.');
      setMessage("");
      // Optionally, reset the form here
    } catch (error) {
      setMessage(`Error updating product: ${error.message}`);
      setSuccessMessage("");
    }
  };
  
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Update Product" />
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
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Description</InputLabel>
                <OutlinedInput
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  label="Description"
                  name="description"
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Price</InputLabel>
                <OutlinedInput
                  value={price}
                  onChange={(e) => setPrice(e.target.value as number)}
                  label="Price"
                  name="price"
                  type="number"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Quantity</InputLabel>
                <OutlinedInput
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value as number)}
                  label="Quantity"
                  name="quantity"
                  type="number"
                />
              </FormControl>
            </Grid>
           
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as string)}
                  label="Category"
                  name="category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">Update Product</Button>
        </CardActions>
      </Card>
      {message && <p className="text-red-500 mt-3">{message}</p>}
      {successMessage && <p className="text-green-500 mt-3">{successMessage}</p>}
    </form>
  );
}

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

export function CreateWorkoutform(): React.JSX.Element {
  const [image, setImage] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
 const [secondaryMuscles, setSecondaryMuscles] = useState<string[]>([]);
const [instructions, setInstructions] = useState<string[]>([]);

  const [bodyParts, setBodyParts] = useState<string>('');
  const [equipments, setEquipments] = useState<string>('');
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [categories, setCategories] = useState<Categories[]>([]);
  const [allequipment, setallequipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [id, setid] = useState<string>('12');
  const TOKEN_KEY = 'abcd123';

  interface Categories {
    _id: string;
    name: string;
  }

  interface Equipment {
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
          'http://192.168.56.1:3007/fyp/workout/allbodyparts',
          ProductOptions(tokenResponse)
        );
        setCategories(categoriesData);
        setLoading(false);

        const equipmentsData: Equipment[] = await fetchData(
          'http://192.168.56.1:3007/fyp/workout/allequipment',
          ProductOptions(tokenResponse)
        );
        setallequipment(equipmentsData);
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

    if (!name || !target || !secondaryMuscles || !instructions || !bodyParts || !equipments.length || !image) {
      setMessage("All fields are required.");
      return;
    }

    // Log the fields before submitting
    

    const formData = new FormData();
formData.append('name', name);
formData.append('target', target);
secondaryMuscles.forEach(muscle => formData.append('secondaryMuscles[]', muscle));
instructions.forEach(instruction => formData.append('instructions[]', instruction));
formData.append('bodyPart', bodyParts);
formData.append('equipment', equipments);
formData.append('id', id);
if (image) {
  formData.append('image', image);
}
console.log(formData)
    try {
      const tokenResponse = localStorage.getItem(TOKEN_KEY);
      if (!tokenResponse) {
        console.error('Token not found in localStorage.');
        return;
      }

      const response = await fetch('http://192.168.56.1:3007/fyp/workout/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenResponse}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const result = await response.json();
      setSuccessMessage('Workout created successfully.');
      setMessage("");
    } catch (error) {
      setMessage(`Error creating workout: ${error.message}`);
      setSuccessMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Create Workout" />
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
                <InputLabel>Target</InputLabel>
                <OutlinedInput
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  label="Target"
                  name="target"
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Secondary Muscles</InputLabel>
                <OutlinedInput
                  value={secondaryMuscles.join(", ")}
                   onChange={(e) => setSecondaryMuscles(e.target.value.split(",").map(muscle => muscle.trim()))}
                  label="Secondary Muscles"
                  name="secondaryMuscles"
                  type="text"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Body Parts</InputLabel>
                <Select
                  value={bodyParts}
                  onChange={(e) => setBodyParts(e.target.value as string)}
                  label="Body Parts"
                  name="bodyParts"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Equipments</InputLabel>
                <Select
                  value={equipments}
                  onChange={(e) => setEquipments(e.target.value as string)}
                  label="Equipments"
                  name="equipments"
                >
                  {allequipment.map((eq) => (
                    <MenuItem key={eq} value={eq}>
                      {eq}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <OutlinedInput
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setImage(e.target.files[0]);
                    }
                  }}
                  label="Image"
                  name="image"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Instructions</InputLabel>
                <OutlinedInput
                  value={instructions.join(". ")}
                 onChange={(e) => setInstructions(e.target.value.split(".").map(inst => inst.trim()))}
                  label="Instructions"
                  name="instructions"
                  multiline
                  minRows={5}  // Create a bigger text area
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">Create Workout</Button>
        </CardActions>
      </Card>
      {message && <p className="text-red-500 mt-3">{message}</p>}
      {successMessage && <p className="text-green-500 mt-3">{successMessage}</p>}
    </form>
  );
}

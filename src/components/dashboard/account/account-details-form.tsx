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
import { useAuth } from '@/app/context/AuthContext';

export function AccountDetailsForm(): React.JSX.Element {
  const { onCheckRegister, onRegister } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [userCreated, setUserCreated] = useState(false); // Track if user is created
  const TOKEN_KEY = 'abcd123';

  const updateUserRole = async (email: string, roles: string[]) => {
    try {
      const tokenResponse = localStorage.getItem(TOKEN_KEY);
      if (!tokenResponse) {
        console.error('Token not found in localStorage.');
        return;
      }

      const response = await fetch(`http://192.168.56.1:3007/fyp/users/role/${email}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${tokenResponse}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roles)
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      alert('Dietition is created');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    if (password === confirmPassword) {
      if (password.length >= 8) {
        try {
          const result = await onCheckRegister(email, password);
          console.log(result);

          if (result.available === true) {
            sessionStorage.setItem('email', email);
            sessionStorage.setItem('password', password);
            const result = await onRegister(email, password, "null", "null", "null", 0, 0, 0, "null", 0);

            setSuccessMessage("User Created successfully!");
            setUserCreated(true); // Mark user as created
          } else {
            setMessage("Email already exists! Try another one.");
          }
        } catch (error) {
          console.error("Registration error:", error);
          setMessage("Registration failed. Please try again later.");
        }

      } else {
        setMessage("Password should be 8 characters or more!");
      }
    } else {
      setMessage("Passwords do not match.");
    }
  };

  useEffect(() => {
    if (userCreated) {
      const updateRole = async () => {
        await updateUserRole(email, ["dietition"]);
      };

      updateRole();
      // Reset userCreated state if necessary, or keep it as needed
    }
  }, [userCreated, email]); // Dependency array to re-run effect when userCreated or email changes

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email</InputLabel>
                <OutlinedInput
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  label="Email"
                  name="email"
                  type="email"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  name="password"
                  type="password"
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Confirm Password</InputLabel>
                <OutlinedInput
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">Save details</Button>
        </CardActions>
      </Card>
      {message && <p className="text-red-500 mt-3">{message}</p>}
      {successMessage && <p className="text-green-500 mt-3">{successMessage}</p>}
    </form>
  );
}

export const exerciseOptions = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      'X-RapidAPI-Key': '6599a0a052msh59d6a42bd08a51ap1e8084jsn372c5cbca2a4',
    },
  };
  
  export const CustomerOptions = (token: string) => ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  export const ProductOptions = (token: string) => ({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
  });
  
  export const fetchData = async (url:string, options:any) => {
    const res = await fetch(url, options);
    const data = await res.json();
  
    return data;
  };
  
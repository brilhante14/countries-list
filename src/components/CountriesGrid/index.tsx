import { Box, Card, CardMedia, CircularProgress, Typography } from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/axios";

export interface ICountryInfo {
   capital: string[];
   name: {
      common: string;
      official: string;
      nativeName: {
         [abbr: string]: {
            official: string;
            common: string;
         };
      };
   };
   currencies: {
      [abbr: string]: {
         name: string;
         symbol: string;
      }
   }
   region: string;
   subregion: string;
   languages: {
      [abbr: string]: string;
   };
   population: number;
   continents: string[];
   flags: {
      png: string;
      svg: string;
      alt: string;
   };
}

export function CountriesGrid() {
   const navigate = useNavigate();

   const [countriesList, setCountriesList] = useState<ICountryInfo[]>([]);

   useEffect(() => {
      (async () => {
         const { data } = await api.get("/all");

         setCountriesList(data);
      })()
   }, []);

   async function handleCardClick(countryName: string) {
      navigate(`/country/${countryName}`);
   }

   if (!countriesList.length) {
      return (
         <Box height="100vh" display="flex" justifyContent="center" alignItems="center" >
            <CircularProgress color="info" />
         </Box >
      );
   }

   return (
      <Grid container spacing={2}>
         {countriesList.map((country, index) => (
            <Grid
               key={index}
               item
               xs={3}
            >
               <Card
                  variant="elevation"
               >
                  <CardActionArea onClick={() => handleCardClick(country.name.official)}>
                     <CardMedia
                        sx={{ height: 200 }}
                        image={country.flags.svg}
                        title={country.flags.alt}
                     />
                     <CardContent>
                        <Typography gutterBottom variant="h6">
                           {country.name.common}
                           <Typography variant="body2" color="text.secondary">
                              {country.capital ?? "-"}
                           </Typography>
                        </Typography>
                     </CardContent>
                  </CardActionArea>
               </Card>
            </Grid>
         ))}
      </Grid>
   );
}
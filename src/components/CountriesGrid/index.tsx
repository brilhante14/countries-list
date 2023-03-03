import FavoriteIcon from '@mui/icons-material/Favorite';
import { Alert, Box, Card, CardMedia, CircularProgress, IconButton, Link, Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { AxiosError } from "axios";
import { memo, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
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
   cca3: string;
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
   favorited: boolean;
}

interface ICountriesGridProps {
   countrySearch: string;
}

function CountriesGrid({ countrySearch }: ICountriesGridProps) {
   const [countriesList, setCountriesList] = useState<ICountryInfo[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      (async () => {
         try {
            setIsLoading(true);

            const searchUrl = countrySearch ? `/name/${countrySearch}` : "/all";

            const { data } = await api.get(searchUrl);

            const result = data.map((country: ICountryInfo) => {
               return {
                  ...country,
                  favorited: false,
               }
            });

            setCountriesList(result);
         } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
               setCountriesList([]);
            }
         } finally {
            setIsLoading(false);
         }
      })()

   }, [countrySearch]);

   function handleClickFavorite() {

   }

   if (isLoading) {
      return (
         <Box height="100vh" display="flex" justifyContent="center" alignItems="center" >
            <CircularProgress color="info" />
         </Box >
      );
   }

   if (!countriesList.length) {
      return (
         <Box height="100vh" display="flex" justifyContent="center" alignItems="center" >
            <Alert severity="error">Oops! Nenhum país foi encontrado para essa busca.</Alert>
         </Box >
      );
   }

   return (
      <Grid container spacing={2} paddingBottom={2}>
         {countriesList.map((country, index) => (
            <Grid
               key={index}
               item
               xs={3}
            >
               <Card variant="elevation" >
                  <CardMedia
                     sx={{ height: 200 }}
                     image={country.flags.svg}
                     title={country.flags.alt}

                  />
                  <CardContent>
                     <Box display="flex" justifyContent="space-between">
                        <Link
                           component={RouterLink}
                           gutterBottom
                           variant="h6"
                           to={`/country/${country.cca3}`}
                           underline="hover"
                           color="inherit"
                        >
                           {country.name.common}
                           <Typography variant="body2" color="text.secondary">
                              {country.capital ?? "-"}
                           </Typography>
                        </Link>
                        <IconButton onClick={() => { console.log("Favorited") }}>
                           <FavoriteIcon />
                        </IconButton>
                     </Box>
                  </CardContent>
               </Card>
            </Grid>
         ))}
      </Grid>
   );
}

export default memo(CountriesGrid);
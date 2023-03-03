import { Alert, Box, Card, CardMedia, CircularProgress, Typography } from "@mui/material";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { AxiosError } from "axios";
import { memo, useEffect, useState } from "react";
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

interface ICountriesGridProps {
   countrySearch: string;
}

function CountriesGrid({ countrySearch }: ICountriesGridProps) {
   const navigate = useNavigate();

   const [countriesList, setCountriesList] = useState<ICountryInfo[]>([]);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      (async () => {
         try {
            setIsLoading(true);

            const searchUrl = countrySearch ? `/name/${countrySearch}` : "/all";

            const { data } = await api.get(searchUrl);

            setCountriesList(data);
         } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
               setCountriesList([]);
            }
         } finally {
            setIsLoading(false);
         }
      })()

   }, [countrySearch]);

   async function handleCardClick(countryName: string) {
      navigate(`/country/${countryName}`);
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

export default memo(CountriesGrid);
import { Alert, Box, Card, CardMedia, IconButton, Link, Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { AxiosError } from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../../api/axios";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { Loading } from "../Loading";

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
   const [isLoading, setIsLoading] = useState(true);

   const [countriesList, setCountriesList] = useState<ICountryInfo[]>([]);
   const [countriesRendered, setCountriesRendered] = useState<ICountryInfo[]>([]);

   useEffect(() => {
      (async () => {
         try {
            setIsLoading(true);

            const storage = localStorage.getItem("favorite");
            const favorited: string[] = storage ? JSON.parse(storage) : [];

            const searchUrl = countrySearch ? `/name/${countrySearch}` : "/all";

            const { data } = await api.get(searchUrl);

            const result = data.map((country: ICountryInfo) => {
               return {
                  ...country,
                  favorited: favorited.includes(country.cca3),
               }
            });

            setCountriesRendered(result.slice(0, 16));
            setCountriesList(result);
         } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
               setCountriesList([]);
               setCountriesRendered([]);
            }
         } finally {
            setIsLoading(false);
         }
      })()

   }, [countrySearch]);

   const hasMore = countriesList.length > countriesRendered.length;

   const observer = useRef<IntersectionObserver>();

   const lastCountryElementRef = useCallback((node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
         if (entries[0].isIntersecting && hasMore) {
            setCountriesRendered(prevState =>
               [...countriesList.slice(0, prevState.length + 16)]
            )
         }
      });

      if (node) observer.current.observe(node);
   }, [isLoading, hasMore]);

   function handleClickFavorite(countryCode: string, isFavorite: boolean) {
      const storage = localStorage.getItem("favorite");
      let favorited: string[] = storage ? JSON.parse(storage) : [];

      if (isFavorite) {
         favorited = favorited.filter(code => code !== countryCode);
      } else {
         favorited.push(countryCode);
      }

      localStorage.setItem("favorite", JSON.stringify(favorited));

      setCountriesList(prevState => prevState.map(c => {
         return c.cca3 === countryCode ? { ...c, favorited: !isFavorite } : c
      }));
      setCountriesRendered(prevState => prevState.map(c => {
         return c.cca3 === countryCode ? { ...c, favorited: !isFavorite } : c
      }));
   }

   if (isLoading) {
      return <Loading />
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
         {countriesRendered.map((country, index) => {
            const isLastElement = countriesRendered.length === index + 1;
            return (
               <Grid
                  key={index}
                  item
                  xs={3}
                  ref={isLastElement ? lastCountryElementRef : null}
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
                           <IconButton onClick={() => handleClickFavorite(country.cca3, country.favorited)}>
                              {country.favorited ?
                                 <FavoriteIcon color="error" />
                                 :
                                 <FavoriteBorderRoundedIcon />
                              }
                           </IconButton>
                        </Box>
                     </CardContent>
                  </Card>
               </Grid>
            )
         }
         )}
      </Grid>
   );
}

export default memo(CountriesGrid);
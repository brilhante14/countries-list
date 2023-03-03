import { Alert, Box, Card, CardActionArea, CardMedia, IconButton, Link, Typography } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import { AxiosError } from "axios";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../../api/axios";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import { ICountryInfo } from "../../interfaces/country";
import { Loading } from "../Loading";

interface ICountriesGridProps {
   countrySearch: string;
   filteringFavorites: boolean;
}

function CountriesGrid({ countrySearch, filteringFavorites }: ICountriesGridProps) {
   const [isLoading, setIsLoading] = useState(true);

   const [countriesList, setCountriesList] = useState<ICountryInfo[]>([]);
   const [renderLimit, setRenderLimit] = useState(16);

   const favoritedCountries = countriesList.filter(c => filteringFavorites ? c.favorited : c);

   useEffect(() => {
      const fetchData = setTimeout(async () => {
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

            setCountriesList(result);
         } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
               setCountriesList([]);
            }
         } finally {
            setIsLoading(false);
         }
      }, 500);

      return () => clearTimeout(fetchData)
   }, [countrySearch]);

   const hasMore = countriesList.length > renderLimit;

   const observer = useRef<IntersectionObserver>();

   const lastCountryElementRef = useCallback((node: HTMLDivElement) => {
      if (isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
         if (entries[0].isIntersecting && hasMore) {
            setRenderLimit(prevState => prevState + 16);
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
   }

   if (isLoading) {
      return <Loading />
   }

   if (!countriesList.length) {
      return (
         <Box height="100vh" display="flex" justifyContent="center" alignItems="center" >
            <Alert severity="error">Oops! No country was found for this search on our database.</Alert>
         </Box >
      );
   }

   return (
      <Grid container spacing={{ xs: 2, md: 3, sm: 1 }} columns={{ xs: 4, sm: 8, md: 12 }} paddingBottom={2}>
         {favoritedCountries.slice(0, renderLimit).map((country, index) => {
            const isLastElement = favoritedCountries.slice(0, renderLimit).length === index + 1;

            return (
               <Grid
                  key={index}
                  item
                  xs={3}
                  ref={isLastElement ? lastCountryElementRef : null}
               >
                  <Card variant="elevation" >
                     <CardActionArea >
                        <Link component={RouterLink} to={`/country/${country.cca3}`}>
                           <CardMedia
                              sx={{ height: 200 }}
                              image={country.flags.svg}
                              title={country.flags.alt}
                           />
                        </Link>
                     </CardActionArea>
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
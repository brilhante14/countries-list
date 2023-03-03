import { Box, Breadcrumbs, Container, Typography, CircularProgress, Paper, Card, CardHeader, CardMedia } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../api/axios";
import { ICountryInfo } from "../../components/CountriesGrid";

export function CountryInfo() {
   let { countryName } = useParams();

   const [countryInfo, setCountryInfo] = useState<ICountryInfo>();

   useEffect(() => {
      (async () => {
         const { data } = await api.get(`/name/${countryName}`);

         setCountryInfo(data[0]);
      })()
   }, [countryName]);

   if (!countryInfo) {
      return (
         <Box height="100vh" display="flex" justifyContent="center" alignItems="center" >
            <CircularProgress color="info" />
         </Box >
      );
   }

   return (
      <Container sx={{ backgroundColor: "#A9A9B2", padding: "1rem", borderRadius: "8px" }}>
         <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Link color="#FFF" to="/">
               <Typography fontWeight={500}>Home</Typography>
            </Link>
            <Typography>{countryInfo.name.official}</Typography>
         </Breadcrumbs>
         <Box display="flex" gap={5} alignItems="center" mt={2}>
            <Card sx={{ padding: "1rem", background: "#A9A9B2", borderRadius: 4 }}>
               <CardHeader title={countryInfo.name.common} subheader={countryInfo.capital} sx={{}} />
               <CardMedia
                  sx={{ width: 280, height: 200 }}
                  image={countryInfo.flags.svg}
                  title={countryInfo.flags.alt}
               />
            </Card>
            <Box height={300} borderRadius={4} width={625} padding="1rem" boxShadow="0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12);">
               <Typography>
                  Região: {countryInfo.region}
               </Typography>

               <Typography>
                  Subregião: {countryInfo.subregion}
               </Typography>

               <Typography>
                  Moeda: {Object.values(countryInfo.currencies).map(value => value.name)}
               </Typography>

               <Typography>
                  População: {countryInfo.population}
               </Typography>

               <Typography>
                  Linguagens: {Object.values(countryInfo.languages)}
               </Typography>
            </Box>
         </Box>
      </Container>
   );
}
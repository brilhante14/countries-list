import { Box, Breadcrumbs, Container, Typography, Link as muiLink, CircularProgress } from "@mui/material";
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
      <Container>
         <Breadcrumbs separator=">" sx={{ color: "#FFF" }} aria-label="breadcrumb">
            <Link to="/">
               Home
            </Link>
            <Typography>{countryInfo.name.official}</Typography>
         </Breadcrumbs>
         <Box>
            {countryInfo.name.common}
         </Box>
      </Container>
   );
}
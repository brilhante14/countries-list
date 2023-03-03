import SearchIcon from '@mui/icons-material/Search';
import { Container, FormControlLabel, InputAdornment, Switch, TextField } from "@mui/material";
import { useState } from "react";
import CountriesGrid from "../../components/CountriesGrid";

export function Home() {
   const [textValue, setTextValue] = useState("");
   const [filteringFavorites, setFilteringFavorites] = useState(false);

   function handleFilterForFavorite() {
      setFilteringFavorites(prevState => !prevState);
   }

   return (
      <Container sx={{ color: "#FFF" }}>
         <TextField
            id="searchBar"
            placeholder="Search for a country"
            value={textValue}
            variant="outlined"
            fullWidth
            sx={{ borderRadius: 2, margin: "1rem 0", backgroundColor: "#FFF" }}
            onChange={(e) => setTextValue(e.target.value)}
            InputProps={{
               endAdornment: (
                  <InputAdornment position="end">
                     <SearchIcon />
                  </InputAdornment>
               ),
            }}
         />

         <FormControlLabel
            control={
               <Switch
                  color='success'
                  checked={filteringFavorites}
                  onChange={handleFilterForFavorite}
                  inputProps={{ 'aria-label': 'controlled' }}
               />
            }
            label="Filter favorites"
            labelPlacement='start'
            sx={{
               marginBottom: "1rem"
            }}
         />

         <CountriesGrid countrySearch={textValue} filteringFavorites={filteringFavorites} />
      </Container>
   );
}
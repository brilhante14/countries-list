import SearchIcon from '@mui/icons-material/Search';
import { Container, IconButton, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import CountriesGrid from "../../components/CountriesGrid";

export function Home() {
   const [textValue, setTextValue] = useState("");
   const [search, setSearch] = useState("");

   function handleSearch() {
      setSearch(textValue);
   }

   return (
      <Container>
         <TextField
            id="searchBar"
            placeholder="Pesquise um país"
            value={textValue}
            variant="outlined"
            InputProps={{
               endAdornment: (
                  <InputAdornment position="end">
                     <IconButton onClick={handleSearch}>
                        <SearchIcon />
                     </IconButton>
                  </InputAdornment>
               ),
            }}
            fullWidth
            sx={{ borderRadius: 2, margin: "1rem 0", backgroundColor: "#FFF" }}
            onChange={(e) => setTextValue(e.target.value)}
         />
         <CountriesGrid countrySearch={search} />
      </Container>
   );
}
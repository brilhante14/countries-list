import { Box, CircularProgress } from "@mui/material";

export function Loading() {
   return (
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center" >
         <CircularProgress color="info" />
      </Box >
   );
}
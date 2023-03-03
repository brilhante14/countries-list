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

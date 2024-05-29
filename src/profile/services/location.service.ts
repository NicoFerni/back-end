import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { map, catchError } from 'rxjs/operators';


    @Injectable()
    export class LocationService {
        constructor (
            private httpService: HttpService,
            private configService: ConfigService
            ) {}
       
        getCountries(){
            const url = 'https://countriesnow.space/api/v0.1/countries';
            
            return this.httpService.get(url)
             .pipe(
              map(response => response.data.map(item => item.country)),
               catchError(error => {
                 console.error('Error occurred:', error);
                 throw error;
               }),
             )
        }

         getStates(country_name: string){
           const url = `https://www.universal-tutorial.com/api/states/${country_name}`;
           const headerRequest = {
               'Authorization': `Bearer ${this.configService.get('AUTHORIZATION')}`,
               'Accept' : 'application/json'
           }
            return this.httpService.get(url, { headers: headerRequest })
            .pipe(
             map(response => response.data),
              catchError(error => {
                console.error('Error occurred:', error);
                throw error;
              }),
            )
       }

        }
      
    

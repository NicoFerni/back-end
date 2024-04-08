import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { response } from "express";
import { map, catchError } from 'rxjs/operators';


    @Injectable()
    export class LocationService {
        constructor (
            private httpService: HttpService,
            private configService: ConfigService
            ) {}
       
        getCountries(){
            const url = 'https://www.universal-tutorial.com/api/countries/';
            const headerRequest = {
                'Authorization': `Bearer ${this.configService.get('AUTHORIZATION')}`,
                'Accept' : 'application/json'
            }
            // return headerRequest.Authorization
             return this.httpService.get(url, { headers: headerRequest })
             .pipe(
              map(response => response.data.map(item => item.country_name)),
               catchError(error => {
                 console.error('Error occurred:', error);
                 throw error;
               }),
             )
        }

        getStates(){
          const url = `https://www.universal-tutorial.com/api/states/${this.getCountries}`;
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
      
    

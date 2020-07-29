import {Injectable, Component} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Uuid} from '../../shared/models/uuid';
import {Global} from './global';
import { Router } from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class UuidService {
    public url: String;
    //SENDINGTOKEN STEP 3
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(
        //SENDINGTOKEN STEP 2 Agregamos servicio de authService
        private _http: HttpClient, private router: Router, private authService: AuthService
        ) {
        this.url = Global.url;    
    }

    //SENDINGTOKEN STEP 1
    private addAuthorizationHeader(){
        let token = this.authService.token;
        if(token != null) {
            return this.httpHeaders.append('Authorization', 'Bearer ' + token)
        }
        return this.httpHeaders;
    }

    private isNotAuthorized(e) : boolean {
        if(e.status == 401) {
            if(this.authService.isAuthenticated()){
                this.authService.logout;
            }
            this.router.navigate(['/login'])
            return true;
        }

        if(e.status == 403) {
            console.log("acceso denegado")
            this.router.navigate(['/home'])
            return true;
        }
        return false;
    }

    getUuidList():Observable<any> {
        //SENDINGTOKEN STEP 4
        return this._http.get(this.url+"/uid", {headers: this.addAuthorizationHeader()}).pipe(catchError(e => {
            this.isNotAuthorized(e);
            return throwError(e);
        }));
    }

    save(uuid: Uuid):Observable<any> {
        let params = JSON.stringify(uuid);
        //let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+"/uid/save", params, {headers: this.addAuthorizationHeader()});
    }

    update(uuid: Uuid):Observable<any> {
        let params = JSON.stringify(uuid);
        //let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+"/uid/update", params, {headers: this.addAuthorizationHeader()});
    }

    delete(id: Number) : Observable<any> {
        return this._http.delete(this.url+"/uid/delete/"+id, {headers: this.addAuthorizationHeader()});
    }
    
    //SENDINGTOKEN STEP 5
    //Creación de nueva cabecera para FormData en caso de ser necesario.
}
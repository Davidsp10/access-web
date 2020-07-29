import {Injectable, Component} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Uuid} from '../models/uuid';
import {Global} from './global';
import { Router } from '@angular/router';
import {User} from '../models/user';

@Injectable()
export class AuthService {

    public url: String;
    private _user: User;
    private _token: string;

    public get user() : User {
        if(this._user != null) {
            return this._user;
        } else if(this._user == null && sessionStorage.getItem('user') != null) {
            this._user = JSON.parse(sessionStorage.getItem('user')) as User;
            return this._user;
        }
        return new User();
    }

    public get token() : string {
        if(this._token != null) {
            return this._token;
        } else if(this._token == null && sessionStorage.getItem('token') != null) {
            this._token = sessionStorage.getItem('token');
            return this._token;
        }
        return null;
    }
    
    constructor(
        private _http: HttpClient, private router: Router
        ) {
        this.url = Global.url;
    }

    login(user: User): Observable<any>{
        let credentials = btoa('uuidAdmin'+':'+'12345');
        let headers = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded', 
                                             'Authorization': 'Basic '+ credentials});
        let params = new URLSearchParams();
        params.set('grant_type', 'password');
        params.set('username', user.username);
        params.set('password', user.password);
        console.log(params.toString(), headers);
        return this._http.post<any>(this.url+"/oauth/token", params.toString(), {headers: headers});
    }

    saveUser(accessToken: string): void {
        let payload = this.getPayload(accessToken);
        this._user = new User();
        this._user.username = payload.user_name;
        this._user.roles = payload.authorities;

        sessionStorage.setItem('user', JSON.stringify(this._user));
    }

    saveToken(accessToken: string): void {
        this._token = accessToken;
        sessionStorage.setItem('token', accessToken);
    }

    getPayload(accessToken: string):any {
        if(accessToken != null) {
            return JSON.parse(atob(accessToken.split(".")[1]));
        }
        return null;
    }

    //CHECK_SESSION STEP 1 Comprobar en el componente login si el usuario ya ha iniciado sesión
    //CHECK_SESSION STEP 2 en login.component
    isAuthenticated(): boolean {
        let payload = this.getPayload(this.token);
        if(payload != null && payload.user_name && payload.user_name.length > 0) {
            return true;
        } 
        return false;
    }

    //HIDDENBUTTONS STEP 1
    hasRole(role: string): boolean {
        if(this.user.roles.includes(role)) {
            return true;
        }
        return false;
    }

    //LOGOUT STEP 3
    logout(): void {
        this._token = null;
        this._user = null;
        sessionStorage.clear();
        this.router.navigate(['']);
    }

}
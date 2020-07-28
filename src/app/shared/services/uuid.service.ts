import {Injectable, Component} from '@angular/core';
import {HttpClient, HttpHeaders, HttpRequest} from '@angular/common/http';
import {map, catchError, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Uuid} from '../../shared/models/uuid';
import {Global} from './global';
import { Router } from '@angular/router';

@Injectable()
export class UuidService {
    public url: String;

    constructor(
        private _http: HttpClient, private router: Router
        ) {
        this.url = Global.url;
        }

    private isNotAuthorized(e) : boolean {
        if(e.status == 401 || e.status == 403) {
            this.router.navigate(['/login'])
            return true;
        }
        return false;
    }

    getUuidList():Observable<any> {
        return this._http.get(this.url+"/uid").pipe(catchError(e => {
            this.isNotAuthorized(e);
            return throwError(e);
        }));
    }

    save(uuid: Uuid):Observable<any> {
        let params = JSON.stringify(uuid);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+"/uid/save", params, { headers : headers});
    }

    update(uuid: Uuid):Observable<any> {
        let params = JSON.stringify(uuid);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.put(this.url+"/uid/update", params, { headers : headers});
    }

    delete(id: Number) : Observable<any> {
        return this._http.delete(this.url+"/uid/delete/"+id);
    }
    
}
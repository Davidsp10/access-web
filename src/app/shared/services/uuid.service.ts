import {Injectable, Component} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Uuid} from '../../shared/models/uuid';
import {Global} from './global';

@Injectable()
export class UuidService {
    public url: String;

    constructor(
        private _http: HttpClient
        ) {
        this.url = Global.url;
        }

    getUuidList():Observable<any> {
        return this._http.get(this.url+"/uid");
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
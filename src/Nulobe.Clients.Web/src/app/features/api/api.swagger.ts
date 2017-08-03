﻿/* tslint:disable */
//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v11.3.3.0 (NJsonSchema v9.4.2.0) (http://NSwag.org)
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { Observable } from 'rxjs/Observable';
import { Injectable, Inject, Optional, OpaqueToken } from '@angular/core';
import { Http, Headers, ResponseContentType, Response } from '@angular/http';

export const API_BASE_URL = new OpaqueToken('API_BASE_URL');

export interface IFactApiClient {
    list(): Observable<Fact[] | null>;
    create(fact: Fact | undefined): Observable<Fact | null>;
    get(id: string): Observable<Fact | null>;
    update(id: string, fact: Fact | undefined): Observable<Fact | null>;
    delete(id: string): Observable<void>;
}

@Injectable()
export class FactApiClient implements IFactApiClient {
    private http: Http;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(Http) http: Http, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    list(): Observable<Fact[] | null> {
        let url_ = this.baseUrl + "/facts";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request(url_, options_).flatMap((response_) => {
            return this.processList(response_);
        }).catch((response_: any) => {
            if (response_ instanceof Response) {
                try {
                    return this.processList(response_);
                } catch (e) {
                    return <Observable<Fact[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<Fact[]>><any>Observable.throw(response_);
        });
    }

    protected processList(response: Response): Observable<Fact[] | null> {
        const status = response.status; 

        if (status === 200) {
            const _responseText = response.text();
            let result200: Fact[] | null = null;
            result200 = _responseText === "" ? null : <Fact[]>JSON.parse(_responseText, this.jsonParseReviver);
            return Observable.of(result200);
        } else if (status !== 200 && status !== 204) {
            const _responseText = response.text();
            return throwException("An unexpected server error occurred.", status, _responseText);
        }
        return Observable.of<Fact[] | null>(<any>null);
    }

    create(fact: Fact | undefined): Observable<Fact | null> {
        let url_ = this.baseUrl + "/facts";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(fact);
        
        let options_ = {
            body: content_,
            method: "post",
            headers: new Headers({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request(url_, options_).flatMap((response_) => {
            return this.processCreate(response_);
        }).catch((response_: any) => {
            if (response_ instanceof Response) {
                try {
                    return this.processCreate(response_);
                } catch (e) {
                    return <Observable<Fact>><any>Observable.throw(e);
                }
            } else
                return <Observable<Fact>><any>Observable.throw(response_);
        });
    }

    protected processCreate(response: Response): Observable<Fact | null> {
        const status = response.status; 

        if (status === 201) {
            const _responseText = response.text();
            let result201: Fact | null = null;
            result201 = _responseText === "" ? null : <Fact>JSON.parse(_responseText, this.jsonParseReviver);
            return Observable.of(result201);
        } else if (status !== 200 && status !== 204) {
            const _responseText = response.text();
            return throwException("An unexpected server error occurred.", status, _responseText);
        }
        return Observable.of<Fact | null>(<any>null);
    }

    get(id: string): Observable<Fact | null> {
        let url_ = this.baseUrl + "/facts/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        let options_ = {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request(url_, options_).flatMap((response_) => {
            return this.processGet(response_);
        }).catch((response_: any) => {
            if (response_ instanceof Response) {
                try {
                    return this.processGet(response_);
                } catch (e) {
                    return <Observable<Fact>><any>Observable.throw(e);
                }
            } else
                return <Observable<Fact>><any>Observable.throw(response_);
        });
    }

    protected processGet(response: Response): Observable<Fact | null> {
        const status = response.status; 

        if (status === 200) {
            const _responseText = response.text();
            let result200: Fact | null = null;
            result200 = _responseText === "" ? null : <Fact>JSON.parse(_responseText, this.jsonParseReviver);
            return Observable.of(result200);
        } else if (status !== 200 && status !== 204) {
            const _responseText = response.text();
            return throwException("An unexpected server error occurred.", status, _responseText);
        }
        return Observable.of<Fact | null>(<any>null);
    }

    update(id: string, fact: Fact | undefined): Observable<Fact | null> {
        let url_ = this.baseUrl + "/facts/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        const content_ = JSON.stringify(fact);
        
        let options_ = {
            body: content_,
            method: "put",
            headers: new Headers({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request(url_, options_).flatMap((response_) => {
            return this.processUpdate(response_);
        }).catch((response_: any) => {
            if (response_ instanceof Response) {
                try {
                    return this.processUpdate(response_);
                } catch (e) {
                    return <Observable<Fact>><any>Observable.throw(e);
                }
            } else
                return <Observable<Fact>><any>Observable.throw(response_);
        });
    }

    protected processUpdate(response: Response): Observable<Fact | null> {
        const status = response.status; 

        if (status === 200) {
            const _responseText = response.text();
            let result200: Fact | null = null;
            result200 = _responseText === "" ? null : <Fact>JSON.parse(_responseText, this.jsonParseReviver);
            return Observable.of(result200);
        } else if (status !== 200 && status !== 204) {
            const _responseText = response.text();
            return throwException("An unexpected server error occurred.", status, _responseText);
        }
        return Observable.of<Fact | null>(<any>null);
    }

    delete(id: string): Observable<void> {
        let url_ = this.baseUrl + "/facts/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id)); 
        url_ = url_.replace(/[?&]$/, "");

        let options_ = {
            method: "delete",
            headers: new Headers({
                "Content-Type": "application/json", 
            })
        };

        return this.http.request(url_, options_).flatMap((response_) => {
            return this.processDelete(response_);
        }).catch((response_: any) => {
            if (response_ instanceof Response) {
                try {
                    return this.processDelete(response_);
                } catch (e) {
                    return <Observable<void>><any>Observable.throw(e);
                }
            } else
                return <Observable<void>><any>Observable.throw(response_);
        });
    }

    protected processDelete(response: Response): Observable<void> {
        const status = response.status; 

        if (status === 204) {
            const _responseText = response.text();
            return Observable.of<void>(<any>null);
        } else if (status !== 200 && status !== 204) {
            const _responseText = response.text();
            return throwException("An unexpected server error occurred.", status, _responseText);
        }
        return Observable.of<void>(<any>null);
    }
}

export interface ITagApiClient {
    list(searchPattern: string | undefined, fields: string | undefined, orderBy: string | undefined): Observable<Tag[] | null>;
}

@Injectable()
export class TagApiClient implements ITagApiClient {
    private http: Http;
    private baseUrl: string;
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

    constructor(@Inject(Http) http: Http, @Optional() @Inject(API_BASE_URL) baseUrl?: string) {
        this.http = http;
        this.baseUrl = baseUrl ? baseUrl : "";
    }

    list(searchPattern: string | undefined, fields: string | undefined, orderBy: string | undefined): Observable<Tag[] | null> {
        let url_ = this.baseUrl + "/tags?";
        if (searchPattern !== undefined)
            url_ += "searchPattern=" + encodeURIComponent("" + searchPattern) + "&"; 
        if (fields !== undefined)
            url_ += "fields=" + encodeURIComponent("" + fields) + "&"; 
        if (orderBy !== undefined)
            url_ += "orderBy=" + encodeURIComponent("" + orderBy) + "&"; 
        url_ = url_.replace(/[?&]$/, "");

        let options_ = {
            method: "get",
            headers: new Headers({
                "Content-Type": "application/json", 
                "Accept": "application/json"
            })
        };

        return this.http.request(url_, options_).flatMap((response_) => {
            return this.processList(response_);
        }).catch((response_: any) => {
            if (response_ instanceof Response) {
                try {
                    return this.processList(response_);
                } catch (e) {
                    return <Observable<Tag[]>><any>Observable.throw(e);
                }
            } else
                return <Observable<Tag[]>><any>Observable.throw(response_);
        });
    }

    protected processList(response: Response): Observable<Tag[] | null> {
        const status = response.status; 

        if (status === 200) {
            const _responseText = response.text();
            let result200: Tag[] | null = null;
            result200 = _responseText === "" ? null : <Tag[]>JSON.parse(_responseText, this.jsonParseReviver);
            return Observable.of(result200);
        } else if (status !== 200 && status !== 204) {
            const _responseText = response.text();
            return throwException("An unexpected server error occurred.", status, _responseText);
        }
        return Observable.of<Tag[] | null>(<any>null);
    }
}

export interface Fact {
    id?: string | undefined;
    title?: string | undefined;
    definition?: string | undefined;
    sources?: Source[] | undefined;
    tags?: string[] | undefined;
    credit?: string | undefined;
}

export interface Source {
    description?: string | undefined;
    url?: string | undefined;
}

export interface Tag {
    text?: string | undefined;
    usageCount: number;
}

export class SwaggerException extends Error {
    message: string;
    status: number; 
    response: string; 
    result: any; 

    constructor(message: string, status: number, response: string, result: any) {
        super();

        this.message = message;
        this.status = status;
        this.response = response;
        this.result = result;
    }
}

function throwException(message: string, status: number, response: string, result?: any): Observable<any> {
    if(result !== null && result !== undefined)
        return Observable.throw(result);
    else
        return Observable.throw(new SwaggerException(message, status, response, null));
}

function blobToText(blob: any): Observable<string> {
    return new Observable<string>((observer: any) => { 
        let reader = new FileReader(); 
        reader.onload = function() { 
            observer.next(this.result);
            observer.complete();
        }
        reader.readAsText(blob); 
    });
}
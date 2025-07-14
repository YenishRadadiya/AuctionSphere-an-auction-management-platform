// src/app/services/auction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Auction {
    id?: number;
    title: string;
    description?: string;
    product_id: number;
    base_price: number;
    increment_percentage: number;
    publish_time: string;
    start_time: string;
    end_time: string;
    extend_duration?: number;
    auto_extend_threshold?: number;
    status: 'draft' | 'active' | 'completed' | 'cancelled';
}

@Injectable({ providedIn: 'root' })
export class AuctionService {
    private apiUrl = 'http://localhost:5000/api/auction';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Auction[]> {
        return this.http.get<Auction[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    getById(id: number): Observable<Auction> {
        return this.http.get<Auction>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    create(auction: Auction): Observable<any> {
        return this.http.post(`${this.apiUrl}`, auction).pipe(catchError(this.handleError));
    }

    update(id: number, auction: Auction): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, auction).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        return throwError(() => error.error?.message || 'Something went wrong');
    }
}

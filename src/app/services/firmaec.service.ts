import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { FirmaValido } from '@models/signer.model';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError, timeout } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirmaecService {
  apiUrl = 'http://192.168.0.105:8080';

  apiMintel = '';

  private _http = inject(HttpClient);
  private _toastr = inject(ToastrService);

  getToken(body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': 'KZjUjGxjkRsHnjTGExS6bCJ7fegP5EJq',
    });
    return this._http
      .post(`${this.apiUrl}/servicio/documentos`, body, {
        responseType: 'text',
        headers: headers,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this._toastr.error(err.error);
          return throwError(err);
        })
      );
  }

  sign(token: string) {
    return this._http
      .get(`http://192.168.0.105:8090/iess/firmaec/firmar/${token}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this._toastr.error(err.error);
          return throwError(err);
        })
      );
  }

  validateDocument(base64: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'text/plain',
    });
    return this._http
      .post<FirmaValido>(
        'https://impws.firmadigital.gob.ec/servicio/validacionavanzadapdf',
        base64,
        { headers: headers }
      )
      .pipe(timeout(19000));
  }
}

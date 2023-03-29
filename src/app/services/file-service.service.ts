import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';



const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};


@Injectable({
  providedIn: 'root'
})
export class FileServiceService {
  private apiUrl = 'https://127.0.0.1:8000';

  constructor(private http: HttpClient) { }


  uploadFile(formData: FormData, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Fileuploade/${email}`, formData);
  }


 createFolder(formData: FormData, email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/createdossier/${email}`, formData);
  }


  getUserFiles( email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getfiles/${email}`);
  }

  getUserFolders( email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getfolder/${email}`);
  }


  supprimerFile(id: number): Observable<any> {
    const url = `https://127.0.0.1:8000/deletefile/${id}`;
    return this.http.delete<any>(url);
  }

  supprimerFolder(id: number): Observable<any> {
    const url = `https://127.0.0.1:8000/deletefolder/${id}`;
    return this.http.delete<any>(url);
  }


  rechercherParName(name: string):Observable< File[]> {
    const url = `https://127.0.0.1:8000/findbyName/${name}`;
    return this.http.get<File[]>(url);
    }
}

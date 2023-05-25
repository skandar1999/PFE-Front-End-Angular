import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';



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


  addFileToDossier(formData: FormData, id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dossiers/${id}`, formData);
  }


  checkFileExists(id: number, file: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<any>(`${this.apiUrl}/checkfile/${id}`, formData).pipe(
      map((response: any) => response.exists)
    );
  }
  

  checkFileExistsforUser(email: string, file: File): Observable<boolean> {
    const formData = new FormData();
    formData.append('file', file);
  
    return this.http.post<any>(`${this.apiUrl}/checkfileUser/${email}`, formData).pipe(
      map((response: any) => response.exists)
    );
  }
  


  checkFolderExists(email: string, name: string): Observable<{ exists: boolean }> {
    const formData = new FormData();
    formData.append('name', name);
    // Make the HTTP request to the server and return the response as an Observable
    return this.http.post<{ exists: boolean }>(`${this.apiUrl}/checkfolder/${email}`, formData).pipe(
      map((response: any) => response.exists)
    );
  }
  
  
  
  



  uploadFileandreplace(id: number, file: File) {
    const formData = new FormData();
    formData.append('files', file);
    return this.http.post(`https://127.0.0.1:8000/FileuploadAndReplace/${id}`, formData);
  }


  uploadFileandreplaceDocu(email: string, file: File) {
    const formData = new FormData();
    formData.append('files', file);
    return this.http.post(`https://127.0.0.1:8000/FileuploadAndReplaceDocs/${email}`, formData);
  }
  
  getFilesByDossier(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/FilesByDossiers/${id}`);
  }

  

  
  getDossierName(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/dossiersname/${id}`);
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


  getFilesByFolder( id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getfiles/${id}`);
  }


  getUserFilesArchive( email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getfilesArchive/${email}`);
  }

 

  deleteFilesByDossier(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/DeletefilesSamecode/${id}`, {});
  }


  archiveFile(id: number, email: string): Observable<any> {
    const url = `https://127.0.0.1:8000/archiver/${id}/${email}`;
    return this.http.put(url, {});
  }

  archiveDossier(id: number, email: string): Observable<any> {
    const url = `https://127.0.0.1:8000/archiverDossier/${id}/${email}`;
    return this.http.put(url, {});
  }

  archiveFileFromDossier(id: number): Observable<any> {
    const url = `https://127.0.0.1:8000/filesss/${id}`;
    return this.http.put(url, {});
  }



  downloadFile(id: number): Observable<Blob> {
    const url = `https://127.0.0.1:8000/Filedownload/${id}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  supprimerFilefromarchive(id: number): Observable<any> {
    const url = `https://127.0.0.1:8000/deletefilefromarchive/${id}`;
    return this.http.delete<any>(url, {});
  }

  supprimerFolder(id: number): Observable<any> {
    const url = `https://127.0.0.1:8000/deletefolder/${id}`;
    return this.http.delete<any>(url);
  }


  rechercherParName(name: string):Observable< File[]> {
    const url = `https://127.0.0.1:8000/findbyName/${name}`;
    return this.http.get<File[]>(url);
    }


   

    renameFile(id: number, updatedFile: { name: string }) {
      const url = `https://127.0.0.1:8000/rename_file/${id}`;
      const formData = new FormData();
      formData.append('name', updatedFile.name);
      return this.http.post(url, formData);
    }
    
    renameDossier(id: number, updateFolder: { name: string }) {
      const url = `https://127.0.0.1:8000/rename_folder/${id}`;
      const formData = new FormData();
      formData.append('name', updateFolder.name);
      return this.http.post(url, formData);
    }

    
    restaurerFile(id: number, email: string): Observable<any> {
      const url = `https://127.0.0.1:8000/restaurerfile/${id}/${email}`;
      return this.http.put(url, {});
    }


    restaurerDossier(id: number, email: string): Observable<any> {
      const url = `https://127.0.0.1:8000/restaurerDsossier/${id}/${email}`;
      return this.http.put(url, {});
    }

    toggleVersioning(id: number): Observable<any> {
      const url = `https://127.0.0.1:8000/toggle-versioning/${id}`;
      return this.http.put<any>(url, {});
    }


    getpathfile(id: number):Observable< File[]> {
      const url = `https://127.0.0.1:8000/getpathofile/${id}`;
      return this.http.get<File[]>(url);
      }
  



}



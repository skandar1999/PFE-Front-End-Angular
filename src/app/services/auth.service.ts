import { Data } from 'popper.js';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { map, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';

import jwt_decode from 'jwt-decode';


const httpOptions = {
  headers: new HttpHeaders( {'Content-Type': 'application/json'} )
};


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  users!: User[];


  public loggedUser!: string;
  public isloggedIn: Boolean = false;
  public roles!: string[];
  username! : string;



  GetApi: string='https://127.0.0.1:8000/getAllUsers';
  apiURL: string='https://127.0.0.1:8000/userCreate';
  apilogin: string='https://127.0.0.1:8000/api/login_check';
  deleteapi: string='https://127.0.0.1:8000/delete';
  userById: string='https://127.0.0.1:8000/getUser';


  token! : string;


  constructor(private router: Router,
               private http : HttpClient,
               private helper: JwtHelperService) {
                this.loadToken();

    // Add listener for storage event
    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage && event.key === 'jwt') {
        this.loadToken();
      }
    });
 }


         login(user : User)
         {
         return this.http.post<any>(this.apilogin, user ).pipe(
          tap(response => {
            this.saveToken(response.jwt);

          })
        ); 
         }

         
        
         

        saveToken(jwt:string){
          localStorage.setItem('jwt',jwt);
          this.token = jwt;
          this.isloggedIn = true; 
           }

           decodeJWT(): void {
            if (this.token == undefined) return;
            const decodedToken = this.helper.decodeToken(this.token);
            this.username = decodedToken.sub;
          }

        loadToken() {
          this.token = localStorage.getItem('jwt')!;
          if (this.token) {
            this.isloggedIn = true;
            this.decodeJWT();
          } else {
            this.isloggedIn = false;
          }
          this.username = localStorage.getItem('username')!;
        }


          isTokenExpired(): Boolean
          {
          return this.helper.isTokenExpired(this.token); }

         getToken():string {
         return this.token;
         }


  listeUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.GetApi);
    }
    
    consulterUser(id: number): Observable<User> {
      const url = `${this.GetApi}/${id}`;
      let jwt = this.getToken();
      jwt = "Bearer "+jwt;
      let httpHeaders = new HttpHeaders({"Authorization":jwt})
      return this.http.get<User>(url,{headers:httpHeaders});
      }


      ajouterUser(user: User): Observable<any> {
        let jwt = this.getToken();
        jwt = "Bearer " + jwt;
        let httpHeaders = new HttpHeaders({"Authorization": jwt})
        return this.http.post<any>(this.apiURL, user, { headers: httpHeaders });
      }

      supprimerUser(id : number) {
        const url = `${this.deleteapi}/${id}`;
        let jwt = this.getToken();
        jwt = "Bearer "+jwt;
        let httpHeaders = new HttpHeaders({"Authorization":jwt})
        return this.http.delete(url, {headers:httpHeaders});

        }


        update( user: User , id :number){
          this.supprimerUser(id);
          this.ajouterUser(user);
           
        }
        

     
 SignIn(user: User): Boolean {
    let validUser: Boolean = false;
    this.users.forEach((curUser) => {
      if (user.email == curUser.email && user.password == curUser.password) {
        validUser = true;
        this.loggedUser = curUser.email;
        this.isloggedIn = true;
        this.roles = curUser.roles;
        localStorage.setItem('loggedUser', this.loggedUser);
        localStorage.setItem('isloggedIn', String(this.isloggedIn));
      }
    });
    return validUser;
    
  }




  isUser(): Boolean {
    if (!this.isloggedIn)
      //this.roles== undefiened
      return false;
    return this.isloggedIn;
  }

  

  logout() {
    this.loggedUser = undefined!;
    this.roles = undefined!;
    this.token= undefined!;
    this.isloggedIn = false;
    window.localStorage.removeItem('jwt');
    window.localStorage.removeItem('username');
    this.router.navigate(['/login']);

  }


  isAdmin(): boolean {
    if (!this.roles) {
      return false;
    }
    return this.roles.includes('ADMIN');
  }


  getUserPermissions(): string[] {
    const token = this.getToken(); // hypothetical method to get user token
    const decodedToken = jwt_decode(token) as { [key: string]: any };
    return decodedToken['permissions'];
  }
  
  

  hasPermissions(permissions: string[]): boolean {
    const userPermissions = this.getUserPermissions(); // hypothetical method to get user permissions
    return permissions.every(permission => userPermissions.includes(permission));
  }
  

    
   }
  
 

  

import { UserService } from './../services/user.service';
import { User } from './../model/user.model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  users!: User[];

  
  curentUser:any;
  username: string | null = null;

  password!:string;
  email:any;
  id!: number;
  mobile!: string;

  token!:any;
  userData: any;
  newData: any;
  notificationsEnabled: boolean = true;
  userImage!: string;

  constructor(public authService: AuthService , public userService:UserService , private router: Router) {}

  ngOnInit() {
    
    this.token = window.localStorage.getItem('jwt');
    this.curentUser = jwt_decode(this.token);
    this.findUserByEmail();
    this.username = localStorage.getItem('username');


  }

  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
  }

  onLogout() {
    this.authService.logout();
  }

  getDecodedAccessToken(token: string): any {
    try {
      this.curentUser= jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  findUserByEmail() {
    this.userService.rechercherParEmail(this.curentUser?.email).subscribe(
      user => {
        console.log(user);
        if (user) {

          this.userData = user;
          this.username = this.userData.username;
          this.password = this.userData.password;
          this.mobile = this.userData.mobile;
          this.userImage = 'https://127.0.0.1:8000/uploads/' + this.userData.image;

  
          // Mettre à jour le nom d'utilisateur dans le stockage local
          this.username = this.userData.username;

        // Update the username in local storage
        localStorage.setItem('username', this.username!);
        

        }
      },
      error => {
        console.error(error);
      }
    );
  }
  
  
  

  reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([currentUrl]));
  }

  


  
}






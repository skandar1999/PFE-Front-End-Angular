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

  username! : string;
  password!:string;
  email:any;
  id!: number;
  mobile!: string;

  curentUser:any;
  token!:any;
  userData: any;
  newData: any;
  notificationsEnabled: boolean = true;

  constructor(public authService: AuthService , public userService:UserService , private router: Router) {}

  ngOnInit() {
    this.token = window.localStorage.getItem('jwt');
    this.curentUser = jwt_decode(this.token);
    this.findUserByEmail();
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
    this.userService.rechercherParEmail(this.curentUser?.email).subscribe(user => {
      console.log(user);
      if (user) {
        this.userData = user;
        this.username = this.userData.username;
        this.password = this.userData.password;
        this.mobile = this.userData.mobile;
      }
    });
    
   
  }
  

  reload() {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
      this.router.navigate([currentUrl]));
  }

  


  
}







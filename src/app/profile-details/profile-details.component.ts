import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { identifierName } from '@angular/compiler';
import { Data } from 'popper.js';
import jwt_decode from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css'],
})
export class ProfileDetailsComponent implements OnInit {

  user!: User;
  users!: User[];

  public data: string | null = null;
  username!: string;
  password!:string;
  email:any;
  id!: number;
  mobile!:string;
  curentUser:any;
  token!:any;
  userData: any;
  newData: any;
  updateSuccess: boolean = false;
  confirmPassword!: string;
  not: boolean = false;

 constructor(
    public authService: AuthService,
    public userService: UserService,
    private route: ActivatedRoute,
  ) {}  


  ngOnInit(): void { 
    this.token =window.localStorage.getItem('jwt')
    this.curentUser= jwt_decode(this.token);
    this.findUserByEmail();
  }
  
  
  findUserByEmail(){
   
    this.userService.rechercherParEmail(this.curentUser?.email).subscribe(us => {
      console.log(us);
      if (us) {
        this.userData = us;
        this.username=this.userData.username;
        this.password=this.userData.password;
        this.mobile=this.userData.mobile;

      }
    });
    console.log(this.confirmPassword);

  } 
 


  onLogout() {
    this.authService.logout();
  }

  updateUserData() {
    const userToUpdate = new User();
    userToUpdate.email = this.curentUser?.email; // set the email of the user to be updated
    userToUpdate.username = this.username; // set the new username
    userToUpdate.password = this.password; // set the new password
    userToUpdate.mobile = this.mobile; // set the new mobile number
    
    this.userService.Update(this.curentUser?.email, userToUpdate).subscribe(updatedUser => {
      console.log(updatedUser);
      this.updateSuccess = true;
      setTimeout(() => {
        this.updateSuccess = false;

      }, 1900); // Delay for hiding the alert
    });
      
    console.log("Username: ", this.username);
    console.log("Password: ", this.password);
    console.log("Mobile: ", this.mobile);
  }




  public hidePassword = true;
  public togglePassword(): void {
  this.hidePassword = !this.hidePassword;
    }

}
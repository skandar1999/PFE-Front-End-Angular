import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';

import jwt_decode from 'jwt-decode';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  PasswordActuelle!:string;
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
  userImage!: string;
  errorMessage!: string;
  passwordMatch!: boolean;
  passwordFieldsModified = false;
  errorMessagepw!: string;

 constructor(
    public authService: AuthService,
    public userService: UserService,
  
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
        this.userImage = 'https://127.0.0.1:8000/uploads/' + this.userData.image;

      }
    });
    console.log(this.confirmPassword);

  } 
 


  onLogout() {
    this.authService.logout();
  }



updatePasswordFields() {
  this.passwordFieldsModified = true;
}

 

  updateUserData() {
    if (this.PasswordActuelle && this.password !== this.confirmPassword) {
      // Show an error message or prevent the update request
      this.not = true;
      setTimeout(() => {
        this.not = false;
      }, 2500);
      return;
    }
  
  
    if (this.PasswordActuelle) {
      this.checkPasswords(); // call the checkPasswords function to verify the current password
    }  
    setTimeout(() => {
      if (this.passwordMatch) {
        const userToUpdate = new User();
        userToUpdate.email = this.curentUser?.email; // set the email of the user to be updated
        userToUpdate.username = this.username; // set the new username
        userToUpdate.password = this.password; // set the new password
        userToUpdate.mobile = this.mobile; // set the new mobile number
  
        this.userService.Update(this.curentUser?.email, userToUpdate).subscribe(
          updatedUser => {
            console.log(updatedUser);
            this.updateSuccess = true;
            setTimeout(() => {
              this.updateSuccess = false;
            }, 2500); // Delay for hiding the alert
          },
          error => {
            console.log(error);
            this.errorMessage = error.error.message; // get the error message from the response
            setTimeout(() => {
              this.errorMessage = '';
            }, 4000); // Delay for hiding the error message
          }
        );
      } else {
        this.errorMessagepw = 'Le mot de passe actuel est incorrect';
        setTimeout(() => {
          this.errorMessagepw = '';
        }, 4000); // Delay for hiding the error message
      }
    }, 1000); // add a delay for the checkPasswords function to complete
  }
  
  
  checkPasswords() {
    this.userService.checkPassword(this.curentUser?.email, this.PasswordActuelle).subscribe((result) => {
      this.passwordMatch = result;
    });
  }
  

  




   public hidePassword1 = true;
  public hidePassword2 = true;

public togglePassword1(): void {
  this.hidePassword1 = !this.hidePassword1;
}

public togglePassword2(): void {
  this.hidePassword2 = !this.hidePassword2;
}

    onFileSelected(event: any) {
      const file = event.target.files[0]; // Get the selected file
      const reader = new FileReader();
    
      reader.onload = () => { // Define a callback function to be executed when the file is loaded
        const userImage = reader.result as string; // Store the image data as a string in a variable
        this.userImage = userImage; // Update the component's userImage property with the new data
        this.updatephoto(file, userImage); // Call the updatephoto method with the file and userImage variables as parameters
      }
    
      reader.readAsDataURL(file); // Read the selected file as a data URL
    }
    
    updatephoto(file: File, userImage: string) {
      const formData = new FormData();
      formData.append('file', file);
    
      this.userService.UpdateImage(this.curentUser?.email, formData).subscribe(updatedUser => {
        console.log(updatedUser);
        this.curentUser = updatedUser; // Update the current user object with the new data
        this.userImage = userImage; // Update the component's userImage property with the new data
      });
    }
    
    
  
}
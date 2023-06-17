import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  email!: string;
  vide: boolean = false;

  users: any;
  successMessage!: string;
  errorMessage!:string;
  resetSuccessful!: boolean;
  notSuccessful!: boolean;
  constructor(private userService: UserService , private router: Router) { }

  ngOnInit(): void {
    
  }


  onSubmit() {
    if (!this.email ) {
      this.vide = true;
      setTimeout(() => {
        this.vide = false;
      }, 3000);
      return;
    }
    this.userService.PasswordReset(this.email)
      .subscribe(users => {
        this.users = users;
        console.log('Password reset successful!');
        this.successMessage = 'Nouveau mot de passe envoyé à votre adresse mail.';
        this.resetSuccessful = true;
        // navigate to login page after 3 seconds
        setTimeout(() => {
          // replace 'login' with the route path for your login page
          this.router.navigate(['login']);
        }, 3000);
      }, error => {
        if (error.status === 404) {
          this.notSuccessful = true;
          this.errorMessage = 'Adresse email n\'existe pas.';
          setTimeout(() => {
            this.notSuccessful = false;
            this.errorMessage = '';
          }, 3000); // hide error message after 3 seconds
        }
      });
  }


 

}

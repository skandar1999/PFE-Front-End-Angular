import { User } from './../model/user.model';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  newUser = new User();
  
  users! : User[];
  erreur = 0;
  err:number=0;
  added: boolean = false;
  vide: boolean = false;
  errorMessage: string = '';
  errorMobile: string = '';
  errorEmail: string = '';
  confirmPassword!: string;
  not: boolean = false;


  constructor(private authService: AuthService , private router: Router ) {}

  ngOnInit(): void {}


  userCreate() {
    if (!this.newUser.email || !this.newUser.username || !this.newUser.mobile || !this.newUser.password) {
      this.vide = true;
      setTimeout(() => {
        this.vide = false;
      }, 2500); // Delay for hiding the alert
      return;
    } 

    if (this.newUser.password !== this.confirmPassword) {
      // Show an error message or prevent the update request
      this.not=true;
      setTimeout(() => {
        this.not = false;
      }, 2500);
      return;
    }

    if (!this.newUser.email.includes('@')  || !this.newUser.email.includes('.')) {
      this.errorEmail = 'email non valide';
      setTimeout(() => {
        this.errorEmail = '';
      }, 3000); // hide error message after 3 seconds
      return;
    }



    if (this.newUser.mobile.length != 8 || !/^[0-9]*$/.test(this.newUser.mobile)) {
      this.errorMobile = 'Telephone non valide';
      setTimeout(() => {
        this.errorMobile = '';
      }, 2500); // hide error message after 3 seconds
      return;
    }

    if (this.newUser.password.length < 8) {
      this.errorMessage = '8 caractères requis pour le mot de passe.';
      setTimeout(() => {
        this.errorMessage = '';
      }, 2500); // hide error message after 3 seconds
      return;
    }
     
    this.authService.ajouterUser(this.newUser).subscribe(
      (response: any) => {
        console.log(response);
        if (response && response.status) {
          this.added = true;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2500); // wait for 3 seconds before navigating to login page
        } else if (response && !response.status) {
          this.errorMessage = response.message;
          setTimeout(() => {
            this.errorMessage = '';
          }, 2500); // hide error message after 3 seconds
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  
  



  

  public hidePassword1 = true;
  public hidePassword2 = true;

public togglePassword1(): void {
  this.hidePassword1 = !this.hidePassword1;
}

public togglePassword2(): void {
  this.hidePassword2 = !this.hidePassword2;
}
}
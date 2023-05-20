import { AuthService } from './../services/auth.service';
import { UserService } from './../services/user.service';
import { UserGuard } from './../guard/user.guard';
import { ForgotPasswordComponent } from './../forgot-password/forgot-password.component';
import { User } from '../model/user.model';
import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user = new User();
  erreur = 0;
  users! : User[];
  err: boolean = false;
  email!:any;
  vide: boolean = false;
  headerComponent: any;
  private isFirstLoad = true;


 
  constructor(private authService: AuthService,
              private router: Router ,
              private userService: UserService,
              private http: HttpClient,
              ) {
              }

              ngOnInit(): void {
                this.router.events.subscribe(event => {
                  if (event instanceof NavigationEnd && this.isFirstLoad) {
                    this.isFirstLoad = false;
                    window.location.reload();
                  }
                });
            
              }


  onLoggedin(): void {
    if (!this.user.email || !this.user.password) {
      this.vide = true;
      setTimeout(() => {
        this.vide = false;
      }, 2500);
      return;
    }
  
    this.authService.login(this.user)
      .subscribe(
        (data) => {
          this.authService.saveToken(data.token);
          
          this.router.navigate(['/docs']);

        },
        error => {
          this.err = true;
          setTimeout(() => {
            this.err = false;
          }, 2500);
        }
      );
  }
  


 


      public hidePassword = true;
      public togglePassword(): void {
      this.hidePassword = !this.hidePassword;
        }
    

      
        
       
      
}

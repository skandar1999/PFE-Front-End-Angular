import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-onlyadmin',
  templateUrl: './onlyadmin.component.html',
  styleUrls: ['./onlyadmin.component.css']
})
export class OnlyadminComponent implements OnInit {
  
  
user = new User();
users! : User[];
username!:string;
deleted: boolean = false;
updated: boolean = false;
removed: boolean = false;

  constructor( private authService: AuthService ,private userService: UserService) { }

  ngOnInit(): void {
    this.chargerUser();

  }

  

  chargerUser(){
    this.userService.listeUsers().subscribe(user => {
    console.log(user);
    this.users = user;
    });
    }

    supprimerUser(user: User) {
      let conf = confirm("Etes-vous sûr supprimer ce compte ?");
      if (conf) {
        this.authService.supprimerUser(user.id).subscribe(() => {
          this.chargerUser();
          this.deleted = true;
          setTimeout(() => {
            this.deleted = false;
          }, 2000);
        });
      }
    }

  rechercherParUser(){
    this.userService.rechercherParUsername(this.username).
    subscribe(user => {
    this.users = user; 
    console.log(user)});
    }   


    updateRoleAdmin(user: User) {
      const conf = confirm("Etes-vous sûr de mettre le rôle de cet utilisateur à ADMIN?");
      if (conf) {
        this.userService.updateUserRole(user.id).subscribe(
          (response) => {
            console.log(response);
            // handle success
            this.updated = true; // exécuter l'action ici
            setTimeout(() => {
              this.updated = false; 
            }, 4000);
          },
          (error) => {
            console.log(error);
            // handle error
          }
        );
      }
    }
    
    removeRoleAdmin(user: User) {
      const conf = confirm("Etes-vous sûr d'anuller le rôle ADMIN à ce Utilisateur?");
      if (conf) {
        this.userService.removeRoleAdmin(user.id).subscribe(
          (response) => {
            console.log(response);
            // handle success
            this.removed = true; // exécuter l'action ici
            setTimeout(() => {
              this.removed = false; 
            }, 4000);
          },
          (error) => {
            console.log(error);
            // handle error
          }
        );
      }
    }

    
    
  

    onLogout() {
      this.authService.logout();
    }
}

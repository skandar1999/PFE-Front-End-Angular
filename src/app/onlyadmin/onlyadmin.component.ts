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
hasAdmin = false;

  constructor( private authService: AuthService ,
              private userService: UserService) { }

  ngOnInit(): void {
    this.chargeUsers();
  }

  
  chargeUsers() {
    this.userService.listeUsers().subscribe(users => {
      this.users = users;
      this.users.sort((a, b) => {
        if (a.roles.includes('SUPER_ADMIN') && !b.roles.includes('SUPER_ADMIN')) {
          return -1;
        } else if (a.roles.includes('ADMIN') && !b.roles.includes('ADMIN') && !b.roles.includes('SUPER_ADMIN')) {
          return -1;
        } else if (!a.roles.includes('ADMIN') && !a.roles.includes('SUPER_ADMIN') && b.roles.includes('ADMIN')) {
          return 1;
        } else if (!a.roles.includes('ADMIN') && !a.roles.includes('SUPER_ADMIN') && !b.roles.includes('ADMIN') && b.roles.includes('SUPER_ADMIN')) {
          return 1;
        } else {
          return 0;
        }
      });
    });
  }
  
  


    supprimerUser(user: User) {
     
     
      let conf = confirm("Etes-vous sûr supprimer ce compte ?");
      if (conf) {
        this.authService.supprimerUser(user.id).subscribe(() => {
          this.chargeUsers();
          this.deleted = true;
          setTimeout(() => {
            this.deleted = false;
          }, 2600);
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
      if(user.roles.includes('SUPER_ADMIN')) {
        alert("Tu ne peut pas modifier le role de SUPER_ADMIN .");
        return;
      }
      const conf = confirm("Etes-vous sûr de mettre le rôle de cet utilisateur à ADMIN?");
      if (conf) {
        this.userService.updateUserRole(user.id).subscribe(
          (response) => {
            console.log(response);
            // handle success
            this.updated = true; // exécuter l'action ici
            setTimeout(() => {
              this.updated = false; 
            }, 4500);
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
            }, 4500);
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

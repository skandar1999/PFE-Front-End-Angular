import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-recherche-par-nom',
  templateUrl: './recherche-par-nom.component.html',
  styleUrls: ['./recherche-par-nom.component.css']
})
export class RechercheParNomComponent implements OnInit {
  username!:string;
  user = new User();
  searchTerm!: string;
 
  users: User[] = [];
  allUsers: User[] = [];

  constructor(private userService: UserService , private authService: AuthService) { }

  ngOnInit(): void {
    this.getUsers();

  }

  getUsers() {
    this.authService.listeUsers().subscribe(
      (users: User[]) => {
        console.log(users);
        this.allUsers = users;
        this.users = users;
      },
      error => {
        console.error(error);
      }
    );
  }

  rechercherParUser(){
    this.userService.rechercherParUsername(this.username).
    subscribe(us => {
    this.users =  us });
    }

   onKeyUp(searchTerm: HTMLInputElement) {
  const filterText = searchTerm.value.toLowerCase();
  if (filterText.length > 0) {
    this.users = this.allUsers.filter(item => item.username.toLowerCase().includes(filterText));
  } else {
    this.users = [];
  }
}

    
      
    
    
      onLogout() {
        this.authService.logout();
      }

}
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
  users! :any[];
  allUsers! :any[];
  searchTerm!: string;
 


  constructor(private userService: UserService , private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.listeUsers().subscribe(us => {
      console.log(us);
      this.allUsers = us;
      });
  }

  

  rechercherParUser(){
    this.userService.rechercherParUsername(this.username).
    subscribe(us => {
    this.users =  us });
    }

    onKeyUp(filterText : string){
      this.users = this.allUsers.filter(item =>
      item.username.toLowerCase().includes(filterText));
      console.log(this.users);
      }
      
    
    
      onLogout() {
        this.authService.logout();
      }

}
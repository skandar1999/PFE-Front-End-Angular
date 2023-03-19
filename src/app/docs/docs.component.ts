import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})
export class DocsComponent implements OnInit {
  constructor( public authService: AuthService) {}

  ngOnInit(): void {}


  onLogout() {
    this.authService.logout();
  }
}

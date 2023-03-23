import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { FileServiceService } from '../services/file-service.service';
import { File } from './../model/file';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})
export class DocsComponent implements OnInit {
  selectedFile!: File;
  id!:number;
  user!: User;
  curentUser:any;
  userData: any;
  token!:any;
  username!: string;
  email:any;
  files: any[] = [];


  
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public fileService: FileServiceService,
    private http: HttpClient

  
  ) {} 
  ngOnInit(): void { 
    this.token =window.localStorage.getItem('jwt')
    this.curentUser= jwt_decode(this.token);
    //console.log(jwt_decode(token))
    this.findUserById();
    this.getFiles()
    console.log(this.id)
    console.log(this.curentUser?.email)

  }
  
  getDecodedAccessToken(token: string): any {
    try {
      this.curentUser= jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }
  

  findUserById(){
   
    this.userService.rechercherParEmail(this.curentUser?.email).subscribe(us => {
      console.log(us);
      if (us) {
        this.userData = us;
        this.id=this.userData.id;
       
      }
    });

  } 

 
  onLogout() {
    this.authService.logout();}     


  onFileSelected(event: any) {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('files', file);

    this.fileService.uploadFile(formData,this.curentUser?.email).subscribe(
      (response) => {
        console.log('File uploaded successfully');
        // You could update your user object with the file details returned by the server
      },
      (error) => {
        console.log('Error uploading file');
      }
    );
  }

getFiles() {
  this.fileService.getUserFiles(this.curentUser?.email).subscribe(
    files => {
      console.log(files);
      this.files = files.map((file:any) => {
        return {
          id: file.id,
          name: file.name,
          date: file.date,
          url: 'http://localhost:8000/files/' + file.name  // Update the URL here
        };
      });
    },
    error => {
      console.error(error);
    }
  );
}


}



    
  
 








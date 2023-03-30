import { Dossier } from './../model/dossier';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';
import { FileServiceService } from '../services/file-service.service';
import { File } from './../model/file';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {
  id!:number;
  user!: User;
  curentUser:any;
  userData: any;
  token!:any;
  username!: string;
  email:any;
  deletedd: boolean = false;
  name!:string;
  allfiles! :any[];
  notificationsEnabled: boolean = true;
  selectedFile: File | null = null;

  files!: any[];
  folders: any[] = [];
  allfolders! :any[];


  
  constructor(
    public authService: AuthService,
    public userService: UserService,
    public fileService: FileServiceService,
    private http: HttpClient,
    private router: Router
  
  ) {} 
  ngOnInit(): void { 
    this.token =window.localStorage.getItem('jwt')
    this.curentUser= jwt_decode(this.token);
    //console.log(jwt_decode(token))
    this.findUserById();
    this.getFiles()
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


   

    getFiles() {
      this.fileService.getUserFiles(this.curentUser?.email).subscribe(
        files => {
          console.log(files);
          this.allfiles = files
            .filter((file:any) => file.status === false) // filter files with status === true
            .map((file:any) => {
              return {
                id: file.id,
                name: file.name,
                date: file.date,
                url: 'http://localhost:8000/files/' + file.name
              };
            });
          this.files = this.allfiles;
        },
        error => {
          console.error(error);
        }
      );
    }
    

 

 


  onFolderSelected(folder: any) {
    // Navigate to the contents of the selected folder
    this.router.navigate(['/folders', folder.id]);
  }



  
  onKeyUp(filterText : string){
    this.files = this.allfiles.filter(item =>
      item.name.toLowerCase().includes(filterText)
    );
  }



  onDelete(file: File, event: Event) {
    event.stopPropagation(); // Add this line to prevent the link from opening
    let conf = confirm("Etes-vous sûr de vouloir supprimer ce document ?");
    if (conf && file.id) {
      this.fileService.supprimerFilefromarchive(file.id).subscribe(() => {
        this.getFiles();
        this.deletedd = true;
        setTimeout(() => {
          this.deletedd = false;
        }, 1700);
      });
    }
  }

 
  




rechercherParFile() {
  this.fileService.rechercherParName(this.name).subscribe(
    files => {
      this.files = files.map((file: any) => {
        return {
          id: file.id,
          name: file.name,
          date: file.date,
          url: 'http://localhost:8000/files/' + file.name
        };
      });
    },
    error => {
      console.error(error);
    }
  );

  }



}

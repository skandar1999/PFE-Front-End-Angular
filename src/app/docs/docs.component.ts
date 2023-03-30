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
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.css'],
})
export class DocsComponent implements OnInit {


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
    this.getFolders()
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
    
      this.fileService.uploadFile(formData, this.curentUser?.email).subscribe(
        (response) => {
          console.log('File uploaded successfully');
          this.selectedFile = file; // Set the selected file in the component property
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
          this.allfiles = files
            .filter((file:any) => file.status === true) // filter files with status === true
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
    

  getFolders() {
    this.fileService.getUserFolders(this.curentUser?.email).subscribe(
      folders => {
        console.log(folders);
        this.allfolders = folders.map((folder:any) => {
          return {
            id: folder.id,
            namefolder: folder.name, // Update the field name here
            date: folder.date, // Update the field name here
            url: 'http://localhost:8000/folders/' + folder.id // Update the URL here
          };
        });
        this.folders = this.allfolders;
      },
      error => {
        console.error(error);
      }
    );
  }

  createNewFolder() {
    const formData = new FormData();
    formData.append('user_id', '1'); // Replace with the ID of the user
    formData.append('namedossier', 'Nouveau dossier');
    formData.append('datedossier', new Date().toISOString().slice(0, 10)); // Use today's date as the default date
    this.fileService.createFolder(formData, this.curentUser?.email).subscribe(
      (response) => {
        console.log(response);
      },
      error => {
        console.log(error);
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



  onArchive(file: File) {
    const confirmed = confirm("Etes-vous sûr de vouloir supprimer ce document ?");
    if (confirmed && file.id) {
      this.fileService.archiveFile(file.id, this.curentUser?.email).subscribe(() => {
        this.getFiles();
        this.deletedd = true;
        setTimeout(() => {
          this.deletedd = false;
        }, 1700);
      });
    }
  }

  onDeletefolder(dossier: Dossier, event: Event) {
    event.stopPropagation(); // Add this line to prevent the link from opening
    let conf = confirm("Etes-vous sûr de vouloir supprimer ce dossier ?");
    if (conf && dossier.id) {
      this.fileService.supprimerFolder(dossier.id).subscribe(() => {
        this.getFolders();
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


  toggleNotifications() {
    this.notificationsEnabled = !this.notificationsEnabled;
  }



}



 
  



















    
  
 








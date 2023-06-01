import { ArchiveComponent } from './archive/archive.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { RechercheParNomComponent } from './recherche-par-nom/recherche-par-nom.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ProfileComponent } from './profile/profile.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocsComponent } from './docs/docs.component';
import { OnlyadminComponent } from './onlyadmin/onlyadmin.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { UserGuard } from './guard/user.guard';
import { MessagesComponent } from './messages/messages.component';
import { FolderContentsComponent } from './folder-contents/folder-contents.component';
import { AcceuilComponent } from './acceuil/acceuil.component';

const routes: Routes = [
  { path: '', redirectTo: 'acceuil', pathMatch: 'full' },
  { path: 'acceuil', component: AcceuilComponent },
  { path: 'login', component: LoginComponent  },
  { path: 'signup', component: SignupComponent  },
  { path: 'forgot-password', component: ForgotPasswordComponent  },
  { path: 'profile-details/:curentUser.email', component: ProfileDetailsComponent,canActivate: [UserGuard]},
  { path: 'docs', component: DocsComponent ,  title:"documents",canActivate: [UserGuard] },
  { path: 'profile', component: ProfileComponent, title:"Profile" ,canActivate: [UserGuard] },
  { path: 'contact', component: ContactComponent , title:"Support"},
  { path: 'admin', component: OnlyadminComponent , title:"Dashboard",canActivate: [UserGuard] },
  { path: 'app-forbidden', component: ForbiddenComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutUsComponent },
  { path: "recherche", component : RechercheParNomComponent,canActivate: [UserGuard] },
  { path: 'messages', component: MessagesComponent , canActivate: [UserGuard] },
  { path: 'condition', component: ConditionsComponent },
  { path: 'folders/:id', component: FolderContentsComponent ,canActivate: [UserGuard]},
  { path: 'archive', component: ArchiveComponent,canActivate: [UserGuard] },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

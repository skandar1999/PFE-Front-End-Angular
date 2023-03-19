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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent , title:"Connexion" },
  { path: 'signup', component: SignupComponent , title:"S'inscrire" },
  { path: 'forgot-password', component: ForgotPasswordComponent ,title:"Réinitialiser le mot de passe"  },
  { path: 'profile-details/:curentUser.email', component: ProfileDetailsComponent,  title:"Profile"},
  { path: 'docs', component: DocsComponent ,  title:"Home"},
  { path: 'profile', component: ProfileComponent, title:"Profile" },
  { path: 'contact', component: ContactComponent , title:"Contact"},
  { path: 'admin', component: OnlyadminComponent , title:"Admin"},
  { path: 'app-forbidden', component: ForbiddenComponent , title:"app-forbidden" },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutUsComponent , title:"A propos" },
  { path: "recherche", component : RechercheParNomComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'condition', component: ConditionsComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

//Importar los módulos del Router de angular
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";

const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'home', component: HomeComponent}
];

export const appRoutingProviders : any [] = [];
export const routing : ModuleWithProviders = RouterModule.forRoot(appRoutes); 
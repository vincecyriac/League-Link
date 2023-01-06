import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NoAuthGuard } from './core/guards/no-auth.guard';

const routes: Routes = [
  { path : '', loadChildren: ()=> import('./modules/user/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard]},
  { path: 'login', loadChildren: ()=> import('./modules/user/login/login.module').then(m => m.LoginModule), canActivate: [NoAuthGuard] },
  { path: 'signup', loadChildren: ()=> import('./modules/user/register/register.module').then(m => m.RegisterModule), canActivate: [NoAuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { LoginComponent } from './login.component';

const routes: Routes = [
  { path : '', component : LoginComponent, pathMatch : 'full', title : `Login${AppConstants.TITLE_COMMON}`}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }

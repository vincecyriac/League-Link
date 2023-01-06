import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { RegisterComponent } from './register.component';

const routes: Routes = [
  { path : '', component : RegisterComponent, pathMatch : 'full', title : `Register${AppConstants.TITLE_COMMON}`}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }

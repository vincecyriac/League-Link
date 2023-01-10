import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path : '', component : DashboardComponent, children : [
    { path : 'players', loadChildren: ()=> import('./players/players.module').then(m => m.PlayersModule), title : `Players ${AppConstants.TITLE_COMMON}`},
    { path : 'teams', loadChildren: ()=> import('./teams/teams.module').then(m => m.TeamsModule)},
    { path : 'tournaments', loadChildren: ()=> import('./tournaments/tournaments.module').then(m => m.TournamentsModule)}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeamsRoutingModule } from './teams-routing.module';
import { IndexComponent } from './index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { CreateComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { TagInputModule } from 'ngx-chips';
import { EditPlayerComponent } from './edit-player/edit-player.component';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    DetailsComponent,
    EditPlayerComponent
  ],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ComponentsModule,
    TagInputModule
  ]
})
export class TeamsModule { }

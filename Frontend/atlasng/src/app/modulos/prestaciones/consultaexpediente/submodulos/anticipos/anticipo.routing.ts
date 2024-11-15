import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnticipoComponent } from './componentes/anticipo.component';

const routes: Routes = [
  { path: '', component: AnticipoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnticipoRoutingModule {}

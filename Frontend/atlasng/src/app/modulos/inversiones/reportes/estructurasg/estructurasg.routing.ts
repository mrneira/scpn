import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstructurasgComponent } from './componentes/estructurasg.component';

const routes: Routes = [
  { path: '', component: EstructurasgComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstructurasgRoutingModule {}

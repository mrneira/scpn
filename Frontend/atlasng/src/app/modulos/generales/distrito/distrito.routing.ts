import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistritoComponent } from './componentes/distrito.component';

const routes: Routes = [
  { path: '', component: DistritoComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistritoRoutingModule {}
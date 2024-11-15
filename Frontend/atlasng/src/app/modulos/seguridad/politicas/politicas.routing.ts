import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PoliticasComponent } from './componentes/politicas.component';

const routes: Routes = [
  { path: '', component: PoliticasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliticasRoutingModule {}

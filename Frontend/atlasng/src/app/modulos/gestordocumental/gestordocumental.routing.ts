import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestorDocumentalComponent } from './componentes/gestordocumental.component';

const routes: Routes = [
  { 
    path: '', component: GestorDocumentalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestorDocumentalRoutingModule {}

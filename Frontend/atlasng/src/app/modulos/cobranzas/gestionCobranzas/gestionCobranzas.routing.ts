import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionCobranzasComponent } from './componentes/gestionCobranzas.component';

const routes: Routes = [
  {
    path: '', component: GestionCobranzasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCobranzasRoutingModule { }
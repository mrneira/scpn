import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LovCotizadorSegurosComponent } from './componentes/lov.cotizador.component';

const routes: Routes = [
  {
    path: '', component: LovCotizadorSegurosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LovCotizadorSegurosRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RendimientoMaduracionRentaFija } from './componentes/rendimientoymaduracionrentafija.component';

const routes: Routes = [
  { path: '', component: RendimientoMaduracionRentaFija,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RendimientoymaduracionrentafijaRouting {}

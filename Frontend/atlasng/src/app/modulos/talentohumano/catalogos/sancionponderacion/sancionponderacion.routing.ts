import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SancionponderacionComponent } from './componentes/sancionponderacion.component';

const routes: Routes = [
  { path: '', component: SancionponderacionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SancionRoutingModule {}

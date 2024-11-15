import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReimpresionEtiquetasComponent } from './componentes/reimpresionEtiquetas.component';

const routes: Routes = [
  { path: '', component: ReimpresionEtiquetasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReimpresionEtiquetasRoutingModule {}

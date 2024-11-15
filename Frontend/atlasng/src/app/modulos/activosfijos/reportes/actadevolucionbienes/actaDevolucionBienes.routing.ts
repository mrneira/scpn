import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActaDevolucionBienesComponent } from './componentes/actaDevolucionBienes.component';


const routes: Routes = [
  { path: '', component: ActaDevolucionBienesComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActaDevolucionBienesRoutingModule {}

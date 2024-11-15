import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngresocxpActivosFijosComponent } from './componentes/ingresocxpActivosFijos.component';

const routes: Routes = [
  { path: '', component: IngresocxpActivosFijosComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngresocxpActivosFijosRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MetaDetalleComponent } from './componentes/metadetalle.component';

const routes: Routes = [
  { path: '', component: MetaDetalleComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetadetalleRoutingModule {}

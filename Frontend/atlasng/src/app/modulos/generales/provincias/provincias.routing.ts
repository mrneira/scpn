import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProvinciasComponent } from './componentes/provincias.component';

const routes: Routes = [
  { path: '', component: ProvinciasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvinciasRoutingModule {}

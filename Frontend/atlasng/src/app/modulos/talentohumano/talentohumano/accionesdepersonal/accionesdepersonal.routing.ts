import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccionesDePersonalComponent } from './componentes/accionesdepersonal.component';

const routes: Routes = [
  { 
    path: '', component: AccionesDePersonalComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccionesDePersonalRoutingModule {}

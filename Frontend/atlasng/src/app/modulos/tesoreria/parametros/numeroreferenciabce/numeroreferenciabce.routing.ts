import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NumeroReferenciaBceComponent } from './componentes/numeroreferenciabce.component';

const routes: Routes = [
  { path: '', component: NumeroReferenciaBceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NumeroReferenciaBceRoutingModule {}

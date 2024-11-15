import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmpresaBceComponent } from './componentes/empresabce.component';

const routes: Routes = [
  { path: '', component: EmpresaBceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaBceRoutingModule {}

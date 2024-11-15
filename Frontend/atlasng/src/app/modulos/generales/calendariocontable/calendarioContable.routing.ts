import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarioContableComponent } from './componentes/calendarioContable.component';

const routes: Routes = [
  { path: '', component: CalendarioContableComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarioContableRoutingModule {}

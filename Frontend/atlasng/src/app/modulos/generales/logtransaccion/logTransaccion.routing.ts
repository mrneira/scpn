import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogTransaccionComponent } from './componentes/logTransaccion.component';

const routes: Routes = [
  { path: '', component: LogTransaccionComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogTransaccionRoutingModule {}

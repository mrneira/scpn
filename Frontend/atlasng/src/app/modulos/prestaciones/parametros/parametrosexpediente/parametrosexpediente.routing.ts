import { ParametrosExpedienteComponent } from './componentes/parametros.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  { path: '', component: ParametrosExpedienteComponent,
  }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosExpedienteRoutingModule {}

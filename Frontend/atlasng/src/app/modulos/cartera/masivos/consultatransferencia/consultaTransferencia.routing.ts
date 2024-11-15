import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ConsultaTransferenciaComponent } from "./componentes/consultaTransferencia.component";

const routes: Routes = [
  {
    path: "",
    component: ConsultaTransferenciaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsultaTransferenciaRoutingModule { }

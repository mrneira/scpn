import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ListadoExpedientesAsignadosRoutingModule } from './listadoExpedientesAsignados.routing';
import { ListadoExpedientesAsignadosComponent } from './componentes/listadoExpedientesAsignados.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ListadoExpedientesAsignadosRoutingModule, JasperModule],
  declarations: [ListadoExpedientesAsignadosComponent]
})
export class ListadoExpedientesAsignadosModule { }
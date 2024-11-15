
import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../../../util/shared/shared.module";
import { CapacidadPagoRoutingModule } from "./_capacidadPago.routing";
import { CapacidadPagoComponent } from "./componentes/_capacidadPago.component";
import { AbsorberOperacionesComponent } from "./componentes/_absorberoperaciones.component";
import { ReincorporadosComponent } from "./componentes/_reincorporados.component";
import { EgresosModule } from '../egresos/_egresos.module';
import { IngresosModule } from '../ingresos/_ingresos.module';
import { ConsolidadoComponent } from "./componentes/_consolidado.component";

@NgModule({
  imports: [SharedModule, CapacidadPagoRoutingModule, EgresosModule, IngresosModule],
  declarations: [CapacidadPagoComponent, AbsorberOperacionesComponent, ReincorporadosComponent, ConsolidadoComponent],
  exports: [CapacidadPagoComponent, AbsorberOperacionesComponent, ReincorporadosComponent, ConsolidadoComponent]
})
export class CapacidadPagoModule { }

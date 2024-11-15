
import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../../../util/shared/shared.module";
import { CapacidadPagoRoutingModule } from "./_capacidadPago.routing";
import { CapacidadPagoComponent } from "./componentes/_capacidadPago.component";
import { EgresosModule } from '../egresos/_egresos.module';
import { IngresosModule } from '../ingresos/_ingresos.module';

@NgModule({
  imports: [SharedModule, CapacidadPagoRoutingModule, EgresosModule, IngresosModule],
  declarations: [CapacidadPagoComponent],
  exports: [CapacidadPagoComponent]
})
export class CapacidadPagoModule { }


import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../../../util/shared/shared.module";
import { CondicionesArregloPagoRoutingModule } from "./_condicionesArregloPago.routing";
import { CondicionesArregloPagoComponent } from "./componentes/_condicionesArregloPago.component";

@NgModule({
  imports: [SharedModule, CondicionesArregloPagoRoutingModule],
  declarations: [CondicionesArregloPagoComponent],
  exports: [CondicionesArregloPagoComponent]
})
export class CondicionesArregloPagoModule { }

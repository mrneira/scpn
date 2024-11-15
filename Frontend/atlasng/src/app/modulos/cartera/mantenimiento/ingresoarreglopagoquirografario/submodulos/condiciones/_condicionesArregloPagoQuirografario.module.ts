
import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../../../util/shared/shared.module";
import { CondicionesArregloPagoQuirografarioRoutingModule } from "./_condicionesArregloPagoQuirografario.routing";
import { CondicionesArregloPagoQuirografarioComponent } from "./componentes/_condicionesArregloPagoQuirografario.component";

@NgModule({
  imports: [SharedModule, CondicionesArregloPagoQuirografarioRoutingModule],
  declarations: [CondicionesArregloPagoQuirografarioComponent],
  exports: [CondicionesArregloPagoQuirografarioComponent]
})
export class CondicionesArregloPagoQuirografarioModule { }

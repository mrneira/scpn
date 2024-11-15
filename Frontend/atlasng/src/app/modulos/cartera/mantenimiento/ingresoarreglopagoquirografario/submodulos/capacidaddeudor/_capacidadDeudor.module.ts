
import { NgModule } from "@angular/core";
import { SharedModule } from "../../../../../../util/shared/shared.module";
import { CapacidadDeudorRoutingModule } from "./_capacidadDeudor.routing";
import { CapacidadDeudorComponent } from "./componentes/_capacidadDeudor.component";
import { EgresosCapacidadModule } from '../egresoscapacidad/_egresosCapacidad.module';
import { IngresosCapacidadModule } from '../ingresoscapacidad/_ingresosCapacidad.module';
import { AbsorberOperacionesComponent } from './componentes/_absorberoperaciones.component';
import { ConsolidadoApComponent } from './componentes/_consolidadoap.component';//CCA 20221025

@NgModule({
  imports: [SharedModule, CapacidadDeudorRoutingModule, IngresosCapacidadModule, EgresosCapacidadModule],
  declarations: [CapacidadDeudorComponent, AbsorberOperacionesComponent,ConsolidadoApComponent],
  exports: [CapacidadDeudorComponent, AbsorberOperacionesComponent,ConsolidadoApComponent]
})
export class CapacidadDeudorModule { }

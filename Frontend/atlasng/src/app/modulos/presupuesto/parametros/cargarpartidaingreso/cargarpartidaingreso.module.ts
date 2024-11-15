import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargarPartidaIngresoRoutingModule } from './cargarpartidaingreso.routing';
import { CargarPartidaIngresoComponent } from './componentes/cargarpartidaingreso.component';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';


@NgModule({
  imports: [SharedModule, CargarPartidaIngresoRoutingModule, ResultadoCargaModule],
  declarations: [CargarPartidaIngresoComponent]
})
export class CargarPartidaIngresoModule { }

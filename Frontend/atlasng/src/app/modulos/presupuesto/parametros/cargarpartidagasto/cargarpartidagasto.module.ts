import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargarPartidaGastoRoutingModule } from './cargarpartidagasto.routing';
import { CargarPartidaGastoComponent } from './componentes/cargarpartidagasto.component';
import { ResultadoCargaModule } from './submodulos/resultadocarga/resultadocarga.module';


@NgModule({
  imports: [SharedModule, CargarPartidaGastoRoutingModule, ResultadoCargaModule],
  declarations: [CargarPartidaGastoComponent]
})
export class CargarPartidaGastoModule { }

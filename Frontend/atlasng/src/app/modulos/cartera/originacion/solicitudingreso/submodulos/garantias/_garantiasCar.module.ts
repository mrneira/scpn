import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { GarantiasCarRoutingModule } from './_garantiasCar.routing';
import { GarantiasCarComponent } from './componentes/_garantiasCar.component';
import { LovOperacionGarModule } from '../../../../../garantias/lov/operacion/lov.operacionGar.module';
import { LovCotizadorSegurosModule } from "../../../../../seguros/lov/cotizador/lov.cotizador.module";

@NgModule({
  imports: [SharedModule, GarantiasCarRoutingModule, LovOperacionGarModule, LovCotizadorSegurosModule],
  declarations: [GarantiasCarComponent],
  exports: [GarantiasCarComponent]

})
export class GarantiasCarModule { }

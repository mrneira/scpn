import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCotizadorSegurosRoutingModule } from './lov.cotizador.routing';

import { LovCotizadorSegurosComponent } from './componentes/lov.cotizador.component';

@NgModule({
  imports: [SharedModule, LovCotizadorSegurosRoutingModule],
  declarations: [LovCotizadorSegurosComponent],
  exports: [LovCotizadorSegurosComponent]
})
export class LovCotizadorSegurosModule { }

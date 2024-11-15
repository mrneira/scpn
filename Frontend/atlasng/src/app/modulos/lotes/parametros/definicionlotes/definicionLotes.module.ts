import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { DefinicionLotesRoutingModule } from './definicionLotes.routing';

import { DefinicionLotesComponent } from './componentes/definicionLotes.component';
import { LoteModuloModule } from './submodulos/lotemodulo/_loteModulo.module';
import { TransaccionesEjecucionModule } from './submodulos/transaccionesejecucion/_transaccionesEjecucion.module';
import { TareasModuloLoteModule } from './submodulos/tareasmodulolote/_tareasModuloLote.module';

@NgModule({
  imports: [SharedModule, DefinicionLotesRoutingModule, LoteModuloModule, TransaccionesEjecucionModule, TareasModuloLoteModule],
  declarations: [DefinicionLotesComponent]
})
export class DefinicionLotesModule { }

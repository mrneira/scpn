import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../util/shared/shared.module';
import {ConsultaEjecucionRoutingModule} from './consultaEjecucion.routing';

import {ConsultaEjecucionComponent} from './componentes/consultaEjecucion.component';
import {LoteResultadoCabeceraModule} from './submodulos/loteresultadocabecera/_loteResultadoCabecera.module';
import {LoteResultadoPrevioModule} from './submodulos/loteresultadoprevio/_loteResultadoPrevio.module';
import {LoteResultadoIndividualModule} from './submodulos/loteresultadoindividual/_loteResultadoIndividual.module';
import {LoteResultadoFinModule} from './submodulos/loteresultadofin/_loteResultadoFin.module';

@NgModule({
  imports: [SharedModule, ConsultaEjecucionRoutingModule, LoteResultadoCabeceraModule, LoteResultadoPrevioModule,
    LoteResultadoIndividualModule, LoteResultadoFinModule],
  declarations: [ConsultaEjecucionComponent]
})
export class ConsultaEjecucionModule {}

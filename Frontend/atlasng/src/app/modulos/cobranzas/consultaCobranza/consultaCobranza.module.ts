import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ConsultaCobranzaRoutingModule } from './consultaCobranza.routing';

import { ConsultaCobranzaComponent } from './componentes/consultaCobranza.component';
import { ProductoModule } from '../../generales/producto/producto.module';
import { TipoProductoModule } from '../../generales/tipoproducto/tipoProducto.module';
import { DatosGeneralesModule } from './submodulos/datosgenerales/_datosGenerales.module';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovOperacionCobranzaModule } from '../lov/operacion/lov.operacionCobranza.module';
import { CobranzaModule } from './submodulos/cobranza/_cobranza.module';
import { TablaAccionesCobranzaModule } from './submodulos/tablaaccionescobranza/_tablaAccionesCobranza.module';
import { TablaAccionesJudicialesModule } from './submodulos/tablaaccionesjudiciales/_tablaAccionesJudiciales.module';
@NgModule({
  imports: [SharedModule, ConsultaCobranzaRoutingModule, LovOperacionCobranzaModule,
    DatosGeneralesModule, ProductoModule, TipoProductoModule, LovPersonasModule, CobranzaModule,TablaAccionesCobranzaModule,
    TablaAccionesJudicialesModule],
    declarations: [ConsultaCobranzaComponent]
})
export class ConsultaCobranzaModule { }
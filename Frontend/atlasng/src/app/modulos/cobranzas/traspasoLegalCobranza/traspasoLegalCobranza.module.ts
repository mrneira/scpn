import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { TraspasoLegalCobranzaRoutingModule } from './traspasoLegalCobranza.routing';

import { TraspasoLegalCobranzaComponent } from './componentes/traspasoLegalCobranza.component';
import { ProductoModule } from '../../generales/producto/producto.module';
import { TipoProductoModule } from '../../generales/tipoproducto/tipoProducto.module';
import { LovPersonasModule } from '../../personas/lov/personas/lov.personas.module';
import { LovOperacionCobranzaModule } from '../lov/operacion/lov.operacionCobranza.module';
import { CobranzaModule } from './submodulos/cobranza/_cobranza.module';
import { TablaAccionesCobranzaModule } from './submodulos/tablaaccionescobranza/_tablaAccionesCobranza.module';
@NgModule({
  imports: [SharedModule, TraspasoLegalCobranzaRoutingModule, LovOperacionCobranzaModule
    , ProductoModule, TipoProductoModule, LovPersonasModule, CobranzaModule,TablaAccionesCobranzaModule],
    declarations: [TraspasoLegalCobranzaComponent]
})
export class TraspasoLegalCobranzaModule{ }
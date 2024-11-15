import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ComponentesConsultaRoutingModule } from './componentesConsulta.routing';

import { ComponentesConsultaComponent } from './componentes/componentesConsulta.component';
import { CodigosConsultaComponent } from './componentes/_codigosConsulta.component';
import { TransaccionesConsultaComponent } from './componentes/_transaccionesConsulta.component';

import { LovCodigosConsultaModule } from '../lov/codigosconsulta/lov.codigosConsulta.module';
import { LovComponentesNegocioModule } from '../lov/componentesnegocio/lov.componentesNegocio.module';
import { LovTransaccionesModule } from '../lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, ComponentesConsultaRoutingModule, LovCodigosConsultaModule, LovComponentesNegocioModule, LovTransaccionesModule ],
  declarations: [ComponentesConsultaComponent, CodigosConsultaComponent, TransaccionesConsultaComponent]
})
export class ComponentesConsultaModule { }

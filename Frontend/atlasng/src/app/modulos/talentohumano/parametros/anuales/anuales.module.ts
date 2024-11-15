import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ParametrizacionAnualRoutingModule } from './anuales.routing';

import { ParametrizacionAnualComponent } from './componentes/anuales.component';

import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';
import {DatosGeneralesModule} from './submodulos/cabecera/datosgenerales.module';
import {AcumulacionesModule} from './submodulos/acumulaciones/acumulaciones.module';
import {HorasExtrasModule} from './submodulos/horasextras/horasextras.module';
import {ImpuestoRentaModule} from './submodulos/impuestorenta/impuestorenta.module';
import {PagodecimoModule} from './submodulos/pagodecimo/pagodecimo.module';
import {GastoDeducibleModule} from './submodulos/gastodeducible/gastodeducible.module';

@NgModule({
  imports: [SharedModule, ParametrizacionAnualRoutingModule,PagodecimoModule, ParametroAnualModule,LovFuncionariosModule,AcumulacionesModule,DatosGeneralesModule,HorasExtrasModule,ImpuestoRentaModule,GastoDeducibleModule],
  declarations: [ParametrizacionAnualComponent]
})
export class ParametrizacionAnualModule { }

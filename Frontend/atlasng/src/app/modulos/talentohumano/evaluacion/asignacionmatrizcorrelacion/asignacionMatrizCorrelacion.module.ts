import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AsignacionMatrizCorrelacionRoutingModule } from './asignacionMatrizCorrelacion.routing';
import { AsignacionMatrizCorrelacionComponent } from './componentes/asignacionMatrizCorrelacion.component';

//Submodulos
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';


//lov
import { LovPeriodoModule } from '../../lov/periodo/lov.periodo.module';

import { LovMatrizCorrelacionModule } from '../../lov/matrizcorrelacion/lov.matrizcorrelacion.module'


@NgModule({
  imports: [SharedModule, AsignacionMatrizCorrelacionRoutingModule,
    LovPeriodoModule,CabeceraModule,LovMatrizCorrelacionModule,DetalleModule],
  declarations: [AsignacionMatrizCorrelacionComponent]
})
export class AsignacionMatrizCorrelacionModule { }

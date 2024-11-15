import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DatosgeneralesRoutingModule } from './datosgenerales.routing';

import { DatosgeneralesComponent } from './componentes/datosgenerales.component';

import { LovDesignacionesModule } from '../../../../lov/designaciones/lov.designaciones.module';


import{ParametroAnualModule} from '../../../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, DatosgeneralesRoutingModule, ParametroAnualModule,LovDesignacionesModule],
  declarations: [DatosgeneralesComponent],
  exports: [DatosgeneralesComponent]
})
export class DatosgeneralesModule { }

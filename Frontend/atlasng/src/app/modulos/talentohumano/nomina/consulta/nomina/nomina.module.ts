import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { NominaRoutingModule } from './nomina.routing';

import { NominaComponent } from './componentes/nomina.component';
import {ParametroAnualModule} from '../../../lov/parametroanual/lov.parametroanual.module'


@NgModule({
  imports: [SharedModule, NominaRoutingModule,ParametroAnualModule ],
  declarations: [NominaComponent]
})
export class NominaModule { }

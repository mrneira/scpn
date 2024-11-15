import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { NominaRoutingModule } from './nomina.routing';

import { NominaComponent } from './componentes/nomina.component';
import {ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module'

import { LovCompromisoModule } from '../../../presupuesto/lov/compromiso/lov.compromiso.module';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
@NgModule({
  imports: [SharedModule, NominaRoutingModule,ParametroAnualModule,SplitButtonModule,LovCompromisoModule ],
  declarations: [NominaComponent]
})
export class NominaModule { }

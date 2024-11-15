import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ExtractobancarioRoutingModule } from './extractobancario.routing';

import { ExtractobancarioComponent } from './componentes/extractobancario.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module'

@NgModule({
  imports: [SharedModule, ExtractobancarioRoutingModule, JasperModule, LovPersonasModule, LovCuentasContablesModule ],
  declarations: [ExtractobancarioComponent]
})
export class ExtractobancarioModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { ResumenconciliacionRoutingModule } from './resumenconciliacion.routing';

import { ResumenconciliacionComponent } from './componentes/resumenconciliacion.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../../personas/lov/personas/lov.personas.module'
import { LovCuentasContablesModule } from '../../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, ResumenconciliacionRoutingModule, JasperModule, LovPersonasModule, LovCuentasContablesModule ],
  declarations: [ResumenconciliacionComponent]
})
export class ResumenconciliacionModule { }

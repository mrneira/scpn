import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RecuperacionRoutingModule } from './recuperacion.routing';

import { RecuperacionComponent } from './componentes/recuperacion.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

@NgModule({
  imports: [SharedModule, RecuperacionRoutingModule, LovInversionesModule, JasperModule ],
  declarations: [RecuperacionComponent]
})
export class RecuperacionModule { }

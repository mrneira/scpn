import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AlertasRoutingModule } from './alertas.routing';

import { AlertasComponent } from './componentes/alertas.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

@NgModule({
  imports: [SharedModule, AlertasRoutingModule, LovInversionesModule, JasperModule, LovPersonasModule ],
  declarations: [AlertasComponent]
})
export class AlertasModule { }

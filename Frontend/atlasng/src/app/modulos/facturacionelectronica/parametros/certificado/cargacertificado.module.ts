import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargaCertificadoRoutingModule } from './cargacertificado.routing';

import { CargaCertificadoComponent } from './componentes/cargacertificado.component';


@NgModule({
  imports: [SharedModule,CargaCertificadoRoutingModule ],
  declarations: [CargaCertificadoComponent]
})
export class CargaCertificadoModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { InactivacionRoutingModule } from './inactivacion.routing';

import { InactivacionComponent } from './componentes/inactivacion.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, InactivacionRoutingModule, JasperModule ],
  declarations: [InactivacionComponent]
})
export class InactivacionModule { }

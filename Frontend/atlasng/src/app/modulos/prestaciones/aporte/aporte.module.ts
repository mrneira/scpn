import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AporteRoutingModule } from './aporte.routing';

import { AporteComponent } from './componentes/aporte.component';
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, AporteRoutingModule, LovPersonasModule, JasperModule ],
  declarations: [AporteComponent]
})
export class AporteModule { }

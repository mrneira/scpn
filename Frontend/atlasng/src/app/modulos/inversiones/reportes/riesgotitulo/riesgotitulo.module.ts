import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RiesgotituloRoutingModule } from './riesgotitulo.routing';
import { RiesgotituloComponent } from './componentes/riesgotitulo.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, RiesgotituloRoutingModule, LovInversionesModule, JasperModule, 
  
    SpinnerModule ],
  declarations: [RiesgotituloComponent]
})
export class RiesgotituloModule { }

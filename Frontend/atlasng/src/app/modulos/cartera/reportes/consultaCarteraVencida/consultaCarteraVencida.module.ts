import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaCarteraVencidaRoutingModule } from './consultaCarteraVencida.routing';
import { ConsultaCarteraVencidaComponent } from './componentes/consultaCarteraVencida.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ConsultaCarteraVencidaRoutingModule, JasperModule],
  declarations: [ConsultaCarteraVencidaComponent]

})
export class ConsultaCarteraVencidaModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafolioconsolidadoRoutingModule } from './portafolioconsolidado.routing';
import { PortafolioconsolidadoComponent } from './componentes/portafolioconsolidado.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, PortafolioconsolidadoRoutingModule, JasperModule, SpinnerModule ],
  declarations: [PortafolioconsolidadoComponent]
})
export class PortafolioconsolidadoModule { }

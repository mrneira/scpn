import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafolioRfyRvRoutingModule } from './portafoliorfyrv.routing';
import { PortafolioRfyRvComponent } from './componentes/portafoliorfyrv.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, PortafolioRfyRvRoutingModule, JasperModule, SpinnerModule ],
  declarations: [PortafolioRfyRvComponent]
})
export class PortafolioRfyRvModule { }

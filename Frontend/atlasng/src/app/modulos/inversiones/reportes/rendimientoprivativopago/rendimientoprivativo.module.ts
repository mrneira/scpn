import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RendimientoprivativoComponent } from './componentes/rendimientoprivativo.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { RendimientoprivativoRoutingModule } from './rendimientoprivativo.routing';

@NgModule({
  imports: [SharedModule, RendimientoprivativoRoutingModule, JasperModule, SpinnerModule ],
  declarations: [RendimientoprivativoComponent]
})
export class RendimientoprivativoModule { }

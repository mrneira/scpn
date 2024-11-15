import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RendimientonoprivativoComponent } from './componentes/rendimientonoprivativo.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { RendimientonoprivativoRoutingModule } from './rendimientonoprivativo.routing';

@NgModule({
  imports: [SharedModule, RendimientonoprivativoRoutingModule, JasperModule, SpinnerModule ],
  declarations: [RendimientonoprivativoComponent]
})
export class RendimientonoprivativoModule { }

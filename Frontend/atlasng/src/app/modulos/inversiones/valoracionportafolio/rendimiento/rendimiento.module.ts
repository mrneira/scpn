import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RendimientoComponent } from './componentes/rendimiento.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { RendimientoRoutingModule } from './rendimiento.routing';

@NgModule({
  imports: [SharedModule, RendimientoRoutingModule, JasperModule, SpinnerModule ],
  declarations: [RendimientoComponent]
})
export class RendimientoModule { }

import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReformaPresupuestariaComponent } from './componentes/reformaPresupuestaria.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { ReformaPresupuestariaRoutingModule } from './reformaPresupuestaria.routing';

@NgModule({
  imports: [SharedModule, ReformaPresupuestariaRoutingModule, JasperModule, SpinnerModule ],
  declarations: [ReformaPresupuestariaComponent]
})
export class ReformaPresupuestariaModule { }

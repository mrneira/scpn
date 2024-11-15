import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { VariacionCierreComponent } from './componentes/variacionprecioscierre.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { VariacionCierreRoutingModule } from './variacionprecioscierre.routing';

@NgModule({
  imports: [SharedModule, VariacionCierreRoutingModule, JasperModule, SpinnerModule ],
  declarations: [VariacionCierreComponent]
})
export class VariacionCierreModule { }

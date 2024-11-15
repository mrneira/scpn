import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AfectacionPresupuestariaComponent } from './componentes/afectacionPresupuestaria.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { AfectacionPresupuestariaRoutingModule } from './afectacionPresupuestaria.routing';
import { LovCompromisoModule } from '../../lov/compromiso/lov.compromiso.module';

@NgModule({
  imports: [SharedModule, AfectacionPresupuestariaRoutingModule,LovCompromisoModule, JasperModule, SpinnerModule ],
  declarations: [AfectacionPresupuestariaComponent]
})
export class AfectacionPresupuestariaModule { }

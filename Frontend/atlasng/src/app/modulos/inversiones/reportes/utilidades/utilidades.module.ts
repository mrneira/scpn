import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { UtilidadesComponent } from './componentes/utilidades.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { UtilidadesRoutingModule } from './utilidades.routing';

@NgModule({
  imports: [SharedModule, UtilidadesRoutingModule, JasperModule, SpinnerModule ],
  declarations: [UtilidadesComponent]
})
export class UtilidadesModule { }

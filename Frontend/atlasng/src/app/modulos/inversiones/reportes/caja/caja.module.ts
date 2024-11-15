import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CajaComponent } from './componentes/caja.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { SpinnerModule } from 'primeng/primeng';
import { CajaRoutingModule } from './caja.routing';

@NgModule({
  imports: [SharedModule, CajaRoutingModule, JasperModule, SpinnerModule ],
  declarations: [CajaComponent]
})
export class CajaModule { }

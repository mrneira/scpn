import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CuentasporcobrarMigradasRoutingModule } from './cuentasporcobrarmigradas.routing';
import { CuentasporcobrarMigradasComponent } from './componentes/cuentasporcobrarmigradas.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, CuentasporcobrarMigradasRoutingModule, JasperModule ],
  declarations: [CuentasporcobrarMigradasComponent]
})
export class CuentasporcobrarMigradasModule { }

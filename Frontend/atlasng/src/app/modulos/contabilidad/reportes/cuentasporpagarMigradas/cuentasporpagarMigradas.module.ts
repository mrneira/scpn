import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CuentasporpagarMigradasRoutingModule } from './cuentasporpagarMigradas.routing';
import { CuentasporpagarMigradasComponent } from './componentes/cuentasporpagarMigradas.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, CuentasporpagarMigradasRoutingModule, JasperModule ],
  declarations: [CuentasporpagarMigradasComponent],
  exports: [CuentasporpagarMigradasComponent]
})
export class CuentasporpagarMigradasModule { }

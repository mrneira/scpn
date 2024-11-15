import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AutorizacioncxpRoutingModule } from './autorizacioncxp.routing';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { AutorizacioncxpComponent } from './componentes/autorizacioncxp.component';
import { JasperModule } from 'app/util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, AutorizacioncxpRoutingModule, LovProveedoresModule, JasperModule ],
  declarations: [ AutorizacioncxpComponent]
})
export class AutorizacioncxpModule { }

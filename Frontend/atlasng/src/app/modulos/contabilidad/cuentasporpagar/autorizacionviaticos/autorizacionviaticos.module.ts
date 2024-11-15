import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AutorizacionviaticosRoutingModule } from './autorizacionviaticos.routing';
//import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { AutorizacionviaticosComponent } from './componentes/autorizacionviaticos.component';
import { JasperModule } from 'app/util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, AutorizacionviaticosRoutingModule, JasperModule ],
  declarations: [ AutorizacionviaticosComponent]
})
export class AutorizacionviaticosModule { }

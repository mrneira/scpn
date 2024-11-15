import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AntiguedadCarteraClienteRoutingModule } from './antiguedadCarteraCliente.routing';

import { AntiguedadCarteraClienteComponent } from './componentes/antiguedadCarteraCliente.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovClientesModule } from '../../lov/clientes/lov.clientes.module';


@NgModule({
  imports: [SharedModule, AntiguedadCarteraClienteRoutingModule, JasperModule, LovClientesModule ],
  declarations: [AntiguedadCarteraClienteComponent]
})
export class AntiguedadCarteraClienteModule { }

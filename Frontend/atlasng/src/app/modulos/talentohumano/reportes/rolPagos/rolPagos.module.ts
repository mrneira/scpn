import { NgModule } from '@angular/core';
import { SpinnerModule } from 'primeng/primeng';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RolPagosRoutingModule } from './rolPagos.routing';
import { RolPagosComponent } from './componentes/rolPagos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovFuncionariosModule} from '../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, RolPagosRoutingModule, JasperModule, LovFuncionariosModule,SpinnerModule],
  declarations: [RolPagosComponent]
})
export class RolPagosModule { }

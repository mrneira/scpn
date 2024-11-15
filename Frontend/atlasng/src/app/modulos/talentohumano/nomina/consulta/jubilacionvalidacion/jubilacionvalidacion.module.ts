import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import {JubilacionvalidacionRoutingModule } from './jubilacionvalidacion.routing';
import { JubilacionvalidacionComponent } from './componentes/jubilacionvalidacion.component';
import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';
import { JasperModule } from '../.././../../../util/componentes/jasper/jasper.module';


import{ParametroAnualModule} from '../../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, JubilacionvalidacionRoutingModule,LovFuncionariosModule,ParametroAnualModule,JasperModule],
  declarations: [JubilacionvalidacionComponent]
})
export class JubilacionvalidacionModule { }

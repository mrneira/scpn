import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import {JubilaciopnRoutingModule } from './jubilacion.routing';
import { JubilacionComponent } from './componentes/jubilacion.component';
import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';
import { JasperModule } from '../.././../../../util/componentes/jasper/jasper.module';
import{ParametroAnualModule} from '../../../lov/parametroanual/lov.parametroanual.module';

@NgModule({
  imports: [SharedModule, JubilaciopnRoutingModule,LovFuncionariosModule,ParametroAnualModule,JasperModule],
  declarations: [JubilacionComponent]
})
export class CJubilacionModule { }

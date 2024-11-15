import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CustodioActivosFuncionarioRoutingModule } from './custodioactivosfuncionario.routing';
import { CustodioActivosFuncionarioComponent } from './componentes/custodioactivosfuncionario.component';
import { LovFuncionariosModule } from '../../../talentohumano/lov/funcionarios/lov.funcionarios.module';
import { LovKardexCodificadoModule } from '../../lov/kardexcodificado/lov.kardexcodificado.module';

@NgModule({
  imports: [SharedModule, CustodioActivosFuncionarioRoutingModule, LovFuncionariosModule, LovKardexCodificadoModule ],
  declarations: [CustodioActivosFuncionarioComponent]
})
export class CustodioActivosFuncionarioModule { }
